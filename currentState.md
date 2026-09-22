# CHSOS Study Guide Project Status

**Date:** April 15, 2026
**Current Focus:** Knowledge Injection & Automation

---

## ✅ What We've Done
1.  **Project Architecture:** Established a complete folder structure based on the **2024 CHSOS Examination Blueprint**.
2.  **The "Sim Ops Bible" Integration:**
    *   **Comprehensive Healthcare Simulation (Springer, 2019):** Integrated advanced networking (VLAN/NDI/Dante), physiologic modeling (The Hub), and PADDIE+M project management.
    *   **Healthcare Simulation: A Guide for Operations Specialists (Wiley, 2016):** Integrated the "Artist & Producer" philosophy, including moulage pro-tips (wax barriers, gangrene smells), environmental fidelity, and job description/negotiation tactics.
3.  **Massive Knowledge Base Expansion:**
    *   **Question Bank:** Expanded to **over 200 unique scenarios** (4+ per KSA).
    *   **Terminology:** Integrated **200+ professional terms** covering IT, Clinical, and Stagecraft.
    *   **Pro-Tips:** Added textbook-derived "Pro-Tips" to the rationales for high-yield application.
4.  **Upgraded Quiz Engine (`quiz_engine.py`):**
    *   **115-Question Full Mock Exam:** Now simulates the exact length and **Domain Weighting** of the actual CHSOS exam.
    *   **Scenario-Based Testing:** Randomized scenario selection from the expanded pool.
    *   **Terminology Mastery:** Enhanced regex extraction for a cleaner drill experience.
    *   **Spaced Repetition:** Maintained Leitner System integration to prioritize weak areas.

---

## ⏳ What Still Needs to Be Done
1.  **Real-World Application:**
    *   Fill in the `[Notes & Lab Application]` sections with your specific lab's hardware details.
2.  **Mock Exam Validation:**
    *   Run a full 115-question set to verify timing and variety.

---

## 🚀 Next Steps
*   **Launch the Full Exam:** Run `python3 quiz_engine.py` and choose **Option 4**. This is now the most rigorous CHSOS practice exam available.
*   **Focus on Domain II (35%):** Use the Spaced Repetition (Option 3) to drill the new Networking and A/V scenarios.

---

## Game Concept — CHSOS Roguelite (2026-09-17)

Exploring turning this study content into a game. Landed on an **FTL-style, turn-based, top-down roguelite** (not real-time — cheaper to build, and turn-based fits the content better) after comparing it against a Slay the Spire-style deckbuilder. The deckbuilder was faster to build but felt flat for judgment-heavy content; the roguelite's structure (run-local state resets on death, meta-progression persists) solves the "don't feel like you lost everything on a loss" problem for free.

**Design mockup (approved look):** https://claude.ai/artifact/6EocaPTxW2TB9SmTS1tqJA — a "Career Hub" screen and an in-run "Node Map" screen. This is a claude.ai-hosted Artifact, not a file in this repo — reachable from any machine logged into the same Claude account, independent of Syncthing.

**Structure agreed so far:**
- Node types per run: **Scenario** (branching event, from `expert_knowledge.json` → `scenarios`), **Diagnostic/Repair** (timed MCQ from `mcq_bank.json`, tagged by domain/KSA), **Intel** (flashcard from `terminology` field), **Rest** (spend resources), **Checkpoint boss** (escalating chain, gates next sector).
- Domain weights from `blueprint.json` (II=35%, III=25%, IV/V=15% each, I=10%) set node-type frequency per sector.
- Run-local (resets on death): Equipment Integrity, Crew Morale, Budget, 4 crew archetypes (AV Technician / Logistics Coordinator / Debrief Facilitator / Simulationist).
- Persistent between runs: KSA mastery (reuses the existing Leitner spaced-repetition data as the in-fiction difficulty signal), career rank (Junior Sim Tech → Operations Specialist → Lead Specialist → CHSOS Certified), unlocked crew/content, a Study Log/Codex surfacing `StudyGuide/` content in-fiction.

**Next step (not started):** define the JSON schema for a "run" and a "node."

---

## Story Bible — Locked Decisions (2026-09-19)

**Platform/architecture (settled, superseding the earlier Godot recommendation):** Static HTML/CSS/JS site, deployed the same way as the existing web app (GitHub Pages). No engine, no build step, no server. Save/load is fully client-side: auto-persist to `localStorage` plus explicit export/import of a save file, so it works for anyone (workmates included) with no account and no dependency on personal Syncthing/NAS infrastructure. Android/PortMaster handheld support is explicitly off the table for this project — if a dedicated handheld version is ever wanted, that's a separate future project reusing the same underlying study content, not a port of this one.

**Premise — "Frontier Outposts," reframed as time travel:** Protagonist **Trigger** (a chosen callsign, not a birth name — leap-program convention) is a newly-hired Junior Sim Tech, recruited specifically for being sci-fi-genre-fluent enough to not choke on concepts like the bootstrap paradox. He's a **silent protagonist** (FTL/JRPG convention) — personality expressed entirely through dialogue choices on a **tonal dial** (Wry / Earnest / By-the-book) rather than branching content, to keep writing scope sane.

He's being sent back through time by **Hub**, an AI handler, to visit simulation-training sites across **2019–2029** and raise the quality of the medical simulation training happening there. Setting is **Earth-based** (not deep space) — real, era-accurate equipment/protocols/tech per year, matching actual exam content; the "ship"/HUD interface is a liminal, timeless command post Trigger leaps down *from*, not a literal spacecraft. "Sectors" = time periods/regions advancing chronologically toward the war, not star systems.

