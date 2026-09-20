// CHSOS Roguelite — vertical slice engine.
// Plain JS, no build step, no framework — reads content.js, renders screens,
// persists to localStorage plus explicit export/import (see README.md).

const SAVE_KEY = "chsos_roguelite_save_v1";

const CREW_DEFS = {
  av_tech: { name: "AV Technician", domain: "II" },
  moulage_artist: { name: "Moulage & Fidelity Artist", domain: "III" },
  debrief_facilitator: { name: "Debrief Facilitator", domain: "IV" },
  simulationist: { name: "Simulationist", domain: "V" }
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

let audioCtx = null;
function getAudioCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone({ freqStart, freqEnd, duration, type = "square", volume = 0.15, delay = 0 }) {
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
    osc.connect(gain).connect(ctx.destination);
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
    global_flags: {}
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultProfile(), parsed);
  } catch (e) {
    console.warn("Save data unreadable, starting fresh.", e);
    return defaultProfile();
  }
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
      profile = Object.assign(defaultProfile(), parsed);
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

document.getElementById("btn-intro-continue").addEventListener("click", () => {
  profile.seen_intro = true;
  if (!profile.unlocked_crew.includes("av_tech")) profile.unlocked_crew.push("av_tech");
  saveProfile();
  showHub();
});

// ---------- hub ----------

function hubLineForVisit() {
  if (profile.hub_visits <= 0) return HUB_LINES.first_visit;
  if (profile.hub_visits === 1) return HUB_LINES.default;
  return HUB_LINES.second_visit_bonus;
}

function showHub() {
  document.getElementById("hub-rank").textContent = RANK_LABELS[profile.rank].toUpperCase();
  document.getElementById("hub-line").textContent = hubLineForVisit();

  const domainsEl = document.getElementById("hub-domains");
  domainsEl.innerHTML = "";
  Object.keys(DOMAIN_LABELS).forEach(id => {
    const pct = domainMasteryPercent(id);
    const row = document.createElement("div");
    row.innerHTML = `
      <div class="domain-row">
        <span class="hud" style="color:${domainColor(id)}">${id} <span style="color:#d3d8e0;font-weight:400">${DOMAIN_LABELS[id]}</span></span>
        <span class="hud">${pct}%</span>
      </div>
      <div class="domain-bar-track"><div class="domain-bar-fill" style="width:${pct}%;background:${domainColor(id)}"></div></div>
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
      <div class="crew-avatar" style="color:${domainColor(def.domain)};border-color:${domainColor(def.domain)}">${unlocked ? def.name.split(" ").map(w => w[0]).slice(0, 2).join("") : "?"}</div>
      <div>
        <div class="crew-name">${unlocked ? def.name : "Locked"}</div>
        <div class="crew-domain">${unlocked ? "Domain " + def.domain + " — " + DOMAIN_LABELS[def.domain] : "Unlocks later"}</div>
      </div>
    `;
    crewEl.appendChild(card);
  });

  showScreen("screen-hub");
}

