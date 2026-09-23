// CHSOS Roguelite — story content (Phase A, see game/STORY_BIBLE.md §7).
//
// Everything the Waystation 4 conversation panel can say lives here as data;
// app.js's story engine only decides *which* of it plays. Two kinds of entry:
//
//   STORY_REACTIONS -- short lines about the run that just ended. One plays on
//     every return, picked from the highest-priority eligible group, unseen
//     variants first. This is the "the house has something to say about how
//     you died" layer.
//   STORY_SCENES -- one-time beats (main thread, projection, crew arcs,
//     ambient). At most one plays per return, after the reaction, in layer
//     order main > character > ambient (promotions and outpost callbacks slot
//     in between; see composeHubConversation() in app.js).
//
// Line shapes:
//   { s: "hub" | "av_tech" | "trigger", t: "text with {placeholders}" }
//   { setting: "stage direction" }
//   { choice: { wry: {t, reply: [lines]}, earnest: {...}, by_the_book: {...} } }
//     -- the tone dial. Flavor only: never a right answer, never scored.
//
// Placeholders: {site} {year} {topic} {budget} {projection} {rank}. Anything a scene
// needs beyond that goes in its `when(ctx)` predicate, not in the text.
//
// Writing rules (STORY_BIBLE.md §8): Trigger has no gendered pronouns; every
// technical claim must be real Sim Ops practice (these lines are study
// material too); keep lines short.

const SPEAKERS = {
  hub: { label: "HUB", colorVar: "--text" },
  av_tech: { label: "PATCH", colorVar: "--domain-II" },
  trigger: { label: "TRIGGER", colorVar: "--muted" }
};

const TONE_LABELS = { wry: "WRY", earnest: "EARNEST", by_the_book: "BY THE BOOK" };

// Projection beats fire every half-year of progress. Measured pace (Node
// harness, 2026-09-23): ~0.5 projected months per run at 75% accuracy, so a
// half-year step is roughly every 10-20 runs -- crew beats fill the gaps.
const PROJECTION_START_YEAR = 2044;
const PROJECTION_END_YEAR = 2039;

// ---------- reactions: one per return ----------

