// CHSOS Roguelite — procedural sector map generator.
//
// Goal: pull a different set of specific questions/terms/scenarios each run
// (from the combined hand-authored NODES + pipeline-generated GENERATED_NODES
// pool -- see game/pipeline/build_nodes.py) instead of replaying a fixed,
// memorizable map. Players should be learning Sim Ops judgment, not which
// button clears which node.
//
// Shape strategy: a small parameterized layered DAG (not a fully generic
// random-graph algorithm) -- same "assign varied content onto a handful of
// map shapes" approach FTL/Slay the Spire use. Positions reuse the existing
// 640x520 MAP_VIEWBOX from content.js so no rendering/CSS changes are needed.
//
// Depends on globals from content.js (MAP_VIEWBOX) and nodes_generated.js
// (GENERATED_NODES) plus content.js's NODES -- load order in index.html
// matters: content.js, nodes_generated.js, mapgen.js, app.js.

const ALL_NODE_TEMPLATES = Object.assign({}, NODES, GENERATED_NODES);

// Mirrors blueprint.json's domain exam weights (I:10 II:35 III:25 IV:15 V:15).
// Duplicated here rather than fetched at runtime, matching content.js's own
// DOMAIN_LABELS -- this is a no-server, no-build-step, bake-it-into-JS project.
const DOMAIN_WEIGHT = { I: 10, II: 35, III: 25, IV: 15, V: 15 };

const RANK_ORDER = ["junior_sim_tech", "operations_specialist", "lead_specialist", "chsos_certified"];

function rankIndex(rank) {
  const i = RANK_ORDER.indexOf(rank);
  return i === -1 ? 0 : i;
}

// Sectors advance chronologically toward the 2039 war (per the story bible),
// independently of rank -- rank gates which domains/crew you have access to,
// sector gates which slice of 2019-2029 the current deployment is drawn from.
// Advances by one on every successful (checkpoint-passed) run; caps at the
// last window rather than growing unboundedly, since the story's "run years"
// span ends at 2029 -- a player who's caught up just keeps working the final
// window. profile.sector_index is 0-based; displayed as sector_index + 1.
const SECTOR_YEAR_WINDOWS = [
  [2019, 2021],
  [2022, 2024],
  [2025, 2027],
  [2028, 2029],
];

function sectorYearWindow(sectorIndex) {
  const i = Math.max(0, Math.min(sectorIndex || 0, SECTOR_YEAR_WINDOWS.length - 1));
  return SECTOR_YEAR_WINDOWS[i];
}

function meetsRequires(template, profile) {
  const req = template.requires || {};
  if (req.rank_min && rankIndex(profile.rank) < rankIndex(req.rank_min)) return false;
  if (req.crew_recruited && !req.crew_recruited.every(c => profile.unlocked_crew.includes(c))) return false;
  if (req.flags_all && !req.flags_all.every(f => profile.global_flags[f])) return false;
  if (req.flags_any && req.flags_any.length && !req.flags_any.some(f => profile.global_flags[f])) return false;
  return true;
}

// ---------- seeded RNG (mulberry32) ----------
// A seed makes a given map reproducible if we ever want "same map for
// everyone today" style challenges; not load-bearing for the core feature.

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedChoice(pairs, rng) {
  const total = pairs.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [value, w] of pairs) {
    r -= w;
    if (r <= 0) return value;
  }
  return pairs[pairs.length - 1][0];
}

// A KSA's mastery level (0-5, see app.js's bumpMastery) drives how urgently
// it should come back up: untouched/weak KSAs (level 0, or never attempted)
// are the most urgent, a maxed-out KSA (level 5) is rare but not impossible,
// so occasional review still happens. This is what actually makes repeats
// feel like spaced repetition -- reinforcing what you're shaky on -- instead
// of the anti-repeat window's plain recency, which had no opinion on whether
// a question you already nailed twice was worth surfacing again over one
// you've never seen or keep missing.
const MASTERY_URGENCY_BY_LEVEL = [6, 5, 4, 3, 2, 1];

function masteryUrgencyWeight(ksa, ksaMastery) {
  if (!ksa) return 1;
  const level = (ksaMastery && ksaMastery[ksa]) ? ksaMastery[ksa].level : 0;
  return MASTERY_URGENCY_BY_LEVEL[Math.max(0, Math.min(5, level))];
}

