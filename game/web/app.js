// CHSOS Roguelite — vertical slice engine.
// Plain JS, no build step, no framework — reads content.js, renders screens,
// persists to localStorage plus explicit export/import (see README.md).

const SAVE_KEY = "chsos_roguelite_save_v1";

// `person`/`initials` per STORY_BIBLE.md §4.2 (approved 2026-09-23).
const CREW_DEFS = {
  av_tech: { name: "AV Technician", person: "Rosa “Patch” Quintero", initials: "PQ", domain: "II" },
  moulage_artist: { name: "Moulage & Fidelity Artist", person: "Theo Lind", initials: "TL", domain: "III" },
  debrief_facilitator: { name: "Debrief Facilitator", person: "Dr. Nadia Achebe", initials: "NA", domain: "IV" },
  simulationist: { name: "Simulationist", person: "Wren Castellanos", initials: "WC", domain: "V" }
};

const CREW_ORDER = ["av_tech", "moulage_artist", "debrief_facilitator", "simulationist"];

const RANK_LABELS = {
  junior_sim_tech: "Junior Sim Tech",
  operations_specialist: "Operations Specialist",
  lead_specialist: "Lead Specialist",
  chsos_certified: "CHSOS Certified"
};

const DOMAIN_COLOR_VAR = {
  I: "--domain-I", II: "--domain-II", III: "--domain-III", IV: "--domain-IV", V: "--domain-V"
};

function domainColor(domain) {
  if (!domain) return "#8b93a1";
  return getComputedStyle(document.documentElement).getPropertyValue(DOMAIN_COLOR_VAR[domain]).trim();
}

// ---------- audio: tiny procedural SFX, generated at runtime ----------
//
// This is NOT the jsfxr library — pulling that in would mean depending on a
// CDN link this environment can't verify is live. Instead this is a handful
// of oscillator sweeps via the Web Audio API, in the same "generate a short
// retro blip instead of sourcing an audio file" spirit jsfxr popularized.
// Swap in real jsfxr (or real SFX files) later without touching call sites —
// every trigger below just calls sfxSelect()/sfxSuccess()/sfxFail()/sfxCheckpointClear().

// Volume/mute is a device preference, not game progress: it lives under its own
// key so New Game / Import Save never touch it, and it isn't in exported saves.
const AUDIO_PREFS_KEY = "chsos_audio_prefs_v1";

function loadAudioPrefs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUDIO_PREFS_KEY));
    if (parsed && typeof parsed.volume === "number") {
      return { volume: Math.min(1, Math.max(0, parsed.volume)), muted: !!parsed.muted };
    }
  } catch (e) {}
  return { volume: 0.8, muted: false };
}

function saveAudioPrefs() {
  try {
    localStorage.setItem(AUDIO_PREFS_KEY, JSON.stringify(audioPrefs));
  } catch (e) {}
}

const audioPrefs = loadAudioPrefs();

let audioCtx = null;
let masterGain = null;
function getAudioCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = audioPrefs.volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function applyAudioPrefs() {
  if (masterGain) masterGain.gain.value = audioPrefs.volume;
  saveAudioPrefs();
  renderSoundControl();
}

function playTone({ freqStart, freqEnd, duration, type = "square", volume = 0.15, delay = 0 }) {
  if (audioPrefs.muted || audioPrefs.volume <= 0) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    const startAt = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freqStart, startAt);
    osc.frequency.linearRampToValueAtTime(freqEnd, startAt + duration);
    gain.gain.setValueAtTime(volume, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
    osc.connect(gain).connect(masterGain);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  } catch (e) {
    // Audio is a nice-to-have, never block gameplay on it.
  }
}

function sfxSelect() {
  playTone({ freqStart: 320, freqEnd: 560, duration: 0.08, type: "square", volume: 0.12 });
}
function sfxSuccess() {
  playTone({ freqStart: 520, freqEnd: 780, duration: 0.12, type: "triangle", volume: 0.16 });
  playTone({ freqStart: 780, freqEnd: 1040, duration: 0.14, type: "triangle", volume: 0.14, delay: 0.09 });
}
function sfxFail() {
  playTone({ freqStart: 220, freqEnd: 90, duration: 0.28, type: "sawtooth", volume: 0.16 });
}
function sfxCheckpointClear() {
  playTone({ freqStart: 440, freqEnd: 440, duration: 0.1, type: "triangle", volume: 0.15 });
  playTone({ freqStart: 554, freqEnd: 554, duration: 0.1, type: "triangle", volume: 0.15, delay: 0.11 });
  playTone({ freqStart: 659, freqEnd: 880, duration: 0.22, type: "triangle", volume: 0.17, delay: 0.22 });
}

// ---------- sound control (fixed corner widget, visible on every screen) ----------

function renderSoundControl() {
  const btn = document.getElementById("btn-sound-toggle");
  const slider = document.getElementById("sound-volume");
  const silent = audioPrefs.muted || audioPrefs.volume <= 0;
  btn.textContent = silent ? "🔇" : audioPrefs.volume < 0.5 ? "🔉" : "🔊";
  btn.setAttribute("aria-pressed", String(audioPrefs.muted));
  btn.setAttribute("aria-label", audioPrefs.muted ? "Unmute sound" : "Mute sound");
  btn.title = audioPrefs.muted ? "Unmute" : "Mute";
  slider.value = String(Math.round(audioPrefs.volume * 100));
  slider.classList.toggle("is-muted", audioPrefs.muted);
}

document.getElementById("btn-sound-toggle").addEventListener("click", () => {
  audioPrefs.muted = !audioPrefs.muted;
  // Unmuting at zero volume would still be silent; bring it back to something audible.
  if (!audioPrefs.muted && audioPrefs.volume <= 0) audioPrefs.volume = 0.5;
  applyAudioPrefs();
  sfxSelect();
});

const soundSlider = document.getElementById("sound-volume");
soundSlider.addEventListener("input", () => {
  audioPrefs.volume = Number(soundSlider.value) / 100;
  // Dragging the slider is an obvious "I want sound" signal.
  if (audioPrefs.volume > 0) audioPrefs.muted = false;
  applyAudioPrefs();
});
// Preview once on release rather than on every input tick.
soundSlider.addEventListener("change", () => sfxSelect());

renderSoundControl();

let profile = null;
let run = null;
let activeTimer = null;

// ---------- profile persistence ----------

function defaultProfile() {
  return {
    rank: "junior_sim_tech",
    unlocked_crew: [],
    hub_visits: 0,
    seen_intro: false,
    ksa_mastery: {},   // "II.A.1" -> { level: 0-5, last_reviewed: epoch ms }
    global_flags: {},
    recent_node_ids: [],  // anti-repeat memory the map generator excludes from picks
    sector_cleared_at_current_rank: false,  // gates promotion: mastery alone can't skip the deployment beat
    pending_promotion: null,  // { rank, crew } -- surfaced once on the next Hub visit, then cleared
    window_last_visited: SECTOR_YEAR_WINDOWS.map(() => -1),  // per SECTOR_YEAR_WINDOWS index: deployments_completed value at last visit, -1 = never (see mapgen.js's pickDeploymentWindow)
    deployments_completed: 0,
    pending_deployment: null,  // { window_index, outpost, year } already picked for the next deployment, shown at Hub, consumed on Begin Deployment
    outposts: {},  // outpost id -> { visits: [{year, success}] } in play order; see outpostContext()
    pending_callbacks: [],  // [{flag, message, deliver_after_hub_visits, queued_at_visit}] -- "outpost reports back" (SCHEMA.md), queued when a node with a `callback` resolves
    delivered_callback_flags: [],  // dedup guard: a recurring node's callback should only ever surface once, even if drawn again in a later run
    last_run: null,  // summary of the most recent run (see summarizeRun), read by story reactions
    story: defaultStoryState()
  };
}