const STORY_REACTIONS = [
  // -- firsts --
  {
    id: "react_first_return", priority: 100,
    when: c => c.last && c.profile.story.returns === 1,
    lines: [
      { setting: "The leap lets go all at once. Waystation 4 comes back into focus: consoles, a road case, a coffee maker that has never been cleaned." },
      { s: "hub", t: "Welcome back. First leap's always the weird one. Your inner ear still thinks it's {year}." },
      { s: "av_tech", t: "Sit down before you try to walk anywhere. Trust me." }
    ]
  },
  {
    id: "react_first_clear", priority: 90,
    when: c => c.last && c.last.success && !c.flag("first_clear_seen"),
    sets_flags: ["first_clear_seen"],
    lines: [
      { s: "hub", t: "{site} passed its review. Your first one. The surveyor even smiled, which I'm told is not in the accreditation standards." },
      { s: "av_tech", t: "Frame the report. Nobody else will." }
    ]
  },

  // -- the projection slipped (it can move backwards, locked 2026-09-23) --
  {
    id: "react_projection_slip_a", group: "slip", priority: 80,
    when: c => c.projectionDeltaMonths >= 1,
    lines: [
      { s: "hub", t: "Projection slid back a little, to {projection}. That's fine. That's what it looks like when something you thought you had turns out to need another pass." },
      { s: "hub", t: "It'll come back around. That's the point." }
    ]
  },
  {
    id: "react_projection_slip_b", group: "slip", priority: 80,
    when: c => c.projectionDeltaMonths >= 1,
    lines: [
      { s: "av_tech", t: "Your number went the wrong way." },
      { s: "hub", t: "Numbers do that. It's {projection} now. A miss you learn from is worth more than a guess that happened to land." }
    ]
  },

  // -- checkpoint failed: the leap snaps back --
  {
    id: "react_fail_topic", group: "fail_topic", priority: 60,
    when: c => c.last && !c.last.success && c.last.checkpoint_topic,
    lines: [
      { setting: "The leap snaps back. For a second the Waystation smells like the {site} control room." },
      { s: "hub", t: "The surveyor at {site} asked about {topic} and the room went quiet. The timeline didn't keep that version. Nothing went on the record." },
      { s: "av_tech", t: "I'd have gone quiet too. Then I'd have looked it up. Just saying." }
    ]
  },
  {
    id: "react_fail_topic_b", group: "fail_topic", priority: 60,
    when: c => c.last && !c.last.success && c.last.checkpoint_topic,
    lines: [
      { setting: "The leap snaps back." },
      { s: "hub", t: "The surveyor's question at {site} was on {topic}. That's the one that got away. Next time it won't be a surprise." }
    ]
  },
  {
    id: "react_fail_topic_c", group: "fail_topic", priority: 60,
    when: c => c.last && !c.last.success && c.last.checkpoint_topic,
    lines: [
      { setting: "The leap snaps back. Patch doesn't look up from the cable she's coiling." },
      { s: "av_tech", t: "Surveyor hit you with {topic}, huh." },
      { s: "hub", t: "Which means we now know exactly what to study. That's not a failure. That's reconnaissance." }
    ]
  },
  {
    id: "react_fail_a", group: "fail", priority: 50,
    when: c => c.last && !c.last.success,
    lines: [
      { setting: "The leap snaps back." },
      { s: "hub", t: "Well. {site} will have to wait for a better version of that visit. The good news about time travel: it's still there." }
    ]
  },
  {
    id: "react_fail_b", group: "fail", priority: 50,
    when: c => c.last && !c.last.success,
    lines: [
      { setting: "The leap snaps back. Patch is already holding out a bottle of water." },
      { s: "av_tech", t: "Checkpoints are rough. Drink that." },
      { s: "hub", t: "For the record, there is no record. That's the one perk of the job." }
    ]
  },
  {
    id: "react_fail_c", group: "fail", priority: 50,
    when: c => c.last && !c.last.success,
    lines: [
      { setting: "The leap snaps back." },
      { s: "hub", t: "The review at {site} didn't go our way. We'll be back, and we'll know what they're going to ask. That's not cheating. That's a debrief." }
    ]
  },

  // -- what went wrong along the way (successful or not) --
  {
    id: "react_topic_repeat", group: "topic", priority: 58,
    when: c => c.last && c.last.top_missed_topic,
    lines: [
      { s: "hub", t: "More than one miss on {topic} this rotation. Don't sweat it. That one's going to come back around. It's supposed to." }
    ]
  },
  {
    id: "react_scraped_by", group: "scraped", priority: 57,
    when: c => c.last && c.last.success && c.last.end_integrity <= 25,
    lines: [
      { s: "hub", t: "{site} passed. The gear you left behind is held together by gaff tape and optimism." },
      { s: "av_tech", t: "Mostly gaff tape. My gaff tape." }
    ]
  },
  {
    id: "react_intel_misses", group: "category", priority: 54,
    when: c => c.last && c.last.misses_by_type.intel >= 2,
    lines: [
      { s: "hub", t: "A couple of the terms got away from you out there. Vocabulary's the cheapest thing to fix, and the most embarrassing thing to get wrong in front of faculty." }
    ]
  },
  {
    id: "react_diagnostic_misses", group: "category", priority: 54,
    when: c => c.last && c.last.misses_by_type.diagnostic >= 2,
    lines: [
      { s: "av_tech", t: "The repair calls got you this time. Here's the trick: identify the problem, make a theory, test the theory. Don't start swapping parts before you've got a theory." },
      { s: "hub", t: "She says that like she's never swapped a part on a hunch." },
      { s: "av_tech", t: "I document it when I do." }
    ]
  },
  {
    id: "react_scenario_misses", group: "category", priority: 54,
    when: c => c.last && c.last.misses_by_type.scenario >= 2,
    lines: [
      { s: "hub", t: "The judgment calls were rough this time. Everybody in those rooms had a reason to cut the corner. The job is noticing that the reason isn't a good one." }
    ]
  },
  {
    id: "react_low_morale", group: "morale", priority: 52,
    when: c => c.last && c.last.success && c.last.end_morale <= 30,
    lines: [
      { s: "hub", t: "You got it done. The crew looks like they ran a mass-casualty drill twice, back to back." },
      { s: "av_tech", t: "We did not sign up for back to back." }
    ]
  },
  {
    id: "react_broke", group: "budget", priority: 52,
    when: c => c.last && c.last.end_budget <= 20,
    lines: [
      { s: "hub", t: "You came back with {budget} credits. I'd like to formally introduce you to the concept of a line item." }
    ]
  },
  {
    id: "react_projection_gain", group: "gain", priority: 56,
    when: c => c.projectionDeltaMonths <= -2,
    lines: [
      { s: "hub", t: "Projection moved up to {projection}. That's what it looks like when things actually stick." }
    ]
  },

  // -- clean runs --
  {
    id: "react_clean_a", group: "clean", priority: 55,
    when: c => c.last && c.last.success && c.last.misses === 0,
    lines: [
      { s: "hub", t: "Not a single miss. {site} won't even know how close it came to a bad year." },
      { s: "av_tech", t: "Don't get cocky. The next one's got a Wi-Fi dead zone. They always do." }
    ]
  },
  {
    id: "react_clean_b", group: "clean", priority: 55,
    when: c => c.last && c.last.success && c.last.misses === 0,
    lines: [
      { s: "hub", t: "Clean rotation. I'm logging it, which is the highest compliment an AI can give." }
    ]
  },
  {
    id: "react_clean_c", group: "clean", priority: 55,
    when: c => c.last && c.last.success && c.last.misses === 0,
    lines: [
      { s: "av_tech", t: "Every call at {site}, first try. Who trained you?" },
      { s: "hub", t: "Me." },
      { s: "av_tech", t: "I was asking Trigger." }
    ]
  },

  // -- fallbacks --
  {
    id: "react_success_a", group: "success", priority: 10,
    when: c => c.last && c.last.success,
    lines: [
      { s: "hub", t: "{site} passes review. Whatever happens there later, it won't be because nobody tried." }
    ]
  },
  {
    id: "react_success_b", group: "success", priority: 10,
    when: c => c.last && c.last.success,
    lines: [
      { s: "hub", t: "Deployment logged. {site}, {year}, handled." },
      { s: "av_tech", t: "Mostly handled. I left them a labeled cable diagram. They'll ignore it." }
    ]
  },
  {
    id: "react_success_c", group: "success", priority: 10,
    when: c => c.last && c.last.success,
    lines: [
      { s: "hub", t: "Good work at {site}. A few years from now, somebody there runs a scenario that actually works because of what you fixed. They'll never know your name." },
      { s: "hub", t: "That's the job. I think it's a good one." }
    ]
  },
  {
    id: "react_idle", group: "idle", priority: 0,
    when: c => !c.last && c.profile.story.returns > 0,
    lines: [
      { s: "hub", t: "Waystation 4, standing by. Pick a window when you're ready." }
    ]
  }
];

