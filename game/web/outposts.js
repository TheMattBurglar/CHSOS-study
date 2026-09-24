// CHSOS Roguelite — outpost content (Phase B, see game/STORY_BIBLE.md §4.4–4.5).
//
// Every deployment now lands at ONE of four recurring outposts in ONE year
// (app.js's pickDeployment()). This file holds what those places say:
//
//   OUTPOSTS -- identity + resident for each site.
//   OUTPOST_BRIEFINGS -- one-time arrival scenes. Hybrid format (decided
//     2026-09-24): if an unseen briefing is eligible when a deployment starts,
//     it plays as a full arrival screen before the map; otherwise the map just
//     shows a one-line banner (outpostStatusLine() in app.js).
//   MARSH_ENCOUNTERS -- Surveyor Iris Marsh at the checkpoint. One-time, the
//     highest-priority eligible one plays; MARSH_FALLBACKS rotate after that.
//   OUTPOST_CALLBACKS -- resident-voiced "outpost reports back" Hub lines.
//   BARKS -- one-line in-run remarks on the map strip.
//
// Time rule (the whole premise, made mechanical): a failed run "snaps back"
// and the timeline drops it, so residents and Marsh only remember SUCCESSFUL
// visits, and only ones in years at or before the current one. A successful
// visit in a LATER year means you've been in their future and they haven't
// met you yet. See outpostContext() / marshContext() in app.js.
//
// Briefing context `c`:
//   c.outpost (id), c.year, c.status ("first" | "met" | "future" | "unrecorded"),
//   c.visits / c.clears / c.fails (all prior visits here, any year),
//   c.seen(id), c.flag(f), c.crew(id)
// Marsh context `m`:
//   m.year, m.meetings (count), m.status ("first" | "met" | "future" | "unrecorded"),
//   m.lastFailed (the most recent meeting was a failed review), m.seenYear(id)
//   (the year an encounter played, or null)
//
// Extra placeholders here: {short} {resident} {refYear} (the year of the
// visit/meeting the status refers to). Same writing rules as story.js.

const OUTPOSTS = {
  kessler: { name: "Fort Kessler Regional Training Center", short: "Fort Kessler", resident: "brandt", residentName: "Brandt" },
  ridgeline: { name: "Ridgeline Sim Center", short: "Ridgeline", resident: "priya", residentName: "Priya" },
  harbor: { name: "Harbor District Training Annex", short: "Harbor", resident: "marcus", residentName: "Marcus" },
  coastal: { name: "Coastal Med Annex 4", short: "Coastal", resident: "june", residentName: "June" }
};
const OUTPOST_ORDER = ["kessler", "ridgeline", "harbor", "coastal"];

Object.assign(SPEAKERS, {
  moulage_artist: { label: "THEO", colorVar: "--domain-III" },
  brandt: { label: "BRANDT", colorVar: "--resident" },
  priya: { label: "PRIYA", colorVar: "--resident" },
  marcus: { label: "MARCUS", colorVar: "--resident" },
  june: { label: "JUNE", colorVar: "--resident" },
  marsh: { label: "MARSH", colorVar: "--surveyor" }
});

// ---------- arrival briefings ----------

