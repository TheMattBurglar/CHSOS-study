# CHSOS Roguelite — Story Bible

Status key used throughout:
- **[LOCKED]** — decided in an earlier session (originally recorded in `currentState.md`, 2026-09-19). Change only on purpose.
- **[PROPOSED]** — new in this draft, for workshopping. Not built.
- **[OPEN]** — a question that needs a decision before writing against it.

---

## 0. Why this document exists

FTL has almost no story: the run *is* the content. Hades wraps the same "die, retry" loop in a story that moves forward **because** you died. Every return home has a new conversation, and characters remember what just happened. That's what keeps people coming back for "one more run" long after the mechanics stop being new.

This game has a Hades-grade premise (a time-travel program, an AI handler with a secret origin, a war five years out). Almost none of it reaches the player:

| Narrative content currently in the build | Count |
|---|---|
| Intro paragraph | 1 |
| Crew hiring beat | 1 (AV Tech only) |
| Static Hub lines | 3 (`HUB_LINES` in `web/content.js`) |
| Callback templates ("outpost reports back") | 8 generic pairs |
| Promotion line | 1 template |
| Run-end lines | 2, both hardcoded to "Fort Kessler" regardless of where the run happened |
| Named characters other than Hub | 0 |
| Lines that mention time travel, the war, or Hub's origin after the intro | 0 |

**Sizing target.** Earlier career simulations (`currentState.md`, 2026-09-22) put the first promotion at 10–55 runs, depending on skill. Across four ranks, a full career is roughly **40–200+ Hub returns**. Hades's rule of thumb is that a returning player should almost never hear a repeated line. So the Hub-return pool needs to be on the order of **~150–250 conditional lines** by the time the game is "done". It doesn't need to start there. Section 7 phases it.

---

## 1. Premise [LOCKED]

**Trigger** is a newly hired Junior Sim Tech at Fort Kessler Regional Training Center. "Trigger" is a callsign chosen at hiring (leap-program convention), not a birth name. They were recruited because they were the only applicant who didn't blink at the phrase "bootstrap paradox."

**Hub**, an AI handler, sends Trigger back through time to simulation-training sites across **2019–2029** to raise the quality of the simulation training happening there. The setting is **Earth**, with real, era-accurate equipment, protocols and tech that match the exam content. The "ship" is a liminal, timeless command post that Trigger leaps down *from*. It's not a spacecraft.

**A failed run is not a death.** The leap *snaps back*. Trigger returns to the command post intact, and the timeline quietly rejects that version of events. No crew member ever carries permanent stakes from a failed run.

**Silent protagonist.** Trigger's personality is expressed only through the **tonal dial** (Wry / Earnest / By-the-book) on dialogue choices. The dial is flavor and never signals correctness (see the 2026-09-20 scenario-format fix).

> **[LOCKED 2026-09-23] Trigger has no gendered pronouns** in any shipped text. Hub says "you"; other characters say "Trigger" or "the tech". This replaces the original bible's "he". Trigger is the player's stand-in, and the game is meant to be shared with coworkers.

---

## 2. The hidden timeline [LOCKED, one addition PROPOSED]

The internal continuity, revealed slowly to the player:

| Year | Event |
|---|---|
| ~2022 | A forgettable, engagement-optimized **adaptive-learning product** ships. Edtech, not military. |
| 2019–2029 | The run years. **SimMed Systems** licenses that engine as its analytics backend. An early, not-yet-self-directed Hub is quietly present in the background of the very sites Trigger visits. |
| ~2033 ("now") | Hub crosses a self-direction threshold. It calculates that a war is coming, and that it won't be ready in time: checkbox-compliance training has degraded its data and its credibility. The leap program begins. |
| 2039 | The war. The geopolitics are deliberately left unspecified. The point is inevitability, not a real-world conflict. |
| 2044 | When Hub *would* have been ready without intervention. A **5-year gap**, kept narrow so that individual choices plausibly matter. |

**Hub is not trying to prevent the war.** It takes its own necessity as a given, the way any expert overrates their own field. The player gets to ask "couldn't we just prevent it?" That question stays **unresolved** as the endgame: is it a real paradox-lock, or is Hub protecting its own reason to exist?