// Story engine state (story.js content, STORY_BIBLE.md §7).
function defaultStoryState() {
  return {
    returns: 0,          // Hub returns that composed a conversation (a run ended)
    seen: {},            // scene/reaction id -> `returns` value when it last played
    tone: { wry: 0, earnest: 0, by_the_book: 0 },  // tone-dial tally; flavor only, read by the Act 4 ending
    convo: null,         // the conversation currently on the Waystation panel (see composeHubConversation)
    projection_at_last_return: null,  // fractional year, for the "moved N months" readout
    last_story_return: null,  // `returns` value when a scene/callback last played (ambient pacing)
    marsh: { meetings: [], seen_year: {} },  // checkpoint encounters: meetings [{year, success}] in play order; encounter id -> year it played
    callback_used: {},  // resident callback line id -> `returns` when delivered (least-recently-used pick)
    bark_used: {}       // bark id -> deployments_completed when shown (least-recently-used pick)
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw);
    return migrateProfile(Object.assign(defaultProfile(), parsed));
  } catch (e) {
    console.warn("Save data unreadable, starting fresh.", e);
    return defaultProfile();
  }
}

// Saves from before the story engine have hub_visits but no story state --
// don't greet a veteran with the first-rotation welcome.
function migrateProfile(p) {
  if (!p.story || typeof p.story !== "object") p.story = defaultStoryState();
  p.story = Object.assign(defaultStoryState(), p.story);
  if (p.story.returns === 0 && p.hub_visits > 0) {
    p.story.returns = p.hub_visits;
    p.global_flags = Object.assign({}, p.global_flags, { first_clear_seen: true });
  }
  delete p.pending_callback_line;
  // Pre-outpost saves stored only the next deployment's year-window.
  if (p.pending_window_index != null && !p.pending_deployment) {
    p.pending_deployment = pickDeployment(p, p.pending_window_index);
  }
  delete p.pending_window_index;
  return p;
}

function saveProfile() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(profile));
}

function exportSave() {
  const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chsos-roguelite-save.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importSaveFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      profile = migrateProfile(Object.assign(defaultProfile(), parsed));
      saveProfile();
      run = null;
      showHub();
    } catch (e) {
      alert("That file doesn't look like a valid save.");
    }
  };
  reader.readAsText(file);
}

// ---------- KSA mastery ----------

function bumpMastery(ksa, success) {
  if (!ksa) return;
  if (!profile.ksa_mastery[ksa]) profile.ksa_mastery[ksa] = { level: 0, last_reviewed: 0 };
  const entry = profile.ksa_mastery[ksa];
  entry.level = success ? Math.min(entry.level + 1, 5) : Math.max(entry.level - 1, 0);
  entry.last_reviewed = Date.now();
}

function domainMasteryPercent(domainId) {
  const entries = Object.keys(profile.ksa_mastery)
    .filter(k => k.split(".")[0] === domainId)
    .map(k => profile.ksa_mastery[k].level);
  if (entries.length === 0) return 0;
  const avg = entries.reduce((a, b) => a + b, 0) / entries.length;
  return Math.round((avg / 5) * 100);
}

// ---------- rank-up ----------
//
// Design (locked with Matthew 2026-09-20): promotion is gated on demonstrated
// mastery, not on raw question volume or pure run-completion count, because
// the point of this game is retained judgment, not memorization or grinding.
// RANK_ORDER/rankIndex come from mapgen.js (shared with its own rank gating).
//
// A rank promotion requires BOTH:
//   1. Mastery of the domain tied to the CURRENT rank (broad coverage, not
//      just a couple of easy KSAs run into the ground -- see MIN_KSA_COVERAGE_RATIO)
//   2. At least one sector cleared (checkpoint passed) at the current rank
// so volume can't substitute for retention, and retention alone can't skip
// the in-fiction deployment beat. Checked "Hades-style" on Hub return.

const RANK_GATE_DOMAIN = { junior_sim_tech: "II", operations_specialist: "III", lead_specialist: "IV" };
const RANK_UNLOCKS_CREW = { junior_sim_tech: "moulage_artist", operations_specialist: "debrief_facilitator", lead_specialist: "simulationist" };
const MASTERY_THRESHOLD_PERCENT = 60;
const MIN_KSA_COVERAGE_RATIO = 0.5;

function domainKsaCodes(domainId) {
  const set = new Set();
  Object.values(ALL_NODE_TEMPLATES).forEach(n => { if (n.domain === domainId && n.ksa) set.add(n.ksa); });
  return set;
}

function domainMasteryReady(domainId) {
  const allKsas = domainKsaCodes(domainId);
  if (allKsas.size === 0) return false;
  const touched = [...allKsas].filter(k => profile.ksa_mastery[k]);
  if (touched.length / allKsas.size < MIN_KSA_COVERAGE_RATIO) return false;
  return domainMasteryPercent(domainId) >= MASTERY_THRESHOLD_PERCENT;
}

function maybeRankUp() {
  const gateDomain = RANK_GATE_DOMAIN[profile.rank];
  if (!gateDomain) return; // chsos_certified is terminal
  if (!profile.sector_cleared_at_current_rank) return;
  if (!domainMasteryReady(gateDomain)) return;

  const nextRank = RANK_ORDER[rankIndex(profile.rank) + 1];
  const newCrew = RANK_UNLOCKS_CREW[profile.rank];
  profile.rank = nextRank;
  if (newCrew && !profile.unlocked_crew.includes(newCrew)) profile.unlocked_crew.push(newCrew);
  profile.sector_cleared_at_current_rank = false;
  profile.pending_promotion = { rank: nextRank, crew: newCrew };
}

// ---------- callbacks ("outpost reports back", SCHEMA.md) ----------
//
// A node with a `callback` (see game/pipeline/build_nodes.py's
// maybe_build_callback -- ~35% of diagnostic/scenario nodes) queues a future
// Hub line on completion. Delivered FIFO, at most one per Hub visit -- same
// "one line per visit" convention as the promotion line -- once at least
// `deliver_after_hub_visits` visits have passed since it was queued. A flag
// only ever delivers once even if the same node template recurs in a later run.

// Held on the run and only committed if the run passes its review (see
// commitRunCallbacks()): a snapped-back visit is dropped from the timeline, so
// its outpost can't report back on it.
function queueCallback(node, success) {
  if (!node.callback) return;
  const flag = node.callback.flag;
  if ((profile.delivered_callback_flags || []).includes(flag)) return;
  if (profile.pending_callbacks.some(c => c.flag === flag)) return;
  const held = run.held_callbacks || (run.held_callbacks = []);
  if (held.some(c => c.flag === flag)) return;
  held.push({
    flag,
    message: success ? node.callback.messages.success : node.callback.messages.fail,  // legacy fallback, see callbackLines()
    outpost: run && run.outpost,
    year: run && run.year,
    success,
    deliver_after_hub_visits: node.callback.deliver_after_hub_visits,
    queued_at_visit: profile.hub_visits,
  });
}

function commitRunCallbacks(success) {
  if (success && run.held_callbacks) profile.pending_callbacks.push(...run.held_callbacks);
}

function checkDueCallback() {
  const dueIndex = profile.pending_callbacks.findIndex(
    c => profile.hub_visits >= c.queued_at_visit + c.deliver_after_hub_visits
  );
  if (dueIndex === -1) return null;
  const [due] = profile.pending_callbacks.splice(dueIndex, 1);
  profile.delivered_callback_flags = (profile.delivered_callback_flags || []).concat(due.flag).slice(-200);
  return due;
}

// Resident-voiced delivery (outposts.js OUTPOST_CALLBACKS). Callbacks queued
// before outposts existed have no `outpost` and keep their generic message.
function callbackLines(due) {
  const pool = due.outpost && OUTPOST_CALLBACKS[due.outpost] && OUTPOST_CALLBACKS[due.outpost][due.success ? "success" : "fail"];
  if (!pool) {
    return [
      { setting: "An outpost report scrolls across the Waystation console." },
      { s: "hub", t: due.message }
    ];
  }
  const used = profile.story.callback_used;
  const pick = pool.slice().sort((a, b) => (used[a.id] == null ? -1 : used[a.id]) - (used[b.id] == null ? -1 : used[b.id]))[0];
  used[pick.id] = profile.story.returns;
  const o = OUTPOSTS[due.outpost];
  const fill = t => t.replace(/\{year\}/g, String(due.year)).replace(/\{site\}/g, o.name);
  return [
    { setting: fill(`A message from {site} comes in on the Waystation console, dated a few months after your {year} visit.`) },
    { s: o.resident, t: fill(pick.t) }
  ];
}