function weightedDomainPick(candidates, rng, ksaMastery) {
  if (!candidates.length) return null;
  const weighted = candidates.map(n => [n, (DOMAIN_WEIGHT[n.domain] || 10) * masteryUrgencyWeight(n.ksa, ksaMastery)]);
  const total = weighted.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [node, w] of weighted) {
    r -= w;
    if (r <= 0) return node;
  }
  return candidates[candidates.length - 1];
}

// ---------- map shape: a small layered DAG ----------

function buildLayeredShape(layerWidths, rng) {
  const slots = [];
  layerWidths.forEach((width, layerIdx) => {
    for (let i = 0; i < width; i++) slots.push({ id: `L${layerIdx}S${i}`, layer: layerIdx });
  });
  const edges = {};
  slots.forEach(s => (edges[s.id] = []));

  for (let layerIdx = 0; layerIdx < layerWidths.length - 1; layerIdx++) {
    const from = slots.filter(s => s.layer === layerIdx);
    const to = slots.filter(s => s.layer === layerIdx + 1);
    // every "to" slot gets at least one incoming edge
    to.forEach(t => {
      const src = from[Math.floor(rng() * from.length)];
      edges[src.id].push(t.id);
    });
    // every "from" slot gets at least one outgoing edge
    from.forEach(f => {
      if (edges[f.id].length === 0) {
        const t = to[Math.floor(rng() * to.length)];
        edges[f.id].push(t.id);
      }
    });
    // sprinkle a few extra cross-edges for branching texture
    from.forEach(f => {
      to.forEach(t => {
        if (!edges[f.id].includes(t.id) && rng() < 0.25) edges[f.id].push(t.id);
      });
    });
  }
  return { slots, edges };
}

function computePositions(slots, layerWidths, numLayersTotal) {
  const marginX = 110, marginY = 80;
  const usableW = MAP_VIEWBOX.w - marginX * 2;
  const usableH = MAP_VIEWBOX.h - marginY * 2;
  const positions = {};
  layerWidths.forEach((width, layerIdx) => {
    const x = numLayersTotal === 1 ? marginX : marginX + (usableW * layerIdx) / (numLayersTotal - 1);
    const layerSlots = slots.filter(s => s.layer === layerIdx);
    layerSlots.forEach((s, i) => {
      const y = width === 1 ? MAP_VIEWBOX.h / 2 : marginY + (usableH * i) / (width - 1);
      positions[s.id] = { x: Math.round(x), y: Math.round(y) };
    });
  });
  return positions;
}

function assignSlotTypes(slots, layerWidths, rng) {
  const types = {};
  const lastLayer = layerWidths.length - 1;

  const starterTypes = shuffle(["intel", "diagnostic", "scenario"], rng);
  slots.filter(s => s.layer === 0).forEach((s, i) => (types[s.id] = starterTypes[i % starterTypes.length]));

  const midWeights = [["diagnostic", 0.45], ["scenario", 0.25], ["intel", 0.20], ["rest", 0.10]];
  slots
    .filter(s => s.layer > 0 && s.layer < lastLayer)
    .forEach(s => (types[s.id] = weightedChoice(midWeights, rng)));

  // final content layer before the checkpoint: keep it weighty, no rest/intel
  slots.filter(s => s.layer === lastLayer).forEach(s => (types[s.id] = rng() < 0.6 ? "diagnostic" : "scenario"));

  return types;
}

// ---------- synthesized nodes (no source content exists for these types) ----------

function synthesizeRestNode(slotId, rng) {
  const repairCost = 15 + Math.floor(rng() * 16); // 15-30
  const downtimeCost = 5 + Math.floor(rng() * 11); // 5-15
  return {
    node_id: `REST-GEN-${slotId}`,
    type: "rest",
    domain: null,
    ksa: null,
    crew_affinity: null,
    year: null,
    location_name: "Waystation",
    title: "A Night Off",
    flavor_intro: "A quiet stretch before the next site. Spend what you've got, or save it.",
    source: null,
    payload: {
      options: [
        { option_id: "repairs", label: "Spend budget on equipment repairs", cost: { budget: repairCost }, effects: { integrity: 15, morale: 0 } },
        { option_id: "downtime", label: "Give the crew a night off", cost: { budget: downtimeCost }, effects: { integrity: 0, morale: 15 } },
        { option_id: "skip", label: "Push on and save the budget", cost: { budget: 0 }, effects: { integrity: 0, morale: 0 } },
      ],
    },
  };
}