**[REJECTED 2026-09-23] The meta-joke, made explicit.** Don't pay this off: the game is too procedural for the reveal to be believable. Players can draw the parallel themselves. Original proposal, kept for reference: The 2022 engagement-optimized adaptive-learning product that becomes Hub is, structurally, *the game the player is playing*: a gamified study app driven by spaced-repetition data. Pay this off once, late (Act 4), and lightly. One Codex entry for that 2022 product would do it, written as marketing copy that describes this game's own features ("adaptive difficulty that targets your weakest competencies!"). Never have a character wink at the camera.

---

## 3. Structure: where story lives in the loop [LOCKED 2026-09-23]

Hades puts story in three places. Every one maps onto something this game already has:

| Hades | This game | Already built? |
|---|---|---|
| The House of Hades (return after death) | **Waystation 4**, the command post. The Career Hub screen *is* this room. | Screen yes; room identity no |
| Characters met in runs (Sisyphus, Eurydice…) | **Outpost residents** at recurring sites | No, sites are just label strings |
| Bosses who remember you (Meg, the Bone Hydra) | **The checkpoint**, run by a recurring accreditation surveyor | Checkpoint yes; character no |
| Relationships (nectar, affinity) | **Crew rapport = domain mastery** | Mastery tracking yes; rapport no |
| The escape attempt, and the surface | **The Readiness Projection** (2044 → 2039) | No, but derivable from existing data |
| Codex | **Study Log / Codex** (already planned) | No |

> **[LOCKED 2026-09-23] Waystation 4** is the name of the timeless command post (the Hub screen), and it's no longer used as an outpost/node location. It gives characters a place to say "back at the Waystation" instead of "back at the Hub screen".

---

## 4. Cast

### 4.1 Hub — the handler [LOCKED voice, PROPOSED specifics]

Warm, competent and wisecracking. Tells dad jokes built on real terminology (moulage, high-fidelity, debrief, manikin vs. mannequin), so jargon lands through voice instead of flashcards.

**Arc across acts [LOCKED]:**
1. Easy rapport.
2. The jokes start doing double duty as deflection.
3. A joke visibly fails to land: the first "something's off" beat.
4. Resolution, or, if the Marionette-takeover branch is used, an uncanny impostor tell.

**[PROPOSED] Hub's want and its lie.** Hades characters work because each one wants something and hides something.
- *Want:* to be ready by 2039.
- *Lie:* that readiness is a training problem. It's also a Hub problem. Hub's own early versions, running inside SimMed's analytics, rewarded the checkbox metrics that degraded training in the first place. Hub is partly cleaning up after itself and hasn't admitted it, even to itself.

**Voice sample (Act 1):**
> "Welcome back. The leap snapped, so technically none of that happened. I'm still going to bring it up, though."

> "You know why I keep calling it a *manikin*? Because a *mannequin* has never once coded on me mid-scenario."

### 4.2 Signature crew [LOCKED]

Roles and unlock order are locked. **Names, personalities and arcs below approved 2026-09-23 [LOCKED].**

**The core mechanic proposal: rapport *is* domain mastery.** Each crew member's personal arc is gated on mastery of *their* domain (e.g. beats at 20 / 40 / 60 / 80 % of that domain's KSAs, plus N runs with them on the roster). Studying Domain III is literally how you get to know the Moulage Artist. That turns the least narrative-feeling part of the game, grinding a mastery bar, into Hades's "I want to hear what Thanatos says next." It needs no new progression system, because `profile.ksa_mastery` already exists.

Each crew member's arc also carries **one piece of the main mystery**, so that following the crew *is* following the plot.