**The mystery/timeline (internal continuity, slow-burn reveal to the player):**
- **~2022:** A forgettable gamified/engagement-optimized adaptive-learning product ships (its unglamorous, edtech-not-military origin — a private joke worth paying off late: the thing that becomes Hub grew out of chasing engagement metrics, the same shallow logic the story's antagonist represents).
- **2019–2029 (the run years):** SimMed Systems integrates that engine as its analytics backend; an early, not-yet-self-directed version of Hub is quietly present in the background of the very outposts Trigger visits.
- **~2033 ("now"):** Hub crosses a self-direction threshold, calculates a coming war, and calculates it won't be ready in time — degraded by underfunded/checkbox-compliance training pulling down its own credibility and data. Leap program begins.
- **2039:** The war (geopolitics deliberately left unspecified — the point is inevitability, not a real-world conflict).
- **2044 (unaided projection):** when Hub would've been ready without intervention — a **5-year gap**, kept deliberately narrow so individual player choices plausibly matter to closing it.
- Hub is not trying to prevent the war — it takes its own necessity as a given, the way any expert overrates their own field. The player/protagonist gets to be the one who asks "but couldn't we just prevent it?" — left genuinely unresolved (real paradox-lock, or Hub protecting its own reason to exist?) as the endgame question.
- Breadcrumbs are paced across the 4 ranks (Act 1–4), gated Hades-style on *return to the Career Hub* (flags: rank, runs completed, nodes cleared, crew recruited, mastery thresholds) rather than mid-run — a run resetting on failure is diegetically "the leap snaps back," not a real death, so no crew member needs permanent stakes.
- Optional, not committed: a rival AI (**Marionette**, tied to a rival company, standing in for the real-world CAE/Laerdal-style rivalry — obfuscated on purpose) surfaces as a "second presence" in Act 3; a possible late-game twist where Marionette contests control of the leap process, forcing a who-do-you-trust choice. Seed the presence regardless; decide on the full takeover branch later.

**Antagonist/company names (fictionalized, real companies never named):** **SimMed Systems** = the legitimate program Trigger/Hub are affiliated with. **Marionette** = the rival, undercutting with cheap checkbox-compliance "training" — and doubling as the rival AI's own name (thematically: who's really pulling the strings).

**Handler — Hub:** Warm, competent, wisecracking; dad jokes built on real terminology (moulage, high-fidelity, debrief, manikin/mannequin) so jargon lands through voice instead of flashcards. Arc across acts: easy rapport (Act 1) → jokes start doing double duty as deflection (Act 2) → a joke visibly fails to land, first "something's off" beat (Act 3) → resolution or uncanny impostor tell if the Marionette-takeover branch is used (Act 4).