function synthesizeCheckpointNode(stages) {
  const primary = stages[0];
  const nodeId = `CHK-GEN-${stages.map(s => s.node_id).join("__")}`;
  return {
    node_id: nodeId,
    type: "checkpoint",
    domain: primary.domain,
    ksa: primary.ksa,
    crew_affinity: primary.crew_affinity,
    year: primary.year,
    location_name: primary.location_name,
    title: "Accreditation Site Visit",
    flavor_intro: "A reviewer from the accreditation board is standing in the doorway. Everything from here on, they're watching.",
    source: null,
    payload: {
      stages: stages.map(s => ({
        stage_id: s.node_id,
        source: s.source,
        question: s.payload.question,
        options: s.payload.options,
        answer: s.payload.answer,
        rationale: s.payload.rationale,
        time_limit_seconds: s.payload.time_limit_seconds,
      })),
      gates_sector: true,
    },
    effects: {
      on_pass: { integrity: 20, morale: 15, budget: 30 },
      on_fail: { integrity: -20, morale: -15, budget: 0 },
    },
  };
}

// ---------- main entry point ----------

/**
 * @param {object} opts
 * @param {object} opts.profile - current player profile (rank, unlocked_crew, global_flags)
 * @param {Set<string>} opts.usedNodeIds - node_ids seen in recent runs, to avoid repeats
 * @param {number} [opts.seed]
 * @returns {{nodes: object, start: string[], edges: object, positions: object, viewBox: object}}
 */
