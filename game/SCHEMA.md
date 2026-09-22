# CHSOS Roguelite — Data Schema (Node / Run / Profile)

Three objects, three lifetimes:

- **Node Template** — static, authored content. Lives in a new `game/nodes.json` (or split by domain/sector later). One entry per node that can ever appear on a map.
- **Run State** — one playthrough. Created fresh each run, discarded (mostly) on death/reset per the "leap snaps back" narrative framing, but its `history` feeds callback messages into future runs.
- **Player Profile** — persistent across all runs. Proposed as an *extension of the existing `progress.json`*, not a new parallel file — see §3.

Story context this schema encodes: rank track = Junior Sim Tech → Operations Specialist → Lead Specialist → CHSOS Certified; sectors advance chronologically 2019 → 2029 toward the 2039 war; 4 signature crew (AV Technician/II, Moulage & Fidelity Artist/III, Debrief Facilitator/IV, Simulationist/V) recruited one per act; Domain I has no dedicated crew (baseline knowledge). Full story bible is in `currentState.md`.

---

## 1. Node Template

| Field | Type | Notes |
|---|---|---|
| `node_id` | string | Unique. Convention: `{TYPE}-{DOMAIN}-{YEAR}-{SEQ}`, e.g. `DIAG-II-2024-001`. |
| `type` | enum | `scenario` \| `diagnostic` \| `intel` \| `rest` \| `checkpoint` |
| `domain` | `"I"`–`"V"` \| `null` | Matches `blueprint.json` domain ids. `null` for `rest` nodes. |
| `ksa` | string \| `null` | Matches a KSA code from `blueprint.json` / `progress.json`'s `ksa` map (e.g. `"II.A.1"`). Node outcome updates this KSA's Leitner box in the profile. |
| `crew_affinity` | enum \| `null` | `av_tech` \| `moulage_artist` \| `debrief_facilitator` \| `simulationist` \| `null` |
| `year` | int | 2019–2029. In-fiction setting year, for era-accurate flavor. |
| `location_name` | string | In-fiction site name shown to the player. |
| `title` | string | Display title. |
| `flavor_intro` | string | Narrative wrapper around the real content. |
| `source` | object | Pointer back to the real study content this was authored from — see examples. Keeps content traceable/maintainable instead of being a one-off rewrite. |
| `payload` | object | Type-specific — see below. |
| `requires` | object | `{rank_min, crew_recruited: [...], flags_all: [...], flags_any: [...]}`. Gates whether this node can be selected into a map at all. |
| `sets_flags` | object | `{on_success: [...], on_fail: [...]}`. Feeds the Hades-style dialogue/eligibility system in the profile's `global_flags` or the run's `local_flags`. |
| `callback` | object \| `null` | `{flag, deliver_after_hub_visits, messages: {success, partial, fail}}`. Queues a future "outpost reports back" message. |
| `weight` | number \| `null` | Procedural selection weight. Defaults to the node's domain weight from `blueprint.json` (II=35, III=25, IV=15, V=15, I=10) if omitted. |

### Example — Diagnostic/Repair (Domain II, AV Technician), sourced from a real MCQ

```json
{
  "node_id": "DIAG-II-2024-001",
  "type": "diagnostic",
  "domain": "II",
  "ksa": "II.A.1",
  "crew_affinity": "av_tech",
  "year": 2024,
  "location_name": "Fort Kessler Regional Training Center, Wing C",
  "title": "Dead Zone",
  "flavor_intro": "The manikin drops off the control PC every time the exercise moves it to the far end of the wing. Your AV Technician wants a second set of eyes before the OSCE starts.",
  "source": { "file": "mcq_bank.json", "id": "MCQ.II.01" },
  "payload": {
    "question": "A manikin frequently disconnects from the control PC only when it is moved to the far end of the simulation wing. Which diagnostic metric is MOST relevant to troubleshoot this issue?",
    "options": {
      "A": "The CPU utilization of the control PC.",
      "B": "The RSSI (Received Signal Strength Indicator) at the far end of the wing.",
      "C": "The MAC address filtering table on the primary switch.",
      "D": "The frame rate of the ceiling cameras."
    },
    "answer": "B",
    "rationale": "RSSI measures Wi-Fi signal strength. Intermittent drops in a specific physical location strongly suggest a signal coverage issue (dead zone).",
    "time_limit_seconds": 45,
    "effects": {
      "on_pass": { "integrity": 5, "morale": 0, "budget": 0 },
      "on_fail": { "integrity": -10, "morale": -5, "budget": 0 }
    }
  },
  "requires": { "rank_min": "junior_sim_tech", "crew_recruited": ["av_tech"] },
  "sets_flags": { "on_fail": ["outpost_kessler_av_shaky"] },
  "callback": {
    "flag": "outpost_kessler_av_shaky",
    "deliver_after_hub_visits": 3,
    "messages": {
      "success": "Kessler's AV rig held through a real mass-casualty drill last month. No dropouts.",
      "fail": "Kessler lost monitor telemetry mid-drill last month. They're blaming the equipment. It wasn't the equipment."
    }
  },
  "weight": null
}
```

