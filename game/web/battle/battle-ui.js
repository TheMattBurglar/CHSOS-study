// Battle prototype UI. Rules live in battle-core.js; questions come from
// GENERATED_NODES (nodes_generated.js), diagnostic nodes only, one per MCQ.

(function () {
  const B = window.BattleCore;
  const $ = id => document.getElementById(id);
  const FAST = location.hash === '#fast'; // test hook: 10x faster playback
  const wait = ms => new Promise(r => setTimeout(r, FAST ? ms / 10 : ms));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const DOMAIN_TITLE = {
    I: 'Healthcare Concepts', II: 'Sim Technology Ops', III: 'Sim Practices & Procedures',
    IV: 'Professional Role', V: 'Instructional Design',
  };
  const SKILL_TYPE = { reroute: 'tech', makeitreal: 'craft' };
  const KNOWN_MARK = { weak: 'WEAK', resist: 'RES', absorb: 'ABS', normal: '–' };

  // ------------------------------------------------------------ questions

  const QUESTIONS = (() => {
    const seen = new Set(), byDomain = {};
    Object.values(GENERATED_NODES).forEach(n => {
      if (n.type !== 'diagnostic' || !n.source || seen.has(n.source.id)) return;
      seen.add(n.source.id);
      (byDomain[n.domain] = byDomain[n.domain] || []).push({
        id: n.source.id, domain: n.domain, ksa: n.ksa,
        question: n.payload.question, options: n.payload.options,
        answer: n.payload.answer, rationale: n.payload.rationale,
      });
    });
    return byDomain;
  })();

  const STATS_KEY = 'chsos-battle-qstats';
  function loadStats() { try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch (e) { return {}; } }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } }

  // Missed-last-time first, then unseen, then everything else.
  function drawQuestion(domain) {
    const stats = loadStats();
    let pool = (QUESTIONS[domain] || []).filter(q => !run.usedQ.has(q.id));
    if (!pool.length) pool = QUESTIONS[domain] || [];
    const weight = q => { const s = stats[q.id]; return !s ? 3 : s.lastWrong ? 5 : 1; };
    const total = pool.reduce((a, q) => a + weight(q), 0);
    let r = Math.random() * total;
    for (const q of pool) { r -= weight(q); if (r <= 0) return q; }
    return pool[pool.length - 1];
  }

  function recordAnswer(q, correct) {
    const stats = loadStats();
    const s = stats[q.id] || { seen: 0, right: 0 };
    s.seen++; if (correct) s.right++;
    s.lastWrong = !correct;
    stats[q.id] = s;
    saveStats(stats);
    run.usedQ.add(q.id);
    run.answered.push({ q, correct });
  }

  // ------------------------------------------------------------ story

  const STORY = {
    intro: {
      place: 'RIDGELINE SIM CENTER · 2019',
      lines: [
        ['hub', 'Ridgeline Sim Center, 2019. When you land, I\'ll render what\'s broken as something you can hit. Don\'t ask how.'],
        ['hub', 'Everything has a weak spot. If you don\'t know it, Analyze. I\'ll ask you something. Know your stuff and you get an opening.'],
        ['patch', 'And if you don\'t know your stuff, I hit it with a wrench until it tells us.'],
        ['hub', 'That also works. Slower.'],
      ],
    },
    after0: {
      place: 'RIDGELINE · MOULAGE STUDIO',
      lines: [
        ['patch', 'Feedback loop\'s dead. That manikin still looks like it\'s judging me.'],
        ['theo', 'It is. And something in the moulage studio is wearing the wrong wound for the case.'],
        ['theo', 'Fair warning: more makeup won\'t fix a wound that doesn\'t belong there.'],
      ],
    },
    after1: {
      place: 'RIDGELINE · SERVER ROOM',
      lines: [
        ['hub', 'Last stop. This site\'s readiness dashboard reads ninety-four percent.'],
        ['patch', 'Ninety-four. The mic in Bay 2 has been unplugged since Tuesday.'],
        ['hub', 'Then go find out what it\'s actually counting.'],
      ],
    },
    lost: {
      place: 'WAYSTATION 4',
      lines: [
        ['narr', 'The leap snaps back. Nobody\'s hurt. The timeline just didn\'t take.'],
        ['hub', 'Again. You\'ve seen how it moves now.'],
      ],
    },
  };
  const BARKS = {
    absorb: { tech: ['patch', 'It\'s eating the signal. Stop feeding it.'], craft: ['theo', 'Okay. It likes that. Noted.'],
      insight: ['hub', 'That made it stronger. Interesting.'], design: ['hub', 'That made it stronger. Interesting.'] },
    shift: ['patch', 'It\'s not a hardware problem anymore. Tech just feeds it now.'],
  };
  const WHO = { hub: 'Hub', patch: 'Patch', theo: 'Theo' };

  function showStory(key, onDone) {
    const s = STORY[key];
    show('screen-story');
    $('story-place').textContent = s.place;
    $('story-lines').innerHTML = s.lines.map(([who, text]) => who === 'narr'
      ? `<div class="line narr">${esc(text)}</div>`
      : `<div class="line"><span class="who who-${who}">${WHO[who]}</span>${esc(text)}</div>`).join('');
    $('story-next').onclick = onDone;
  }

  function show(id) {
    ['screen-story', 'screen-battle', 'screen-summary'].forEach(s => { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------ run state

  let run, state, ui;

  function newRun() {
    run = { party: B.makeParty(), fight: 0, usedQ: new Set(), answered: [] };
    showStory('intro', () => startFight(0));
  }

  function startFight(i) {
    run.fight = i;
    state = B.createBattle(i, run.party);
    ui = { active: null, pending: null, busy: false, logLines: [], disp: null, saidAbsorb: {} };
    show('screen-battle');
    $('b-place').textContent = state.fight.place.toUpperCase() + ' · ' + state.fight.year;
    log(state.fight.boss ? 'Something big is running the numbers in here.' : 'Faults detected. Pick who moves first.');
    pickDefaultActive();
    render();
  }

  function pickDefaultActive() {
    const m = state.party.find(p => p.hp > 0 && !p.acted);
    ui.active = m ? m.id : null;
  }

  // ------------------------------------------------------------ rendering

  const hpOf = (kind, obj) => ui.disp ? ui.disp[obj.uid || obj.id] : obj.hp;

  function render() {
    $('b-round').textContent = 'ROUND ' + state.round;
    const targets = ui.pending ? B.validTargets(state, ui.pending.aid) : [];

    const en = $('enemies');
    en.style.setProperty('--n', state.enemies.length);
    en.innerHTML = state.enemies.map(e => {
      const hp = hpOf('e', e);
      const dead = hp <= 0;
      const types = B.TYPES.map(t => {
        const k = e.known[t];
        return `<span class="tk ${k || ''}">${B.TYPE_LABEL[t]}<b>${k ? KNOWN_MARK[k] : '?'}</b></span>`;
      }).join('');
      const cls = ['enemy', e.boss ? 'boss' : '', dead ? 'dead' : '', e.down && !dead ? 'down' : '',
        targets.includes(e.uid) ? 'targetable' : ''].join(' ');
      return `<div class="${cls}" data-uid="${e.uid}">
        ${e.down && !dead ? '<span class="badge-down">DOWN</span>' : ''}
        <div class="e-row"><span class="e-name">${esc(e.name)}</span><span class="chip dom-${e.domain}">${e.domain}</span></div>
        <div class="bar"><i style="width:${100 * Math.max(0, hp) / e.maxHp}%"></i></div>
        <div class="e-hp">${Math.max(0, hp)} / ${e.maxHp}</div>
        <div class="types">${types}</div>
        ${dead ? '' : `<div class="intent">${intentText(e)}</div>`}
      </div>`;
    }).join('');

    $('party').innerHTML = state.party.map(m => {
      const hp = hpOf('m', m);
      const cls = ['member', hp <= 0 ? 'ko' : '', m.acted && hp > 0 ? 'acted' : '',
        ui.active === m.id && state.phase === 'party' ? 'active' : '',
        targets.includes(m.id) ? 'targetable' : ''].join(' ');
      const status = [];
      if (hp <= 0) status.push('<span class="j">DOWN</span>');
      if (m.guard) status.push('<span class="g">GUARD</span>');
      if (m.shield) status.push(`<span class="s">+${m.shield}</span>`);
      if (m.jammed) status.push('<span class="j">RATTLED</span>');
      return `<div class="${cls}" data-mid="${m.id}">
        <div class="m-name">${m.name}</div><div class="m-role">${m.role}</div>
        <div class="bar hp"><i style="width:${100 * Math.max(0, hp) / m.maxHp}%"></i></div>
        <div class="bar focus"><i style="width:${100 * m.focus / m.maxFocus}%"></i></div>
        <div class="m-nums"><span>${Math.max(0, hp)} HP</span><span>${m.focus} F</span></div>
        <div class="m-status">${status.join(' ')}</div>
      </div>`;
    }).join('');

    renderPanel();
    renderLog();
  }

  function intentText(e) {
    const { move, target } = e.intent;
    const who = target ? state.party.find(m => m.id === target).name : '';
    const big = move.power >= 20 ? ' class="big"' : '';
    switch (move.kind) {
      case 'hit': return `${esc(move.name)}: <span${big}>${move.power}</span> to ${move.aoe ? 'everyone' : who}`;
      case 'jam': return `${esc(move.name)}: ${move.power} + rattle ${who}`;
      case 'heal': return `${esc(move.name)}: heals ${move.power}`;
      case 'charge': return `${esc(move.name)}: <span class="big">winding up</span>`;
    }
    return '';
  }

  function renderPanel() {
    const p = $('panel');
    if (state.phase !== 'party' || ui.busy) { p.innerHTML = ''; return; }
    const m = state.party.find(x => x.id === ui.active);

    if (ui.pending) {
      const a = B.ACTIONS[ui.pending.aid];
      if (a.chooseType && !ui.pending.dmgType) {
        p.innerHTML = `<div class="p-title"><span><b>${m.name}</b> · Improvise: pick a type</span></div>
          <div class="actions">${B.TYPES.map(t => `<button class="act t-${t}" data-type="${t}"><span class="a-name">${B.TYPE_LABEL[t]}</span></button>`).join('')}</div>
          <div class="p-row"><span></span><button class="linkbtn" data-cancel>Cancel</button></div>`;
      } else {
        const what = a.target.startsWith('enemy') ? 'Tap a Fault' : 'Tap a crew member';
        p.innerHTML = `<div class="p-title"><span><b>${m.name}</b> · ${a.label}${ui.pending.dmgType ? ' (' + B.TYPE_LABEL[ui.pending.dmgType] + ')' : ''}</span></div>
          <div class="p-row"><span class="muted">${what}.</span><button class="linkbtn" data-cancel>Cancel</button></div>`;
      }
      return;
    }

    let html = '';
    if (B.allOutReady(state)) {
      html += `<button class="allout" data-allout>ALL-OUT ATTACK</button>`;
    }
    if (m) {
      html += `<div class="p-title"><span><b>${m.name}</b>${m.jammed ? ' · rattled, no skills' : ''}</span><span>tap a crew card to switch</span></div>
        <div class="actions">${m.actions.map(aid => {
          const a = B.ACTIONS[aid];
          const t = SKILL_TYPE[aid];
          const cls = ['act', aid === 'analyze' ? 'analyze' : '', t ? 't-' + t : ''].join(' ');
          return `<button class="${cls}" data-aid="${aid}" ${B.canUse(state, m, aid) ? '' : 'disabled'}>
            <span class="a-top"><span class="a-name">${a.label}</span>${a.cost ? `<span class="a-cost">${a.cost} F</span>` : ''}</span>
            <span class="a-hint">${B.ACTION_HINT[aid]}</span></button>`;
        }).join('')}</div>`;
    }
    html += `<div class="p-row"><span></span><button class="linkbtn" data-endturn>End turn</button></div>`;
    p.innerHTML = html;
  }

  function log(text) { ui.logLines.push(text); ui.logLines = ui.logLines.slice(-2); renderLog(); }
  function renderLog() {
    const n = ui.logLines.length;
    $('log').innerHTML = ui.logLines.map((l, i) => `<div class="${i === n - 1 ? 'now' : ''}">${l}</div>`).join('');
  }
  function bark([who, text]) { log(`<b class="who-${who}">${WHO[who]}:</b> ${esc(text)}`); }

  // ------------------------------------------------------------ input

  $('screen-battle').addEventListener('click', ev => {
    if (ui.busy || state.phase !== 'party') return;
    const t = ev.target.closest('[data-aid],[data-type],[data-cancel],[data-allout],[data-endturn],[data-uid],[data-mid]');
    if (!t) return;

    if (t.dataset.cancel !== undefined) { ui.pending = null; return render(); }
    if (t.dataset.allout !== undefined) return play(() => B.allOut(state));
    if (t.dataset.endturn !== undefined) { ui.pending = null; return play(() => B.endTurn(state)); }
    if (t.dataset.type) { ui.pending.dmgType = t.dataset.type; return render(); }

    if (t.dataset.aid) {
      const aid = t.dataset.aid;
      if (B.ACTIONS[aid].target === 'self') return play(() => B.act(state, ui.active, aid));
      ui.pending = { aid };
      return render();
    }

    const id = t.dataset.uid || t.dataset.mid;
    if (ui.pending && B.validTargets(state, ui.pending.aid).includes(id)) {
      const { aid, dmgType } = ui.pending;
      ui.pending = null;
      if (aid === 'analyze') return askQuestion(id);
      return play(() => B.act(state, ui.active, aid, id, { dmgType }));
    }
    if (!ui.pending && t.dataset.mid) {
      const m = state.party.find(x => x.id === t.dataset.mid);
      if (m.hp > 0 && !m.acted) { ui.active = m.id; render(); }
    }
  });

  // ------------------------------------------------------------ analyze

  function askQuestion(uid) {
    const e = state.enemies.find(x => x.uid === uid);
    const q = drawQuestion(e.domain);
    $('q-domain').className = 'chip dom-' + q.domain;
    $('q-domain').textContent = q.domain + ' · ' + DOMAIN_TITLE[q.domain];
    $('q-target').textContent = 'Reading ' + e.name + '. Take your time.';
    $('q-text').textContent = q.question;
    $('q-result').hidden = true;
    $('q-options').innerHTML = Object.entries(q.options).map(([k, v]) =>
      `<button class="opt" data-k="${k}"><span class="k">${k}</span><span>${esc(v)}</span></button>`).join('');
    $('sheet').hidden = false;
    $('sheet').scrollTop = 0;

    $('q-options').onclick = ev => {
      const b = ev.target.closest('.opt');
      if (!b || !$('q-result').hidden) return;
      const correct = b.dataset.k === q.answer;
      [...$('q-options').children].forEach(o => {
        o.disabled = true;
        if (o.dataset.k === q.answer) o.classList.add('right');
        else if (o === b) o.classList.add('wrong');
      });
      recordAnswer(q, correct);
      const v = $('q-verdict');
      v.className = 'q-verdict hud ' + (correct ? 'ok' : 'no');
      v.textContent = correct ? 'SPOT ON. IT\'S OPEN.' : 'NOT THIS TIME. ANSWER: ' + q.answer;
      $('q-rationale').textContent = q.rationale;
      $('q-result').hidden = false;
      $('q-continue').onclick = () => {
        $('sheet').hidden = true;
        play(() => B.act(state, ui.active, 'analyze', uid, { correct }));
      };
      $('q-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
  }

  // ------------------------------------------------------------ playback

  function floatAt(id, text, cls) {
    const el = document.querySelector(`[data-uid="${id}"],[data-mid="${id}"]`);
    if (!el) return;
    const f = document.createElement('div');
    f.className = 'float ' + cls;
    f.textContent = text;
    el.appendChild(f);
    if (cls === 'hurt' || cls === 'dmg' || cls === 'weak') { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
    setTimeout(() => f.remove(), 950);
  }

  async function banner(text) {
    const b = $('banner');
    b.textContent = text; b.hidden = false;
    b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    await wait(800);
    b.hidden = true;
  }

  // Events come back with the state already updated. Replay them with a
  // display-HP overlay so bars move step by step instead of all at once.
  async function play(doAction) {
    ui.busy = true;
    const before = {};
    state.enemies.forEach(e => { before[e.uid] = e.hp; });
    state.party.forEach(m => { before[m.id] = m.hp; });
    const events = doAction();
    const maxOf = id => (state.enemies.find(e => e.uid === id) || state.party.find(m => m.id === id)).maxHp;
    ui.disp = new Proxy(before, {
      set(t, k, v) { t[k] = Math.max(0, Math.min(maxOf(k), v)); return true; },
    });
    render();

    for (const v of events) {
      switch (v.type) {
        case 'damage':
          ui.disp[v.target] -= v.amount; render();
          floatAt(v.target, (v.weak ? 'WEAK ' : v.resist ? 'resist ' : '') + v.amount, v.weak ? 'weak' : v.resist ? 'res' : 'dmg');
          await wait(v.weak ? 450 : 320); break;
        case 'absorb':
          ui.disp[v.target] += v.amount; render();
          floatAt(v.target, 'ABSORB +' + v.amount, 'heal'); log(esc(v.text));
          if (!ui.saidAbsorb[v.dmgType]) { ui.saidAbsorb[v.dmgType] = true; bark(BARKS.absorb[v.dmgType]); }
          await wait(600); break;
        case 'down': log('Knocked down!'); await wait(150); break;
        case 'oneMore': await banner('ONE MORE'); break;
        case 'allOut': await banner('ALL-OUT ATTACK'); break;
        case 'scan': render(); log(esc(v.text)); await wait(350); break;
        case 'defeat': log(esc(v.text)); render(); await wait(350); break;
        case 'shift': render(); log(esc(v.text)); await wait(900); bark(BARKS.shift); await wait(900); break;
        case 'phase':
          if (v.phase === 'enemy') { log('The Faults move.'); render(); await wait(450); }
          break;
        case 'enemyMove': log(esc(v.text)); await wait(380); break;
        case 'hurt':
          ui.disp[v.target] -= v.amount; render();
          if (v.amount) floatAt(v.target, '-' + v.amount, 'hurt');
          await wait(300); break;
        case 'block': floatAt(v.target, 'blocked ' + v.amount, 'shield'); await wait(200); break;
        case 'heal':
          ui.disp[v.target] = Math.max(0, ui.disp[v.target]) + v.amount; render();
          floatAt(v.target, v.revived ? 'BACK UP' : '+' + v.amount, 'heal'); await wait(350); break;
        case 'enemyHeal':
          ui.disp[v.target] += v.amount; render();
          floatAt(v.target, '+' + v.amount, 'heal'); await wait(400); break;
        case 'shield': floatAt(v.target, 'SHIELD ' + v.amount, 'shield'); await wait(300); break;
        case 'ko': case 'jam': case 'log': log(esc(v.text)); render(); await wait(300); break;
        case 'won': case 'lost': break;
      }
    }
    ui.disp = null;
    ui.busy = false;

    if (state.phase === 'won') return finishFight();
    if (state.phase === 'lost') return showStory('lost', () => { B.restParty(run.party, 1); startFight(run.fight); });
    const cur = state.party.find(m => m.id === ui.active);
    if (!cur || cur.acted || cur.hp <= 0) pickDefaultActive();
    if (B.allOutReady(state)) log('Every Fault is down. <b>All-Out Attack</b> is ready.');
    render();
  }

  async function finishFight() {
    await banner('CLEAR');
    B.restParty(run.party, 0.4);
    const next = run.fight + 1;
    if (next < B.FIGHTS.length) showStory('after' + run.fight, () => startFight(next));
    else showSummary();
  }

  // ------------------------------------------------------------ summary

  function showSummary() {
    show('screen-summary');
    const right = run.answered.filter(a => a.correct).length;
    $('sum-line').innerHTML = `Hub: “Ridgeline's readiness number just dropped to 71%. First honest number this building's had.”<br><br>
      You read ${run.answered.length} Fault${run.answered.length === 1 ? '' : 's'} and got ${right} right. Missed ones come back sooner next time.`;
    $('sum-list').innerHTML = run.answered.map(({ q, correct }) => `
      <details class="sum-item"><summary><b class="${correct ? 'ok' : 'no'}">${correct ? 'RIGHT' : 'MISSED'}</b>${esc(q.question)}</summary>
      <p><b>${q.answer}.</b> ${esc(q.options[q.answer])}</p><p>${esc(q.rationale)}</p></details>`).join('')
      || '<p class="muted">No questions this time. Analyze is worth it, trust me.</p>';
    $('sum-again').onclick = newRun;
  }

  newRun();
})();
