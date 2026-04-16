/* ============================================================
   CHSOS Study App — app.js
   Full quiz engine: spaced repetition, dashboard, export/import
   ============================================================ */

'use strict';

/* ============================================================
   STATE
   ============================================================ */
const state = {
  knowledge:   {},   // { [ksaId]: { perspective, clinical, terminology, scenario, … } }
  terms:       {},   // { [term]:  { def, ksa } }
  progress:    { ksa: {}, terms: {} },
  currentMode: null, // 'scenarios' | 'terms' | 'spaced'
  currentItem: null, // { type, id, question, answer, relatedKsa? }
  session:     { correct: 0, total: 0 },
};

/* ============================================================
   DATA LOADING
   ============================================================ */

async function loadKnowledge() {
  const res = await fetch('expert_knowledge.json');
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching expert_knowledge.json`);
  return res.json();
}

/**
 * Parse the terminology markdown strings into a flat term→def map.
 * Handles both **Term**: and **Term:** formats.
 */
function extractTerms(knowledge) {
  const terms = {};
  for (const [ksaId, data] of Object.entries(knowledge)) {
    if (!data.terminology) continue;
    for (const line of data.terminology.split('\n')) {
      // Matches: * **Term**: Def  OR  * **Term:** Def
      const match = line.match(/^\*+\s*\*\*([^*]+)\*\*[:：]?\s*(.*)$/);
      if (match) {
        let term = match[1].trim();
        const def = match[2].trim();

        // If colon was inside the bold markers (e.g. **Term:**)
        if (term.endsWith(':')) {
          term = term.slice(0, -1).trim();
        }

        if (term && def) terms[term] = { def, ksa: ksaId };
      }
    }
  }
  return terms;
}

/* ============================================================
   PROGRESS — localStorage  (Leitner system, levels 0–5)
   ============================================================ */

const STORAGE_KEY = 'chsos_progress_v1';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const p   = raw ? JSON.parse(raw) : {};
    return { ksa: p.ksa || {}, terms: p.terms || {} };
  } catch {
    return { ksa: {}, terms: {} };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  } catch { /* storage full — silently skip */ }
}

function updateScore(category, id, success) {
  if (!state.progress[category][id]) {
    state.progress[category][id] = { level: 0, lastReviewed: 0 };
  }
  const rec   = state.progress[category][id];
  rec.level   = success
    ? Math.min(rec.level + 1, 5)
    : Math.max(rec.level - 1, 0);
  rec.lastReviewed = Date.now();
  saveProgress();
}

/**
 * Return up to `limit` item IDs sorted by ascending level then ascending
 * lastReviewed — i.e. weakest / least-recently-seen items first.
 */
function getPriorityItems(category, ids, limit = 10) {
  return ids
    .map(id => {
      const s = state.progress[category][id] ?? { level: -1, lastReviewed: 0 };
      return { id, level: s.level, lastReviewed: s.lastReviewed };
    })
    .sort((a, b) => a.level - b.level || a.lastReviewed - b.lastReviewed)
    .slice(0, limit)
    .map(x => x.id);
}

/* ============================================================
   EXPORT / IMPORT
   ============================================================ */

function exportProgress() {
  const blob = new Blob(
    [JSON.stringify(state.progress, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = 'chsos_progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (typeof data.ksa === 'object' && typeof data.terms === 'object') {
        state.progress = { ksa: data.ksa, terms: data.terms };
        saveProgress();
        renderMenuStats();
        showToast('Progress imported ✓');
      } else {
        showToast('Invalid progress file — expected { ksa, terms } keys', true);
      }
    } catch {
      showToast('Could not parse file as JSON', true);
    }
  };
  reader.readAsText(file);
}

/* ============================================================
   MARKDOWN → HTML  (lightweight, sufficient for this data set)
   ============================================================ */

function md(text) {
  if (!text) return '';
  return text
    // 1. Escape HTML special chars before inserting any tags
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    // 2. Bullet point markers first, before bold processing removes their asterisks
    .replace(/^[\*\-]\s+/gm, '• ')
    // 3. Bold  **text**
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    // 4. Italic *text*  (only remaining single asterisks after bold pass)
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    // 5. Newlines → line breaks
    .replace(/\n/g, '<br>');
}

/* ============================================================
   QUIZ LOGIC — building question items
   ============================================================ */

/**
 * Split a scenario string on the **A:** marker.
 * Keeps **Q:** in the question so md() renders it as bold.
 */
function parseScenario(ksaId) {
  const raw = state.knowledge[ksaId]?.scenario ?? 'No scenario available for this KSA.';

  // Primary format:  **Q:** … \n**A:** …
  const boldAIdx = raw.indexOf('**A:**');
  if (boldAIdx !== -1) {
    return {
      question: raw.slice(0, boldAIdx).trim(),
      answer:   raw.slice(boldAIdx + 6).trim(),
    };
  }

  // Fallback format:  Q: … \nA: …
  const plainAIdx = raw.search(/\bA:\s/);
  if (plainAIdx !== -1) {
    return {
      question: raw.slice(0, plainAIdx).trim(),
      answer:   raw.slice(plainAIdx).replace(/^A:\s*/, '').trim(),
    };
  }

  return { question: raw, answer: '' };
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildScenarioItem(ids) {
  const id = pickRandom(ids);
  const { question, answer } = parseScenario(id);
  return { type: 'ksa', id, question, answer };
}

function buildTermItem(termNames) {
  const term         = pickRandom(termNames);
  const { def, ksa } = state.terms[term];
  return {
    type:       'terms',
    id:         term,
    question:   `Define: **${term}**`,
    answer:     def,
    relatedKsa: ksa,
  };
}

function buildSpacedItem() {
  const ksaIds  = Object.keys(state.knowledge);
  const termIds = Object.keys(state.terms);
  const pKsa    = getPriorityItems('ksa',   ksaIds,  5);
  const pTerms  = getPriorityItems('terms', termIds, 5);

  const hasKsa   = pKsa.length > 0;
  const hasTerms = pTerms.length > 0;

  if (Math.random() > 0.5 && hasKsa)  return buildScenarioItem(pKsa);
  if (hasTerms)                       return buildTermItem(pTerms);
  if (hasKsa)                         return buildScenarioItem(pKsa);

  // Fallback to absolute random if priority lists were empty
  if (ksaIds.length)  return buildScenarioItem(ksaIds);
  if (termIds.length) return buildTermItem(termIds);

  return { type: 'ksa', id: 'Error', question: 'No study items found.', answer: 'Check your data source.' };
}

/* ============================================================
   DOM HELPERS
   ============================================================ */

const $    = id  => document.getElementById(id);
const hide = id  => { $(id).hidden = true; };
const show = id  => { $(id).hidden = false; };
const txt  = (id, t) => { $(id).textContent = t; };
const html = (id, h) => { $(id).innerHTML   = h; };

let _toastTimer;
function showToast(msg, isError = false) {
  const t     = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = 'toast' + (isError ? ' toast-error' : '');
  t.hidden      = false;
  clearTimeout(_toastTimer);
  _toastTimer   = setTimeout(() => { t.hidden = true; }, 2800);
}

function hideAllScreens() {
  ['screen-loading', 'screen-menu', 'screen-quiz', 'screen-dashboard']
    .forEach(hide);
}

/* ============================================================
   MENU SCREEN
   ============================================================ */

function renderMenuStats() {
  const ksaIds  = Object.keys(state.knowledge);
  const termIds = Object.keys(state.terms);

  const studied  = ksaIds.filter(id => state.progress.ksa[id]?.lastReviewed).length;
  const mastered = ksaIds.filter(id => (state.progress.ksa[id]?.level ?? 0) >= 5).length;
  const termsL3  = termIds.filter(id => (state.progress.terms[id]?.level ?? 0) >= 3).length;

  txt('stat-studied',  `${studied}/${ksaIds.length}`);
  txt('stat-mastered', mastered);
  txt('stat-terms',    `${termsL3}/${termIds.length}`);
}

function showMenu() {
  hideAllScreens();
  renderMenuStats();
  show('screen-menu');
}

/* ============================================================
   QUIZ SCREEN
   ============================================================ */

const MODE_LABELS = {
  scenarios: '📋 Scenario Drill',
  terms:     '📖 Terminology',
  spaced:    '🔄 Spaced Repetition',
};

function startMode(mode) {
  state.currentMode = mode;
  state.session     = { correct: 0, total: 0 };
  hideAllScreens();
  show('screen-quiz');
  loadNextQuestion();
}

function loadNextQuestion() {
  const ksaIds  = Object.keys(state.knowledge);
  const termIds = Object.keys(state.terms);

  let item;
  switch (state.currentMode) {
    case 'scenarios':
      if (!ksaIds.length) { showToast('No scenarios available', true); showMenu(); return; }
      item = buildScenarioItem(ksaIds);
      break;
    case 'terms':
      if (!termIds.length) { showToast('No terminology available', true); showMenu(); return; }
      item = buildTermItem(termIds);
      break;
    default:
      item = buildSpacedItem();
      break;
  }
  state.currentItem = item;

  // Header
  txt('quiz-mode-label', MODE_LABELS[state.currentMode] ?? 'Quiz');
  txt('session-stats',
    state.session.total > 0
      ? `${state.session.correct}/${state.session.total} this session`
      : ''
  );

  // KSA badge
  if (item.type === 'ksa') { txt('ksa-badge', item.id); show('ksa-badge'); }
  else                      { hide('ksa-badge'); }

  // Mastery dots
  const level = state.progress[item.type]?.[item.id]?.level ?? 0;
  html('mastery-dots',
    Array.from({ length: 5 }, (_, i) => {
      let cls = 'level-dot';
      if (i < level) cls += level >= 5 ? ' mastered' : ' filled';
      return `<span class="${cls}" title="Level ${i + 1}"></span>`;
    }).join('')
  );

  // Question text
  html('question-text', md(item.question));

  // Reset UI state for new question
  hide('feedback-banner');
  hide('answer-section');
  hide('answer-btns');
  hide('next-btns');
  show('btn-reveal');
}

function revealAnswer() {
  const item = state.currentItem;

  html('answer-text', md(item.answer));

  if (item.relatedKsa) {
    txt('answer-ksa', `Related KSA: ${item.relatedKsa}`);
    show('answer-ksa');
  } else {
    hide('answer-ksa');
  }

  show('answer-section');
  hide('btn-reveal');
  show('answer-btns');

  // Smooth-scroll to answer on mobile so nothing is hidden below the fold
  $('answer-section').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function submitAnswer(correct) {
  const item = state.currentItem;
  updateScore(item.type, item.id, correct);

  state.session.total++;
  if (correct) state.session.correct++;

  const newLevel = state.progress[item.type][item.id].level;
  const banner   = $('feedback-banner');

  if (correct) {
    banner.className = 'feedback-banner feedback-correct';
    banner.innerHTML = newLevel >= 5
      ? '🌟 Mastered! Reached level 5.'
      : `✓ Correct — level ${newLevel}/5`;
  } else {
    banner.className = 'feedback-banner feedback-incorrect';
    banner.innerHTML = `✗ Needs more review — level ${newLevel}/5`;
  }

  show('feedback-banner');
  hide('answer-btns');
  show('next-btns');

  txt('session-stats', `${state.session.correct}/${state.session.total} this session`);
}

/* ============================================================
   DASHBOARD SCREEN
   ============================================================ */

const DOMAINS = [
  { id: 'I',   name: 'Concepts in Healthcare as Applied to Simulation',       weight: '10%', wtClass: ''            },
  { id: 'II',  name: 'Simulation Technology Operations',                       weight: '35%', wtClass: 'domain-wt--high' },
  { id: 'III', name: 'Healthcare Simulation Practices, Principles & Procedures', weight: '25%', wtClass: 'domain-wt--med'  },
  { id: 'IV',  name: 'Professional Role: Behavior, Capabilities & Leadership', weight: '15%', wtClass: ''            },
  { id: 'V',   name: 'Concepts in Instructional Design as Applied to Simulation', weight: '15%', wtClass: ''         },
];

// Colour per domain, used in the bar fill and left border
const DOMAIN_COLOURS = {
  I:   '#8b5cf6',
  II:  '#ef4444',
  III: '#f59e0b',
  IV:  '#10b981',
  V:   '#0891b2',
};

function showDashboard() {
  hideAllScreens();
  show('screen-dashboard');

  const ksaIds  = Object.keys(state.knowledge);
  const termIds = Object.keys(state.terms);

  // ---- Overall ----
  const allLevels = ksaIds.map(id => state.progress.ksa[id]?.level ?? 0);
  const avgLevel  = allLevels.reduce((s, n) => s + n, 0) / (allLevels.length || 1);
  const pct       = Math.round((avgLevel / 5) * 100);

  txt('dash-pct', `${pct}%`);
  $('dash-bar').style.width = `${pct}%`;
  txt('dash-reviewed', ksaIds.filter(id =>  state.progress.ksa[id]?.lastReviewed).length);
  txt('dash-mastered', allLevels.filter(l => l >= 5).length);
  txt('dash-total',    ksaIds.length);

  // ---- Domain breakdown ----
  const container = $('domain-breakdown');
  container.innerHTML = '';

  for (const domain of DOMAINS) {
    // Match KSAs whose ID prefix (before the first dot) equals the domain ID.
    // e.g. "II.A.1".split('.')[0] === "II"  ✓
    //      "III.A" .split('.')[0] === "III" ✓  (won't match "I" prefix check)
    const dKsas = ksaIds.filter(id => id.split('.')[0] === domain.id);
    if (!dKsas.length) continue;

    const levels   = dKsas.map(id => state.progress.ksa[id]?.level ?? 0);
    const avg      = levels.reduce((s, n) => s + n, 0) / levels.length;
    const domPct   = Math.round((avg / 5) * 100);
    const mastered = levels.filter(l => l >= 5).length;
    const reviewed = levels.filter(l => l > 0).length;
    const colour   = DOMAIN_COLOURS[domain.id] ?? 'var(--c-accent)';

    const el = document.createElement('div');
    el.className = 'domain-card';
    el.style.borderLeftColor = colour;
    el.innerHTML = `
      <div class="domain-row">
        <span class="domain-name">${domain.id}. ${domain.name}</span>
        <span class="domain-wt ${domain.wtClass}">${domain.weight}</span>
      </div>
      <div class="progress-bar-wrap" style="margin-top: .5rem;">
        <div class="progress-bar-fill"
             style="width: ${domPct}%;
                    background: linear-gradient(90deg, ${colour}88, ${colour});"></div>
      </div>
      <div class="domain-stats">
        ${reviewed}/${dKsas.length} reviewed &nbsp;·&nbsp;
        ${mastered} mastered &nbsp;·&nbsp;
        avg ${avg.toFixed(1)}/5
      </div>
    `;
    container.appendChild(el);
  }

  // ---- Terminology ----
  const termLevels    = termIds.map(id => state.progress.terms[id]?.level ?? 0);
  const termsReviewed = termLevels.filter(l => l > 0).length;
  const termsL3       = termLevels.filter(l => l >= 3).length;
  const termsPct      = Math.round((termsReviewed / (termIds.length || 1)) * 100);

  txt('terms-stats',
    `${termsReviewed} / ${termIds.length} terms reviewed · ${termsL3} at level 3+`
  );
  $('terms-bar').style.width = `${termsPct}%`;
}

/* ============================================================
   INIT — wire everything up
   ============================================================ */

async function init() {
  show('screen-loading');

  try {
    state.knowledge = await loadKnowledge();
    state.terms     = extractTerms(state.knowledge);
    state.progress  = loadProgress();
  } catch (err) {
    $('loading-error').textContent =
      `Failed to load study data: ${err.message}. ` +
      `Make sure expert_knowledge.json is in the same folder as index.html, ` +
      `and that the page is served over HTTP (not opened as a local file).`;
    show('loading-error');
    return;
  }

  // ---- Menu buttons ----
  $('btn-mode-scenarios').addEventListener('click', () => startMode('scenarios'));
  $('btn-mode-terms')    .addEventListener('click', () => startMode('terms'));
  $('btn-mode-spaced')   .addEventListener('click', () => startMode('spaced'));
  $('btn-dashboard')     .addEventListener('click', showDashboard);

  // ---- Quiz buttons ----
  $('btn-reveal')   .addEventListener('click', revealAnswer);
  $('btn-correct')  .addEventListener('click', () => submitAnswer(true));
  $('btn-incorrect').addEventListener('click', () => submitAnswer(false));
  $('btn-next')     .addEventListener('click', loadNextQuestion);
  $('btn-quiz-back').addEventListener('click', showMenu);
  $('btn-quiz-menu').addEventListener('click', showMenu);

  // ---- Dashboard buttons ----
  $('btn-dash-back').addEventListener('click', showMenu);

  // ---- Data management ----
  $('btn-export').addEventListener('click', exportProgress);

  $('btn-import').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', e => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = ''; // allow re-importing the same file if needed
  });

  $('btn-reset').addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      state.progress = { ksa: {}, terms: {} };
      saveProgress();
      renderMenuStats();
      showToast('Progress reset');
    }
  });

  // ---- Keyboard shortcut: Space/Enter to reveal, Y/N to grade ----
  document.addEventListener('keydown', e => {
    if ($('screen-quiz').hidden) return;
    const key = e.key.toLowerCase();

    // Space or Enter → reveal answer
    if ((key === ' ' || key === 'enter') && !$('btn-reveal').hidden) {
      e.preventDefault();
      revealAnswer();
      return;
    }

    // Y → Got It,  N → Missed It
    if (key === 'y' && !$('answer-btns').hidden) {
      submitAnswer(true);
      return;
    }
    if (key === 'n' && !$('answer-btns').hidden) {
      submitAnswer(false);
      return;
    }

    // Right arrow / Space → Next question (after grading)
    if ((key === ' ' || key === 'arrowright') && !$('next-btns').hidden) {
      e.preventDefault();
      loadNextQuestion();
    }
  });

  showMenu();
}

document.addEventListener('DOMContentLoaded', init);