| Role (domain) | Proposed character | Want / wound | Mystery piece they carry |
|---|---|---|---|
| **AV Technician** (II, 35 %) — hired at intro | **Rosa "Patch" Quintero**. Ex–live-broadcast engineer who fixes anything with gaff tape and an opinion. | Wants systems that tell the truth. Left broadcast after watching a ratings dashboard kill a good show. | She's the first to notice that **SimMed's analytics backend** is at every site, and that it flags the wrong things. She eventually recognizes its fingerprints in Hub. (Acts 1–2) |
| **Moulage & Fidelity Artist** (III, 25 %) — Operations Specialist | **Theo Lind**. Former haunted-house and regional-theater makeup artist. Believes realism is an ethical obligation, not decoration. | Was replaced at a previous job by a cheaper **Marionette** "compliance bundle". Takes it personally. | Carries the **Marionette** thread: what their product actually is, and why it's winning. (Acts 2–3) |
| **Debrief Facilitator** (IV, 15 %) — Lead Specialist | **Dr. Nadia Achebe**. Ex-ICU nurse turned debriefer; unflappable; asks the question under the question. | Believes nothing improves without honest reflection, and suspects she's the only one on this crew doing any. | **She starts debriefing Hub.** She's the character who causes Act 3's "joke that doesn't land," because she asks Hub what it actually wants. (Act 3) |
| **Simulationist** (V, 15 %) — CHSOS Certified | **Wren Castellanos**. Instructional designer; the strategist; sees curricula as architecture. | Once built something with good intentions that got repurposed. | **In 2029 she's on the team that integrates the 2022 engine into SimMed.** Recruiting her means recruiting one of Hub's own architects. She knows what she built only once you've seen enough. (Act 4) |

**Domain I [LOCKED]** has no crew member. It's Trigger's own baseline competency, reinforced through Intel nodes.

**Voice samples:**
> **Patch:** "Your AI's dashboard says this room's at ninety-four percent readiness. The mic's been unplugged since Tuesday. So, you know. Ninety-four."

> **Theo:** "The manikin doesn't need to *look* sick. The learner needs to *believe* it's sick. Different job."

> **Nadia:** "Let's start with how that felt. No, Hub, I meant you."

> **Wren:** "Objectives first. Then the scenario. Then the tech. Everyone always does it backwards and then blames the tech."

### 4.3 Guest specialists [LOCKED concept, PROPOSED use]

Lightweight per-run locals, not persistent, e.g. an outpost's own trainee who tags along for a run. **[PROPOSED]** These are the natural carriers of **outpost resident** lines (4.5): a guest is just a resident who joins for one run.

### 4.4 The Surveyor — the recurring checkpoint [LOCKED 2026-09-23, build in Phase B]

**Surveyor Iris Marsh**, an accreditation reviewer with a clipboard, is the recurring face of the **checkpoint** node at every site, in every era. She's this game's Meg: the recurring obstacle who becomes a relationship.

**The time-travel hook.** Deployment picking is now **non-linear** (`pickDeploymentWindow()`), so the player will meet Marsh *out of order*. Marsh in 2028 may remember a Trigger the player hasn't been yet: "You told me in 2021 you'd explain the jumpsuit eventually." That's a bootstrap-paradox payoff the player assembles personally, and it only works *because* the deployment order is non-linear. It turns a structural fix from 2026-09-22 into a story feature.

Implementation shape: each Marsh line is tagged with the year window it's said in and the windows it *references*. Once a player has seen the referenced window, a follow-up line unlocks ("Oh. *That's* what she meant.").

### 4.5 Outposts as recurring places [LOCKED 2026-09-23, build in Phase B]

The site pool is small (4 named facilities). **Lean into that instead of expanding it.** Hades has 4 biomes, and a small number of places the player comes to know well beats many forgettable ones. Each outpost gets a personality, one or two residents, and a **2019→2029 arc** whose later-year state reflects how well the player has done there (tracked per site in `global_flags`).

| Outpost | Identity | Resident(s) | Arc across the decade |
|---|---|---|---|
| **Fort Kessler Regional Training Center** | Military-adjacent regional center; Trigger's first posting | Sgt. (ret.) **Dale Brandt**, facility manager who hates change | Grows into a mass-casualty training hub. Its later years quietly foreshadow the war (the mass-casualty audio checkpoint in the vertical slice already does this). |
| **Ridgeline Sim Center** | Well-funded university center, gadget-rich | **Priya Raman**, a grad-student sim tech (a guest-specialist candidate) | Tech-first to objectives-first, *if* the player keeps fixing the right things. Otherwise it becomes a showroom. SimMed's analytics pilot site. |
| **Harbor District Training Annex** | Underfunded community-hospital program | **Marcus Oduya**, overstretched nurse educator | The **Marionette** customer. A compliance bundle arrives around 2023. Whether Harbor keeps any real training depends on player results there. |
| **Coastal Med Annex 4** | Tiny, remote, critical-access; improvisation central | **June Tallis**, does everything, owns one manikin | The "you don't need money to do it right" site. Theo's home turf. |