document.getElementById("btn-begin-deployment").addEventListener("click", () => {
  run = {
    resources: { integrity: 100, morale: 100, budget: 200 },
    available: [...SECTOR_1_MAP.start],
    completedIds: [],
    lastOutcomeOk: true
  };
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
  document.getElementById("map-location").textContent = "SECTOR 1 · 2019";
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
  return NODE_POSITIONS[lastId || "start"];
}

function pctPos(pos) {
  return { left: (pos.x / MAP_VIEWBOX.w * 100) + "%", top: (pos.y / MAP_VIEWBOX.h * 100) + "%" };
}

function renderSectorMap() {
  const svg = document.getElementById("map-svg");
  const nodesLayer = document.getElementById("map-nodes");
  svg.innerHTML = "";
  nodesLayer.innerHTML = "";

  const svgNS = "http://www.w3.org/2000/svg";
  allSectorEdges().forEach(([from, to]) => {
    const fromPos = NODE_POSITIONS[from];
    const toPos = NODE_POSITIONS[to];
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

  Object.keys(NODE_POSITIONS).forEach(nodeId => {
    if (nodeId === "start") return;
    const node = NODES[nodeId];
    const pos = pctPos(NODE_POSITIONS[nodeId]);
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
    nodesLayer.appendChild(btn);

    const label = document.createElement("div");
    label.className = "map-node-label";
    label.style.left = pos.left;
    label.style.top = pos.top;
    label.textContent = node.title;
    nodesLayer.appendChild(label);
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

function travelTo(nodeId) {
  sfxSelect();
  document.querySelectorAll(".map-node-btn").forEach(b => b.disabled = true);
  const marker = document.getElementById("ship-marker");
  const pos = pctPos(NODE_POSITIONS[nodeId]);
  marker.style.left = pos.left;
  marker.style.top = pos.top;
  setTimeout(() => openNode(nodeId), 620);
}

// ---------- node interaction ----------

function openNode(nodeId) {
  const node = NODES[nodeId];
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
  bumpMastery(node.ksa, success);
  if (node.type === "checkpoint") {
    endRun(success);
    return;
  }
  run.available = SECTOR_1_MAP.edges[node.node_id] || [];
  closeNodeOverlay();
  renderStats();
  renderSectorMap();
}

// -- intel --

function renderIntel(node) {
  panel().innerHTML = `
    <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">INTEL</span>
    <h1 class="hud" style="margin:10px 0">${node.title}</h1>
    <div class="flavor">${node.flavor_intro}</div>
    <div class="result-box"><strong>${node.payload.term}</strong> — ${node.payload.definition}<br><br><em>${node.payload.flavor}</em></div>
    <div class="btn-row"><button class="btn" id="node-continue">CONTINUE</button></div>
  `;
  document.getElementById("node-continue").onclick = () => {
    sfxSelect();
    applyEffects(node.effects);
    advanceAfterNode(node, true);
  };
}

// -- diagnostic (also reused by checkpoint stages) --

function renderMCQBlock(container, mcq, onResolved) {
  let remaining = mcq.time_limit_seconds || 30;
  container.innerHTML += `
    <p style="font-size:15px;line-height:1.6;">${mcq.question}</p>
    <div class="timer-bar-track"><div class="timer-bar-fill" id="mcq-timer-fill" style="width:100%"></div></div>
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

  activeTimer = setInterval(() => {
    remaining -= 1;
    const fill = document.getElementById("mcq-timer-fill");
    if (fill) fill.style.width = Math.max(0, (remaining / (mcq.time_limit_seconds || 30)) * 100) + "%";
    if (remaining <= 0) { clearInterval(activeTimer); resolve(null); }
  }, 1000);
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

function renderScenario(node) {
  const p = panel();
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
    p.innerHTML = `
      <span class="node-type-tag" style="background:${domainColor(node.domain)}22;color:${domainColor(node.domain)}">CHECKPOINT</span>
      <h1 class="hud" style="margin:10px 0">${node.title}</h1>
      <div class="flavor">${node.flavor_intro}</div>
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
            <div class="result-box">${allCorrect
              ? "The reviewer signs off without comment. That's the highest praise this job hands out."
              : "The reviewer makes a note. It won't end the program — but it won't be forgotten either."}</div>
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
  document.getElementById("runend-text").textContent = success
    ? "Fort Kessler passes review. Whatever happens here later, it won't be because nobody tried."
    : "Fort Kessler squeaks by. Hub doesn't say anything about it. That's somehow worse.";
  document.getElementById("runend-stats").innerHTML = `
    <span class="effect-chip">INTEGRITY ${run.resources.integrity}</span>
    <span class="effect-chip">MORALE ${run.resources.morale}</span>
    <span class="effect-chip">BUDGET ${run.resources.budget} CR</span>
  `;
  closeNodeOverlay();
  showScreen("screen-runend");
}

document.getElementById("btn-return-hub").addEventListener("click", () => {
  profile.hub_visits += 1;
  run = null;
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