// ---------- readiness projection (STORY_BIBLE.md §6) ----------
//
// Blueprint-weighted coverage across *every* KSA in the pool (untouched KSAs
// count as level 0), mapped linearly from 2044 (nothing mastered) to 2039
// (everything at level 5). Deliberately not domainMasteryPercent(), which
// averages only touched KSAs and would let one lucky answer read as 100%.
// Can move backwards: a wrong answer drops that KSA's Leitner level.

function readinessFraction() {
  let totalWeight = 0, score = 0;
  Object.keys(DOMAIN_WEIGHT).forEach(d => {
    const ksas = [...domainKsaCodes(d)];
    if (!ksas.length) return;
    totalWeight += DOMAIN_WEIGHT[d];
    const levels = ksas.reduce((sum, k) => sum + (profile.ksa_mastery[k] ? profile.ksa_mastery[k].level : 0), 0);
    score += DOMAIN_WEIGHT[d] * levels / (5 * ksas.length);
  });
  return totalWeight ? score / totalWeight : 0;
}

function projectionYear() {
  return PROJECTION_START_YEAR - (PROJECTION_START_YEAR - PROJECTION_END_YEAR) * readinessFraction();
}

const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatProjection(yearFrac) {
  const year = Math.floor(yearFrac + 1e-9);
  const month = Math.min(11, Math.floor((yearFrac - year) * 12 + 1e-9));
  return `${MONTH_ABBR[month]} ${year}`;
}

// ---------- run summary (feeds story reactions) ----------

// Site names are "Outpost, Room" -- reactions talk about the outpost.
function outpostName(locationName) {
  if (!locationName) return null;
  const outpost = locationName.split(",")[0].trim();
  return outpost === "en route" ? null : outpost;
}

function runSite() {
  if (run.outpost) return OUTPOSTS[run.outpost].name;
  const nodes = Object.values(run.map.nodes);
  const checkpoint = nodes.find(n => n.type === "checkpoint");
  const fromCheckpoint = checkpoint && outpostName(checkpoint.location_name);
  if (fromCheckpoint) return fromCheckpoint;
  const counts = {};
  nodes.forEach(n => { const o = outpostName(n.location_name); if (o) counts[o] = (counts[o] || 0) + 1; });
  const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  return best || "the outpost";
}

// Blueprint labels are title-ish ("Healthcare equipment recommendations");
// lowercase the first letter so they read mid-sentence, but leave acronyms
// ("A/V equipment utilization", "LMS ...") alone.
function topicPhrase(ksa) {
  const label = KSA_LABELS[ksa];
  if (!label) return null;
  return /^[A-Z][a-z]/.test(label) ? label[0].toLowerCase() + label.slice(1) : label;
}

function summarizeRun(success) {
  const misses = run.misses || [];
  const byType = { intel: 0, diagnostic: 0, scenario: 0, checkpoint: 0 };
  const byKsa = {};
  misses.forEach(m => {
    byType[m.type] = (byType[m.type] || 0) + 1;
    if (m.ksa) byKsa[m.ksa] = (byKsa[m.ksa] || 0) + 1;
  });
  const topKsa = Object.keys(byKsa).sort((a, b) => byKsa[b] - byKsa[a])[0];
  const checkpoint = Object.values(run.map.nodes).find(n => n.type === "checkpoint");
  const years = Object.values(run.map.nodes).map(n => n.year).filter(Boolean);
  return {
    success,
    site: runSite(),
    year: run.year || (checkpoint && checkpoint.year ? checkpoint.year : (years[0] || null)),
    misses: misses.length,
    misses_by_type: byType,
    top_missed_topic: topKsa && byKsa[topKsa] >= 2 ? topicPhrase(topKsa) : null,
    checkpoint_topic: !success && checkpoint ? topicPhrase(checkpoint.ksa) : null,
    end_integrity: run.resources.integrity,
    end_morale: run.resources.morale,
    end_budget: run.resources.budget
  };
}

// ---------- outposts (outposts.js content, STORY_BIBLE.md §4.4-4.5) ----------
//
// Each deployment is one outpost in one year. The year-window is still picked
// by pickDeploymentWindow() (mapgen.js); the outpost gets the same
// staleness-squared weighting so all four come around without a fixed cycle.

function pickDeployment(p, windowIndex) {
  const wi = windowIndex != null ? windowIndex : pickDeploymentWindow(p, Math.random);
  const done = p.deployments_completed || 0;
  const outpost = weightedChoice(OUTPOST_ORDER.map(id => {
    const rec = (p.outposts || {})[id];
    const last = rec && rec.last_deployment != null ? rec.last_deployment : -1;
    const staleness = Math.max(1, done - last);
    return [id, staleness * staleness];
  }), Math.random);
  const [lo, hi] = SECTOR_YEAR_WINDOWS[wi];
  const year = lo + Math.floor(Math.random() * (hi - lo + 1));
  return { window_index: wi, outpost, year };
}