function generateSectorMap({ profile, usedNodeIds, seed }) {
  const rng = mulberry32(seed !== undefined ? seed : Math.floor(Math.random() * 2 ** 31));
  const pool = Object.values(ALL_NODE_TEMPLATES).filter(n => meetsRequires(n, profile));
  const yearWindow = sectorYearWindow(profile.sector_index);
  const inWindow = n => n.year == null || (n.year >= yearWindow[0] && n.year <= yearWindow[1]);

  const layer0Width = rng() < 0.5 ? 2 : 3;
  const layer1Width = rng() < 0.5 ? 1 : 2;
  const layerWidths = [layer0Width, layer1Width, 1];

  const { slots, edges: slotEdges } = buildLayeredShape(layerWidths, rng);
  // +1 reserves a trailing x-slot for the checkpoint, so it doesn't land on
  // top of the last content layer (both would otherwise sit near the same x).
  const slotPositions = computePositions(slots, layerWidths, layerWidths.length + 1);
  const typeForSlot = assignSlotTypes(slots, layerWidths, rng);

  const usedThisRun = new Set();
  const idBySlot = {};
  const nodes = {};
  let restPlaced = false;

  // Diagnostic and scenario nodes both draw from mcq_bank.json 1:1 -- a
  // scenario node is the SAME question/options/rationale as its diagnostic
  // twin, just re-skinned (untimed, pressure-archetype framing). Their
  // node_ids differ, so plain node_id anti-repeat can't see the duplication:
  // a player can get "RSSI dead zone" as a diagnostic node one run and the
  // literal same question text as a scenario node soon after, and it reads
  // as a repeat even though it technically isn't one by id. Tracking
  // source.id (the shared mcq_bank id) alongside node_id closes that gap.
  const usedSourceIds = new Set(
    [...usedNodeIds]
      .map(id => ALL_NODE_TEMPLATES[id])
      .filter(n => n && n.source && n.source.id)
      .map(n => n.source.id)
  );
  const usedSourceIdsThisRun = new Set();

  // Prefer content from the sector's own year window, and prefer content not
  // seen recently (by node_id or by shared source id, see above) -- but never
  // let either preference starve a slot. Tiers, most-preferred first:
  // (in-window AND fresh) -> (in-window) -> (fresh, any year) -> (anything of
  // this type at all).
  function pickForType(type) {
    if (type === "rest") return null; // handled separately, no pool content
    const sameType = pool.filter(n => n.type === type && !usedThisRun.has(n.node_id));
    if (!sameType.length) return null;
    const isFresh = n => !usedNodeIds.has(n.node_id)
      && !(n.source && n.source.id && (usedSourceIds.has(n.source.id) || usedSourceIdsThisRun.has(n.source.id)));
    const windowed = sameType.filter(inWindow);
    const windowedFresh = windowed.filter(isFresh);
    const anyFresh = sameType.filter(isFresh);
    const tiers = [windowedFresh, windowed, anyFresh, sameType];
    const tier = tiers.find(t => t.length > 0);
    const picked = weightedDomainPick(tier, rng, profile.ksa_mastery);
    if (picked && picked.source && picked.source.id) usedSourceIdsThisRun.add(picked.source.id);
    return picked;
  }

  slots.forEach(slot => {
    const type = typeForSlot[slot.id];
    if (type === "rest") {
      restPlaced = true;
      const template = synthesizeRestNode(slot.id, rng);
      nodes[template.node_id] = template;
      idBySlot[slot.id] = template.node_id;
      return;
    }
    let picked = pickForType(type);
    if (!picked) {
      // fallback chain: whichever type actually has eligible content wins;
      // rest always works since it needs no source pool.
      const fallbackOrder = ["diagnostic", "intel", "scenario"];
      for (const fallbackType of fallbackOrder) {
        picked = pickForType(fallbackType);
        if (picked) break;
      }
    }
    if (!picked) {
      restPlaced = true;
      const template = synthesizeRestNode(slot.id, rng);
      nodes[template.node_id] = template;
      idBySlot[slot.id] = template.node_id;
      return;
    }
    usedThisRun.add(picked.node_id);
    nodes[picked.node_id] = picked;
    idBySlot[slot.id] = picked.node_id;
  });

  if (!restPlaced) {
    const midSlots = slots.filter(s => s.layer > 0 && s.layer < layerWidths.length - 1);
    if (midSlots.length) {
      const target = midSlots[Math.floor(rng() * midSlots.length)];
      delete nodes[idBySlot[target.id]];
      const restTemplate = synthesizeRestNode(target.id, rng);
      nodes[restTemplate.node_id] = restTemplate;
      idBySlot[target.id] = restTemplate.node_id;
    }
  }

  // checkpoint: stitch two fresh diagnostic templates into an escalating chain,
  // via the same tiered (in-window/fresh) preference as regular slots
  const stage1 = pickForType("diagnostic") || pool.find(n => n.type === "diagnostic");
  usedThisRun.add(stage1.node_id);
  const stage2 = pickForType("diagnostic") || stage1;
  usedThisRun.add(stage2.node_id);
  const checkpoint = synthesizeCheckpointNode([stage1, stage2]);
  nodes[checkpoint.node_id] = checkpoint;

  // translate slot-space edges/positions into node-id-space
  const nodeEdges = {};
  Object.keys(nodes).forEach(id => (nodeEdges[id] = []));
  Object.entries(slotEdges).forEach(([fromSlot, toSlots]) => {
    const fromId = idBySlot[fromSlot];
    if (!fromId) return;
    toSlots.forEach(toSlot => {
      const toId = idBySlot[toSlot];
      if (toId) nodeEdges[fromId].push(toId);
    });
  });
  const lastLayerIdx = layerWidths.length - 1;
  slots.filter(s => s.layer === lastLayerIdx).forEach(s => {
    const id = idBySlot[s.id];
    if (id) nodeEdges[id].push(checkpoint.node_id);
  });
  nodeEdges[checkpoint.node_id] = [];

  const positions = { start: { x: 40, y: MAP_VIEWBOX.h / 2 } };
  slots.forEach(s => {
    const id = idBySlot[s.id];
    if (id) positions[id] = slotPositions[s.id];
  });
  positions[checkpoint.node_id] = { x: MAP_VIEWBOX.w - 110, y: MAP_VIEWBOX.h / 2 }; // mirrors the marginX used in computePositions

  const start = slots.filter(s => s.layer === 0).map(s => idBySlot[s.id]).filter(Boolean);

  return { nodes, start, edges: nodeEdges, positions, viewBox: MAP_VIEWBOX };
}

function allMapEdges(map) {
  const edges = map.start.map(to => ["start", to]);
  Object.keys(map.edges).forEach(from => {
    map.edges[from].forEach(to => edges.push([from, to]));
  });
  return edges;
}
