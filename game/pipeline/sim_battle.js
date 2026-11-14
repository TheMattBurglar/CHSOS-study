// Balance sim for the battle prototype (game/web/battle/battle-core.js).
// Usage: node game/pipeline/sim_battle.js [runs]
// A scripted player clears all fights in order (resting between, retrying a
// lost fight from full) at several Analyze accuracies, plus one player who
// never uses Analyze and finds weaknesses by trial and error.

const B = require('../web/battle/battle-core.js');
const RUNS = Number(process.argv[2] || 2000);

function mulberry(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function bestTypeFor(e, types) {
  // Prefer a known weakness, then an untested type, then a known neutral.
  const order = ['weak', null, 'normal'];
  for (const k of order) {
    const t = types.find(t => e.known[t] === k);
    if (t) return t;
  }
  return null;
}

function chooseAndAct(s, acc, useAnalyze, rng) {
  if (B.allOutReady(s)) return B.allOut(s);
  const live = B.living(s.enemies);
  const upright = live.filter(e => !e.down);
  const pool = upright.length ? upright : live;
  const lowest = arr => arr.slice().sort((a, b) => a.hp - b.hp)[0];
  const hurt = s.party.filter(m => m.hp > 0 && m.hp < m.maxHp * 0.4);
  const ko = s.party.filter(m => m.hp <= 0);

  for (const m of s.party) {
    if (m.hp <= 0 || m.acted) continue;
    const can = a => B.canUse(s, m, a);

    if (m.id === 'trigger') {
      const unscanned = upright.filter(e => !e.scanned);
      if (useAnalyze && unscanned.length && can('analyze')) {
        return B.act(s, m.id, 'analyze', unscanned[0].uid, { correct: rng() < acc });
      }
      if (can('improvise')) {
        for (const e of pool) {
          const t = bestTypeFor(e, B.TYPES);
          if (t && (e.known[t] === 'weak' || (!useAnalyze && e.known[t] === null))) {
            return B.act(s, m.id, 'improvise', e.uid, { dmgType: t });
          }
        }
      }
      return B.act(s, m.id, 'attack', lowest(pool).uid);
    }

    const skill = m.id === 'patch' ? 'reroute' : 'makeitreal';
    const type = m.id === 'patch' ? 'tech' : 'craft';
    if (m.id === 'theo' && (ko.length || hurt.length) && can('touchup')) {
      return B.act(s, m.id, 'touchup', (ko[0] || hurt[0]).id);
    }
    if (can(skill)) {
      const weakT = pool.find(e => e.known[type] === 'weak');
      if (weakT) return B.act(s, m.id, skill, weakT.uid);
      const untested = pool.find(e => e.known[type] === null);
      if (untested) return B.act(s, m.id, skill, untested.uid);
      const neutral = pool.find(e => e.known[type] === 'normal');
      if (neutral) return B.act(s, m.id, skill, neutral.uid);
    }
    if (m.id === 'patch' && hurt.length && can('gaff')) return B.act(s, m.id, 'gaff', hurt[0].id);
    const notResist = pool.filter(e => true);
    return B.act(s, m.id, 'attack', lowest(notResist).uid);
  }
  return B.endTurn(s);
}

function runCareer(acc, useAnalyze, seed) {
  const rng = mulberry(seed);
  const party = B.makeParty();
  const out = [];
  for (let f = 0; f < B.FIGHTS.length; f++) {
    let tries = 0, s;
    do {
      tries++;
      if (tries > 1) B.restParty(party, 1);
      s = B.createBattle(f, party, rng);
      let guard = 0;
      while (s.phase === 'party' && guard++ < 500) chooseAndAct(s, acc, useAnalyze, rng);
    } while (s.phase === 'lost' && tries < 5);
    out.push({ won: s.phase === 'won', tries, rounds: s.round, asked: s.stats.asked,
      hpLeft: party.reduce((a, m) => a + Math.max(0, m.hp), 0) / party.reduce((a, m) => a + m.maxHp, 0) });
    B.restParty(party, 0.4);
  }
  return out;
}

const pct = x => (100 * x).toFixed(0) + '%';
const avg = a => a.reduce((x, y) => x + y, 0) / a.length;

const players = [
  ['never Analyze', 0, false], ['Analyze, 40% right', 0.4, true],
  ['Analyze, 60% right', 0.6, true], ['Analyze, 80% right', 0.8, true], ['Analyze, 95% right', 0.95, true],
];
console.log('fight            player               1st-try win  rounds  questions  party HP left');
for (let f = 0; f < B.FIGHTS.length; f++) {
  for (const [label, acc, use] of players) {
    const rs = [];
    for (let i = 0; i < RUNS; i++) rs.push(runCareer(acc, use, i * 7919 + 13)[f]);
    console.log(
      B.FIGHTS[f].id.padEnd(16), label.padEnd(20),
      pct(avg(rs.map(r => r.tries === 1 ? 1 : 0))).padStart(11),
      avg(rs.map(r => r.rounds)).toFixed(1).padStart(7),
      avg(rs.map(r => r.asked)).toFixed(1).padStart(10),
      pct(avg(rs.map(r => r.hpLeft))).padStart(14));
  }
}