// Question nodes were generated with a site baked into their text (see
// SITE_POOL_BY_DOMAIN in build_nodes.py). Re-home every string in a copy of
// the node onto this run's outpost, keeping any room suffix ("…, Server Room").
const OUTPOST_NAME_PATTERN = new RegExp(
  Object.values(OUTPOSTS).map(o => o.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");

function rehomeNode(node, outpostId) {
  const name = OUTPOSTS[outpostId].name;
  return JSON.parse(JSON.stringify(node), (key, value) =>
    typeof value === "string" ? value.replace(OUTPOST_NAME_PATTERN, name) : value);
}

// Residents and Marsh only remember successful visits (a failed leap is
// dropped from the timeline), and only ones at or before the current year.
function timelineStatus(records, year) {
  if (!records.length) return { status: "first", refYear: null };
  const past = records.filter(r => r.success && r.year <= year).map(r => r.year);
  if (past.length) return { status: "met", refYear: Math.max(...past) };
  const future = records.filter(r => r.success && r.year > year).map(r => r.year);
  if (future.length) return { status: "future", refYear: Math.min(...future) };
  return { status: "unrecorded", refYear: null };
}

function outpostContext(outpostId, year) {
  const visits = ((profile.outposts[outpostId] || {}).visits) || [];
  const { status, refYear } = timelineStatus(visits, year);
  return {
    profile,
    outpost: outpostId,
    year,
    status,
    refYear,
    visits: visits.length,
    clears: visits.filter(v => v.success).length,
    fails: visits.filter(v => !v.success).length,
    seen: id => profile.story.seen[id] != null,
    flag: f => !!(profile.global_flags && profile.global_flags[f]),
    crew: id => profile.unlocked_crew.includes(id)
  };
}

function pickBriefing(ctx) {
  const candidates = OUTPOST_BRIEFINGS.filter(b =>
    (!b.outpost || b.outpost === ctx.outpost) && !ctx.seen(b.id) && b.when(ctx));
  if (!candidates.length) return null;
  const top = Math.max(...candidates.map(b => b.priority));
  return candidates.find(b => b.priority === top);
}

function outpostVars(outpostId, year, refYear) {
  const o = OUTPOSTS[outpostId];
  return { site: o.name, short: o.short, resident: o.residentName, year: String(year), refYear: refYear != null ? String(refYear) : "" };
}

// The one-line banner every map shows; also the subtitle on a full briefing.
function outpostStatusLine(ctx) {
  const o = OUTPOSTS[ctx.outpost];
  const parts = [`${o.residentName.toUpperCase()} ON SITE`];
  if (ctx.status === "first") parts.push("FIRST VISIT");
  else if (ctx.status === "met") parts.push(`THEY REMEMBER YOU FROM ${ctx.refYear}`);
  else if (ctx.status === "future") parts.push(`YOU'VE BEEN HERE IN ${ctx.refYear}. THEY HAVEN'T MET YOU YET`);
  else parts.push("NO VISIT ON RECORD");
  if (ctx.visits) parts.push(`RECORD ${ctx.clears}–${ctx.fails}`);
  return parts.join(" · ");
}

function recordOutpostVisit(success) {
  if (!run.outpost) return;
  const rec = profile.outposts[run.outpost] || (profile.outposts[run.outpost] = { visits: [], last_deployment: null });
  rec.visits.push({ year: run.year, success });
  rec.last_deployment = profile.deployments_completed;
}

// ---------- Surveyor Marsh ----------

function marshContext() {
  const m = profile.story.marsh;
  const { status, refYear } = timelineStatus(m.meetings, run.year);
  const last = m.meetings[m.meetings.length - 1];
  return {
    year: run.year,
    meetings: m.meetings.length,
    status,
    refYear,
    lastFailed: !!(last && !last.success),
    seenYear: id => (m.seen_year[id] != null ? m.seen_year[id] : null)
  };
}

// Chosen once per checkpoint (on first open) so re-rendering a stage can't re-roll it.
function marshEncounter() {
  if (run.marsh) return run.marsh;
  const mc = marshContext();
  const seenYear = profile.story.marsh.seen_year;
  const candidates = MARSH_ENCOUNTERS.filter(e => seenYear[e.id] == null && e.when(mc));
  const top = candidates.length ? Math.max(...candidates.map(e => e.priority)) : null;
  const enc = candidates.find(e => e.priority === top) || null;
  const rot = mc.meetings % 3;
  run.marsh = {
    id: enc ? enc.id : null,
    intro: enc ? enc.intro : MARSH_FALLBACKS[rot % MARSH_FALLBACKS.length],
    pass: (enc && enc.pass) || MARSH_RESULTS.pass[rot % MARSH_RESULTS.pass.length],
    fail: (enc && enc.fail) || MARSH_RESULTS.fail[rot % MARSH_RESULTS.fail.length],
    vars: outpostVars(run.outpost, run.year, mc.refYear)
  };
  return run.marsh;
}

function recordMarshMeeting(success) {
  if (!run.marsh) return;
  const m = profile.story.marsh;
  m.meetings.push({ year: run.year, success });
  if (run.marsh.id) m.seen_year[run.marsh.id] = run.year;
}

// ---------- in-run barks (outposts.js BARKS) ----------

const LOW_RESOURCE_THRESHOLD = { integrity: 35, morale: 35, budget: 30 };

// What just happened, most notable first. Low-resource barks fire once per
// run; a plain clean node only gets a bark some of the time so the strip
// doesn't chatter.
function barkEvent(node, success) {
  if (!node) return "arrive";
  const fired = run.barkFired || (run.barkFired = {});
  for (const res of ["integrity", "morale", "budget"]) {
    if (run.resources[res] <= LOW_RESOURCE_THRESHOLD[res] && !fired[res]) { fired[res] = true; return "low_" + res; }
  }
  const checkpointNext = run.available.some(id => run.map.nodes[id] && run.map.nodes[id].type === "checkpoint");
  if (checkpointNext && !fired.checkpoint) { fired.checkpoint = true; if (Math.random() < 0.6) return "checkpoint"; }
  if (!success) return "miss";
  return Math.random() < 0.5 ? (node.type === "rest" ? "rest" : "ok") : null;
}

function pickBark(event) {
  if (!event) return null;
  const b = { year: run.year, resources: run.resources };
  const eligible = BARKS.filter(k => k.on === event
    && (!k.outpost || k.outpost === run.outpost)
    && (!k.crew || profile.unlocked_crew.includes(k.crew))
    && (!k.when || k.when(b)));
  if (!eligible.length) return null;
  const used = profile.story.bark_used;
  const lru = k => (used[k.id] == null ? -1 : used[k.id]);
  const oldest = Math.min(...eligible.map(lru));
  const tied = eligible.filter(k => lru(k) === oldest);
  const pick = tied[Math.floor(Math.random() * tied.length)];
  used[pick.id] = profile.deployments_completed;
  return pick.line;
}

function setBark(event) {
  run.bark = pickBark(event);
}

function renderBark() {
  const el = document.getElementById("map-bark");
  el.innerHTML = run.bark ? storyLineHtml(run.bark, outpostVars(run.outpost, run.year, null)) : "";
}

function convoLinesHtml(lines, vars) {
  return `<div class="hub-convo">${lines.map(l => storyLineHtml(l, vars)).join("")}</div>`;
}

// ---------- story engine (story.js content, STORY_BIBLE.md §7.1) ----------
//
// Each Hub return composes one conversation: a reaction to the run that just
// ended, then at most one story slot in priority order
//   promotion > main (projection beats) > character (crew arcs) > due outpost callback > ambient.
// Anything eligible but not picked stays eligible for a later return -- the
// same deferral rule the callback queue already used against promotions.
// The composed conversation is stored on the profile so a reload or re-render
// shows the same thing instead of re-rolling.

function storyContext(projectionDeltaMonths) {
  const st = profile.story;
  return {
    profile,
    last: profile.last_run,
    flag: f => !!(profile.global_flags && profile.global_flags[f]),
    seen: id => st.seen[id] != null,
    crew: id => profile.unlocked_crew.includes(id),
    domainPct: d => domainMasteryPercent(d),
    rankAtLeast: r => rankIndex(profile.rank) >= rankIndex(r),
    projectionYear: projectionYear(),
    projectionDeltaMonths
  };
}

function markStorySeen(entry) {
  profile.story.seen[entry.id] = profile.story.returns;
  (entry.sets_flags || []).forEach(f => { profile.global_flags[f] = true; });
}

// A reaction heard within this many returns yields to any other eligible one,
// even a lower-priority one -- otherwise a lone high-priority reaction (e.g.
// the failed-checkpoint one) would play on every matching return.
const REACTION_RECENCY_WINDOW = 4;

function pickReaction(ctx) {
  const seen = profile.story.seen;
  const eligible = STORY_REACTIONS.filter(r => r.when(ctx));
  if (!eligible.length) return null;
  const fresh = eligible.filter(r => seen[r.id] == null || profile.story.returns - seen[r.id] > REACTION_RECENCY_WINDOW);
  const pool = fresh.length ? fresh : eligible;
  const top = Math.max(...pool.map(r => r.priority));
  // Unseen variants first, then whichever was heard longest ago.
  return pool
    .filter(r => r.priority === top)
    .sort((a, b) => (seen[a.id] == null ? -1 : seen[a.id]) - (seen[b.id] == null ? -1 : seen[b.id]))[0];
}

function pickScene(ctx, layer) {
  const candidates = STORY_SCENES.filter(sc => sc.layer === layer && !ctx.seen(sc.id) && sc.when(ctx));
  if (!candidates.length) return null;
  const top = Math.max(...candidates.map(sc => sc.priority));
  return candidates.find(sc => sc.priority === top); // declared order breaks ties
}

function composeHubConversation() {
  const st = profile.story;
  const projNow = projectionYear();
  const deltaMonths = st.projection_at_last_return == null
    ? 0
    : Math.round((projNow - st.projection_at_last_return) * 12);
  const ctx = storyContext(deltaMonths);
  const blocks = [];

  const reaction = pickReaction(ctx);
  if (reaction) { markStorySeen(reaction); blocks.push({ kind: "reaction", id: reaction.id }); }

  if (profile.pending_promotion) {
    blocks.push({ kind: "text", lines: promotionLines(profile.pending_promotion) });
    profile.pending_promotion = null;
  } else {
    const scene = pickScene(ctx, "main") || pickScene(ctx, "character");
    const callback = scene ? null : checkDueCallback();
    // Ambient filler at most every other return, so the pool stretches across
    // the gaps between gated beats instead of being burned all at once.
    const ambientRested = st.last_story_return == null || st.returns - st.last_story_return >= 2;
    const ambient = scene || callback || !ambientRested ? null : pickScene(ctx, "ambient");
    const chosen = scene || ambient;
    if (chosen || callback) st.last_story_return = st.returns;
    if (chosen) {
      markStorySeen(chosen);
      blocks.push({ kind: "scene", id: chosen.id });
    } else if (callback) {
      blocks.push({ kind: "text", lines: callbackLines(callback) });
    }
  }

  const last = profile.last_run;
  st.convo = {
    blocks,
    choices: {},
    vars: {
      site: last ? last.site : "",
      year: last && last.year ? String(last.year) : "",
      topic: last ? (last.top_missed_topic || last.checkpoint_topic || "") : "",
      budget: last ? String(last.end_budget) : "",
      projection: formatProjection(projNow),
      rank: RANK_LABELS[profile.rank]
    },
    projection_delta_months: deltaMonths
  };
  st.projection_at_last_return = projNow;
  convoAnimateFrom = 0;
}

function promotionLines(promotion) {
  const lines = [
    { setting: "A notification chimes on the Waystation console. Hub reads it out loud, and doesn't bother hiding that it's pleased." },
    { s: "hub", t: promotionLine(promotion) }
  ];
  if (promotion.crew) {
    lines.push({ s: "av_tech", t: "New face. Somebody tell them about rule two before Hub does." });
  }
  return lines;
}

function storyEntryById(id) {
  return STORY_SCENES.find(sc => sc.id === id) || STORY_REACTIONS.find(r => r.id === id) || null;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch]));
}