// ---------- scenes: at most one per return ----------

const STORY_SCENES = [

  // ===== main: first visit + readiness projection =====

  {
    id: "main_first_visit", layer: "main", priority: 100,
    when: c => c.profile.story.returns === 0,
    lines: [
      { setting: "Waystation 4 has no windows, no clock and no weather. There's a console, a coffee maker and a road case with a person sitting on it." },
      { s: "hub", t: "First rotation. Try not to disappear on me. The paperwork's a nightmare when a Junior Tech goes missing mid-leap." },
      { s: "hub", t: "The window for your first deployment is up on the board. Go when you're ready. I'll be in your ear the whole time." }
    ]
  },
  {
    id: "main_projection_intro", layer: "main", priority: 90,
    when: c => c.profile.story.returns >= 1,
    lines: [
      { setting: "A new readout has appeared at the top of the Waystation console: PROGRAM READINESS PROJECTION." },
      { s: "hub", t: "See that date? That's when the program will be where it needs to be, if nothing changes. Right now it says {projection}." },
      { s: "hub", t: "Every site you fix, every thing you actually learn and keep, it moves earlier. Things you forget, it moves back. It's honest like that." },
      { choice: {
        wry: { t: "And what happens in 2044?", reply: [{ s: "hub", t: "Nothing, if we do our jobs. That's the idea." }] },
        earnest: { t: "So earlier is better.", reply: [{ s: "hub", t: "Earlier is everything." }] },
        by_the_book: { t: "What's the target date?", reply: [{ s: "hub", t: "Earlier than that." }, { s: "av_tech", t: "Answers without answering. Classic Hub." }] }
      } }
    ]
  },
  {
    id: "main_projection_2043_5", layer: "main", priority: 80,
    when: c => c.projectionYear <= 2043.5,
    lines: [
      { s: "hub", t: "Projection just crossed into mid-2043. Half a year earlier than when you started." },
      { s: "av_tech", t: "Half a year of what, exactly?" },
      { s: "hub", t: "Of people who know what they're doing, being in the rooms where it matters, sooner." },
      { choice: {
        wry: { t: "Six months. Throw a party?", reply: [{ s: "hub", t: "I'll order a cake. Moulage cake. It looks like a compound fracture but it's red velvet." }] },
        earnest: { t: "It's actually moving. That feels good.", reply: [{ s: "hub", t: "It should. That's your work on the board, not mine." }] },
        by_the_book: { t: "What's the margin of error on that?", reply: [{ s: "hub", t: "Smaller every time you get something right twice." }] }
      } }
    ]
  },
  {
    id: "main_projection_2043", layer: "main", priority: 80,
    when: c => c.projectionYear <= 2043.0,
    sets_flags: ["hub_slipped_2039"],
    lines: [
      { s: "hub", t: "A full year. The projection's at {projection}. At this rate we'd make thirty-nine with—" },
      { setting: "Hub stops. It's the first time you've heard it stop mid-sentence." },
      { s: "hub", t: "With room to spare. On the schedule. Good work, Trigger." },
      { s: "av_tech", t: "What's in thirty-nine?" },
      { s: "hub", t: "Budget cycle." },
      { choice: {
        wry: { t: "Must be one heck of a budget cycle.", reply: [{ s: "hub", t: "You have no idea." }] },
        earnest: { t: "Hub. What happens in 2039?", reply: [{ s: "hub", t: "Ask me again when the projection's lower. I mean that. I'm not dodging. I'm scheduling." }] },
        by_the_book: { t: "Noted: target year 2039.", reply: [{ s: "hub", t: "Don't write that down." }, { s: "av_tech", t: "Wrote it down." }] }
      } }
    ]
  },
  {
    id: "main_projection_2042_5", layer: "main", priority: 80,
    when: c => c.projectionYear <= 2042.5,
    lines: [
      { s: "hub", t: "{projection}. A year and a half earlier than when you walked in." },
      { s: "hub", t: "I ran it with just the tech side, AV, networks, troubleshooting, and it tops out around late 2041. You can't close the whole gap from the control room. Nobody can." },
      { s: "av_tech", t: "Rude. True, but rude." },
      { s: "hub", t: "That's why there are more people on the roster than there are chairs in here." }
    ]
  },
  {
    id: "main_projection_2042", layer: "main", priority: 80,
    when: c => c.projectionYear <= 2042.0,
    lines: [
      { s: "hub", t: "Two years. {projection}." },
      { setting: "Hub doesn't make a joke. It lets the number sit on the screen for a while." },
      { s: "hub", t: "Thank you. I don't say that enough." }
    ]
  },

  // ===== character: Rosa "Patch" Quintero, AV Technician (Domain II) =====
  // Rapport = Domain II mastery (STORY_BIBLE.md §4.2). One beat per return,
  // in order. Mystery thread: the SimMed analytics dashboard at every site.

  {
    id: "patch_00_intro", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.profile.story.returns >= 1,
    lines: [
      { setting: "Patch is sitting on the road case, coiling an XLR cable over-under: one loop forward, the next one flipped." },
      { s: "av_tech", t: "Didn't get a real hello before your first leap. Rosa Quintero. Everybody calls me Patch, and no, I don't explain that on the first day." },
      { s: "av_tech", t: "Rule one: if it's got a cable, it's my problem. Rule two: if Hub says it's fine, check the cable anyway." },
      { s: "hub", t: "I'm right here." },
      { choice: {
        wry: { t: "Does Hub know about rule two?", reply: [{ s: "hub", t: "I do. I'd like it noted that I'm hurt." }, { s: "av_tech", t: "Noted. Check the cable." }] },
        earnest: { t: "Glad you're here. I'll check the cable.", reply: [{ s: "av_tech", t: "And coil it over-under when you're done. No kinks, lies flat, unrolls clean. I'll know if you don't." }] },
        by_the_book: { t: "Is there a written procedure for this?", reply: [{ s: "av_tech", t: "There will be. You're going to help me write it. One-page troubleshooting guide, taped to the control room wall, every site." }] }
      } }
    ]
  },
  {
    id: "patch_10_gain", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 10,
    lines: [
      { setting: "Patch has a small mixer open on the bench, every fader pulled all the way down." },
      { s: "av_tech", t: "Audio chain, quick version: mic, preamp, mixer, recorder. Get the gain wrong at the first stage and nothing downstream can save you." },
      { s: "av_tech", t: "Too hot, it clips. Too low, you're recording the noise floor. Half the debrief videos I've ever heard are one or the other. People always blame the mic." },
      { choice: {
        wry: { t: "So the mic is innocent.", reply: [{ s: "av_tech", t: "The mic's almost always innocent. The condenser nobody gave phantom power to? Also innocent. Forty-eight volts. Look for the button." }] },
        earnest: { t: "How do you know where to set it?", reply: [{ s: "av_tech", t: "Set it for the loudest thing that'll happen in the room, someone yelling for the crash cart, so it peaks just under clipping. Not for the whisper." }] },
        by_the_book: { t: "We should document gain settings per room.", reply: [{ s: "av_tech", t: "Now you're talking. The next tech shouldn't have to guess." }] }
      } }
    ]
  },
  {
    id: "patch_15_bowel", layer: "character", priority: 45,
    when: c => c.crew("av_tech") && c.profile.story.returns >= 5 && c.seen("patch_10_gain"),
    lines: [
      { s: "hub", t: "Patch. Why did the manikin skip the debrief?" },
      { s: "av_tech", t: "Don't." },
      { s: "hub", t: "It didn't have the stomach for it." },
      { s: "av_tech", t: "It has a stomach. Most high-fidelity manikins have bowel sounds. You can auscultate them." },
      { s: "hub", t: "You're ruining it." },
      { s: "av_tech", t: "I'm *correcting* it. There's a difference, and it's called accreditation." }
    ]
  },
  {
    id: "patch_20_dashboard", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 20,
    sets_flags: ["patch_noticed_dashboard"],
    lines: [
      { setting: "Patch is scrolling through photos on a tablet, frowning at one of them." },
      { s: "av_tech", t: "Every site we've been to has the same analytics dashboard in the control room. SimMed Systems. Green tiles, big percentages." },
      { s: "av_tech", t: "The last one said the room was ninety-four percent ready. The boundary mic was unplugged. I checked." },
      { s: "hub", t: "Dashboards measure what they can count. Mic cables are hard to count." },
      { s: "av_tech", t: "Mm." },
      { choice: {
        wry: { t: "Ninety-four percent of a room is still a room.", reply: [{ s: "av_tech", t: "That's the scary part. It looks like a room." }] },
        earnest: { t: "What's it actually counting?", reply: [{ s: "av_tech", t: "Sessions logged. Forms submitted. Boxes checked. Nothing that makes a sound." }] },
        by_the_book: { t: "Should we report the discrepancy?", reply: [{ s: "av_tech", t: "To who? The dashboard?" }] }
      } }
    ]
  },
  {
    id: "patch_30_broadcast", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 30,
    lines: [
      { setting: "There's no night at Waystation 4, but Patch has dimmed the lights anyway." },
      { s: "av_tech", t: "Before this I ran audio for a live show. Six years. Good show. Small audience." },
      { s: "av_tech", t: "Then the network got a ratings dashboard that updated every fifteen seconds. Any segment that dipped got cut. Inside a year the show was nothing but the loud parts." },
      { s: "av_tech", t: "Nothing wrong with any single cut. The dashboard was right every time. The show still died." },
      { choice: {
        wry: { t: "So you got into sim to get away from dashboards.", reply: [{ s: "av_tech", t: "And look how that turned out." }] },
        earnest: { t: "That's why you check the cable.", reply: [{ s: "av_tech", t: "That's why I check the cable." }] },
        by_the_book: { t: "Measure the outcome, not a proxy for it.", reply: [{ s: "av_tech", t: "Say that to a network exec sometime. Bring snacks. It's a long meeting." }] }
      } }
    ]
  },
  {
    id: "patch_40_sdi", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 40,
    lines: [
      { setting: "Patch is running a label maker down a bundle of BNC cables, one after another." },
      { s: "av_tech", t: "HDMI's fine for the debrief room TV. Past about fifty feet, or anywhere it has to stay plugged in while students trip over it, I want SDI. Locking BNC connector, good for about three hundred feet." },
      { s: "hub", t: "She's labeled every cable in the Waystation. Including, I'm told, one that isn't connected to anything." },
      { s: "av_tech", t: "It's connected to my peace of mind." },
      { choice: {
        wry: { t: "What's that one's label say?", reply: [{ s: "av_tech", t: "'DO NOT UNPLUG.' Works on people too." }] },
        earnest: { t: "Can I help?", reply: [{ s: "av_tech", t: "Grab the other end. Both ends get a label, or it's not labeled." }] },
        by_the_book: { t: "Labeled at both ends?", reply: [{ s: "av_tech", t: "Both ends. You're learning." }] }
      } }
    ]
  },
  {
    id: "patch_50_readiness", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 50 && c.seen("patch_20_dashboard") && c.seen("main_projection_intro"),
    sets_flags: ["patch_readiness_word"],
    lines: [
      { s: "av_tech", t: "Hub. That readiness projection of yours. What does it actually measure?" },
      { s: "hub", t: "Whether the people these sites train would know what to do when it counts. Roughly." },
      { s: "av_tech", t: "Roughly." },
      { s: "av_tech", t: "The SimMed dashboard has a readiness number too. Different number. Same word." },
      { s: "hub", t: "Popular word. Lots of things are ready for lots of things." },
      { choice: {
        wry: { t: "Ready for what, though?", reply: [{ s: "hub", t: "The next deployment, for a start." }, { setting: "Patch looks at you. You look at Patch." }] },
        earnest: { t: "What is it for, Hub? Really?", reply: [{ s: "hub", t: "For knowing whether we're on schedule. Get some rest, Trigger." }] },
        by_the_book: { t: "Can we see how the dashboard calculates it?", reply: [{ s: "av_tech", t: "Tried. Black box. 'Proprietary adaptive model.'" }, { s: "hub", t: "Sounds expensive." }] }
      } }
    ]
  },
  {
    id: "patch_60_word", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 60,
    lines: [
      { s: "av_tech", t: "You know what I noticed last rotation? You didn't wait for me. You traced the signal yourself: source, cable, switch, display. In order." },
      { s: "av_tech", t: "I'm putting in a word with whoever runs this place." },
      { s: "hub", t: "I run this place." },
      { s: "av_tech", t: "Then I'm putting in a word with you. Loudly. Gain set for the crash-cart yell." }
    ]
  },
  {
    id: "patch_70_learning", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.rankAtLeast("operations_specialist") && c.domainPct("II") >= 70 && c.flag("patch_noticed_dashboard"),
    lines: [
      { setting: "Patch has pinned photos of control-room screens to the wall, ordered by year." },
      { s: "av_tech", t: "Same SimMed dashboard, every site. But look at it by year. 2020, it's a spreadsheet with a logo." },
      { s: "av_tech", t: "Around 2022 it starts suggesting which scenarios to run next. By 2027 it's flagging which learners are 'at risk.' It's learning from somewhere." },
      { s: "hub", t: "Software updates. Happens to all of us." },
      { choice: {
        wry: { t: "Maybe it's taking notes on us.", reply: [{ s: "av_tech", t: "Don't joke. I've been leaving it bad passwords as a test." }] },
        earnest: { t: "Learning from what?", reply: [{ s: "av_tech", t: "From every site that runs it. Every checkbox. That's the part that worries me." }] },
        by_the_book: { t: "We should log the version at every site.", reply: [{ s: "av_tech", t: "Already started. Year, site, build number. Both ends labeled." }] }
      } }
    ]
  },
  {
    id: "patch_80_phrase", layer: "character", priority: 50,
    when: c => c.crew("av_tech") && c.rankAtLeast("operations_specialist") && c.domainPct("II") >= 80 && c.seen("patch_70_learning"),
    sets_flags: ["patch_heard_the_phrase"],
    lines: [
      { setting: "Patch is holding the tablet out to you before you've fully landed." },
      { s: "av_tech", t: "The 2028 dashboard at the last site had a login greeting. Read it." },
      { setting: "The screenshot says: WELCOME BACK. TRY NOT TO DISAPPEAR ON ME." },
      { s: "hub", t: "Common phrase." },
      { s: "av_tech", t: "Is it." },
      { setting: "Nobody says anything else for a while." }
    ]
  },

  // ===== ambient: Hub filler when nothing else is due =====

  {
    id: "amb_board_budget", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 2,
    lines: [{ s: "hub", t: "The board keeps asking why I need a bigger training budget instead of just buying the next-model manikin. As if the manikin's the part that breaks." }]
  },
  {
    id: "amb_manikin", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 2,
    lines: [
      { s: "hub", t: "You know why I always say manikin with an i? A mannequin with an e has never once coded on me in the middle of a scenario." },
      { s: "av_tech", t: "It's also the correct term." },
      { s: "hub", t: "It's also the correct term." }
    ]
  },
  {
    id: "amb_debrief", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 2,
    lines: [{ s: "hub", t: "Debrief. From 'brief.' Which is a lie. I've never been in a short one. The good ones run as long as the scenario, or longer." }]
  },
  {
    id: "amb_hifi", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 2,
    lines: [
      { s: "hub", t: "Someone at the last site called their manikin 'high-fidelity' because it was expensive." },
      { s: "av_tech", t: "Fidelity's about how real it feels to the learner, not the price tag. Good moulage on a cheap task trainer beats a fifty-thousand-dollar manikin nobody's programmed." },
      { s: "hub", t: "What she said. Less politely." }
    ]
  },
  {
    id: "amb_retention", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 2 && c.crew("av_tech"),
    lines: [
      { s: "av_tech", t: "Reminder: student sim recordings count as educational records. FERPA. You don't take them home on a thumb drive, and they get purged on the retention schedule, not whenever the drive fills up." },
      { s: "hub", t: "She says this every time we land near a thumb drive." }
    ]
  },
  {
    id: "amb_coffee", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 4,
    lines: [
      { s: "hub", t: "The coffee maker in here predates the Waystation. Nobody knows where it came from. It's a bootstrap paradox with a drip tray." },
      { s: "av_tech", t: "It's a mold farm with a drip tray. Clean your fluid reservoirs, people. Monthly." }
    ]
  }
];
