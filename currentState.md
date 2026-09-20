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

**Not yet done:** procedural map generation (still hand-authored), Sector 2+ content, Moulage/Debrief/Simulationist crew recruitment, any Act 1 narrative beyond the intro + the gated funding-board joke, checkpoint escalation design for later sectors, and a content-tagging pipeline to pull from the full `mcq_bank.json`/`expert_knowledge.json` bank instead of hand-picking.