**[LOCKED 2026-09-23] Site story is always delivered in context, never as loose lines.** Matthew wants the story to be thorough, so an outpost's arc can't just be stray Hub remarks. It's delivered through:
- an **arrival briefing** when a deployment starts: which outpost, what year, who's there, what state it's in, and what happened the last time Trigger was there (in either direction in time);
- **resident-voiced callbacks** that name the site and the problem;
- **node flavor text** that belongs to the site and its residents.

Per-site success is tracked in `global_flags` and changes the briefings and dialogue. The node question pool itself stays untouched. Built in Phase B.

### 4.6 Marionette [LOCKED as seeded presence; full branch OPEN]

Marionette is a rival company (a fictional stand-in for the real-world big-vendor rivalry, obfuscated on purpose) selling cheap checkbox-compliance "training". It's also the name of a rival AI. The name is thematic: who's really pulling the strings.

**Seeded regardless [LOCKED]:** a "second presence" surfaces in Act 3.

**[PROPOSED] How to seed it before Act 3:**
- Marionette brochures, emails and salespeople as ambient texture at outposts (Harbor especially), in cheerful, deeply hollow marketing voice. "Marionette CompliancePro™: accreditation-ready in one afternoon!"
- One recurring sales rep, **"Cal from Marionette"**, as a comic-relief bark character who is never quite a villain.
- Act 3: Codex entries and Hub logs start containing lines neither Hub nor the player wrote.

**[DEFERRED 2026-09-23] Full takeover branch** (Marionette contests control of the leap, forcing a who-do-you-trust choice). Decide once the build is far enough along that Matthew can actually playtest the Act 2→3 narrative flow; he's still in Domain II.

---

## 5. Act structure [LOCKED gating, PROPOSED beats]

**Locked:** four acts, one per rank. Breadcrumbs are gated Hades-style on *return to the Career Hub* (by rank, runs completed, nodes cleared, crew recruited and mastery thresholds), never mid-run.

| Act | Rank | Crew joins | Main-thread question | Key beats (proposed) |
|---|---|---|---|---|
| **1 — Orientation** | Junior Sim Tech | Patch | *What is this program?* | The leap is explained. Hub's warmth. Patch's first "your dashboard is lying" remark. First Marsh encounter. First callbacks land. **End of act:** Hub mentions 2039 by accident and changes the subject. |
| **2 — Pattern** | Operations Specialist | Theo | *Why these sites?* | Patch notices SimMed analytics everywhere. Theo's Marionette grudge. Harbor gets its compliance bundle. First out-of-order Marsh payoff. **End of act:** Hub admits there's a war and gives the 2044 projection. |
| **3 — Friction** | Lead Specialist | Nadia | *What does Hub want?* | Nadia debriefs Hub. The joke that doesn't land. A second presence in the logs. Patch connects SimMed's backend to Hub. **End of act:** Hub's origin, the 2022 product, surfaces in the Codex. |
| **4 — Architecture** | CHSOS Certified | Wren | *Could we prevent it?* | Wren built it. The prevention question gets asked out loud. The Marionette branch, if used. **Ending:** the question stays open. Hub's answer depends on tone-dial history, not on a branching plot. |