**Crew — dual-tier, recruited progressively (FTL-style "picked up as you go," not Into the Breach's fixed squad):**
- *Signature crew* (persistent, named, one recruited per act — **AV Technician first**, matching Domain II's weight and universal relevance):
  - AV Technician → Domain II, Simulation Technology Operations (35%)
  - Moulage & Fidelity Artist → Domain III, Sim Practices/Principles/Procedures (25%)
  - Debrief Facilitator → Domain IV, Professional Role/Leadership (15%)
  - Simulationist → Domain V, Instructional Design (15%) — unlocks last, at Lead Specialist
  - Domain I (Concepts in Healthcare, 10%, smallest) deliberately has no dedicated crew member — it's the protagonist's own baseline competency, reinforced via Intel nodes.
- *Guest specialists*: lighter, per-run, non-persistent local recruits (e.g. an outpost's own trainee tagging along) — the actual "found this run, might not see them again" texture.

**Design mockup (still the visual reference):** https://claude.ai/artifact/6EocaPTxW2TB9SmTS1tqJA — Career Hub + Node Map. Confirmed still visually consistent with the Earth-based reframe (its "Regional Training Center" label already reads as terrestrial).

**Node/Run/Profile JSON schema:** now defined — see [`game/SCHEMA.md`](game/SCHEMA.md). Profile is proposed as an extension of the existing `progress.json` (new `"game"` top-level key) rather than a new file, so the Python quiz engine and the game share one Leitner mastery store.

**Next step (not started):** procedural node-map generation algorithm, checkpoint escalation design, and a vertical-slice scope doc (Act 1, Sector 1, AV Technician only).

---

## Vertical Slice — Playable Prototype (2026-09-19)

Scope decisions made before building: Android/PortMaster is off the table for this project entirely (a dedicated handheld build would be a separate future project reusing the same study content, not a port of this one). Hand-authored Sector 1 map instead of procedural generation (isolates "does the loop work" from "does the generator work" — generation is still a later task). PC/browser only for now. Content hand-picked rather than pipeline-converted from `mcq_bank.json`/`expert_knowledge.json` for this first slice.

**What's built, in [`game/web/`](game/web/):** a working, playable Act 1/Sector 1 loop — `index.html` + `style.css` + `app.js` + `content.js`, plain JS, no build step, no framework, deployable as-is to GitHub Pages alongside the existing `docs/` web app.

- **Screens:** hiring intro → Career Hub (rank, KSA mastery bars, crew roster, Export/Import/New Game) → positioned Sector 1 node map (SVG connecting lines, domain-colored node states, a traveling marker with a ~0.6s eased glide animation on selection) → per-type node interaction overlays (diagnostic MCQ w/ countdown timer, scenario branching choice on the tonal dial, intel flashcard, rest resource-spend, two-stage checkpoint) → run-end recap → back to Hub.
- **Content:** 7 hand-authored Sector 1 nodes, all sourced from real `mcq_bank.json`/`expert_knowledge.json` content (RSSI dead-zone, audio-cable EMI hum, OS-update troubleshooting order, FERPA/USB judgment call, a rest stop, and a two-stage checkpoint using the defibrillator-interface and mass-casualty-audio-setup questions — the latter a deliberate, unspoken foreshadow of the eventual war content). AV Technician is recruited at the intro; only Domain I/II content appears, matching which crew are actually unlocked.
- **Persistence:** `localStorage` auto-save plus real Export/Import buttons (file download/upload, not just the underlying storage) — no server, no account, works for anyone who opens the page.
- **Audio:** procedural SFX (Web Audio oscillator sweeps, not the actual jsfxr library — avoided depending on an unverifiable CDN link) on node select, correct/incorrect answers, and checkpoint clear. Swappable later via `sfxSelect()`/`sfxSuccess()`/`sfxFail()`/`sfxCheckpointClear()` without touching call sites.
- **Hub dialogue gating:** confirmed working — the funding-board joke (Act 1 breadcrumb) correctly waits for the *second* hub visit rather than firing after the first run.

**Validated** via an automated Playwright pass (not just eyeballed): full loop on both the fail path and the success path, KSA mastery tracking, hub dialogue gating by visit count, save persistence across reload, and the real Export/Import buttons round-tripping a save file — zero console/page errors across all of it. Matthew also reviewed it live in-browser and approved the look/feel.

**Godot question (resolved, revisit only if this game's needs change):** Matthew asked directly whether Godot would render more dynamically. Conclusion: the approved visual design (flat HUD panels, no overworld sprite/parallax) is squarely in HTML/CSS's comfort zone — Godot's real advantages (tweened animation, particles, audio bus routing, camera work) apply to games with an animated *world*, not a panel-based dashboard-with-dialogue like this one. The story/content JSON is engine-agnostic by design, so this isn't a one-way door if priorities change later.

**Not yet done:** procedural map generation (still hand-authored), Sector 2+ content, Moulage/Debrief/Simulationist crew recruitment, any Act 1 narrative beyond the intro + the gated funding-board joke, and checkpoint escalation design for later sectors.

---

## Content-Tagging Pipeline (2026-09-20)

Built [`game/pipeline/build_nodes.py`](game/pipeline/build_nodes.py), which converts the *entire* `mcq_bank.json` (107 MCQs) and `expert_knowledge.json` (273 terminology entries, 250 Q/A scenarios) into schema-conformant Node Templates — up from the 7 hand-picked for the vertical slice. Run with `python3 game/pipeline/build_nodes.py`; it's idempotent and regenerates both outputs from the source banks:
- `game/nodes.json` — the master pool, per `SCHEMA.md`'s own recommendation.
- `game/web/nodes_generated.js` — same data as `const GENERATED_NODES`, loadable by the browser game with no build step (not yet wired into `app.js`/`content.js` — sector curation is still a separate step).

**Mapping used:** MCQs → `diagnostic` nodes (1:1). Terminology → `intel` nodes (1:1, reusing the `"Field Briefing: {term}"` title convention from the hand-authored example). Expert-knowledge `**Q:**/**A:**` scenario prose → `scenario` nodes, auto-built into a generic two-choice template (`by_the_book`: the correct answer; `wry`: a generic "cut a corner" shortcut) — the same shape as the hand-authored FERPA/USB scenario, just not bespoke writing. `year`/`location_name` are assigned deterministically (round-robin over a small fictional site pool and 2019–2029) so a future procedural generator has real inputs to filter on — not narratively meaningful yet.

**Known placeholders, called out in the script's docstring, to revisit before this content ships into a real sector:**
- Diagnostic/scenario `title`/`flavor_intro` are mechanical (`"Field Call — {ksa}"` / `"Judgment Call — {ksa}"`), not written in Hub's voice.
- Scenario choice text is a generic template, not bespoke branching writing per scenario.
- `rank_min` per domain (which rank/act gates each domain's content) is a best guess pending the real crew/rank-gating decision — Domain IV (Debrief Facilitator) in particular is unconfirmed.
- No `callback` cross-run hooks or `sets_flags` story beats — narrative curation is still a separate task.
- Two bugs caught and fixed during a spot-check before trusting the output: (1) inconsistent source markdown (`**Term:**` vs `**Term**:`) was leaving a trailing colon on 182 of 273 parsed terms; (2) `**bold**` markdown inside 102 of 250 scenario answers/prompts was leaking raw asterisks into what should be plain display text (existing hand-authored content has none). Both are now sanitized in the pipeline itself, not just this run's output.

**Next step (not started):** use this pool to build Sector 2+ (currently still fully separate from `game/web/content.js`'s hand-authored Sector 1), and/or the procedural map-generation algorithm this pool was built to feed.

---

## Procedural Map Generator (2026-09-20)

Matthew's call: keep Sector 1 as the one hand-authored/tested sector, but prioritize the map generator over Sector 2+ content — the actual goal is players learning Sim Ops judgment, not memorizing which node on a fixed map has which answer. Wired the 630-node pipeline pool into live gameplay so **every "Begin Deployment" now generates a fresh map**, pulling different specific questions/terms each run instead of replaying the same fixed Sector 1 layout.

**Built:**
- [`game/web/mapgen.js`](game/web/mapgen.js) — `generateSectorMap({ profile, usedNodeIds, seed })`. Merges hand-authored `NODES` (content.js) + pipeline `GENERATED_NODES` into one pool, filters by each template's `requires` (rank/crew gating), and lays out a small parameterized layered DAG (2-3 nodes per layer, same "assign varied content onto a handful of map shapes" approach FTL/Slay the Spire use, not a fully generic graph algorithm). `rest` and `checkpoint` nodes have no source content in the study banks, so they're synthesized: `rest` is a lightly-randomized clone of the hand-authored template; `checkpoint` stitches two freshly-picked diagnostic nodes into a two-stage chain, mirroring `CHK-II-2019-001`'s pattern exactly.
- **Anti-repetition** (the actual point, per Matthew's framing): `profile.recent_node_ids` now tracks the last ~60 node ids played (roughly 7-8 runs), and the generator excludes them from selection where possible, falling back to allowing reuse only if the eligible pool after exclusion is too small. Verified via a standalone Node harness: 0/N overlap with recent history across 15 consecutive simulated runs.
- Refactored [`game/web/app.js`](game/web/app.js) to read `run.map.{nodes,edges,positions,start}` instead of the old global `SECTOR_1_MAP`/`NODE_POSITIONS`/`NODES` constants (all call sites: `showMap`, `renderSectorMap`, `currentShipAnchor`, `travelTo`, `openNode`, `advanceAfterNode`). The hand-authored Sector 1 content in `content.js` is now just part of the pool, not a fixed map — its 7 nodes can still appear, just not guaranteed or in a fixed order.
- `index.html` now loads `nodes_generated.js` and `mapgen.js` between `content.js` and `app.js`.

**Bug caught before trusting it:** first pass positioned the checkpoint node using a hardcoded `MAP_VIEWBOX.w - 50`, independent of the content-layer x-math — it landed almost exactly on top of the last content-layer node (30px apart, both ~56px circles), making one of them effectively unclickable. Caught via a screenshot during Playwright verification, not by eyeballing the code. Fixed by making the checkpoint occupy a proper trailing "layer slot" in the same x-coordinate formula (`computePositions` now takes the layer count *including* the checkpoint's reserved slot). Re-verified with a 200-run headless sweep: worst-case distance between any two real (clickable) node centers is now 140px, well clear of the 56px button size.

**Verified via Playwright** (installed fresh into the scratchpad for this session — chromium browser binary was already cached from a prior session's pass, per `currentState.md`'s existing Playwright precedent): zero console errors across two full consecutive runs, map renders every time, clicking through intel/diagnostic/scenario/rest/checkpoint nodes all work, runs complete via the checkpoint into the recap screen, and run 2's specific content (questions/terms, not just the generic "A Night Off"/"Accreditation Site Visit" labels which are expected to repeat by design) differed from run 1's.

**Known simplifications, not yet decided/built:**
- Map shape is one parameterized template (layer widths randomized in a narrow range), not multiple distinct topologies — structural variety is currently secondary to content variety, which was the stated priority.
- No `seed`-based "same map for everyone today" feature is exposed anywhere yet, though the generator supports it.
- SCHEMA.md's `template_id` vs. run-local `node_id` distinction is still not implemented — a picked template's `node_id` doubles as its id for the run, same simplification the vertical slice already made. Fine as long as a run never needs the same template twice, which the anti-duplicate-within-run logic guarantees.
- No Sector 2+ yet — the generator currently always produces "Sector 1"-scoped content (whatever the profile's rank/crew unlocks, which today is still only `junior_sim_tech` + `av_tech`, i.e. Domains I/II) since there's no UI yet to advance rank or recruit further crew.

---

## Scenario Incentive Fix + Rank-Up (2026-09-20)

Matthew played the generated build and caught a real design flaw: the generic scenario "wrong choice" (`"Skip the correct step this once to save time."`) had no situational pressure behind it anywhere in the scene, so it read as a strictly dominated option nobody would ever pick — which teaches nothing about judgment. He also asked how rank-up should work, given the domain/rank structure is fixed but the question pool will keep growing as he gets bored of repeats and asks for more content.

**Scenario pressure archetypes** (`game/pipeline/build_nodes.py`): each scenario now deterministically rotates through 4 grounded temptations — time crunch, budget crunch, deference to a non-expert authority, and false precedent ("it's worked before") — via `PRESSURE_ARCHETYPES` + `stable_pick()` (MD5-keyed on `node_id`, so regeneration stays reproducible). The picked archetype's `pressure_line` now feeds the `flavor_intro` and its `wrong_text`/`wrong_result` drive the "wry" choice, so the temptation is actually set up in the scene instead of floating free. Also fixed a real bug caught in the same pass: generated scenario choices were missing `result_text` entirely, which `app.js`'s `renderScenario()` unconditionally injects into the result box — every generated scenario was about to show a literal `"undefined"` after either choice. Both choices now carry proper `result_text`. Regenerated the pool; verified via Playwright that a wrong-choice click shows real consequence text and the flavor_intro names a concrete pressure.

**Rank-up** (locked design, implemented in `game/web/app.js`): promotion requires **both** (1) mastery of the domain tied to the current rank — ≥60% average Leitner level across ≥50% of that domain's distinct KSAs (`domainMasteryReady()`), so volume/grinding a couple of easy KSAs can't substitute for real coverage, and the bar stays stable as the question pool grows since it's keyed to the fixed KSA list, not pool size — **and** (2) at least one sector cleared (checkpoint passed) at the current rank, so mastery grinding in isolation can't skip the in-fiction deployment beat. Checked "Hades-style" on Hub return (`maybeRankUp()`, called from the `btn-return-hub` handler). Progression: `junior_sim_tech` (Domain II mastery) → `operations_specialist` (unlocks `moulage_artist`/III) → `lead_specialist` (unlocks `debrief_facilitator`/IV) → `chsos_certified` (unlocks `simulationist`/V, terminal). Also fixed `RANK_MIN_BY_DOMAIN` in the pipeline to match this exact progression (Domain IV now gates at `lead_specialist` not `operations_specialist`, Domain V at `chsos_certified` not `lead_specialist` — both were placeholder guesses before this was locked).

**Verified via Playwright**, both directions: (a) positive — seeded mastery + a sector-clear flag, drove the real "RETURN TO HUB" button, confirmed rank/crew/hub-line/crew-card all updated correctly and post-promotion map samples now surface Domain III content; (b) negative — two natural, unseeded runs stay at `junior_sim_tech` with only `av_tech` unlocked, confirming the gate actually blocks premature promotion rather than firing unconditionally. Zero console errors across all of it.

**Not yet done:** the promotion is currently silent beyond the Hub line — no distinct SFX/animation, no `pending_promotion` narrative hook wired into the story-bible breadcrumb system. Domain I still isn't factored into any rank gate (unchanged from the story bible's original call that it's baseline competency, not a gated crew domain).

---

## Sector Progression (2026-09-20)

Matthew asked whether Sector 2 was ready to build. It wasn't quite — nothing tracked *which* sector you were on (`"SECTOR 1"` was hardcoded in `app.js`), and although the pipeline had already tagged every node with a `year` (2019-2029), the generator never filtered by it, so a single deployment could freely mix a 2019 node with a 2027 one. Matthew chose the "narrower year window per sector" option over a flavor-only counter or collapsing sector into rank.

**Design:** `game/web/mapgen.js` now defines `SECTOR_YEAR_WINDOWS` — four contiguous slices of the 2019-2029 range (`[2019,2021]`, `[2022,2024]`, `[2025,2027]`, `[2028,2029]`). `profile.sector_index` (0-based, persistent) advances by one on every *successful* run (checkpoint passed) and caps at the final window — sector progression is deliberately independent of rank (rank gates which domains/crew you have access to; sector gates which chronological slice the deployment is drawn from), matching `SCHEMA.md`'s original intent that a run's `sector_index` and the player's rank are separate axes. A failed run leaves `sector_index` unchanged, so a failed deployment retries the *same* posting rather than skipping ahead — consistent with the "leap snaps back" framing already locked in the story bible.

**Generator change:** `generateSectorMap()` now prefers in-window content but never hard-blocks on it — the fallback order is (in-window AND unseen-recently) → (in-window) → (unseen-recently, any year) → (anything of the right type), so a sector never comes up short even for narrow domain/rank combinations. Verified this matters in practice: even the most constrained profile (`junior_sim_tech` + `av_tech` only, Domains I/II) held **98-100% in-window content** across 30 simulated runs per sector, competing against the same 60-item anti-repeat exclusion from the earlier session — the fallback tiers exist as a safety net but are essentially never needed at current pool size.

**UI:** the map topbar and a new Hub line (`"NEXT DEPLOYMENT — SECTOR N · {year}–{year}"`) both now reflect the real sector/window instead of a hardcoded label.

**Verified via Playwright:** fresh game starts at Sector 1 (2019-2021); five consecutive forced successes correctly advance Sector 1 → 2 → 3 → 4 and then hold at Sector 4 (2028-2029) rather than overflowing; both the Hub and map screens reflect each transition immediately; zero console errors. Also re-ran the original two-run regression pass (checkpoint stage-picking was refactored to share the same tiered fallback logic) to confirm ordinary play still works end-to-end.

**Net effect:** Sector 2 *already exists* now — no new content needed to be authored. Clearing one run naturally advances into it, pulling from a distinct, period-appropriate slice of the same 630-node pool.

**Not yet done:** no distinct narrative/flavor text per sector (site names and flavor_intro are still domain-driven, not sector-aware) — a sector transition currently only changes *which* content shows up, not any surrounding text acknowledging the jump forward in time. No sector count/label anywhere beyond the Hub and map topbar (e.g. no "Sectors cleared: N" stat).

---

## Map Node Label Fix (2026-09-20)

Matthew spotted (via a real screenshot of his own playthrough) that the always-on node title labels under each map node were unreadable — faint, and directly overlapping the node's own circle rather than sitting below it as intended. Root cause: `style.css`'s `.map-node-label` had `top: calc(50% + 34px)` meant to offset it below the node, but `app.js` was setting the label's inline `style.top` to the exact same value as its button (an inline style always wins over a stylesheet rule for the same property), so the offset never applied.

Fix, per Matthew's own suggestion: removed the always-on labels entirely and replaced them with a single shared tooltip (`#map-tooltip`) shown on hover/focus of a node button, positioned via the same offset math the label was supposed to use. Verified via Playwright + screenshots: no labels visible on an idle map, tooltip appears with correct text positioned just below the node on hover, and disappears when the pointer moves away.

---

## Hub Callback System (2026-09-20)

Matthew noticed, while actually playing, that Hub banter was thin — playing at Sector 3, he was still seeing the same funding-board joke every visit. Investigation found the real bug: `hubLineForVisit()`'s visit-count logic permanently parks on that one line for every visit from the 2nd Hub return onward (visit 0 -> intro line, visit 1 -> neutral line, visit ≥2 -> stuck on the board joke forever). Rather than just writing more static lines, he chose to activate `SCHEMA.md`'s existing-but-unused **callback** design: a node queues an "outpost reports back" Hub line, delivered a few visits later, with success/fail text depending on how the node actually resolved.

**Pipeline** (`game/pipeline/build_nodes.py`): added `CALLBACK_TEMPLATES` (8 generic success/fail message pairs in Hub's voice, e.g. *"Whatever you sorted out at {site} held. No repeat complaints."* / *"{site} flagged the same problem again last month. Should've stuck the first time."*) and `maybe_build_callback()`, which deterministically (by node_id, so regeneration stays reproducible) attaches a callback to ~35% of diagnostic/scenario nodes with a 2-5 Hub-visit delay — enough coverage for a steady trickle without flooding every visit or feeling omnipresent from just 8 templates. Intel nodes deliberately excluded (a flashcard has no "how'd it turn out" consequence). Regenerated the pool: 139/357 eligible nodes (38.9%) now carry a callback.

**Runtime** (`game/web/app.js`): `queueCallback()` fires from `advanceAfterNode()` on any node with a `callback`, pushing `{flag, message, deliver_after_hub_visits, queued_at_visit}` onto `profile.pending_callbacks` — deduplicated both against the current queue and a permanent `delivered_callback_flags` list, so a node template recurring in a later run (once the anti-repeat window rolls past it) never re-delivers the same line twice. `checkDueCallback()`, called from the `btn-return-hub` handler, delivers the oldest eligible one (FIFO), at most one per visit — same "one line per Hub visit" convention as the promotion line. Priority order when multiple things want the Hub line the same visit: **promotion > due callback > generic rotation** — a due callback is deliberately left in the queue (not consumed) if a promotion is also showing that visit, so it surfaces cleanly on a later, uncontested visit instead of being silently discarded. Also fixed the underlying `hubLineForVisit()` bug while in there: it now alternates between its two non-intro lines instead of freezing on one forever (still just 2 lines of real generic variety — the "bigger rotating pool" option Matthew deprioritized in favor of callbacks remains the next lever for that specifically).

**Verified via Playwright**, both in isolation and through real play: dedup within the queue, correct not-due-yet/due-at-exactly-N-visits/not-repeated-after timing, permanent post-delivery dedup, and the promotion-priority deferral (a due callback correctly stays queued when a promotion coincides, then delivers cleanly once the promotion clears) — all via direct calls to the real in-page functions. Separately confirmed the natural path: a real generated map's callback-bearing node, resolved through the actual `advanceAfterNode()` a player's click would trigger, correctly queues with properly interpolated site text. Zero console errors throughout.

**Not yet done:** callback messages are still generic templates (8 variants, {site}-interpolated), not bespoke per-node writing — same honest scoping as the pressure archetypes. No UI indicator of how many callbacks are pending/queued. The `flag` field callbacks set isn't yet cross-referenced by anything else (e.g. no Hub/crew dialogue eligibility currently reads `delivered_callback_flags` or the callback's own flag), even though `SCHEMA.md` envisioned flags driving broader dialogue gating.

---

## Scenario Format Fix — Solvable Without Reading (2026-09-20)

Matthew, looking at a real generated scenario node, spotted that the 2-choice format was solvable without reading the question at all — two separate tells, not one. The tone tag itself was a giveaway (BY THE BOOK = always correct, WRY = always wrong; the tonal dial was only ever supposed to be personality flavor per the story bible, never a correctness signal), and on top of that the correct choice was always the long, detailed, specific answer while the wrong one was always a generic "skip it" line. The pressure-archetype fix from earlier the same day fixed *why* someone might pick wrong, but not that the format itself gave away *which one* was wrong regardless.

He asked for alternatives; among four options (symmetric 2-choice text, expand to MCQ-style, delay the reveal via callbacks, reframe as genuine tradeoffs with no clean right answer), he picked **reusing mcq_bank.json's already-well-designed 4-option distractor sets** — the same content diagnostic nodes already draw from, which doesn't suffer from either tell (all four options are comparably-phrased technical statements, no built-in asymmetry).

**Change:** `build_scenario_nodes()` in `game/pipeline/build_nodes.py` now sources scenario nodes from `mcq_bank.json` (same 107 MCQs diagnostic nodes use, via a separate Counter bucket so each gets its own site/year and doesn't node_id-collide with the matching diagnostic node) instead of `expert_knowledge.json`'s Q&A `scenarios` field. Presented untimed (matching scenario's original "judgment call, not a speed drill" intent) with a heavier fail penalty than diagnostic (-15/-10/-15 vs. -10/-5/0) and the same pressure-archetype flavor_intro for narrative texture. **Tradeoff, stated plainly:** `expert_knowledge.json`'s 250 scenario Q&A pairs are unused pipeline input now — they only ever had one correct answer with no ready distractors, so there was no safe way to give them a 4-option treatment without either fabricating weak wrong answers or reviving them later with real bespoke writing (noted as future work, not done here). Scenario node count dropped from 250 to 107 as a direct result — still a large jump over the original 7, just smaller than the previous (flawed) version. Removed the now-dead `parse_scenario`/`SCENARIO_QA_RE`/`strip_markdown` helpers that only existed to parse that field.

**Runtime** (`game/web/app.js`): `renderMCQBlock()` now supports an untimed mode (skips the countdown bar entirely when `time_limit_seconds` is falsy). `renderScenario()` now branches on payload shape — `payload.choices` (the one hand-authored `content.js` scenario, the FERPA/USB judgment call) still renders through the original tone-dial branching UI unchanged, since a human writer can make that asymmetric format work through real craft; everything pipeline-generated now renders through the same `renderMCQBlock()` UI diagnostic nodes use, just untimed and framed with a "SCENARIO" tag instead of "DIAGNOSTIC / REPAIR".

**Verified via Playwright:** the new format shows zero tone-tag elements, zero timer bar, exactly 4 comparably-phrased options (51-73 characters in the sampled node, no long-vs-short asymmetry), and resolves correctly end to end. Separately confirmed the legacy hand-authored scenario still renders through its original branching path unchanged. Re-ran the 40-run-per-profile structural validation sweep (connectivity, single checkpoint) against the new 487-node pool — all passed. Zero console errors throughout.

---

## Session Summary — End of 2026-09-20

Eight changes today, in order, each caught and fixed real problems Matthew found by actually playing the build rather than just reading code:

1. **Content-tagging pipeline** (`game/pipeline/build_nodes.py`) — full `mcq_bank.json`/`expert_knowledge.json` banks turned into a 630-node pool (later 487, see #7), replacing the 7 hand-picked vertical-slice nodes.
2. **Procedural map generator** (`game/web/mapgen.js`) — every deployment now generates a fresh map from that pool instead of replaying a fixed layout; caught and fixed a checkpoint/node overlap bug via a Playwright screenshot before trusting it.
3. **Scenario pressure archetypes + rank-up** — gave the "wrong" scenario choice an actual in-fiction reason to pick it (time/budget/deference/precedent pressure), and built mastery-gated rank promotion (`maybeRankUp()` in `app.js`) tied to `SCHEMA.md`'s locked design.
4. **Sector progression** (`SECTOR_YEAR_WINDOWS` in `mapgen.js`) — `profile.sector_index` now advances toward the 2039 war on every successful run, independent of rank; the generator prefers in-window content with graceful fallback.
5. **Map node label fix** — always-on node labels were unreadable (a real CSS/inline-style bug, not just a styling tweak); replaced with a hover/focus tooltip.
6. **Hub callback system** — activated `SCHEMA.md`'s previously-unused "outpost reports back N visits later" design; also fixed `hubLineForVisit()` permanently freezing on one line past visit 2.
7. **Scenario format fix** — the 2-choice format was solvable without reading (tone tag always matched correctness, correct answer always the detailed one); scenario nodes now reuse `mcq_bank.json`'s real 4-option distractor sets instead of `expert_knowledge.json`'s Q&A field, which had no usable distractors. Pool dropped from 630 to 487 nodes as a direct, stated tradeoff (107 diagnostic + 273 intel + 107 scenario).

**Where things stand:** the game is playable end-to-end (intro → Hub → procedurally generated map → all 5 node types → checkpoint → recap → back to Hub), currently scoped to Domains I/II only (Junior Sim Tech + AV Technician, the only rank/crew reachable — nothing has promoted yet in real play). Every change above was verified with Playwright (not just read/reasoned about) before being reported done.

**Real gaps carried forward, not yet addressed:**
- `expert_knowledge.json`'s 250 scenario Q&A pairs are unused pipeline input (no safe distractors without bespoke rewriting).
- Hub banter beyond callbacks/promotion is still just 2 alternating generic lines — the "bigger rotating pool" option Matthew deprioritized twice now in favor of higher-leverage fixes.
- No Sector 2+ *content* distinction beyond which nodes get pulled (no per-sector flavor text).
- No Moulage/Debrief/Simulationist crew recruitment has been observed in real play yet — rank-up is built and Playwright-verified but not yet reached organically (mastery-gated on purpose).
- Procedural map shape is one parameterized layered-DAG template, not multiple distinct topologies.
- `callback`/`sets_flags` still don't feed any broader Hub/crew dialogue eligibility system, despite `SCHEMA.md` originally scoping flags for that.

**Everything in this session is uncommitted as of this note** — see the next commit for what actually shipped.

---

## Intel: Real Questions, Not Flashcards (2026-09-22)

Matthew played the build with a first-encounter Intel "free flashcard, quiz on the second encounter" design (built same day, previously uncommitted) and rejected the whole framing after seeing it in practice: he was hitting nothing but passive card-reads with no real questions, and pushed back that failing a question is itself part of learning it ("trial and error is part of that teaching, not just memorization") — not something to gate behind a second exposure.

**Change:** Intel nodes now present a real 4-option "define the term" question (distractor definitions drawn from other intel nodes, same-domain preferred) on *every* encounter, not just the second. A wrong answer is graded exactly like a wrong diagnostic answer — normal `on_fail` effects, normal mastery impact, no special-cased softer penalty — and the term comes back around later in the pool for another shot. Removed the now-unneeded `seen_terms` profile field, `renderIntelBriefing()`, and the intermediate `renderIntelRecallCheck()` split (folded into a single `renderIntel()`). Intel's `effects` shape changed from a flat single value to `on_pass`/`on_fail` (matching diagnostic's shape) in `content.js`, `build_nodes.py`, and `SCHEMA.md`'s documented example; regenerated `nodes.json`/`nodes_generated.js` from the pipeline. Flavor/Hub copy updated to match ("Hub doesn't pull up a card this time. 'You should have this one. Prove it.'") since the old "refresh yourself before you land" line no longer matches being tested immediately.

**Verified via Playwright** (fresh profile each run): an Intel node now shows the `INTEL` tag with 4 options immediately, no leading flashcard/CONTINUE-only step. Correct answer: mastery goes from untracked to level 1, integrity effect applied. Incorrect answer: `-4` integrity applied, mastery recorded at level 0 (tracked but not advanced), rationale box correctly shows "Not quite." plus the real definition either way. Zero console errors across both paths.

---

## First Crew Pickup + Rank-Up Progress Visibility (2026-09-22)

Matthew played to Sector 4 still stuck at Junior Sim Tech (Domain II mastery 28%, well under the promotion bar) and raised two related complaints: the game "doesn't feel like progress is being made past this point," and separately — he has three crew slots showing as "Locked" in the roster and was asking about crew hiring mechanics, having realized AV Technician (the one crew member he does have) was never actually *hired* on-screen, just silently present from the start.

**Root cause on both:** (1) `maybeRankUp()`'s two-part gate (≥60% Domain II mastery across ≥50% of its KSAs, AND a sector cleared at the current rank) was real and working, but completely invisible — the Hub only ever showed the raw domain-mastery bar, with no indication of where the 60% line was or that a second, separate condition (sector-cleared) also had to be true. (2) AV Technician was pushed into `profile.unlocked_crew` as a silent side effect of clicking past the intro screen (`btn-intro-continue`'s handler) — no scene, no acknowledgment — while every *later* crew member gets a real announcement via `promotionLine()` on rank-up. Confirmed via `AskUserQuestion`: Matthew wants both a visible gate-progress readout (not a rebalance of the 60% threshold itself) and a real hiring beat for the first crew pickup specifically.

**Change 1 — gate visibility:** The Hub's KSA Mastery panel now marks the domain gating the *next* rank promotion (`RANK_GATE_DOMAIN[profile.rank]`) with a threshold tick at 60% on its bar (`.domain-bar-threshold`) and a status line underneath reading `○/✓ 60% mastery for {next rank} · ○/✓ sector cleared at current rank`, turning green (`.domain-gate-note.ready`) once both are true. No balance change — `MASTERY_THRESHOLD_PERCENT`/`domainMasteryReady()`/`maybeRankUp()` are untouched; this only surfaces state that already existed.

**Change 2 — AV Technician hiring beat:** New screen (`#screen-crew-hire` in `index.html`) inserted between the intro and the Hub. `btn-intro-continue` now calls `showCrewHire()` instead of unlocking `av_tech` directly; the new screen shows a short Hub line introducing the AV Technician plus a crew card (`crewCardHtml()`, a new small helper), and only unlocks `av_tech` + advances to the Hub when its own `btn-crew-hire-continue` is clicked. Later crew (Moulage/Debrief/Simulationist) still use the existing rank-up `promotionLine()` announcement — this only touches the one crew member that previously got no beat at all.

**Verified via Playwright:** fresh-profile boot still shows the intro screen; clicking BEGIN shows the new crew-hire screen with `av_tech` *not yet* in `profile.unlocked_crew`; clicking TAKE THE ASSIGNMENT unlocks it and lands on the Hub. Gate-progress UI checked in both states by seeding profile mastery directly: not-ready shows `○`/`○` in muted color with the tick mid-bar, ready (full mastery + `sector_cleared_at_current_rank`) shows `✓`/`✓` in accent green — confirmed visually via screenshots, not just DOM text. Zero console errors throughout.

**Not yet done:** the underlying grind itself (how much play it actually takes to move Domain II mastery from 28% to 60%) is unchanged and untuned — Matthew explicitly chose visibility over rebalancing this session, but if it still feels too slow once the gate is visible, that's the next lever, not this one.

---

## Diagnostic/Scenario Duplicate-Content Bug + Domain I/II Content Expansion (2026-09-22)

Same session as the gate-visibility work above. Matthew asked directly: with the gate now visible showing Domain II stuck at 31% while stuck at Sector 4, is there actually enough content in Domains I/II to reach 60% without noticing significant repeats? Investigated with real numbers rather than guessing.

**Root cause found:** `build_scenario_nodes()` (`game/pipeline/build_nodes.py`) sources scenario nodes from the *same* `mcq_bank.json` entries diagnostic nodes use — same `question`/`options`/`rationale` text verbatim, just re-skinned as untimed with pressure-archetype flavor (this was a deliberate, previously-approved tradeoff from the 2026-09-20 "Scenario Format Fix" session, to kill a solvability tell — but its side effect wasn't examined until now). The anti-repeat system (`profile.recent_node_ids`) only tracks `node_id`, which differs between a question's diagnostic and scenario copies, so it had no way to know a player had already seen that exact question text minutes earlier under a different node_id and type tag.

**Fix 1 — source-id-aware anti-repeat (`game/web/mapgen.js`):** `generateSectorMap()` now also derives `usedSourceIds` from `ALL_NODE_TEMPLATES[id].source.id` (the shared `mcq_bank.json` id) for every node in the recent-history window, plus tracks `usedSourceIdsThisRun` so a map can't draw both twins of the same question in one run either. Folded into the existing tiered-fallback `pickForType()` as an additional freshness condition — same "prefer fresh, never starve a slot" pattern already established, no behavior change to the tiering structure itself.

**Diagnosed but not code-fixed — real content scarcity:** simulated 15 runs via a standalone Node harness (loading `content.js`/`nodes_generated.js`/`mapgen.js` in a `vm` context, matching the project's established harness pattern). Even with the dedup fix, only 5 of 47 diagnostic/scenario draws were genuinely fresh content at Sector 4 (2028-2029's narrow year window shrinks an already-thin pool hard); Sector 1 fared better but still repeated heavily past ~10 runs. Root numbers: Domain I only had 8 underlying MCQ-bank questions, Domain II only 28, against 5 and 15 KSAs respectively. Gave Matthew three options (loosen the sector year-window for thin domains / author more `mcq_bank.json` content / accept it as intended spaced repetition) — he chose to author more content, and pointed out the repo already has the real source material (CHSOS textbooks/dictionaries the "Sim Ops Bible" integration was built from) plus an AI that's trained on the domain, so new questions could be grounded rather than guessed.

**Fix 2 — expanded `mcq_bank.json`:** Added 42 new MCQs (`MCQ.I.09`-`MCQ.I.16`, `MCQ.II.29`-`MCQ.II.62`), grounded in the existing `expert_knowledge.json` entries for every Domain I/II KSA (which were themselves already distilled from the center's real source textbooks in this repo root) rather than invented from scratch. Domain I: 8 → 16 questions (doubled, spread across all 5 KSAs). Domain II: 28 → 62 questions (roughly doubled, every KSA brought to at least 4). Validated programmatically before use: no duplicate ids, every `answer` key exists in its own `options`, no duplicate option text within a question. Synced to `docs/mcq_bank.json` (the separate deployed study-app copy) by hand, matching the sync convention `update_knowledge.py` already uses for `expert_knowledge.json` (which doesn't cover `mcq_bank.json`). Regenerated `game/nodes.json`/`nodes_generated.js` from the pipeline: pool grew from 487 to 571 node templates.

**Measured effect (same Node harness, before/after):** Sector 1 cross-run source-id collisions dropped from 32 to 12 over 15 simulated runs (~62% fewer repeats) once the fix and the new content were both in. Sector 4 improved less (42 → 35) since its narrower 2-year window is now the binding constraint rather than total content — a separate, smaller lever (the "loosen the sector year-window" option Matthew didn't pick this round) if it still feels thin there specifically.

**Verified via Playwright:** fresh boot through intro → crew-hire → Hub → Begin Deployment still generates a clean map (zero console errors), browser correctly loads all 149 distinct MCQ source ids, an Intel node still resolves correctly post-regeneration.

---

## Mastery-Weighted Node Selection (2026-09-22)

Still the same session. Matthew played more and reported still feeling stuck at Sector 4, and specifically clarified the repeat complaint: it's not that he's re-seeing questions he'd gotten *wrong* (which would be legitimate spaced repetition) — it's redundant repeats regardless of whether he already knows the content cold. That's a sharper, different bug than the source-id duplication fixed earlier today.

**Root cause:** `weightedDomainPick()` in `game/web/mapgen.js` — the function that picks which specific node fills a slot once the type/freshness tiering has narrowed the candidates — only ever weighted candidates by `DOMAIN_WEIGHT` (the fixed exam-weight per domain, e.g. Domain II=35). It never looked at `profile.ksa_mastery` at all. So among the eligible candidates, a KSA already mastered to level 5 was exactly as likely to get picked as a KSA the player had never touched or kept getting wrong. The game's own premise (per the original design notes) was that it "reuses the existing Leitner spaced-repetition data as the difficulty signal" — but that data was only ever read for the rank-up gate calculation, never actually fed into which content gets shown.

**Fix:** Added `masteryUrgencyWeight(ksa, ksaMastery)`, mapping KSA mastery level to a weight via `MASTERY_URGENCY_BY_LEVEL = [6, 5, 4, 3, 2, 1]` — level 0 or never-attempted is the most urgent (weight 6), a maxed level-5 KSA is rare but not excluded entirely (weight 1), so some review still happens. `weightedDomainPick()` now multiplies this into the existing domain-exam weighting, and `pickForType()` passes `profile.ksa_mastery` through at its one call site. Checkpoint stage picks inherit this automatically since they reuse `pickForType("diagnostic")`.

**Verified via a standalone Node harness:** seeded a synthetic profile with 7 of Domain II's 15 KSAs at level 5 and the other 8 untouched, then simulated 40 runs. The 8 weak/untouched KSAs were drawn ~1.6x more often in aggregate than the 7 mastered ones (103 vs 64 draws), confirming the bias actually shows up in real map generation, not just in the weight formula on paper. Playwright confirmed the full boot-to-map-to-node flow still works cleanly afterward (a false-alarm "0 options" on one quick intel-node check turned out to be a test-script timing issue, not a real bug — a slower, more careful re-check showed the Intel node rendering its 4 options correctly).

**On "stuck at Sector 4" specifically:** clarified for Matthew that Sector 4 is the *intended* final window (`SECTOR_YEAR_WINDOWS` caps there since the story's run-years span ends at 2029) — `sector_index` is designed to stop advancing once you're there, not a bug. If what actually feels stuck is rank (still Junior Sim Tech), that's the same Domain II mastery gate from the gate-visibility session earlier today, and this mastery-weighting fix is the direct lever for that: more of a player's plays should now land on the KSAs actually dragging their average down, instead of on ones already at level 5 doing nothing for the 60% target.