const OUTPOST_BRIEFINGS = [

  // ===== any outpost =====
  {
    id: "brief_any_unrecorded", priority: 90,
    when: c => c.status === "unrecorded",
    lines: [
      { setting: "{short}, {year}. Same halls. Nobody looks up when you walk in." },
      { s: "hub", t: "Your last visit here didn't take, so as far as {short} knows, you've never been here. Clean slate. Use it." }
    ]
  },

  // ===== Fort Kessler: Sgt. (ret.) Dale Brandt, facility manager who hates change =====
  {
    id: "brief_kessler_first", outpost: "kessler", priority: 100,
    when: c => c.status === "first",
    lines: [
      { setting: "Fort Kessler Regional Training Center, {year}. Your first posting, technically. Cinderblock, fluorescent lights, a sign-in sheet on a clipboard chained to the desk." },
      { s: "brandt", t: "You're the new tech. Sergeant Dale Brandt, retired. I run this building. Rule one: nothing gets moved without a work order." },
      { s: "hub", t: "He means it. There's a work order on file for moving the work order box." },
      { s: "av_tech", t: "I like him already. Don't tell him." }
    ]
  },
  {
    id: "brief_kessler_future", outpost: "kessler", priority: 80,
    when: c => c.status === "future",
    lines: [
      { setting: "Fort Kessler, {year}. Brandt's hair is darker. He studies your badge like it's a forgery." },
      { s: "brandt", t: "Never seen you before. Who signed your work order?" },
      { s: "hub", t: "You've met him. In {refYear}. He just hasn't gotten there yet. Don't bring it up." }
    ]
  },
  {
    id: "brief_kessler_met", outpost: "kessler", priority: 70,
    when: c => c.status === "met",
    lines: [
      { s: "brandt", t: "The tech from {refYear}. Your cable labels are still on the rack. Nobody's allowed to touch them." },
      { s: "av_tech", t: "Technically those are *my* labels." },
      { s: "brandt", t: "Technically, I don't care." }
    ]
  },
  {
    id: "brief_kessler_maintenance", outpost: "kessler", priority: 50,
    when: c => c.visits >= 2 && c.year <= 2024,
    lines: [
      { s: "brandt", t: "Vendor says the manikin's warranty claim got denied. Something about missing records." },
      { s: "av_tech", t: "Most manufacturers want proof of regular maintenance before they'll honor a warranty. No maintenance log, no claim." },
      { s: "brandt", t: "So you're telling me the paperwork *is* the repair." },
      { s: "hub", t: "He's never been happier to be right." }
    ]
  },
  {
    id: "brief_kessler_mci", outpost: "kessler", priority: 60,
    when: c => c.visits >= 2 && c.year >= 2025,
    lines: [
      { setting: "Fort Kessler, {year}. There's a new wing with a hand-painted sign: REGIONAL MASS-CASUALTY TRAINING." },
      { s: "brandt", t: "Four zones, a dozen casualties, one control room. Command wants it running by spring." },
      { s: "av_tech", t: "Then the control room has to hear all four zones. A boundary mic in each, into a mixer, so you can isolate one zone or blend them." },
      { s: "hub", t: "Build it right. Somebody who trains in that wing is going to need it." }
    ]
  },
  {
    id: "brief_kessler_late_good", outpost: "kessler", priority: 40,
    when: c => c.year >= 2027 && c.clears >= 3 && c.clears > c.fails,
    lines: [
      { s: "brandt", t: "I put in a work order to change the work order process. Approved it myself." },
      { s: "hub", t: "Growth." },
      { s: "brandt", t: "Don't make it a thing." }
    ]
  },
  {
    id: "brief_kessler_late_poor", outpost: "kessler", priority: 40,
    when: c => c.year >= 2027 && c.visits >= 3 && c.fails > c.clears,
    lines: [
      { setting: "Fort Kessler, {year}. The mass-casualty wing is spotless. The equipment still has the shipping film on it." },
      { s: "brandt", t: "We pass every inspection. I couldn't tell you if we'd pass a real bad day." },
      { s: "hub", t: "That's the gap we're here for. Keep coming back." }
    ]
  },

  // ===== Ridgeline: Priya Raman, grad-student sim tech; gadget-rich; SimMed pilot site =====
  {
    id: "brief_ridgeline_first", outpost: "ridgeline", priority: 100,
    when: c => c.status === "first",
    lines: [
      { setting: "Ridgeline Sim Center, {year}. Glass walls, four ceiling cameras per room, and a manikin that costs more than a house." },
      { s: "priya", t: "Hi! Priya Raman, grad assistant. Want to see the new high-fidelity manikin? It blinks, it sweats. We haven't actually used it yet." },
      { s: "hub", t: "Ask her what the learning objectives are." },
      { s: "priya", t: "The... what for it?" }
    ]
  },
  {
    id: "brief_ridgeline_future", outpost: "ridgeline", priority: 80,
    when: c => c.status === "future",
    lines: [
      { s: "priya", t: "Sorry, have we met? You're looking at the manikin like you already know where the fluid reservoir is." },
      { s: "hub", t: "You do. You showed her in {refYear}. For her, that's later." }
    ]
  },
  {
    id: "brief_ridgeline_met", outpost: "ridgeline", priority: 70,
    when: c => c.status === "met",
    lines: [
      { s: "priya", t: "You're back! I wrote the objectives first this time, *then* picked the equipment. The low-fidelity trainer did the job fine." },
      { s: "hub", t: "Objectives, then scenario, then tech. She figured it out faster than most faculty." }
    ]
  },
  {
    id: "brief_ridgeline_simmed", outpost: "ridgeline", priority: 60,
    when: c => c.visits >= 1 && c.year >= 2022,
    sets_flags: ["ridgeline_simmed_seen"],
    lines: [
      { setting: "Every Ridgeline console has a new login screen: SIMMED SYSTEMS — ANALYTICS PILOT SITE." },
      { s: "priya", t: "It scores every session automatically. Green, yellow, red." },
      { s: "av_tech", t: "Scores it on what?" },
      { s: "priya", t: "...Green, yellow, red." },
      { s: "hub", t: "Let's get to work." }
    ]
  },
  {
    id: "brief_ridgeline_late_good", outpost: "ridgeline", priority: 40,
    when: c => c.year >= 2026 && c.clears >= 3 && c.clears > c.fails,
    lines: [
      { s: "priya", t: "They hired me full time. First thing I did was write a debrief guide: plus-delta for the quick ones, GAS for the long ones." },
      { s: "hub", t: "Gather, analyze, summarize. She's going to be fine." }
    ]
  },
  {
    id: "brief_ridgeline_late_poor", outpost: "ridgeline", priority: 40,
    when: c => c.year >= 2026 && c.visits >= 3 && c.fails > c.clears,
    lines: [
      { setting: "Ridgeline, {year}. There's a tour group behind the glass. Nobody's running a scenario." },
      { s: "priya", t: "We're mostly a showroom now. The dashboard says we're ninety-something percent ready." },
      { s: "av_tech", t: "Ninety-something. Sure." }
    ]
  },

  // ===== Harbor: Marcus Oduya, overstretched nurse educator; the Marionette customer =====
  {
    id: "brief_harbor_first", outpost: "harbor", priority: 100,
    when: c => c.status === "first",
    lines: [
      { setting: "Harbor District Training Annex, {year}. One sim room, and a control booth that's also the supply closet." },
      { s: "marcus", t: "Marcus Oduya, nurse educator. Also the scheduler, the tech, and whoever mops Bay 2. What do you need?" },
      { s: "hub", t: "Tell him we're here to help." },
      { s: "marcus", t: "People say that. Then they leave a binder." }
    ]
  },
  {
    id: "brief_harbor_future", outpost: "harbor", priority: 80,
    when: c => c.status === "future",
    lines: [
      { s: "marcus", t: "You're from the agency? I didn't request anybody." },
      { s: "hub", t: "He will. He did. In {refYear}. Leave it." }
    ]
  },
  {
    id: "brief_harbor_met", outpost: "harbor", priority: 70,
    when: c => c.status === "met",
    lines: [
      { s: "marcus", t: "You're back. I kept the par levels you set. Average daily use times lead time, plus a safety stock. First spring we haven't run out of IV bags." },
      { s: "av_tech", t: "And rotate them. First in, first out." },
      { s: "marcus", t: "Yes, Patch." }
    ]
  },
  {
    id: "brief_harbor_marionette", outpost: "harbor", priority: 60,
    when: c => c.visits >= 1 && c.year >= 2023,
    sets_flags: ["harbor_marionette_seen"],
    lines: [
      { setting: "A glossy box sits on the booth desk: MARIONETTE COMPLIANCEPRO™ — ACCREDITATION-READY IN ONE AFTERNOON!" },
      { s: "marcus", t: "Admin bought it. Fifty slides and a quiz. It counts as sim hours." },
      { s: "hub", t: "It counts as hours. It doesn't count as simulation." }
    ]
  },
  {
    id: "brief_harbor_late_good", outpost: "harbor", priority: 40,
    when: c => c.year >= 2026 && c.clears >= 3 && c.clears > c.fails && c.flag("harbor_marionette_seen"),
    lines: [
      { s: "marcus", t: "The Marionette box is holding the door open. We run real scenarios Thursday mornings now. Small ones: a task trainer, one standardized patient." },
      { s: "hub", t: "Small and real beats big and pretend. Every time." }
    ]
  },
  {
    id: "brief_harbor_late_poor", outpost: "harbor", priority: 40,
    when: c => c.year >= 2026 && c.visits >= 3 && c.fails > c.clears && c.flag("harbor_marionette_seen"),
    lines: [
      { setting: "Harbor, {year}. The sim room door is propped open. The manikin is under a sheet." },
      { s: "marcus", t: "Everyone passes the Marionette quiz. Nobody here has run a real mock code in two years." },
      { s: "hub", t: "Then we come back until somebody does." }
    ]
  },

  // ===== Coastal: June Tallis, does everything, owns one manikin =====
  {
    id: "brief_coastal_first", outpost: "coastal", priority: 100,
    when: c => c.status === "first",
    lines: [
      { setting: "Coastal Med Annex 4, {year}. A critical-access hospital: twenty beds, and a long drive to anywhere bigger." },
      { s: "june", t: "June Tallis. Educator, sim tech, and the person who fixes the copier. That's Gary." },
      { setting: "She points at a manikin in a wheelchair." },
      { s: "june", t: "Gary is our whole program." },
      { s: "hub", t: "Low budget isn't low fidelity. Fidelity is whether the learner believes it, not what the manikin cost." }
    ]
  },
  {
    id: "brief_coastal_future", outpost: "coastal", priority: 80,
    when: c => c.status === "future",
    lines: [
      { s: "june", t: "You've got the look of someone who's about to tell me Gary needs a new chest skin." },
      { s: "hub", t: "You did tell her that. In {refYear}. She was right to budget for it." }
    ]
  },
  {
    id: "brief_coastal_met", outpost: "coastal", priority: 70,
    when: c => c.status === "met",
    lines: [
      { s: "june", t: "Gary says hi. I've been flushing his blood lines every week like you said. No more mold." },
      { s: "av_tech", t: "Gary's in better shape than half the manikins at Ridgeline." }
    ]
  },
  {
    id: "brief_coastal_moulage", outpost: "coastal", priority: 60,
    when: c => c.visits >= 1 && c.crew("moulage_artist"),
    lines: [
      { s: "june", t: "Gary's left ankle is permanently purple. Stage blood." },
      { s: "moulage_artist", t: "Patch test on a hidden spot first, then a barrier layer before anything goes on the skin. Some dyes never come out, and a stained skin can void the warranty." },
      { s: "june", t: "Where were you three years ago?" },
      { s: "moulage_artist", t: "Somewhere with a much worse manikin." }
    ]
  },
  {
    id: "brief_coastal_late_good", outpost: "coastal", priority: 40,
    when: c => c.year >= 2026 && c.clears >= 3 && c.clears > c.fails,
    lines: [
      { s: "june", t: "Three other hospitals send their nurses here to train now. For Gary." },
      { s: "hub", t: "For you." },
      { s: "june", t: "For Gary." }
    ]
  },
  {
    id: "brief_coastal_late_poor", outpost: "coastal", priority: 40,
    when: c => c.year >= 2026 && c.visits >= 3 && c.fails > c.clears,
    lines: [
      { s: "june", t: "Gary's chest cracked in the cold snap. The budget says next year. It said that last year." },
      { s: "hub", t: "Let's make this year one worth budgeting for." }
    ]
  }
];

