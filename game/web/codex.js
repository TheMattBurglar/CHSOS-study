// CHSOS Roguelite — Study Log / Codex (Phase C, see game/STORY_BIBLE.md §7, layer 6).
//
// In-fiction documents that unlock as the story moves: Hub's own logs,
// personnel and site files, SimMed Systems paperwork, Marionette marketing.
// Each one carries a FIELD NOTE: one real exam fact, tagged with its KSA and
// grounded in expert_knowledge.json (decided 2026-09-28: lore with facts
// inside, not a separate study tab).
//
// Entry shape:
//   { id, cat, title, meta, when(c), body: [paragraphs], fact: { ksa, t } }
// `when` gets the Hub story context (app.js storyContext()): c.flag, c.seen,
// c.crew, c.domainPct, c.rankAtLeast, c.visited(outpostId), c.marshMeetings,
// c.profile. Unlocks are checked on every Hub return and never re-lock.
//
// Writing rules as story.js. Keep the lore short: the fact is the payload.

const CODEX_CATEGORIES = [
  { id: "hub", label: "HUB LOGS" },
  { id: "personnel", label: "PERSONNEL" },
  { id: "outpost", label: "SITE FILES" },
  { id: "simmed", label: "SIMMED SYSTEMS" },
  { id: "marionette", label: "MARIONETTE" }
];