// Placeholders come from the conversation's stored vars; *word* -> emphasis.
function renderStoryText(text, vars) {
  const filled = text.replace(/\{(\w+)\}/g, (m, key) => (vars[key] != null && vars[key] !== "" ? vars[key] : m));
  return escapeHtml(filled).replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

// Index of the first line to fade in on the next render; null = no animation.
// Set by composeHubConversation() (animate everything) and by a tone choice
// (animate only the reply), so re-rendering the Hub doesn't replay old lines.
let convoAnimateFrom = null;

function storyLineHtml(line, vars) {
  if (line.setting) return `<div class="convo-setting">${renderStoryText(line.setting, vars)}</div>`;
  const spk = SPEAKERS[line.s] || { label: line.s.toUpperCase(), colorVar: "--muted" };
  return `
    <div class="convo-line">
      <span class="convo-speaker hud" style="color:var(${spk.colorVar})">${spk.label}</span>
      <span class="convo-text">${renderStoryText(line.t, vars)}</span>
    </div>`;
}

function renderHubConversation() {
  const el = document.getElementById("hub-convo");
  const convo = profile.story.convo;
  if (!convo) { el.innerHTML = ""; return; }
  const parts = [];
  convo.blocks.forEach(block => {
    const lines = block.kind === "text" ? block.lines : ((storyEntryById(block.id) || {}).lines || []);
    lines.forEach(line => {
      if (!line.choice) { parts.push(storyLineHtml(line, convo.vars)); return; }
      const picked = convo.choices[block.id];
      if (picked) {
        const opt = line.choice[picked];
        parts.push(`
          <div class="convo-line convo-trigger">
            <span class="convo-speaker hud">TRIGGER <span class="tone-tag">${TONE_LABELS[picked]}</span></span>
            <span class="convo-text">${renderStoryText(opt.t, convo.vars)}</span>
          </div>`);
        (opt.reply || []).forEach(r => parts.push(storyLineHtml(r, convo.vars)));
      } else {
        const buttons = Object.keys(TONE_LABELS).filter(k => line.choice[k]).map(k => `
          <button class="convo-choice" data-block="${escapeHtml(block.id)}" data-tone="${k}">
            <span class="tone-tag">${TONE_LABELS[k]}</span>
            <span>${renderStoryText(line.choice[k].t, convo.vars)}</span>
          </button>`).join("");
        parts.push(`<div class="convo-choices">${buttons}</div>`);
      }
    });
  });
  el.innerHTML = parts.join("");

  if (convoAnimateFrom != null) {
    [...el.children].forEach((child, i) => {
      if (i < convoAnimateFrom) return;
      child.classList.add("convo-fade");
      child.style.animationDelay = `${(i - convoAnimateFrom) * 140}ms`;
    });
    convoAnimateFrom = null;
  }

  el.querySelectorAll(".convo-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      const tone = btn.dataset.tone;
      convo.choices[btn.dataset.block] = tone;
      profile.story.tone[tone] = (profile.story.tone[tone] || 0) + 1;
      saveProfile();
      sfxSelect();
      // Everything before the (now-replaced) choice row stays put; animate the rest.
      convoAnimateFrom = [...el.children].indexOf(btn.closest(".convo-choices"));
      renderHubConversation();
    });
  });
}

function renderProjectionReadout() {
  const el = document.getElementById("hub-projection");
  // The readout "appears" in-fiction during main_projection_intro.
  if (profile.story.seen.main_projection_intro == null) { el.hidden = true; return; }
  el.hidden = false;
  const convo = profile.story.convo;
  const delta = convo ? convo.projection_delta_months : 0;
  let deltaHtml = "";
  if (delta < 0) deltaHtml = `<span class="proj-delta gain">▲ ${-delta} MO EARLIER</span>`;
  else if (delta > 0) deltaHtml = `<span class="proj-delta slip">▼ ${delta} MO LATER</span>`;
  el.innerHTML = `
    <span class="eyebrow">PROGRAM READINESS PROJECTION</span>
    <span class="proj-value hud">${formatProjection(projectionYear())}</span>
    ${deltaHtml}`;
}

// ---------- screen helpers ----------

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(el => el.hidden = true);
  document.getElementById(id).hidden = false;
}

// ---------- intro ----------

function startIntro() {
  document.getElementById("intro-text").textContent =
    "Fort Kessler Regional Training Center just hired you as a Junior Sim Tech. " +
    "Somebody on the hiring committee flagged your file: you're apparently the only " +
    "applicant who didn't blink at the phrase “bootstrap paradox.” You're about to " +
    "find out why that mattered.";
  showScreen("screen-intro");
}

function crewCardHtml(id) {
  const def = CREW_DEFS[id];
  return `
    <div class="crew-avatar" style="color:${domainColor(def.domain)};border-color:${domainColor(def.domain)}">${def.initials}</div>
    <div>
      <div class="crew-name">${def.person}</div>
      <div class="crew-domain">${def.name} · Domain ${def.domain} — ${DOMAIN_LABELS[def.domain]}</div>
    </div>
  `;
}

document.getElementById("btn-intro-continue").addEventListener("click", () => {
  showCrewHire();
});

// First crew pickup is an actual beat, not a silent grant -- later crew get a
// promotion-line announcement (promotionLine()) when rank-up unlocks them;
// AV Technician previously got nothing at all since rank-up doesn't apply yet.
function showCrewHire() {
  document.getElementById("crew-hire-card").innerHTML = crewCardHtml("av_tech");
  showScreen("screen-crew-hire");
}

document.getElementById("btn-crew-hire-continue").addEventListener("click", () => {
  profile.seen_intro = true;
  if (!profile.unlocked_crew.includes("av_tech")) profile.unlocked_crew.push("av_tech");
  saveProfile();
  showHub();
});

// ---------- hub ----------

function promotionLine(promotion) {
  const crewLine = promotion.crew
    ? ` And there's someone new joining the roster: ${CREW_DEFS[promotion.crew].person}, ${CREW_DEFS[promotion.crew].name}.`
    : "";
  return `Command must've liked what they saw. You're being bumped to ${RANK_LABELS[promotion.rank].toUpperCase()}.${crewLine}`;
}