// ---------- Surveyor Iris Marsh (the checkpoint) ----------
//
// `intro` plays at the top of checkpoint stage 1; `pass`/`fail` replace the
// generic review-result text. Missing pass/fail falls back to MARSH_RESULTS.
// The two *_payoff encounters are the out-of-order bootstrap loops: the setup
// is Marsh in a later year quoting something Trigger said "years ago"; the
// payoff is an earlier year where Hub feeds Trigger that exact line.

const MARSH_ENCOUNTERS = [
  {
    id: "marsh_jumpsuit_payoff", priority: 100,
    when: m => m.seenYear("marsh_jumpsuit_setup") != null && m.year < m.seenYear("marsh_jumpsuit_setup"),
    intro: [
      { s: "marsh", t: "Before we start. What is that you're wearing?" },
      { s: "hub", t: "Tell her you'll explain eventually." },
      { setting: "You tell her you'll explain eventually. She writes it down." },
      { s: "hub", t: "Oh. *That's* what she meant." }
    ]
  },
  {
    id: "marsh_labels_payoff", priority: 100,
    when: m => m.seenYear("marsh_labels_setup") != null && m.year < m.seenYear("marsh_labels_setup"),
    intro: [
      { s: "marsh", t: "Anything I should look at that isn't on my list?" },
      { s: "hub", t: "Tell her to check the crash cart. Every vial should say 'for simulation use only.'" },
      { setting: "She looks at you for a long second, then writes it down." },
      { s: "hub", t: "So that's how she knew to look. Huh." }
    ]
  },
  {
    id: "marsh_first", priority: 95,
    when: m => m.meetings === 0,
    intro: [
      { setting: "A woman with a clipboard is standing in the doorway. Her badge reads I. MARSH — ACCREDITATION SURVEYOR." },
      { s: "marsh", t: "Two questions. Answer the one I ask, not the one you wish I'd asked." }
    ],
    pass: [
      { s: "marsh", t: "Hm. Fine." },
      { s: "hub", t: "'Fine.' From her, that's a parade." }
    ],
    fail: [
      { s: "marsh", t: "I'm noting that." }
    ]
  },
  {
    id: "marsh_future", priority: 80,
    when: m => m.status === "future",
    intro: [
      { s: "marsh", t: "Have we met? You're looking at me like we've met." },
      { s: "hub", t: "You have, in {refYear}. She hasn't. Don't tell her. She hates surprises." }
    ]
  },
  {
    id: "marsh_after_snap", priority: 70,
    when: m => m.meetings >= 1 && m.lastFailed,
    intro: [
      { s: "marsh", t: "Strange. I have the feeling I've already flagged you once." },
      { s: "hub", t: "She hasn't. That version didn't take. Some things leave a mark anyway." }
    ]
  },
  {
    id: "marsh_jumpsuit_setup", priority: 60,
    when: m => m.status === "met" && m.year >= 2025,
    intro: [
      { s: "marsh", t: "Years ago you told me you'd explain the jumpsuit eventually. It's {year}. I'm still waiting." },
      { s: "hub", t: "I don't remember you saying that." },
      { s: "marsh", t: "Two questions. Then the jumpsuit." }
    ]
  },
  {
    id: "marsh_labels_setup", priority: 60,
    when: m => m.status === "met" && m.year >= 2024,
    intro: [
      { s: "marsh", t: "Years ago you told me to check that every vial on a crash cart is labeled 'for simulation use only.' I started checking. Last spring I found one that wasn't. It was real epinephrine." },
      { s: "marsh", t: "So. Thank you. I suppose." },
      { s: "hub", t: "When did you tell her that?" }
    ]
  },
  {
    id: "marsh_show_work", priority: 50,
    when: m => m.meetings >= 2,
    intro: [
      { s: "marsh", t: "People think accreditation is about the building. It isn't. It's whether the program can show its work: objectives, evaluation, improvement. Show me yours." }
    ]
  },
  {
    id: "marsh_listening", priority: 40,
    when: m => m.meetings >= 3,
    intro: [
      { s: "marsh", t: "You tilt your head when you're listening to someone who isn't in the room." },
      { s: "hub", t: "...I'm going to be quiet for a bit." }
    ]
  },
  {
    id: "marsh_off_record", priority: 40,
    when: m => m.meetings >= 4 && m.status === "met",
    intro: [
      { s: "marsh", t: "Off the record: most sites, I'm checking boxes. Yours, I'm actually checking." }
    ],
    pass: [
      { s: "marsh", t: "Still off the record: that was good." }
    ]
  }
];