### Example — Scenario (Domain III, Moulage & Fidelity Artist), sourced from real expert knowledge

```json
{
  "node_id": "SCN-III-2021-004",
  "type": "scenario",
  "domain": "III",
  "ksa": "III.L",
  "crew_affinity": "moulage_artist",
  "year": 2021,
  "location_name": "Coastal Med Annex 4",
  "title": "First Cut",
  "flavor_intro": "A high-stakes OSCE goes live in an hour. Your Moulage Artist is holding a fresh gunshot-wound kit over a manikin that cost more than the annex's annual supply budget.",
  "source": { "file": "expert_knowledge.json", "ksa": "III.L", "scenario_index": 0 },
  "payload": {
    "prompt": "What do you tell her to do first?",
    "choices": [
      {
        "choice_id": "test_patch",
        "tone": "by_the_book",
        "text": "Test the product on a hidden patch first, and lay down a barrier layer before the visible application.",
        "effects": { "integrity": 5, "morale": 5, "budget": 0 },
        "sets_flags": ["kessler_moulage_correct"]
      },
      {
        "choice_id": "just_go",
        "tone": "wry",
        "text": "Tell her the objective doesn't need it to be pretty, just fast — skip the test patch.",
        "effects": { "integrity": -15, "morale": 0, "budget": -20 },
        "sets_flags": ["annex4_manikin_stained"]
      }
    ]
  },
  "requires": { "rank_min": "operations_specialist", "crew_recruited": ["moulage_artist"] },
  "sets_flags": {},
  "callback": null,
  "weight": null
}
```

### Example — Intel (Domain I, no crew affinity), sourced from real terminology

```json
{
  "node_id": "INT-I-2019-002",
  "type": "intel",
  "domain": "I",
  "ksa": "I.A",
  "crew_affinity": null,
  "year": 2019,
  "location_name": "en route",
  "title": "Field Briefing: Shock",
  "flavor_intro": "Hub doesn't pull up a card this time. \"You should have this one. Prove it.\"",
  "source": { "file": "expert_knowledge.json", "ksa": "I.A", "field": "terminology" },
  "payload": {
    "term": "Sepsis",
    "definition": "A life-threatening reaction to infection.",
    "flavor": "Hub: \"Say it back to me without the textbook voice, or I'm not letting you off this ship.\""
  },
  "requires": { "rank_min": "junior_sim_tech" },
  "sets_flags": {},
  "callback": null,
  "weight": null,
  "effects": {
    "on_pass": { "integrity": 4, "morale": 2, "budget": 0 },
    "on_fail": { "integrity": -4, "morale": 0, "budget": 0 }
  }
}
```

Rendered as a real 4-option "define the term" question every time (distractor definitions drawn from other intel nodes) — not a passive flashcard. A wrong answer is graded like any other question (`on_fail` effects, normal mastery impact); the term simply comes back around later for another shot, same as any other missed KSA.

### `rest` and `checkpoint` payload shapes (lighter — no full example yet)

```json
// rest
"payload": {
  "options": [
    { "option_id": "repair", "label": "Spend budget on repairs", "cost": {"budget": 30}, "effects": {"integrity": 20} },
    { "option_id": "downtime", "label": "Give the crew a night off", "cost": {"budget": 10}, "effects": {"morale": 20} }
  ]
}

// checkpoint — an escalating chain; each stage is itself diagnostic/scenario-shaped
"payload": {
  "stages": [ { "stage_id": "...", "type": "diagnostic", "...": "..." } ],
  "gates_sector": true
}
```

---

## 2. Run State