function showHub() {
  document.getElementById("hub-rank").textContent = RANK_LABELS[profile.rank].toUpperCase();
  if (!profile.pending_deployment) {
    profile.pending_deployment = pickDeployment(profile);
    saveProfile();
  }
  const next = profile.pending_deployment;
  document.getElementById("hub-sector").textContent = `NEXT DEPLOYMENT — ${OUTPOSTS[next.outpost].name.toUpperCase()} · ${next.year}`;
  // A fresh profile, or one loaded/imported without a stored conversation,
  // gets one composed now (no last_run, so only non-run content is eligible).
  if (!profile.story.convo) {
    composeHubConversation();
    saveProfile();
  }
  renderProjectionReadout();
  renderHubConversation();

  const domainsEl = document.getElementById("hub-domains");
  domainsEl.innerHTML = "";
  const gateDomain = RANK_GATE_DOMAIN[profile.rank];
  const nextRank = gateDomain ? RANK_ORDER[rankIndex(profile.rank) + 1] : null;
  Object.keys(DOMAIN_LABELS).forEach(id => {
    const pct = domainMasteryPercent(id);
    const row = document.createElement("div");
    const isGate = id === gateDomain;
    let gateNoteHtml = "";
    if (isGate) {
      const masteryReady = domainMasteryReady(id);
      const sectorReady = profile.sector_cleared_at_current_rank;
      const ready = masteryReady && sectorReady;
      gateNoteHtml = `
        <div class="domain-gate-note${ready ? " ready" : ""}">
          ${masteryReady ? "✓" : "○"} ${MASTERY_THRESHOLD_PERCENT}% mastery for ${RANK_LABELS[nextRank]}
          &nbsp;·&nbsp;
          ${sectorReady ? "✓" : "○"} sector cleared at current rank
        </div>
      `;
    }
    row.innerHTML = `
      <div class="domain-row">
        <span class="hud" style="color:${domainColor(id)}">${id} <span style="color:#d3d8e0;font-weight:400">${DOMAIN_LABELS[id]}</span></span>
        <span class="hud">${pct}%</span>
      </div>
      <div class="domain-bar-track">
        <div class="domain-bar-fill" style="width:${pct}%;background:${domainColor(id)}"></div>
        ${isGate ? `<div class="domain-bar-threshold" style="left:${MASTERY_THRESHOLD_PERCENT}%"></div>` : ""}
      </div>
      ${gateNoteHtml}
    `;
    row.style.marginBottom = "12px";
    domainsEl.appendChild(row);
  });

  const crewEl = document.getElementById("hub-crew");
  crewEl.innerHTML = "";
  CREW_ORDER.forEach(id => {
    const def = CREW_DEFS[id];
    const unlocked = profile.unlocked_crew.includes(id);
    const card = document.createElement("div");
    card.className = "crew-card" + (unlocked ? "" : " locked");
    card.innerHTML = `
      <div class="crew-avatar" style="color:${domainColor(def.domain)};border-color:${domainColor(def.domain)}">${unlocked ? def.initials : "?"}</div>
      <div>
        <div class="crew-name">${unlocked ? def.person : "Locked"}</div>
        <div class="crew-domain">${unlocked ? def.name + " · Domain " + def.domain + " — " + DOMAIN_LABELS[def.domain] : "Unlocks later"}</div>
      </div>
    `;
    crewEl.appendChild(card);
  });

  showScreen("screen-hub");
}

document.getElementById("btn-begin-deployment").addEventListener("click", () => {
  const usedNodeIds = new Set(profile.recent_node_ids || []);
  const deployment = profile.pending_deployment || pickDeployment(profile);
  const windowIndex = deployment.window_index;
  const map = generateSectorMap({ profile, usedNodeIds, windowIndex });
  Object.keys(map.nodes).forEach(id => { map.nodes[id] = rehomeNode(map.nodes[id], deployment.outpost); });
  profile.window_last_visited[windowIndex] = profile.deployments_completed;
  profile.deployments_completed += 1;
  profile.pending_deployment = null;
  run = {
    outpost: deployment.outpost,
    year: deployment.year,
    resources: { integrity: 100, morale: 100, budget: 200 },
    map,
    available: [...map.start],
    completedIds: [],
    misses: [],  // [{type, domain, ksa}] -- summarized into profile.last_run for story reactions
    lastOutcomeOk: true
  };
  // Hybrid arrival (decided 2026-09-24): a full briefing screen only when
  // there's something new to say; otherwise straight to the map's banner.
  setBark("arrive");
  const ctx = outpostContext(run.outpost, run.year);
  const briefing = pickBriefing(ctx);
  if (briefing) {
    markStorySeen(briefing);
    saveProfile();
    showBriefing(briefing, ctx);
  } else {
    saveProfile();
    showMap();
  }
});

function showBriefing(briefing, ctx) {
  const vars = outpostVars(ctx.outpost, ctx.year, ctx.refYear);
  document.getElementById("briefing-eyebrow").textContent = `ARRIVAL · ${ctx.year}`;
  document.getElementById("briefing-title").textContent = OUTPOSTS[ctx.outpost].name.toUpperCase();
  document.getElementById("briefing-status").textContent = outpostStatusLine(ctx);
  const el = document.getElementById("briefing-lines");
  el.innerHTML = briefing.lines.map(l => storyLineHtml(l, vars)).join("");
  [...el.children].forEach((child, i) => {
    child.classList.add("convo-fade");
    child.style.animationDelay = `${i * 140}ms`;
  });
  showScreen("screen-briefing");
}

document.getElementById("btn-briefing-deploy").addEventListener("click", () => {
  sfxSelect();
  showMap();
});

document.getElementById("btn-export").addEventListener("click", exportSave);
document.getElementById("btn-import").addEventListener("click", () => document.getElementById("file-import").click());
document.getElementById("file-import").addEventListener("change", (e) => {
  if (e.target.files[0]) importSaveFile(e.target.files[0]);
  e.target.value = "";
});
document.getElementById("btn-new-game").addEventListener("click", () => {
  if (!confirm("Start a new game? This clears rank, crew, and mastery progress in the browser (export first if you want to keep it).")) return;
  profile = defaultProfile();
  saveProfile();
  startIntro();
});

// ---------- map ----------

function showMap() {
  document.getElementById("map-location").textContent = String(run.year);
  document.getElementById("map-subtitle").textContent = OUTPOSTS[run.outpost].name.toUpperCase();
  document.getElementById("map-banner").textContent = outpostStatusLine(outpostContext(run.outpost, run.year));
  renderBark();

  renderStats();
  renderSectorMap();
  showScreen("screen-map");
}

function renderStats() {
  document.getElementById("stat-integrity").textContent = run.resources.integrity;
  document.getElementById("stat-morale").textContent = run.resources.morale;
  document.getElementById("stat-budget").textContent = run.resources.budget + " CR";
}

// ---------- positioned sector map (graph + SVG lines + traveling marker) ----------

const NODE_GLYPHS = { intel: "IN", diagnostic: "RP", scenario: "SC", rest: "RS", checkpoint: "CP" };

function nodeState(nodeId) {
  if (run.completedIds.includes(nodeId)) return "completed";
  if (run.available.includes(nodeId)) return "available";
  return "locked";
}

function currentShipAnchor() {
  const lastId = run.completedIds[run.completedIds.length - 1];
  return run.map.positions[lastId || "start"];
}

function pctPos(pos) {
  return { left: (pos.x / MAP_VIEWBOX.w * 100) + "%", top: (pos.y / MAP_VIEWBOX.h * 100) + "%" };
}

function renderSectorMap() {
  const svg = document.getElementById("map-svg");
  const nodesLayer = document.getElementById("map-nodes");
  svg.innerHTML = "";
  nodesLayer.innerHTML = "";
  hideNodeTooltip();

  const svgNS = "http://www.w3.org/2000/svg";
  allMapEdges(run.map).forEach(([from, to]) => {
    const fromPos = run.map.positions[from];
    const toPos = run.map.positions[to];
    const fromReached = from === "start" || run.completedIds.includes(from);
    const toDone = run.completedIds.includes(to);
    const toAvailable = run.available.includes(to);
    let stroke = "#232a35";
    let dashed = true;
    if (fromReached && toDone) { stroke = "var(--accent)"; dashed = false; }
    else if (fromReached && toAvailable) { stroke = "#3a4250"; dashed = false; }
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", fromPos.x);
    line.setAttribute("y1", fromPos.y);
    line.setAttribute("x2", toPos.x);
    line.setAttribute("y2", toPos.y);
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", "2.5");
    if (dashed) line.setAttribute("stroke-dasharray", "4 4");
    svg.appendChild(line);
  });

  Object.keys(run.map.positions).forEach(nodeId => {
    if (nodeId === "start") return;
    const node = run.map.nodes[nodeId];
    const pos = pctPos(run.map.positions[nodeId]);
    const state = nodeState(nodeId);
    const color = domainColor(node.domain);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `map-node-btn state-${state}`;
    btn.style.left = pos.left;
    btn.style.top = pos.top;
    btn.style.color = color;
    btn.style.borderColor = color;
    if (state === "completed") btn.style.background = color + "22";
    btn.textContent = NODE_GLYPHS[node.type] || "?";
    btn.disabled = state !== "available";
    btn.setAttribute("aria-label", node.title);
    if (state === "available") btn.addEventListener("click", () => travelTo(nodeId));
    btn.addEventListener("mouseenter", () => showNodeTooltip(node.title, pos));
    btn.addEventListener("mouseleave", hideNodeTooltip);
    btn.addEventListener("focus", () => showNodeTooltip(node.title, pos));
    btn.addEventListener("blur", hideNodeTooltip);
    nodesLayer.appendChild(btn);
  });

  snapShipMarker();
}