// Once the one-time encounters are used up (or none is eligible).
const MARSH_FALLBACKS = [
  [{ s: "marsh", t: "Two questions. You know the drill." }],
  [{ setting: "Surveyor Marsh clicks her pen twice. That's the whole greeting." }],
  [{ s: "marsh", t: "{short}, {year}. Let's see it." }]
];

const MARSH_RESULTS = {
  pass: [
    [{ s: "marsh", t: "Signed. No notes." }],
    [{ s: "marsh", t: "No notes. Don't get used to it." }],
    [{ setting: "Marsh signs the form without comment. That's the highest praise this job hands out." }]
  ],
  fail: [
    [{ s: "marsh", t: "That's going in the report." }],
    [{ setting: "Marsh makes a note. It won't end the program, but it won't be forgotten either." }],
    [{ s: "marsh", t: "Come back when you've looked that up." }]
  ]
};

// ---------- resident-voiced callbacks ("outpost reports back") ----------
//
// Replaces build_nodes.py's 8 generic CALLBACK_TEMPLATES at delivery time: a
// node still decides WHETHER a callback queues (and when it's due), but the
// words now come from the resident of the outpost the run was at. Only runs
// that pass their review keep their callbacks (the time rule above): a
// snapped-back visit never happened, so nobody there can report on it. Picked
// least-recently-used per outpost and outcome. {year} is the run's year.