| Field | Type | Notes |
|---|---|---|
| `run_id` | string | |
| `seed` | int | For reproducible map generation. |
| `rank_at_start` | string | Rank enum, matches profile ranks. |
| `sector_index` | int | Sectors advance chronologically toward the war. |
| `year` | int | In-fiction year for the current sector. |
| `status` | enum | `active` \| `completed` \| `reset` |
| `resources` | object | `{integrity, morale, budget}` — run-local, resets each run. |
| `crew.signature` | array | Signature crew ids currently active (subset of profile's `unlocked_crew`). |
| `crew.guests` | array | Guest specialists generated for this run only: `{guest_id, name, role, domain_affinity, flavor}`. |
| `map.nodes` | array | `{node_id, template_id, pos: {x,y}, connections: [node_id...], state, outcome}`. `state` is `locked`\|`available`\|`current`\|`completed`. |
| `map.current_node_id` | string | |
| `history` | array | `{node_id, template_id, outcome, choice_id, effects_applied, ts}` — feeds callback delivery in later runs. |
| `local_flags` | object | Flags scoped to this run only. |
| `pending_callbacks` | array | Queued messages from *previous* runs' `callback` triggers, to surface at the next eligible Hub visit. |

### Example

```json
{
  "run_id": "run-2026-09-19-a",
  "seed": 88213,
  "rank_at_start": "junior_sim_tech",
  "sector_index": 1,
  "year": 2019,
  "status": "active",
  "resources": { "integrity": 72, "morale": 85, "budget": 340 },
  "crew": {
    "signature": ["av_tech"],
    "guests": [
      { "guest_id": "g-001", "name": "Cpl. Reyes", "role": "Trainee Medic", "domain_affinity": "I", "flavor": "Tags along from Sector 1's host unit." }
    ]
  },
  "map": {
    "nodes": [
      { "node_id": "n1", "template_id": "INT-I-2019-002", "pos": {"x": 190, "y": 80}, "connections": ["n3"], "state": "completed", "outcome": "success" },
      { "node_id": "n2", "template_id": "DIAG-II-2024-001", "pos": {"x": 190, "y": 260}, "connections": ["n3"], "state": "available", "outcome": null },
      { "node_id": "n3", "template_id": "SCN-III-2021-004", "pos": {"x": 360, "y": 180}, "connections": [], "state": "locked", "outcome": null }
    ],
    "current_node_id": "n2"
  },
  "history": [
    { "node_id": "n1", "template_id": "INT-I-2019-002", "outcome": "success", "choice_id": null, "effects_applied": {}, "ts": 1789800000 }
  ],
  "local_flags": {},
  "pending_callbacks": []
}
```

---

## 3. Player Profile (persistent)

**Recommendation: don't create a second save file.** `progress.json` already holds exactly the Leitner mastery data (`ksa`, `terms`, `mcqs` — level 0–5, `last_reviewed`) this game needs to reuse, and `quiz_engine.py`'s `ProgressManager` round-trips the whole file (`json.load`/`json.dump` on `self.data` as a whole) without stripping unknown keys. Adding one new top-level `"game"` key keeps the Python quiz engine and the game reading/writing the same mastery data with zero migration or sync logic.

```json
{
  "ksa": { "II.A.1": { "level": 2, "last_reviewed": 1789800000 } },
  "terms": { "...": "..." },
  "mcqs": { "...": "..." },

  "game": {
    "rank": "junior_sim_tech",
    "unlocked_crew": ["av_tech"],
    "global_flags": {
      "hub_seed_1_funding_joke": true,
      "outpost_kessler_av_shaky": true
    },
    "codex_unlocked": ["hub_origin_hint_1"],
    "run_log": [
      { "run_id": "run-2026-09-19-a", "sector_index": 1, "year": 2019, "outcome_summary": "in_progress", "ts": 1789800000 }
    ],
    "settings": { "tonal_dial_default": "wry" }
  }
}
```

### Flag scopes, to keep straight

- `node.sets_flags` — set on completion of a single node.
- `run.local_flags` — scoped to the current run, discarded on reset (unless a node's `callback` promotes something into `global_flags`/`pending_callbacks`).
- `profile.game.global_flags` — permanent, drives Hades-style Hub/crew dialogue eligibility on return to the Career Hub, and main-thread breadcrumb gating (Act 1–4 reveal beats).

---

## Deliberately not decided yet

- The exact procedural algorithm for laying out a sector's node map from weighted templates (this schema gives it the inputs — `weight`, `requires` — but not the algorithm).
- Checkpoint stage escalation formula (how difficulty/stakes scale within a `checkpoint` chain).
- Exact dialogue-priority resolution when multiple Hub lines are eligible at once (Hades-style priority ordering) — flag *shape* is here, the resolution rule isn't yet.