function snapShipMarker() {
  const marker = document.getElementById("ship-marker");
  const pos = pctPos(currentShipAnchor());
  marker.style.transition = "none";
  marker.style.left = pos.left;
  marker.style.top = pos.top;
  void marker.offsetHeight; // force reflow before re-enabling the CSS transition
  marker.style.transition = "";
}

function showNodeTooltip(title, pos) {
  const tip = document.getElementById("map-tooltip");
  tip.textContent = title;
  tip.style.left = pos.left;
  tip.style.top = `calc(${pos.top} + 34px)`;
  tip.classList.add("visible");
}

function hideNodeTooltip() {
  document.getElementById("map-tooltip").classList.remove("visible");
}

function travelTo(nodeId) {
  hideNodeTooltip();
  sfxSelect();
  document.querySelectorAll(".map-node-btn").forEach(b => b.disabled = true);
  const marker = document.getElementById("ship-marker");
  const pos = pctPos(run.map.positions[nodeId]);
  marker.style.left = pos.left;
  marker.style.top = pos.top;
  setTimeout(() => openNode(nodeId), 620);
}

// ---------- node interaction ----------

function openNode(nodeId) {
  const node = run.map.nodes[nodeId];
  clearActiveTimer();
  document.getElementById("overlay-node").hidden = false;
  switch (node.type) {
    case "intel": renderIntel(node); break;
    case "diagnostic": renderDiagnostic(node); break;
    case "scenario": renderScenario(node); break;
    case "rest": renderRest(node); break;
    case "checkpoint": renderCheckpoint(node); break;
  }
}

function closeNodeOverlay() {
  clearActiveTimer();
  document.getElementById("overlay-node").hidden = true;
}

function clearActiveTimer() {
  if (activeTimer) { clearInterval(activeTimer); activeTimer = null; }
}

function panel() { return document.getElementById("node-panel-content"); }

function clampResources() {
  run.resources.integrity = Math.max(0, Math.min(100, run.resources.integrity));
  run.resources.morale = Math.max(0, Math.min(100, run.resources.morale));
  run.resources.budget = Math.max(0, run.resources.budget);
}

function applyEffects(effects) {
  if (!effects) return;
  run.resources.integrity += effects.integrity || 0;
  run.resources.morale += effects.morale || 0;
  run.resources.budget += effects.budget || 0;
  clampResources();
}

function effectsRowHtml(effects) {
  if (!effects) return "";
  const chip = (label, val) => val ? `<span class="effect-chip ${val > 0 ? "pos" : "neg"}">${label} ${val > 0 ? "+" : ""}${val}</span>` : "";
  return `<div class="effects-row">${chip("INTEGRITY", effects.integrity)}${chip("MORALE", effects.morale)}${chip("BUDGET", effects.budget)}</div>`;
}

function advanceAfterNode(node, success) {
  run.completedIds.push(node.node_id);
  run.lastOutcomeOk = success;
  if (!success && node.ksa) run.misses.push({ type: node.type, domain: node.domain, ksa: node.ksa });
  bumpMastery(node.ksa, success);
  queueCallback(node, success);
  if (node.type === "checkpoint") {
    recordMarshMeeting(success);
    endRun(success);
    return;
  }
  run.available = run.map.edges[node.node_id] || [];
  setBark(barkEvent(node, success));
  saveProfile();
  closeNodeOverlay();
  renderStats();
  renderBark();
  renderSectorMap();
}

// -- intel --
//
// A real question every time, not a flashcard: define-the-term, 4-option
// multiple choice, drawing distractor definitions from other intel nodes.
// Wrong answers are just wrong answers -- normal mastery/effects impact,
// same as diagnostic -- and the term comes back around later for another
// shot, so getting it wrong once is part of learning it, not a dead end.

function normTerm(term) {
  return term.trim().toLowerCase();
}

function otherIntelDefinitions(excludeTerm) {
  const excludeKey = normTerm(excludeTerm);
  const seen = new Set();
  const out = [];
  Object.values(ALL_NODE_TEMPLATES).forEach(n => {
    if (n.type !== "intel") return;
    const key = normTerm(n.payload.term);
    if (key === excludeKey || seen.has(key)) return;
    seen.add(key);
    out.push({ domain: n.domain, definition: n.payload.definition });
  });
  return out;
}

function pickDistractorDefinitions(node, count) {
  const pool = otherIntelDefinitions(node.payload.term);
  const sameDomain = pool.filter(p => p.domain === node.domain);
  const source = sameDomain.length >= count ? sameDomain : pool;
  return source
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(p => p.definition);
}

function shuffleIntoOptions(correctText, distractors) {
  const letters = ["A", "B", "C", "D"];
  const all = [correctText, ...distractors];
  const order = all.map((_, i) => i).sort(() => Math.random() - 0.5);
  const options = {};
  let answer = null;
  order.forEach((origIdx, pos) => {
    options[letters[pos]] = all[origIdx];
    if (origIdx === 0) answer = letters[pos];
  });
  return { options, answer };
}

function renderIntel(node) {
  const p = panel();
  const distractors = pickDistractorDefinitions(node, 3);
  const { options, answer } = shuffleIntoOptions(node.payload.definition, distractors);
  p.innerHTML = `
    <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">INTEL</span>
    <h1 class="hud" style="margin:10px 0">${node.title}</h1>
    <div class="flavor">${node.flavor_intro}</div>
  `;
  renderMCQBlock(p, {
    question: `DEFINE: ${node.payload.term}`,
    options,
    answer,
    rationale: node.payload.definition
  }, (correct) => {
    const effects = correct ? node.effects.on_pass : node.effects.on_fail;
    p.innerHTML += effectsRowHtml(effects);
    p.innerHTML += `<div class="btn-row"><button class="btn" id="node-continue">CONTINUE</button></div>`;
    document.getElementById("node-continue").onclick = () => {
      applyEffects(effects);
      advanceAfterNode(node, correct);
    };
  });
}

// -- diagnostic (also reused by checkpoint stages) --