const OUTPOST_CALLBACKS = {
  kessler: {
    success: [
      { id: "cb_kessler_s1", t: "Brandt here. Whatever you did in {year} is still holding. I put a work order on it so nobody touches it." },
      { id: "cb_kessler_s2", t: "Brandt. Inspection came through. No notes on your item. I'd take the credit, but my work orders are honest." },
      { id: "cb_kessler_s3", t: "Brandt. New hire asked who set things up that way. I told them: somebody who read the manual." }
    ],
    fail: [
      { id: "cb_kessler_f1", t: "Brandt. The item from {year} failed again. I have a work order for it. I have three work orders for it." },
      { id: "cb_kessler_f2", t: "Brandt. We patched your fix. With tape. I'm not proud of it." },
      { id: "cb_kessler_f3", t: "Brandt. Vendor came out twice for the same problem. The invoice is on your desk. You don't have a desk. It's on mine." }
    ]
  },
  ridgeline: {
    success: [
      { id: "cb_ridgeline_s1", t: "Priya! The thing you showed me in {year} is in the orientation deck now. Slide four." },
      { id: "cb_ridgeline_s2", t: "Priya again. The dashboard flagged a session red, but the debrief was the best one we've had all term. I'm trusting the debrief." },
      { id: "cb_ridgeline_s3", t: "Priya. Faculty keep asking for 'the setup Trigger did.' It's on a laminated card now." }
    ],
    fail: [
      { id: "cb_ridgeline_f1", t: "Priya. Um. The fix didn't hold. I think we skipped a step. Maybe two." },
      { id: "cb_ridgeline_f2", t: "Priya. The dashboard still says green. It is not green." },
      { id: "cb_ridgeline_f3", t: "Priya. Faculty went back to doing it the old way. I'm working on them." }
    ]
  },
  harbor: {
    success: [
      { id: "cb_harbor_s1", t: "Marcus. It's holding. First thing this year that has." },
      { id: "cb_harbor_s2", t: "Marcus. Ran a scenario Thursday on what you set up. Nobody had to stop and fix anything mid-session. That's never happened." },
      { id: "cb_harbor_s3", t: "Marcus. Admin asked what changed. I said somebody helped. They didn't follow up." }
    ],
    fail: [
      { id: "cb_harbor_f1", t: "Marcus. Same problem, back again. I'm working around it. I'm always working around it." },
      { id: "cb_harbor_f2", t: "Marcus. Admin says a Marionette module could 'cover' that gap. I'm stalling them." },
      { id: "cb_harbor_f3", t: "Marcus. It broke in the middle of a class. The students thought it was part of the scenario. It wasn't." }
    ]
  },
  coastal: {
    success: [
      { id: "cb_coastal_s1", t: "June. Gary's doing great. Your fix held through the whole winter." },
      { id: "cb_coastal_s2", t: "June. Taught the night nurses what you showed me, on Gary. They've got it now." },
      { id: "cb_coastal_s3", t: "June. It held up for the regional inspection. Gary wore his good gown." }
    ],
    fail: [
      { id: "cb_coastal_f1", t: "June. It failed again. Gary and I improvised. Improvising's fine until it isn't." },
      { id: "cb_coastal_f2", t: "June. Had to cancel Tuesday's session. The budget says we can fix it next quarter." },
      { id: "cb_coastal_f3", t: "June. The fix slipped. I've got a workaround and some zip ties. Mostly zip ties." }
    ]
  }
};