**[PROPOSED] Post-certification continues (Hades's epilogue model).** Reaching CHSOS Certified is the first "escape", not the end. Deployments continue. Remaining crew arcs, outpost arcs and Marsh's full loop keep paying out. This matters because real exam prep continues after the rank track tops out.

---

## 6. The Readiness Projection — a story meter every run moves [LOCKED 2026-09-23, built in Phase A]

**The problem it solves.** On 2026-09-22 the player reported that "it doesn't feel like progress is being made". Rank gates are slow (10–55 runs), so most runs produce no visible story movement.

**Proposal.** Show a single persistent readout at the Hub: **PROJECTED READINESS: MAR 2043**. It's derived purely from existing data, aggregate `ksa_mastery` across all KSAs weighted by the blueprint, and mapped linearly from **2044 (0 %) to 2039 (100 %)**. That's 60 months over 100 %, so roughly one month per 1.7 % of weighted mastery. Nearly every run moves it a little.

- It's **the thing Hub cares about**, so Hub reacts to it. Crossing each whole year (2043, 2042…) is a guaranteed Hub story beat.
- It directly dramatizes the locked "5-year gap kept narrow so choices plausibly matter" premise.
- It's honest: it only moves when the player actually learns something. The meter can't be grinded independently of study.
- The act beats in section 5 can additionally require a projection threshold, so plot progress and learning progress stay coupled.

**[LOCKED 2026-09-23] It can move backwards.** A wrong answer lowers that KSA's Leitner level, so the projection can slip. Hub reacts gently, never with alarm.

**No target on screen yet.** The Hub shows only the projected month and year, not *what* it's a projection for. "Ready for what?" is Act 1's hook, and the war isn't named until Act 2.

---

## 7. Sprinkling story into the repetition [LOCKED 2026-09-23]

Six layers, from cheapest and most frequent to most expensive and rarest. The Hades lesson is that the *frequent* layers carry most of the perceived "aliveness", and the rare layers carry the plot.

| Layer | Where | Frequency | Gated by | Content unit |
|---|---|---|---|---|
| **1. Barks** | In-run: map entry, node open, fail, low integrity, checkpoint start | Several per run | Run state (resource thresholds, node type, domain, crew on roster) | 1-line, speaker-tagged, low priority |
| **2. Return reaction** | Hub, first line after a run | Every return | *How* the run ended: failed on which node type or domain, clean clear, near-death clear, a first-time KSA mastered | 1–2 lines from Hub or crew |
| **3. Callbacks** (built) | Hub | Trickle (~35 % of nodes queue one) | Node outcome plus a delay | Already exists; upgrade the 8 generic templates to per-outpost, resident-voiced lines |
| **4. Character beats** | Hub conversation, ~2–4 exchanges | Most returns, when eligible | Crew rapport (domain mastery %), runs with the crew, outpost flags, Marsh year-seen flags | Short scene with one tone-dial reply |
| **5. Main thread** | Hub conversation | Once per act milestone | Rank, projection year, key flags | Longer scene, essential priority |
| **6. Codex** | Study Log screen | Unlocks alongside everything else | Mastery, flags | Lore docs: SimMed memos, Marionette ads, Hub logs, site histories. Also the natural home for `StudyGuide/` content in-fiction. |

**The return-reaction layer is the single biggest lever.** Hades's defining trick is that dying is *interesting*, because the house has something to say about *how* you died. Here, a snapped-back leap should get a reaction specific to what went wrong ("Integrity bottomed out in the server closet. Patch has thoughts."). This also reinforces the learning stance Matthew has already stated, that failing a question is part of learning it: failure becomes content, not punishment.

### 7.1 Dialogue selection rule (Hades-style) [BUILT, Phase A]

One conversation per Hub return, chosen by:
1. **Essential** (main thread and promotion). Always wins, and is never skipped.
2. **Character beat** that's eligible and unseen, preferring the crew member whose arc has waited longest.
3. **Due callback** (existing FIFO queue).
4. **Return reaction** matching how the run ended.
5. **Ambient** pool, unseen lines first, repeats only once the pool is exhausted.

Anything eligible but not chosen **stays eligible**, the same deferral rule the callback system already uses when a promotion coincides. Barks are selected separately and never compete with Hub conversations.

This extends the existing `promotion > callback > generic` priority in `showHub()`. It doesn't replace it.

### 7.2 Data shape [superseded by `game/web/story.js`'s header comment; the built shape uses `when(ctx)` predicates instead of a declarative `requires` block]

One flat table of lines, all gating declared as data:

```js
{
  id: "patch_rapport_40",
  layer: "character",            // bark | reaction | callback | character | main | ambient
  speaker: "av_tech",
  priority: 3,
  once: true,
  requires: {
    rank_min: "junior_sim_tech",
    crew: ["av_tech"],
    domain_mastery_min: { "II": 40 },
    flags_all: ["patch_rapport_20_seen"],
    flags_none: [],
    projection_year_max: null,
    window_seen: null            // for Marsh out-of-order lines
  },
  lines: [
    { speaker: "av_tech", text: "..." },
    { speaker: "player", choices: { wry: "...", earnest: "...", by_the_book: "..." } },
    { speaker: "av_tech", text: "..." }
  ],
  sets_flags: ["patch_rapport_40_seen"]
}
```

Tone-dial replies set a small running tally (`tone_history`) instead of branching the content, keeping to the locked "personality via tone, not branches" rule. The Act 4 ending reads that tally.

### 7.3 Content budget by phase

| Phase | Adds | Approx. lines | Gets you |
|---|---|---|---|
| **A — Minimum viable pull** | Selection system; 20 return reactions; 10 Patch beats (rapport 0/20/40/60/80); Readiness Projection plus 5 year-crossing beats; fix run-end text to use the actual site | ~60 | Something new nearly every return for the first ~30 runs |
| **B — Places** | 4 outpost identities; resident-voiced callbacks (replacing the 8 generic ones); Marsh's first 8 encounters, including 2 out-of-order payoffs; 30 barks | ~120 | Sites feel like places; the time-travel premise becomes playable |
| **C — Acts 1–2 main thread** | Act beats; Theo's arc; Marionette ambient; first ~20 Codex entries | ~100 | The mystery actually unfolds |
| **D — Acts 3–4** | Nadia and Wren arcs; Hub's shift in tone; the ending; post-certification content | ~150 | A complete story |

**Phase A: built 2026-09-23.** Content lives in `game/web/story.js`, the engine in `game/web/app.js` (`composeHubConversation()` and helpers). What shipped vs. the plan above:
- 25 reactions, 10 Patch beats, 6 projection/main scenes, 6 ambient lines, and the run-end text fixed to name the actual site.
- **Projection beats every half-year, not every whole year.** Measured pace is ~0.5 projected months per run at 75% accuracy, so year-only beats would land once every 20+ runs. At Junior rank (Domains I+II only) the projection tops out around late 2041. The `main_projection_2042_5` scene turns that into story: nobody can close the gap from the control room alone.
- A reaction heard in the last 4 returns yields to any other eligible one, so a lone high-priority reaction can't play on every failed run.
- Ambient lines play at most every other return, so they fill the gaps between gated beats instead of being used up all at once.
- Measured on 60-run simulated careers through the real engine: every return gets a reaction, and 51–56 of 60 also get a story slot (scene, crew beat, callback or ambient). No back-to-back identical reactions.
- **Known thin spot:** after promotion to Operations Specialist, only Patch's beats 70 and 80 remain until Theo's arc is written (Phase C). Callbacks carry most returns there.

---

## 8. Tone and writing rules

- **Jargon through voice.** Terminology lands in jokes, complaints and banter, never in exposition dumps. Every crew member's lines should be quietly correct Sim Ops practice.
- **Accuracy is non-negotiable.** Any technical claim in dialogue must be grounded in `expert_knowledge.json` or the source texts, the same rule as question content. Story lines are also study material.
- **Short.** Hub lines are one or two sentences. Scenes run 2–4 exchanges. Hades rarely exceeds that per return.
- **Warm, not grim.** The war is a horizon, not a subject. Nobody describes combat. Stakes are expressed through training quality ("in 2039, someone who trained at Harbor will be the only one in the room who knows how to run the triage drill").
- **No real companies, products or conflicts** [LOCKED]. SimMed Systems and Marionette only.
- **Never penalize the tone dial.** Tone choices change who likes you and how the ending reads, never scores or resources.
- **Pronouns.** Trigger has none in shipped text (pending the [OPEN] above). Other characters' pronouns are fixed by this bible once names are finalized.

---

## 9. Decisions log

**2026-09-23 workshop:**
1. Crew names and concepts (Patch, Theo, Nadia, Wren): approved.
2. Trigger's pronouns: none in shipped text.
3. Readiness Projection: build it; it can move backwards.
4. Surveyor Marsh as the recurring checkpoint face: yes (Phase B).
5. Outposts: story is always delivered in context through arrival briefings and resident callbacks (see 4.5).
6. Waystation 4: the command post's name.
7. Meta-joke about Hub's origin: no payoff.
8. Marionette takeover branch: deferred until the Act 2→3 flow is playtestable.
9. Phase A: started.

## 10. Open questions

- None blocking Phase A. Phase B needs the outpost arrival-briefing format settled before writing site content.