function renderMCQBlock(container, mcq, onResolved) {
  const timed = !!mcq.time_limit_seconds;
  let remaining = mcq.time_limit_seconds || 30;
  container.innerHTML += `
    <p style="font-size:15px;line-height:1.6;">${mcq.question}</p>
    ${timed ? '<div class="timer-bar-track"><div class="timer-bar-fill" id="mcq-timer-fill" style="width:100%"></div></div>' : ""}
    <div id="mcq-options"></div>
  `;
  const optionsEl = container.querySelector("#mcq-options");
  Object.entries(mcq.options).forEach(([key, text]) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<strong>${key}.</strong> ${text}`;
    btn.onclick = () => resolve(key);
    optionsEl.appendChild(btn);
  });

  let resolved = false;
  function resolve(chosenKey) {
    if (resolved) return;
    resolved = true;
    clearActiveTimer();
    const correct = chosenKey === mcq.answer;
    correct ? sfxSuccess() : sfxFail();
    optionsEl.querySelectorAll(".option-btn").forEach(btn => {
      const key = btn.textContent.trim()[0];
      if (key === mcq.answer) btn.classList.add("reveal-correct");
      if (key === chosenKey && !correct) btn.classList.add("chosen-incorrect");
      if (key === chosenKey && correct) btn.classList.add("chosen-correct");
      btn.disabled = true;
    });
    const rationale = document.createElement("div");
    rationale.className = "result-box";
    rationale.innerHTML = `<strong>${correct ? "Correct." : "Not quite."}</strong> ${mcq.rationale}`;
    container.appendChild(rationale);
    onResolved(correct);
  }

  if (timed) {
    activeTimer = setInterval(() => {
      remaining -= 1;
      const fill = document.getElementById("mcq-timer-fill");
      if (fill) fill.style.width = Math.max(0, (remaining / mcq.time_limit_seconds) * 100) + "%";
      if (remaining <= 0) { clearInterval(activeTimer); resolve(null); }
    }, 1000);
  }
}

function renderDiagnostic(node) {
  const p = panel();
  p.innerHTML = `
    <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">DIAGNOSTIC / REPAIR</span>
    <h1 class="hud" style="margin:10px 0">${node.title}</h1>
    <div class="flavor">${node.flavor_intro}</div>
  `;
  renderMCQBlock(p, node.payload, (correct) => {
    const effects = correct ? node.effects.on_pass : node.effects.on_fail;
    p.innerHTML += effectsRowHtml(effects);
    p.innerHTML += `<div class="btn-row"><button class="btn" id="node-continue">CONTINUE</button></div>`;
    document.getElementById("node-continue").onclick = () => {
      applyEffects(effects);
      advanceAfterNode(node, correct);
    };
  });
}

// -- scenario --
//
// Two payload shapes coexist here:
//   - `payload.choices` (legacy tone-dial branching): content.js's one
//     hand-authored scenario (the FERPA/USB judgment call). A human writer
//     can make an asymmetric "obviously right vs. tempting wrong" pair work
//     through real craft -- left as-is, still Playwright-validated.
//   - `payload.options`/`answer`/`rationale` (MCQ-style, pipeline-generated):
//     every procedurally-generated scenario, as of 2026-09-20. Matthew caught
//     that the old templated 2-choice version had two tells that let you
//     solve it without reading anything -- the tone tag always matched
//     correctness (BY THE BOOK = right, WRY = wrong), and the correct choice
//     was always the long detailed one, the wrong one always a generic
//     "skip it" line. Reusing mcq_bank.json's already-well-designed 4-option
//     distractor sets (the same source diagnostic nodes use) through the
//     same renderMCQBlock() UI fixes both: same source pool, same format,
//     just untimed and narratively framed, so the only way to solve it is
//     to actually know the content.

function renderScenario(node) {
  const p = panel();
  if (node.payload.choices) {
    renderScenarioChoiceLegacy(node, p);
  } else {
    p.innerHTML = `
      <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">SCENARIO</span>
      <h1 class="hud" style="margin:10px 0">${node.title}</h1>
      <div class="flavor">${node.flavor_intro}</div>
    `;
    renderMCQBlock(p, node.payload, (correct) => {
      const effects = correct ? node.effects.on_pass : node.effects.on_fail;
      p.innerHTML += effectsRowHtml(effects);
      p.innerHTML += `<div class="btn-row"><button class="btn" id="node-continue">CONTINUE</button></div>`;
      document.getElementById("node-continue").onclick = () => {
        applyEffects(effects);
        advanceAfterNode(node, correct);
      };
    });
  }
}

function renderScenarioChoiceLegacy(node, p) {
  p.innerHTML = `
    <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">SCENARIO</span>
    <h1 class="hud" style="margin:10px 0">${node.title}</h1>
    <div class="flavor">${node.flavor_intro}</div>
    <p style="font-size:15px;">${node.payload.prompt}</p>
    <div id="scenario-choices"></div>
  `;
  const choicesEl = p.querySelector("#scenario-choices");
  node.payload.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="tone-tag">${choice.tone.replace("_", " ").toUpperCase()}</span>${choice.text}`;
    btn.onclick = () => {
      choicesEl.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
      btn.classList.add(choice.correct ? "chosen-correct" : "chosen-incorrect");
      choice.correct ? sfxSuccess() : sfxFail();
      (choice.sets_flags || []).forEach(f => profile.global_flags[f] = true);
      p.innerHTML += `<div class="result-box">${choice.result_text}</div>`;
      p.innerHTML += effectsRowHtml(choice.effects);
      p.innerHTML += `<div class="btn-row"><button class="btn" id="node-continue">CONTINUE</button></div>`;
      document.getElementById("node-continue").onclick = () => {
        applyEffects(choice.effects);
        advanceAfterNode(node, choice.correct);
      };
    };
    choicesEl.appendChild(btn);
  });
}

// -- rest --

function renderRest(node) {
  const p = panel();
  p.innerHTML = `
    <span class="node-type-tag" style="background:#8b93a122;color:#8b93a1">REST</span>
    <h1 class="hud" style="margin:10px 0">${node.title}</h1>
    <div class="flavor">${node.flavor_intro}</div>
    <div id="rest-options"></div>
  `;
  const optionsEl = p.querySelector("#rest-options");
  node.payload.options.forEach(opt => {
    const affordable = run.resources.budget >= (opt.cost.budget || 0);
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.disabled = !affordable;
    btn.innerHTML = `${opt.label} ${opt.cost.budget ? `<em style="color:var(--muted)">(−${opt.cost.budget} CR)</em>` : ""}`;
    btn.onclick = () => {
      sfxSelect();
      run.resources.budget -= (opt.cost.budget || 0);
      applyEffects(opt.effects);
      advanceAfterNode(node, true);
    };
    optionsEl.appendChild(btn);
  });
}

// -- checkpoint (two sequential MCQ-style stages) --

function renderCheckpoint(node) {
  const stages = node.payload.stages;
  let stageIndex = 0;
  let allCorrect = true;

  function renderStage() {
    const p = panel();
    const stage = stages[stageIndex];
    const marsh = marshEncounter();
    p.innerHTML = `
      <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">CHECKPOINT</span>
      <h1 class="hud" style="margin:10px 0">${node.title}</h1>
      ${stageIndex === 0
        ? convoLinesHtml(marsh.intro, marsh.vars)
        : `<div class="flavor">Surveyor Marsh turns a page.</div>`}
      <div class="stage-indicator">Stage ${stageIndex + 1} of ${stages.length}</div>
    `;
    renderMCQBlock(p, stage, (correct) => {
      if (!correct) allCorrect = false;
      p.innerHTML += `<div class="btn-row"><button class="btn" id="node-continue">${stageIndex < stages.length - 1 ? "NEXT STAGE" : "FINISH REVIEW"}</button></div>`;
      document.getElementById("node-continue").onclick = () => {
        stageIndex += 1;
        if (stageIndex < stages.length) {
          renderStage();
        } else {
          const effects = allCorrect ? node.effects.on_pass : node.effects.on_fail;
          if (allCorrect) sfxCheckpointClear();
          panel().innerHTML = `
            <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">CHECKPOINT</span>
            <h1 class="hud" style="margin:10px 0">${allCorrect ? "Review Passed" : "Review Flagged"}</h1>
            ${convoLinesHtml(allCorrect ? marsh.pass : marsh.fail, marsh.vars)}
            ${effectsRowHtml(effects)}
            <div class="btn-row"><button class="btn" id="node-continue">CONTINUE</button></div>
          `;
          document.getElementById("node-continue").onclick = () => {
            applyEffects(effects);
            advanceAfterNode(node, allCorrect);
          };
        }
      };
    });
  }

  renderStage();
}

// ---------- run end ----------

function endRun(success) {
  const site = runSite();
  document.getElementById("runend-title").textContent = success ? "DEPLOYMENT COMPLETE" : "LEAP SNAPPED BACK";
  document.getElementById("runend-text").textContent = success
    ? `${site} passes its accreditation review. The timeline keeps this version.`
    : `The review at ${site} doesn't go your way, and the leap lets go before any of it goes on the record. Hub will want to talk about it.`;
  document.getElementById("runend-stats").innerHTML = `
    <span class="effect-chip">INTEGRITY ${run.resources.integrity}</span>
    <span class="effect-chip">MORALE ${run.resources.morale}</span>
    <span class="effect-chip">BUDGET ${run.resources.budget} CR</span>
  `;
  profile.recent_node_ids = (profile.recent_node_ids || [])
    .concat(Object.keys(run.map.nodes))
    .slice(-60); // remembers roughly the last 7-8 runs' worth of content
  if (success) {
    profile.sector_cleared_at_current_rank = true;
  }
  recordOutpostVisit(success);
  commitRunCallbacks(success);
  profile.last_run = summarizeRun(success);
  saveProfile();

  closeNodeOverlay();
  showScreen("screen-runend");
}

document.getElementById("btn-return-hub").addEventListener("click", () => {
  profile.hub_visits += 1;
  run = null;
  profile.story.returns += 1;
  maybeRankUp();
  // Promotion/callback/story priority lives in composeHubConversation().
  composeHubConversation();
  saveProfile();
  showHub();
});

// ---------- boot ----------

profile = loadProfile();
if (!profile.seen_intro) {
  startIntro();
} else {
  showHub();
}
