// Battle prototype: pure rules, no DOM. Loaded by battle-ui.js in the
// browser and by game/pipeline/sim_battle.js under Node for balance runs.
//
// Shape of a fight:
//   party phase  -> the player picks any party member who hasn't acted yet.
//                   Hitting a weakness (or a correct Analyze) on a Fault that
//                   isn't already down knocks it down and gives that member
//                   ONE MORE action. All Faults down -> All-Out Attack.
//   enemy phase  -> downed Faults get up, then each Fault runs its
//                   telegraphed intent. Downed Faults take extra damage.

(function (root) {
  const TYPES = ['tech', 'craft', 'insight', 'design'];
  const TYPE_LABEL = { tech: 'Tech', craft: 'Craft', insight: 'Insight', design: 'Design' };

  const ACTIONS = {
    attack:     { label: 'Strike',       cost: 0, target: 'enemy', power: 8, type: null },
    guard:      { label: 'Guard',        cost: 0, target: 'self' },
    analyze:    { label: 'Analyze',      cost: 0, target: 'enemy-unscanned', question: true },
    improvise:  { label: 'Improvise',    cost: 6, target: 'enemy', power: 13, chooseType: true },
    reroute:    { label: 'Re-route',     cost: 6, target: 'enemy', power: 18, type: 'tech' },
    makeitreal: { label: 'Make It Real', cost: 6, target: 'enemy', power: 18, type: 'craft' },
    gaff:       { label: 'Gaff Tape',    cost: 5, target: 'ally', shield: 16 },
    touchup:    { label: 'Touch-up',     cost: 5, target: 'ally-any', heal: 20 },
  };

  const ACTION_HINT = {
    attack: 'Basic hit. No type.',
    guard: 'Halve damage this round. +5 Focus.',
    analyze: 'Answer a question to reveal weaknesses. Right: also knocks it down, ONE MORE.',
    improvise: 'Hit with a type you pick.',
    reroute: 'Tech damage.',
    makeitreal: 'Craft damage.',
    gaff: 'Shield an ally for 16.',
    touchup: 'Heal an ally 20, or revive one.',
  };

  const ALL_OUT_PER_MEMBER = 16;
  const GUARD_FOCUS = 5;
  const DOWN_BONUS = 1.25; // downed Faults take extra damage

  function makeParty() {
    return [
      { id: 'trigger', name: 'Trigger', role: 'Specialist', maxHp: 60, maxFocus: 24, color: 'I',
        actions: ['analyze', 'improvise', 'attack', 'guard'] },
      { id: 'patch', name: 'Patch', role: 'AV Tech', maxHp: 72, maxFocus: 24, color: 'II',
        actions: ['reroute', 'gaff', 'attack', 'guard'] },
      { id: 'theo', name: 'Theo', role: 'Moulage', maxHp: 56, maxFocus: 24, color: 'III',
        actions: ['makeitreal', 'touchup', 'attack', 'guard'] },
    ].map(m => Object.assign(m, {
      hp: m.maxHp, focus: m.maxFocus, acted: false, guard: false, shield: 0, jammed: false,
    }));
  }

  // ---------------------------------------------------------------- fights

  const FIGHTS = [
    {
      id: 'av-bay',
      place: 'Ridgeline Sim Center, AV Bay',
      year: 2019,
      enemies: [
        { name: 'Feedback Howl', domain: 'II', hp: 70, weak: ['tech'], resist: ['insight'], absorb: [],
          moves: [
            { name: 'Howl', kind: 'hit', power: 13 },
            { name: 'Screech', kind: 'hit', power: 7, aoe: true },
          ] },
        { name: 'Uncanny Valley', domain: 'III', hp: 75, weak: ['craft'], resist: ['tech'], absorb: [],
          moves: [
            { name: 'Dead Stare', kind: 'hit', power: 12 },
            { name: 'Unsettle', kind: 'jam', power: 8 },
          ] },
      ],
    },
    {
      id: 'moulage',
      place: 'Ridgeline Sim Center, Moulage Studio',
      year: 2019,
      enemies: [
        { name: 'Wrong-Case Wound', domain: 'III', hp: 66, weak: ['design'], resist: ['tech'], absorb: ['craft'],
          moves: [
            { name: 'Ooze', kind: 'hit', power: 14 },
            { name: 'Stain', kind: 'hit', power: 16 },
          ] },
        { name: 'Ghost Login', domain: 'II', hp: 60, weak: ['tech'], resist: ['craft'], absorb: [],
          moves: [
            { name: 'Lockout', kind: 'jam', power: 8 },
            { name: 'Session Timeout', kind: 'hit', power: 9, aoe: true },
          ] },
        { name: 'Silent Debrief', domain: 'IV', hp: 72, weak: ['insight'], resist: ['craft'], absorb: ['tech'],
          moves: [
            { name: 'Awkward Silence', kind: 'charge' },
            { name: 'Thirty Minutes of Nothing', kind: 'hit', power: 30 },
          ] },
      ],
    },
    {
      id: 'server-room',
      place: 'Ridgeline Sim Center, Server Room',
      year: 2019,
      boss: true,
      enemies: [
        { name: 'Readiness: 94%', domain: 'II', hp: 260, weak: ['tech'], resist: ['insight'], absorb: ['craft'],
          moves: [
            { name: 'Metrics Storm', kind: 'hit', power: 11, aoe: true },
            { name: 'Green Checkmark', kind: 'heal', power: 22 },
            { name: 'Audit Prep', kind: 'charge' },
            { name: 'Compliance Audit', kind: 'hit', power: 34 },
          ],
          shift: {
            at: 0.5, domain: 'IV', weak: ['insight'], resist: ['design'], absorb: ['tech'],
            line: 'The dashboard reboots itself. The number stays at 94%. It\'s measuring something else now.',
          } },
      ],
    },
  ];

  // ---------------------------------------------------------------- setup

  function makeEnemy(def, i) {
    const known = {};
    TYPES.forEach(t => { known[t] = null; });
    return {
      uid: 'e' + i, name: def.name, domain: def.domain, hp: def.hp, maxHp: def.hp,
      weak: def.weak.slice(), resist: def.resist.slice(), absorb: (def.absorb || []).slice(), moves: def.moves,
      shift: def.shift || null, shifted: false, boss: !!def.boss,
      known, scanned: false, down: false, moveIdx: 0, intent: null,
    };
  }

  function createBattle(fightIndex, party, rng) {
    const fight = FIGHTS[fightIndex];
    const state = {
      fightIndex, fight, party, rng: rng || Math.random, round: 1, phase: 'party',
      enemies: fight.enemies.map((d, i) => makeEnemy(Object.assign({ boss: fight.boss }, d), i)),
      stats: { asked: 0, right: 0, weakHits: 0, allOuts: 0 },
    };
    state.party.forEach(m => { m.acted = m.hp <= 0; m.guard = false; m.shield = 0; m.jammed = false; });
    state.enemies.forEach(e => setIntent(state, e));
    return state;
  }

  // Patch up the party between fights.
  function restParty(party, frac) {
    party.forEach(m => {
      m.hp = Math.min(m.maxHp, Math.max(m.hp, 0) + Math.round(m.maxHp * frac));
      m.focus = m.maxFocus;
    });
  }

  // ---------------------------------------------------------------- helpers

  const living = arr => arr.filter(x => x.hp > 0);
  const pick = (state, arr) => arr[Math.floor(state.rng() * arr.length)];
  const vary = (state, n) => Math.max(1, Math.round(n * (0.9 + state.rng() * 0.2)));
  const find = (arr, id) => arr.find(x => x.id === id || x.uid === id);

  function setIntent(state, e) {
    const move = e.moves[e.moveIdx % e.moves.length];
    let target = null;
    if ((move.kind === 'hit' && !move.aoe) || move.kind === 'jam') {
      const alive = living(state.party);
      target = alive.length ? pick(state, alive).id : null;
    }
    e.intent = { move, target };
  }

  function canUse(state, m, aid) {
    const a = ACTIONS[aid];
    if (m.hp <= 0 || m.acted || state.phase !== 'party') return false;
    if (a.cost > 0 && m.jammed) return false;
    if (m.focus < a.cost) return false;
    if (aid === 'analyze' && !living(state.enemies).some(e => !e.scanned)) return false;
    return true;
  }

  function validTargets(state, aid) {
    const a = ACTIONS[aid];
    switch (a.target) {
      case 'enemy': return living(state.enemies).map(e => e.uid);
      case 'enemy-unscanned': return living(state.enemies).filter(e => !e.scanned).map(e => e.uid);
      case 'ally': return living(state.party).map(m => m.id);
      case 'ally-any': return state.party.filter(m => m.hp < m.maxHp).map(m => m.id);
      default: return [];
    }
  }

  function allOutReady(state) {
    const live = living(state.enemies);
    return state.phase === 'party' && live.length > 0 && live.every(e => e.down) &&
      living(state.party).some(m => !m.acted);
  }

  // ---------------------------------------------------------------- damage

  function reveal(e, type) {
    e.known[type] = e.weak.includes(type) ? 'weak' : e.absorb.includes(type) ? 'absorb'
      : e.resist.includes(type) ? 'resist' : 'normal';
  }

  function hitEnemy(state, e, power, type, ev) {
    if (type && e.absorb.includes(type)) {
      const amt = vary(state, power);
      e.hp = Math.min(e.maxHp, e.hp + amt);
      reveal(e, type);
      ev.push({ type: 'absorb', target: e.uid, amount: amt, dmgType: type,
        text: e.name + ' absorbs ' + TYPE_LABEL[type] + '!' });
      return false;
    }
    let mult = 1, weak = false, resist = false;
    if (type && e.weak.includes(type)) { mult = 1.5; weak = true; }
    else if (type && e.resist.includes(type)) { mult = 0.5; resist = true; }
    if (e.down) mult *= DOWN_BONUS;
    const amt = vary(state, power * mult);
    e.hp = Math.max(0, e.hp - amt);
    if (type) reveal(e, type);
    ev.push({ type: 'damage', target: e.uid, amount: amt, weak, resist, dmgType: type });
    let knocked = false;
    if (weak) state.stats.weakHits++;
    if (weak && !e.down && e.hp > 0) { e.down = true; knocked = true; ev.push({ type: 'down', target: e.uid }); }
    if (e.hp <= 0) { e.down = false; ev.push({ type: 'defeat', target: e.uid, text: e.name + ' is cleared.' }); }
    else maybeShift(e, ev);
    return knocked;
  }

  function maybeShift(e, ev) {
    if (!e.shift || e.shifted || e.hp > e.maxHp * e.shift.at) return;
    e.shifted = true;
    e.domain = e.shift.domain;
    e.weak = e.shift.weak.slice();
    e.resist = e.shift.resist.slice();
    e.absorb = (e.shift.absorb || []).slice();
    TYPES.forEach(t => { e.known[t] = null; });
    e.scanned = false;
    e.down = false;
    ev.push({ type: 'shift', target: e.uid, text: e.shift.line });
  }

  function hitMember(state, m, power, ev, source) {
    let amt = vary(state, power * (m.guard ? 0.5 : 1));
    if (m.shield > 0) {
      const absorbed = Math.min(m.shield, amt);
      m.shield -= absorbed; amt -= absorbed;
      if (absorbed) ev.push({ type: 'block', target: m.id, amount: absorbed });
    }
    m.hp = Math.max(0, m.hp - amt);
    ev.push({ type: 'hurt', target: m.id, amount: amt, source });
    if (m.hp <= 0) ev.push({ type: 'ko', target: m.id, text: m.name + ' is down. Theo can patch them back up.' });
  }

  // ---------------------------------------------------------------- party

  // opt.correct (analyze), opt.dmgType (improvise)
  function act(state, mid, aid, tid, opt) {
    opt = opt || {};
    const m = find(state.party, mid);
    const a = ACTIONS[aid];
    const ev = [];
    if (!canUse(state, m, aid)) return ev;
    m.focus -= a.cost;
    let oneMore = false;

    if (aid === 'guard') {
      m.guard = true;
      m.focus = Math.min(m.maxFocus, m.focus + GUARD_FOCUS);
      ev.push({ type: 'log', text: m.name + ' braces.' });
    } else if (aid === 'analyze') {
      const e = find(state.enemies, tid);
      state.stats.asked++;
      if (opt.correct) {
        state.stats.right++;
        e.scanned = true;
        TYPES.forEach(t => reveal(e, t));
        ev.push({ type: 'scan', target: e.uid, text: 'Read it right. ' + e.name + ' is wide open.' });
        if (!e.down) { e.down = true; oneMore = true; ev.push({ type: 'down', target: e.uid }); }
      } else {
        // A miss still teaches: Hub shows the read, you just lose the tempo.
        e.scanned = true;
        TYPES.forEach(t => reveal(e, t));
        ev.push({ type: 'scan', target: e.uid, text: 'Hub fills in the read. No opening this time.' });
      }
    } else if (a.target === 'enemy') {
      const e = find(state.enemies, tid);
      const type = a.chooseType ? opt.dmgType : a.type;
      oneMore = hitEnemy(state, e, a.power, type, ev);
    } else if (aid === 'gaff') {
      const t = find(state.party, tid);
      t.shield += a.shield;
      ev.push({ type: 'shield', target: t.id, amount: a.shield });
    } else if (aid === 'touchup') {
      const t = find(state.party, tid);
      const revived = t.hp <= 0;
      t.hp = Math.min(t.maxHp, Math.max(0, t.hp) + a.heal);
      if (revived) t.acted = true;
      ev.push({ type: 'heal', target: t.id, amount: a.heal, revived });
    }

    if (oneMore) ev.push({ type: 'oneMore', target: m.id, text: 'ONE MORE' });
    else m.acted = true;
    afterPartyAction(state, ev);
    return ev;
  }

  function allOut(state) {
    const ev = [];
    if (!allOutReady(state)) return ev;
    const crew = living(state.party);
    state.stats.allOuts++;
    ev.push({ type: 'allOut', text: 'ALL-OUT' });
    const power = ALL_OUT_PER_MEMBER * crew.length;
    living(state.enemies).forEach(e => {
      const amt = vary(state, power);
      e.hp = Math.max(0, e.hp - amt);
      ev.push({ type: 'damage', target: e.uid, amount: amt });
      if (e.hp <= 0) { e.down = false; ev.push({ type: 'defeat', target: e.uid, text: e.name + ' is cleared.' }); }
      else maybeShift(e, ev);
    });
    crew.forEach(m => { m.acted = true; });
    afterPartyAction(state, ev);
    return ev;
  }

  function afterPartyAction(state, ev) {
    if (checkEnd(state, ev)) return;
    if (living(state.party).every(m => m.acted)) runEnemyPhase(state, ev);
  }

  // A deliberate pass: end the party phase early.
  function endTurn(state) {
    const ev = [];
    if (state.phase !== 'party') return ev;
    state.party.forEach(m => { m.acted = true; });
    runEnemyPhase(state, ev);
    return ev;
  }

  // ---------------------------------------------------------------- enemies

  function runEnemyPhase(state, ev) {
    state.phase = 'enemy';
    state.party.forEach(m => { m.jammed = false; });
    ev.push({ type: 'phase', phase: 'enemy' });
    for (const e of living(state.enemies)) {
      if (living(state.party).length === 0) break;
      if (e.down) {
        e.down = false;
        ev.push({ type: 'log', target: e.uid, text: e.name + ' gets back up.' });
      }
      const { move } = e.intent;
      let target = find(state.party, e.intent.target);
      if (target && target.hp <= 0) target = pick(state, living(state.party));
      ev.push({ type: 'enemyMove', source: e.uid, text: e.name + ': ' + move.name });
      if (move.kind === 'hit') {
        const targets = move.aoe ? living(state.party) : [target];
        targets.forEach(t => hitMember(state, t, move.power, ev, e.uid));
      } else if (move.kind === 'jam') {
        hitMember(state, target, move.power, ev, e.uid);
        if (target.hp > 0) {
          target.jammed = true;
          ev.push({ type: 'jam', target: target.id, text: target.name + ' is rattled: no skills next turn.' });
        }
      } else if (move.kind === 'heal') {
        e.hp = Math.min(e.maxHp, e.hp + move.power);
        ev.push({ type: 'enemyHeal', target: e.uid, amount: move.power });
      } else if (move.kind === 'charge') {
        ev.push({ type: 'log', target: e.uid, text: e.name + ' is winding up something big.' });
      }
      e.moveIdx++;
      setIntent(state, e);
    }
    if (checkEnd(state, ev)) return;
    // Downed Faults that skipped still need fresh targets if theirs went down.
    living(state.enemies).forEach(e => {
      if (e.intent.target && find(state.party, e.intent.target).hp <= 0) setIntent(state, e);
    });
    state.round++;
    state.phase = 'party';
    state.party.forEach(m => { m.acted = m.hp <= 0; m.guard = false; m.shield = 0; });
    ev.push({ type: 'phase', phase: 'party' });
  }

  function checkEnd(state, ev) {
    if (living(state.enemies).length === 0) {
      state.phase = 'won'; ev.push({ type: 'won' }); return true;
    }
    if (living(state.party).length === 0) {
      state.phase = 'lost'; ev.push({ type: 'lost' }); return true;
    }
    return false;
  }

  const api = {
    TYPES, TYPE_LABEL, ACTIONS, ACTION_HINT, FIGHTS,
    makeParty, createBattle, restParty, canUse, validTargets, allOutReady,
    act, allOut, endTurn, living,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BattleCore = api;
})(this);