const CODEX_ENTRIES = [

  // ===== Hub logs =====
  {
    id: "codex_hub_leap_001", cat: "hub", title: "After-action: Leap 001", meta: "Hub log · Waystation 4",
    when: c => c.profile.story.returns >= 1,
    body: [
      "Subject: Trigger, first leap. Format: plus-delta, since the recruit will need to learn it anyway.",
      "PLUS: Arrived intact. Asked good questions. Did not touch the coffee maker.",
      "DELTA: Inner ear still in the source year on return. Recommend sitting down. Patch concurs."
    ],
    fact: { ksa: "V.C.8", t: "Plus-delta is the quick debrief: what went well (plus) and what to change (delta). For longer debriefs, GAS: Gather, Analyze, Summarize. DASH is the tool for rating how good a debrief was." }
  },
  {
    id: "codex_hub_projection", cat: "hub", title: "Projection method", meta: "Hub log · Waystation 4",
    when: c => c.seen("main_projection_intro"),
    body: [
      "The projection only counts what sticks. A lucky first answer moves it a little. Getting it right again, later, moves it more. Forgetting moves it back.",
      "I considered counting hours logged. Hours are easy to count. They also say nothing about whether anyone can do the job."
    ],
    fact: { ksa: "V.C.4", t: "Reliability is consistency: does it measure the same way every time? Validity is accuracy: does it measure what it claims to? A measure can be perfectly reliable and still not valid." }
  },
  {
    id: "codex_hub_bootstrap", cat: "hub", title: "On bootstraps", meta: "Hub log · Waystation 4",
    when: c => c.seen("main_bootstrap"),
    body: [
      "A bootstrap paradox is knowledge with no origin. Someone learns it from someone who learned it from them.",
      "Every good sim program is one. The tech trains the faculty, the faculty train the next tech, and the next tech trains the faculty."
    ],
    fact: { ksa: "III.C", t: "Train-the-trainer: the specialist trains key faculty members, who then train their peers on the equipment. Pair it with a competency checklist so everyone ends up at the same skill level." }
  },
  {
    id: "codex_hub_budget", cat: "hub", title: "Draft reply (not sent)", meta: "Hub log · Waystation 4",
    when: c => c.flag("hub_slipped_2039"),
    body: [
      "Re: Patch, \"what's in thirty-nine.\"",
      "Draft 1: \"Budget cycle.\" Delivered verbally. Unconvincing.",
      "Draft 2: \"A gap analysis. Where we are, where we need to be, and what it takes to close the difference.\" Accurate. Deleted.",
      "Draft 3: [empty]"
    ],
    fact: { ksa: "V.C.1", t: "A gap analysis identifies the difference between current performance and desired performance. In instructional design it's the heart of the needs assessment: the gap is the reason the training exists." }
  },
  {
    id: "codex_hub_sites", cat: "hub", title: "Site selection", meta: "Hub log · Waystation 4",
    when: c => c.seen("main_act2_why_sites"),
    body: [
      "Criteria for outpost selection: [WITHHELD]",
      "Theo asked. I said \"the rooms that matter.\" Patch pointed out that I said it twice. Repetition is a legitimate teaching technique.",
      "It is not a legitimate answering technique."
    ],
    fact: { ksa: "IV.B", t: "Closed-loop communication: the sender states the message, the receiver repeats it back, and the sender confirms. For example: \"Confirming, manikin heart rate is now 120.\"" }
  },
  {
    id: "codex_hub_target", cat: "hub", title: "Target 2039", meta: "Hub log · Waystation 4",
    when: c => c.flag("war_named"),
    body: [
      "Crew briefed. Reaction within the expected range. Theo asked about the budget cycle. Patch checked a cable that did not need checking.",
      "Standing orders unchanged. When a site is in trouble, the priorities are the same ones every sim tech learns: people first, then the objective, then the equipment."
    ],
    fact: { ksa: "V.C.10", t: "Priority hierarchy during a live simulation: participant and patient safety first, learning objectives second, equipment preservation third." }
  },

  // ===== personnel =====
  {
    id: "codex_person_patch", cat: "personnel", title: "Quintero, Rosa (\"Patch\")", meta: "Personnel file · AV Technician",
    when: c => c.crew("av_tech"),
    body: [
      "Prior: six years as a live-broadcast audio engineer.",
      "Notes: Labels both ends. Distrusts dashboards. Has declined to explain the callsign on fourteen occasions."
    ],
    fact: { ksa: "II.A.2", t: "Condenser microphones need phantom power, +48V DC, usually switched on at the mixer or preamp. A \"dead\" condenser mic is often one nobody gave phantom power." }
  },
  {
    id: "codex_person_theo", cat: "personnel", title: "Lind, Theo", meta: "Personnel file · Moulage & Fidelity Artist",
    when: c => c.crew("moulage_artist"),
    body: [
      "Prior: seasonal haunted-house makeup; regional theater; hospital simulation program (position eliminated).",
      "Kit inventory includes one prosthetic finger, labeled."
    ],
    fact: { ksa: "III.L", t: "Before applying moulage to a manikin, patch-test the product on a hidden spot, then apply a barrier layer (wax or barrier film). Remove it with manufacturer-approved, silicone-safe removers, never acetone." }
  },
  {
    id: "codex_person_marsh", cat: "personnel", title: "Marsh, Iris (external)", meta: "Contact file · Accreditation reviewer",
    when: c => c.marshMeetings >= 1,
    body: [
      "Regional accreditation reviewer. Present in every year on record.",
      "Signs in without being asked. Brandt approves."
    ],
    fact: { ksa: "IV.I", t: "SSH's Accreditation Standards and INACSL's Healthcare Simulation Standards of Best Practice (HSSOBP) are separate documents from separate organizations. Know which one a question is asking about." }
  },

  // ===== site files =====
  {
    id: "codex_site_kessler", cat: "outpost", title: "Fort Kessler Regional Training Center", meta: "Site file",
    when: c => c.visited("kessler"),
    body: [
      "Military-adjacent regional training center. Facility manager: Sgt. (ret.) Dale Brandt. Every change requires a work order, including changes to the work order process.",
      "Maintenance records: excellent, because Brandt."
    ],
    fact: { ksa: "III.A", t: "Preventive maintenance (PM) is scheduled upkeep; corrective maintenance is repair after a failure. Document every repair: most manufacturers want a maintenance record before they'll honor a warranty." }
  },
  {
    id: "codex_site_kessler_mci", cat: "outpost", title: "Kessler mass-casualty wing", meta: "Site file · addendum, 2025",
    when: c => c.seen("brief_kessler_mci"),
    body: [
      "Four zones, a dozen casualties, one control room.",
      "Audio plan (Quintero): one boundary mic per zone into a mixer, so the control room can isolate a single zone or blend all four."
    ],
    fact: { ksa: "II.B.1", t: "A boundary microphone is a small omnidirectional condenser capsule mounted flush on or near a surface. It picks up room-wide ambient audio, which is why it's the usual choice for a sim room. As a condenser, it needs phantom power." }
  },
  {
    id: "codex_site_ridgeline", cat: "outpost", title: "Ridgeline Sim Center", meta: "Site file",
    when: c => c.visited("ridgeline"),
    body: [
      "University sim center. Four ceiling cameras per room. One high-fidelity manikin, unused as of the first visit.",
      "Grad assistant Priya Raman asked what learning objectives were. Has since written several."
    ],
    fact: { ksa: "III.I", t: "Match the type and level of realism to the learning objective. A task trainer that fits the objective can teach a skill better than an expensive manikin used for the wrong one." }
  },
  {
    id: "codex_site_harbor", cat: "outpost", title: "Harbor District Training Annex", meta: "Site file",
    when: c => c.visited("harbor"),
    body: [
      "Community-hospital program. One sim room; the control booth doubles as the supply closet. Nurse educator Marcus Oduya also does the scheduling, runs the tech and mops Bay 2.",
      "Stockouts: frequent, until par levels were set."
    ],
    fact: { ksa: "III.D", t: "PAR level = (average daily usage × lead time) + safety stock. Rotate perishables like IV fluids first in, first out (FIFO)." }
  },
  {
    id: "codex_site_coastal", cat: "outpost", title: "Coastal Med Annex 4", meta: "Site file",
    when: c => c.visited("coastal"),
    body: [
      "Critical-access hospital, twenty beds. Simulation program: June Tallis and one manikin, Gary.",
      "Gary's blood lines are flushed weekly."
    ],
    fact: { ksa: "III.I", t: "Cheap fidelity first: ambient hospital sounds, a cluttered bedside table, an overhead page. Add environmental fidelity before assuming you need new hardware." }
  },

  // ===== SimMed Systems =====
  {
    id: "codex_simmed_pilot", cat: "simmed", title: "Welcome to the Analytics Pilot", meta: "SimMed Systems · letter to Ridgeline, 2022",
    when: c => c.flag("ridgeline_simmed_seen"),
    body: [
      "Congratulations! Your center's readiness is now scored automatically, every session, in real time.",
      "Scores reflect sessions logged, attendance recorded, and evaluation forms submitted on time. Green means ready!"
    ],
    fact: { ksa: "III.B", t: "Utilization rate = actual scheduled hours ÷ total available hours × 100. Roughly 70–85% is healthy. Much above that leaves no buffer for preventive maintenance or staff development." }
  },
  {
    id: "codex_simmed_v22", cat: "simmed", title: "Release notes, v2.2", meta: "SimMed Systems · analytics platform",
    when: c => c.seen("patch_20_dashboard"),
    body: [
      "NEW: Scenario recommendations. SimMed now suggests which scenario your center should run next, based on its history.",
      "Powered by a licensed third-party adaptive engine, optimized for engagement.",
      "FIXED: The dashboard no longer displays readiness above 100%."
    ],
    fact: { ksa: "V.C.3", t: "Formative evaluation is low-stakes feedback during learning. Summative evaluation is high-stakes grading of competency at the end. Know which one a session is before anyone scores it." }
  },
  {
    id: "codex_simmed_v30", cat: "simmed", title: "Release notes, v3.0", meta: "SimMed Systems · analytics platform, 2027",
    when: c => c.seen("patch_70_learning"),
    body: [
      "NEW: Learner risk flags. SimMed now identifies learners \"at risk\" from their session behavior and shares the flags with program leadership.",
      "TIP: Flags work best when learners don't know about them!"
    ],
    fact: { ksa: "IV.K", t: "Psychological safety means learners can make mistakes and be honest in the debrief without fear of punishment. Confidentiality (\"what happens in sim stays in sim\") is part of keeping it." }
  },

  // ===== Marionette =====
  {
    id: "codex_mar_brochure", cat: "marionette", title: "CompliancePro™ brochure", meta: "Marionette Solutions · found at Harbor, 2023",
    when: c => c.flag("harbor_marionette_seen"),
    body: [
      "Accreditation-ready in one afternoon!",
      "Fifty expertly designed slides. One quiz. Instant certificates. No manikins, no mess, no moulage cleanup!",
      "Every learner passes. Every time.*",
      "*Pass rate reflects quiz completion."
    ],
    fact: { ksa: "V.C.2", t: "Learning objectives should be SMART: Specific, Measurable, Achievable, Relevant, Time-bound. The technology has to serve the objective. If the objective is team communication, the audio recording matters more than the manikin's lung sounds." }
  },
  {
    id: "codex_mar_cal", cat: "marionette", title: "Quick follow-up!", meta: "Marionette Solutions · email from Cal",
    when: c => c.flag("cal_met"),
    body: [
      "Hi there! Great meeting you at Harbor. Loved the energy.",
      "Just a thought: every hour your team spends on hands-on simulation is an hour CompliancePro could deliver for a fraction of the cost. That's ROI! Happy to run the numbers anytime.",
      "Coffee's on me. — Cal"
    ],
    fact: { ksa: "IV.A", t: "ROI (return on investment) compares financial benefit to cost. VOI (value on investment) is broader and counts non-financial benefits too, like patient safety and culture." }
  },
  {
    id: "codex_mar_realism", cat: "marionette", title: "Realism Lite™ product sheet", meta: "Marionette Solutions · from Theo's files",
    when: c => c.seen("theo_30_replaced"),
    body: [
      "Why pay a moulage artist? Realism Lite™ adds high-resolution wound photos to every slide.",
      "Studies show learners rate photo slides as \"very realistic.\"*",
      "*Internal survey, n = 12."
    ],
    fact: { ksa: "III.I", t: "Psychological fidelity is whether a scenario evokes the emotional and cognitive experience of the real event, through things like time pressure or a family member in the room, regardless of how high-tech the equipment is." }
  },
  {
    id: "codex_mar_assist", cat: "marionette", title: "You're invited: Marionette Assist", meta: "Marionette Solutions · beta invitation",
    when: c => c.flag("theo_marionette_ai"),
    body: [
      "You've been selected! Marionette Assist is an adaptive AI facilitator that runs, scores and debriefs your simulations. No debriefer required.",
      "Assist learns from every center that uses it. The more you use it, the more it knows. It's already learning about you!",
      "Reply YES to begin."
    ],
    fact: { ksa: "IV.G", t: "Judge new technology by whether it solves a real educational problem, not tech for tech's sake. Pilot-test it for technical stability before full implementation." }
  }
];