// ---------- in-run barks (STORY_BIBLE.md §7, layer 1) ----------
//
// One line on the map strip at a time. `on` is the event (see barkEvent() in
// app.js); `outpost` limits a bark to one site; `crew` requires that crew
// member on the roster; `when(b)` gets { year, resources }. Least-recently
// used wins, so the pool cycles before anything repeats.

const BARKS = [
  // -- arriving --
  { id: "bark_arrive_hub_rules", on: "arrive", line: { s: "hub", t: "{short}, {year}. Same rules as always: fix what's broken, don't break what isn't." } },
  { id: "bark_arrive_wifi", on: "arrive", line: { s: "av_tech", t: "I'll walk the building with a phone. There's always a Wi-Fi dead zone." } },
  { id: "bark_arrive_leap", on: "arrive", line: { s: "hub", t: "Leap's stable. You've got until the surveyor shows up." } },
  { id: "bark_arrive_theo", on: "arrive", crew: "moulage_artist", line: { s: "moulage_artist", t: "Point me at their moulage kit. I want to see what they've been doing to these manikins." } },
  { id: "bark_arrive_brandt_a", on: "arrive", outpost: "kessler", line: { s: "brandt", t: "Sign in. Then sign the other sheet. Then I'll tell you where the coffee is." } },
  { id: "bark_arrive_brandt_b", on: "arrive", outpost: "kessler", when: b => b.year >= 2025, line: { s: "brandt", t: "The mass-casualty wing is off-limits without a work order. Yes, even for you." } },
  { id: "bark_arrive_priya_a", on: "arrive", outpost: "ridgeline", line: { s: "priya", t: "Oh good, you're here. The new camera system won't talk to the recorder." } },
  { id: "bark_arrive_priya_b", on: "arrive", outpost: "ridgeline", line: { s: "priya", t: "Somebody unplugged a ceiling mic to charge their phone. Again." } },
  { id: "bark_arrive_marcus_a", on: "arrive", outpost: "harbor", line: { s: "marcus", t: "Bay 2 is yours until noon. After that it's a flu clinic." } },
  { id: "bark_arrive_marcus_b", on: "arrive", outpost: "harbor", line: { s: "marcus", t: "Supplies are in the booth. If they're not in the booth, we don't have them." } },
  { id: "bark_arrive_june_a", on: "arrive", outpost: "coastal", line: { s: "june", t: "Gary's warmed up and ready. Please don't break Gary." } },
  { id: "bark_arrive_june_b", on: "arrive", outpost: "coastal", line: { s: "june", t: "The generator tests Thursdays and the lights flicker. Save your work." } },

  // -- after a miss --
  { id: "bark_miss_hub_a", on: "miss", line: { s: "hub", t: "Missed that one. Note it and keep moving. It'll be back." } },
  { id: "bark_miss_patch", on: "miss", line: { s: "av_tech", t: "Happens. Figure out what you'd do differently. That's a debrief, not a confession." } },
  { id: "bark_miss_hub_b", on: "miss", line: { s: "hub", t: "That's a gap, not a verdict." } },
  { id: "bark_miss_theo", on: "miss", crew: "moulage_artist", line: { s: "moulage_artist", t: "Wrong call. Better here than in front of learners." } },

  // -- after a clean node --
  { id: "bark_ok_hub", on: "ok", line: { s: "hub", t: "Good. Next." } },
  { id: "bark_ok_patch", on: "ok", line: { s: "av_tech", t: "Clean. I'd have taken longer and complained more." } },
  { id: "bark_ok_brandt", on: "ok", outpost: "kessler", line: { s: "brandt", t: "Huh. It works now. Put in a work order so it stays working." } },
  { id: "bark_ok_priya", on: "ok", outpost: "ridgeline", line: { s: "priya", t: "Wait, can you do that again slower? I'm going to teach that." } },
  { id: "bark_ok_marcus", on: "ok", outpost: "harbor", line: { s: "marcus", t: "That's going on the whiteboard." } },
  { id: "bark_ok_june", on: "ok", outpost: "coastal", line: { s: "june", t: "Gary approves." } },

  // -- resources running low (each fires at most once per run) --
  { id: "bark_low_integrity_a", on: "low_integrity", line: { s: "av_tech", t: "Gear's in rough shape. If anything else breaks, we're fixing it live." } },
  { id: "bark_low_integrity_b", on: "low_integrity", line: { s: "hub", t: "Equipment integrity's low. A rest stop wouldn't hurt." } },
  { id: "bark_low_morale_a", on: "low_morale", line: { s: "hub", t: "Crew's running on fumes. Pace yourself." } },
  { id: "bark_low_morale_b", on: "low_morale", line: { s: "av_tech", t: "I'm fine. I'm fine. I would like a nap." } },
  { id: "bark_low_budget", on: "low_budget", line: { s: "hub", t: "Budget's thin. Spend what's left like it's the last of it. It is." } },

  // -- after a rest stop --
  { id: "bark_rest_patch", on: "rest", line: { s: "av_tech", t: "Better. I re-coiled every cable in the building while you were out. Over-under." } },
  { id: "bark_rest_hub", on: "rest", line: { s: "hub", t: "A rested crew makes fewer mistakes. That's not sentiment, that's safety." } },

  // -- the checkpoint is next --
  { id: "bark_checkpoint_hub", on: "checkpoint", line: { s: "hub", t: "Surveyor's on site. Last stretch." } },
  { id: "bark_checkpoint_patch", on: "checkpoint", line: { s: "av_tech", t: "Marsh is here. Stand up straight." } },
  { id: "bark_checkpoint_brandt", on: "checkpoint", outpost: "kessler", line: { s: "brandt", t: "Surveyor's in the lobby. She signed both sheets without being asked. I like her." } },
  { id: "bark_checkpoint_priya", on: "checkpoint", outpost: "ridgeline", line: { s: "priya", t: "The surveyor's here! Should I move the tour group?" } },
  { id: "bark_checkpoint_marcus", on: "checkpoint", outpost: "harbor", line: { s: "marcus", t: "Surveyor's early. Of course she's early." } },
  { id: "bark_checkpoint_june", on: "checkpoint", outpost: "coastal", line: { s: "june", t: "The surveyor drove two hours to get here. Let's make it worth the drive." } }
];
