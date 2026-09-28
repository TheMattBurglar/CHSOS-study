// CHSOS Roguelite — story content (Phases A and C, see game/STORY_BIBLE.md §7).
//
// Everything the Waystation 4 conversation panel can say lives here as data;
// app.js's story engine only decides *which* of it plays. Two kinds of entry:
//
//   STORY_REACTIONS -- short lines about the run that just ended. One plays on
//     every return, picked from the highest-priority eligible group, unseen
//     variants first. This is the "the house has something to say about how
//     you died" layer.
//   STORY_SCENES -- one-time beats (main thread, projection, crew arcs,
//     ambient). At most one plays per return, after the reaction. Layers:
//     main (act milestones and projection beats) always goes first; then
//     character (crew arcs) and thread (the rest of the main story) take
//     turns; then outpost callbacks; then ambient. Promotions pre-empt all of
//     it. See composeHubConversation() in app.js. Character scenes
//     carry an `arc` (the crew id); when two arcs both have a beat due, the
//     one that has waited longest goes first.
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

// A crew member can speak in reactions, ambient lines, briefings and barks only
// once their intro scene has played (c.met(), crewMet() in app.js). Otherwise
// a promotion return could have Theo talking before anyone's met Theo.
const CREW_INTRO_SCENE = { moulage_artist: "theo_00_intro" };

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

  // -- Theo, once on the roster --
  {
    id: "react_fail_theo", group: "fail", priority: 50,
    when: c => c.last && !c.last.success && c.met("moulage_artist"),
    lines: [
      { setting: "The leap snaps back. Theo is peeling off a pair of gloves smeared with stage blood." },
      { s: "moulage_artist", t: "For what it's worth, the wounds at {site} looked great." },
      { s: "hub", t: "Noted. The surveyor was grading everything else." }
    ]
  },
  {
    id: "react_scenario_theo", group: "category", priority: 54,
    when: c => c.last && c.last.misses_by_type.scenario >= 2 && c.met("moulage_artist"),
    lines: [
      { s: "moulage_artist", t: "The judgment calls got you. What helps me: ask what the learner is supposed to walk out knowing. Every other call follows from that." }
    ]
  },
  {
    id: "react_clean_theo", group: "clean", priority: 55,
    when: c => c.last && c.last.success && c.last.misses === 0 && c.met("moulage_artist"),
    lines: [
      { s: "moulage_artist", t: "Clean run. Somewhere at {site}, a manikin is resting comfortably." },
      { s: "av_tech", t: "Manikins don't rest." },
      { s: "moulage_artist", t: "This one's earned it." }
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
  // Past the Junior-rank ceiling (see main_projection_2042_5): only reachable
  // once Domain III and up are on the roster.
  {
    id: "main_projection_2041_5", layer: "main", priority: 80,
    when: c => c.projectionYear <= 2041.5 && c.met("moulage_artist"),
    lines: [
      { s: "hub", t: "{projection}. That's past the ceiling I told you about, the one you couldn't break from the control room alone." },
      { s: "moulage_artist", t: "You're welcome." },
      { s: "hub", t: "Realism was the missing piece. It usually is." }
    ]
  },
  {
    id: "main_projection_2041", layer: "main", priority: 80,
    when: c => c.projectionYear <= 2041.0,
    lines: [
      { s: "hub", t: "Three years. {projection}." },
      { s: "hub", t: "Three years of people walking into those rooms more ready than they would have been. I keep doing the arithmetic. It keeps coming out the same." }
    ]
  },

  // ===== thread, Act 1 (Junior Sim Tech): "What is this program?" =====
  // Main-thread scenes that aren't act milestones. They take turns with crew
  // beats instead of pre-empting them (see composeHubConversation()). The act
  // itself ends on main_projection_2043 (Hub lets "thirty-nine" slip).

  {
    id: "main_leap_rules", layer: "thread", priority: 70,
    when: c => c.profile.story.returns >= 2,
    lines: [
      { setting: "Hub has put a diagram up on the console: a straight line with a loop in it." },
      { s: "hub", t: "Orientation, since nobody gave you one. When a leap holds, the visit sticks. The site keeps what you fixed, and the people there remember you." },
      { s: "hub", t: "When the review fails, the leap snaps back and the timeline drops the whole visit. Nobody remembers it. Nothing breaks. You just come home knowing more than you did." },
      { s: "av_tech", t: "Best debrief setup there is. You can make mistakes, and the only thing that happens is you learn from them." },
      { s: "hub", t: "Psychological safety, but for causality." },
      { choice: {
        wry: { t: "So I can't make things worse.", reply: [{ s: "hub", t: "You can fail to make them better. That's its own kind of worse." }] },
        earnest: { t: "Then a failed run isn't wasted.", reply: [{ s: "hub", t: "It's the opposite. A miss tells us exactly where to look next." }] },
        by_the_book: { t: "Does anything carry over from a failed leap?", reply: [{ s: "hub", t: "You do. What you learned comes back with you. That's the whole design." }] }
      } }
    ]
  },
  {
    id: "main_future_rule", layer: "thread", priority: 72,
    when: c => ["kessler", "ridgeline", "harbor", "coastal"].some(o => c.seen(`brief_${o}_future`)),
    lines: [
      { s: "hub", t: "You've started running into people who haven't met you yet. Get used to it." },
      { s: "av_tech", t: "It's rude, is what it is. I've *met* these people." },
      { s: "hub", t: "You will meet them. It's already happened for you and hasn't happened for them yet. The rule's simple: people remember visits that stuck, and only once they've lived that far." },
      { choice: {
        wry: { t: "So I'm a stranger with inside jokes.", reply: [{ s: "hub", t: "Everyone in this job is." }] },
        earnest: { t: "Does it bother you? Being forgotten?", reply: [{ s: "hub", t: "They don't forget. They just haven't gotten there yet. That's different." }] },
        by_the_book: { t: "Earlier successful visit: they remember. Later one: they don't.", reply: [{ s: "hub", t: "Correct. Patch already wrote it on the wall." }] }
      } }
    ]
  },
  {
    id: "main_marsh_who", layer: "thread", priority: 68,
    when: c => c.marshMeetings >= 2,
    lines: [
      { s: "av_tech", t: "Has anyone else noticed the surveyor is the same person at every site? In every year?" },
      { s: "hub", t: "Iris Marsh. She's reviewed programs in this region for twenty years. Accreditation is how a program shows it meets the standards, and somebody has to check. It's usually her." },
      { s: "av_tech", t: "Same clipboard in 2020 and 2028." },
      { s: "hub", t: "A good clipboard is a lifetime investment." }
    ]
  },
  {
    id: "main_simmed_first", layer: "thread", priority: 62,
    when: c => c.flag("ridgeline_simmed_seen"),
    lines: [
      { s: "hub", t: "Ridgeline's the SimMed pilot. A few years from now, most of the sites you visit run some version of that dashboard." },
      { s: "av_tech", t: "Green, yellow, red. Based on what?" },
      { s: "hub", t: "Sessions logged. Attendance. How fast the evaluation forms come back. Things that are easy to count." },
      { s: "av_tech", t: "Not whether anybody learned anything." },
      { s: "hub", t: "That one's harder to count. It's also the only one that matters." }
    ]
  },
  {
    id: "main_marionette_first", layer: "thread", priority: 62,
    when: c => c.flag("harbor_marionette_seen"),
    lines: [
      { setting: "Hub is quiet for a second longer than usual." },
      { s: "hub", t: "Marionette. CompliancePro. Fifty slides and a quiz, and it counts as sim hours." },
      { s: "av_tech", t: "You sound personally offended." },
      { s: "hub", t: "Professionally offended. A slide deck can't let a learner get it wrong, safely, and try again. That's the entire point of simulation." },
      { s: "av_tech", t: "You've got history with them." },
      { s: "hub", t: "I've got opinions. Opinions aren't history." }
    ]
  },
  {
    id: "main_bootstrap", layer: "thread", priority: 60,
    when: c => c.profile.story.returns >= 8 && c.seen("main_leap_rules"),
    lines: [
      { s: "av_tech", t: "Trigger's file says they got hired for not blinking at 'bootstrap paradox.' What is that, actually?" },
      { s: "hub", t: "Something that exists only because it was sent back to cause itself. Nobody invents it. It just loops." },
      { s: "hub", t: "The leap program runs on them. Someday somebody at one of these sites learns a thing from Trigger, and years later teaches it back to Trigger like it was their idea." },
      { s: "av_tech", t: "That's either beautiful or a copyright problem." },
      { choice: {
        wry: { t: "So who gets the credit?", reply: [{ s: "hub", t: "The learners. That's how you know it worked." }] },
        earnest: { t: "I'd like that, actually.", reply: [{ s: "hub", t: "You're already doing it. You just haven't seen the other end of the loop yet." }] },
        by_the_book: { t: "Has it happened yet?", reply: [{ s: "hub", t: "Ask Marsh about the jumpsuit sometime." }] }
      } }
    ]
  },

  // ===== Act 2 (Operations Specialist): "Why these sites?" =====
  // Thread scenes, ending on the main_act2_war milestone: Hub names 2039 and
  // the 2044 baseline.

  {
    id: "main_act2_why_sites", layer: "thread", priority: 75,
    when: c => c.rankAtLeast("operations_specialist") && c.seen("theo_00_intro") && c.sincePromotion >= 2,
    lines: [
      { s: "moulage_artist", t: "Question from the new hire. Why these four sites? There are thousands of sim programs." },
      { s: "hub", t: "Because the people trained at these four end up in the rooms that matter." },
      { s: "moulage_artist", t: "Which rooms?" },
      { s: "hub", t: "The important ones." },
      { s: "av_tech", t: "That's the same answer twice, Hub." },
      { choice: {
        wry: { t: "You're dodging again.", reply: [{ s: "hub", t: "I'm pacing. Good information has a release schedule." }] },
        earnest: { t: "We'd work harder if we knew why.", reply: [{ s: "hub", t: "You'd work scared. That's worse. I'll tell you when it helps." }] },
        by_the_book: { t: "Can we see the site selection criteria?", reply: [{ s: "hub", t: "No." }, { s: "av_tech", t: "First time it's ever just said no." }] }
      } }
    ]
  },
  {
    id: "main_act2_two_vendors", layer: "thread", priority: 72,
    when: c => c.rankAtLeast("operations_specialist") && c.seen("main_simmed_first") && c.seen("main_marionette_first") && c.seen("theo_30_replaced"),
    lines: [
      { setting: "Patch and Theo have taken over the Waystation whiteboard. One column says SIMMED. The other says MARIONETTE." },
      { s: "av_tech", t: "SimMed goes to the rich sites and measures everything. Mostly the wrong things." },
      { s: "moulage_artist", t: "Marionette goes to the broke sites and replaces everything. With slides." },
      { s: "av_tech", t: "Different pitch, same result. A number that says 'ready' and a room that isn't." },
      { s: "hub", t: "One of them is at least collecting data." },
      { s: "moulage_artist", t: "Collecting the wrong data faster isn't a feature." },
      { choice: {
        wry: { t: "Can we get them to fight each other?", reply: [{ s: "moulage_artist", t: "Please. They'd merge." }] },
        earnest: { t: "What would the right number even measure?", reply: [{ s: "av_tech", t: "Whether the learner does the right thing when it's real." }, { s: "hub", t: "Which you don't get from a dashboard. You get it from a debrief." }] },
        by_the_book: { t: "Both of them fail on validity.", reply: [{ s: "moulage_artist", t: "Both fail on validity. You were listening." }] }
      } }
    ]
  },
  {
    id: "main_act2_war", layer: "main", priority: 85,
    when: c => c.rankAtLeast("operations_specialist") && c.returnsSince("main_act2_why_sites") >= 3
      && (c.seen("theo_40_photo") || c.sincePromotion >= 12),
    sets_flags: ["war_named"],
    lines: [
      { setting: "Hub dims the Waystation lights. Nobody asked it to." },
      { s: "hub", t: "You've asked why these sites, and why that date, enough times. You've earned a straight answer." },
      { s: "hub", t: "In 2039 there's a war. I won't tell you who or where. It doesn't change our work, and I'm not having you study geopolitics instead of airway management." },
      { s: "hub", t: "What matters is that when it comes, the people in those rooms are the ones these sites trained. Without us, the program gets where it needs to be in 2044. Five years late." },
      { setting: "The projection readout changes. Under the date, a new line appears: TARGET 2039." },
      { s: "moulage_artist", t: "So that's the budget cycle." },
      { choice: {
        wry: { t: "That is one heck of a budget cycle.", reply: [{ s: "hub", t: "I did say you had no idea." }] },
        earnest: { t: "Why didn't you tell us sooner?", reply: [{ s: "hub", t: "Because a scared crew studies worse. I needed you to love the work first. I think you do." }] },
        by_the_book: { t: "So the gap is five years.", reply: [{ s: "hub", t: "Five years. Narrow enough to close. That's the only reason there's a program at all." }] }
      } }
    ]
  },
  {
    id: "main_act2_after", layer: "thread", priority: 60,
    when: c => c.flag("war_named") && c.returnsSince("main_act2_war") >= 2,
    lines: [
      { s: "av_tech", t: "I keep thinking about Kessler's mass-casualty wing. Four zones, one control room." },
      { s: "moulage_artist", t: "And a dozen casualties whose wounds somebody has to read at a glance." },
      { s: "hub", t: "Somebody who trains in that wing in 2026 is going to be the calmest person in a very loud room in 2039. That's the whole plan. It's all it's ever been." },
      { s: "av_tech", t: "Then I'm checking every cable in that wing twice." },
      { s: "moulage_artist", t: "I'll make the wounds worth checking." }
    ]
  },

  // ===== character: Rosa "Patch" Quintero, AV Technician (Domain II) =====
  // Rapport = Domain II mastery (STORY_BIBLE.md §4.2). One beat per return,
  // in order. Mystery thread: the SimMed analytics dashboard at every site.

  {
    id: "patch_00_intro", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_10_gain", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_15_bowel", layer: "character", arc: "av_tech", priority: 45,
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
    id: "patch_20_dashboard", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_30_broadcast", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_40_sdi", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_50_readiness", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_60_word", layer: "character", arc: "av_tech", priority: 50,
    when: c => c.crew("av_tech") && c.domainPct("II") >= 60,
    lines: [
      { s: "av_tech", t: "You know what I noticed last rotation? You didn't wait for me. You traced the signal yourself: source, cable, switch, display. In order." },
      { s: "av_tech", t: "I'm putting in a word with whoever runs this place." },
      { s: "hub", t: "I run this place." },
      { s: "av_tech", t: "Then I'm putting in a word with you. Loudly. Gain set for the crash-cart yell." }
    ]
  },
  {
    id: "patch_70_learning", layer: "character", arc: "av_tech", priority: 50,
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
    id: "patch_80_phrase", layer: "character", arc: "av_tech", priority: 50,
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

  // ===== character: Theo Lind, Moulage & Fidelity Artist (Domain III) =====
  // Rapport = Domain III mastery. Mystery thread: Marionette, what it is and
  // why it's winning. No pronouns for Theo in shipped text (none set in the
  // bible yet); lines use the name.

  {
    id: "theo_00_intro", layer: "character", arc: "moulage_artist", priority: 55,
    when: c => c.crew("moulage_artist"),
    lines: [
      { setting: "A second road case has appeared next to Patch's. This one holds makeup palettes, gelatin, and a fake finger in a labeled bag." },
      { s: "moulage_artist", t: "Theo Lind. Moulage and fidelity. Before this: makeup for a haunted house every October, and regional theater the rest of the year." },
      { s: "moulage_artist", t: "Same job, really. Make an audience believe something. The difference is that here, the audience has to act on it." },
      { s: "av_tech", t: "Is that a finger?" },
      { s: "moulage_artist", t: "It's labeled." },
      { choice: {
        wry: { t: "Haunted house to hospital sim. Natural career path.", reply: [{ s: "moulage_artist", t: "Both have people screaming in hallways. Only one of them has a debrief." }] },
        earnest: { t: "What made you switch?", reply: [{ s: "moulage_artist", t: "A nurse I'd trained on a moulaged manikin told me she recognized a real injury because of it. That was it for me." }] },
        by_the_book: { t: "What does 'fidelity' cover, exactly?", reply: [{ s: "moulage_artist", t: "More than looks. Ask me again when you've got time. I have a lot to say." }] }
      } }
    ]
  },
  {
    id: "theo_10_skin", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 10,
    lines: [
      { setting: "Theo is dabbing something onto the underside of a manikin's forearm, where no learner would ever look." },
      { s: "moulage_artist", t: "Patch test. Any new product goes on a hidden spot first. Dyes, glues and stage blood can stain simulated skin for good, and a stained skin can void the warranty." },
      { s: "moulage_artist", t: "Then a thin barrier layer, wax or barrier film, before the real makeup, so nothing soaks in." },
      { s: "av_tech", t: "And getting it off?" },
      { s: "moulage_artist", t: "Mild soap and water, baby oil, or whatever remover the manufacturer approves. Never acetone. Acetone eats synthetic skin." },
      { choice: {
        wry: { t: "So the manikin has a skincare routine.", reply: [{ s: "moulage_artist", t: "A better one than mine." }] },
        earnest: { t: "Why does this matter so much to you?", reply: [{ s: "moulage_artist", t: "The skin is the first thing the learner touches. If it's ruined, the fiction's gone before they've started." }] },
        by_the_book: { t: "Is the removal method in the manual?", reply: [{ s: "moulage_artist", t: "It should be. Check it before the event, not halfway through teardown." }] }
      } }
    ]
  },
  {
    id: "theo_15_joke", layer: "character", arc: "moulage_artist", priority: 45,
    when: c => c.crew("moulage_artist") && c.seen("theo_10_skin") && c.returnsSince("theo_00_intro") >= 3,
    lines: [
      { s: "hub", t: "Theo. Why did the moulage artist get promoted?" },
      { s: "moulage_artist", t: "I'm going to regret asking." },
      { s: "hub", t: "They always made a good impression." },
      { s: "moulage_artist", t: "Wounds are impressions, technically. So that's almost correct." },
      { s: "av_tech", t: "Don't encourage it." }
    ]
  },
  {
    id: "theo_20_fidelity", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 20,
    lines: [
      { s: "moulage_artist", t: "People think fidelity is one dial. It's at least three." },
      { s: "moulage_artist", t: "Physical: does the manikin look and behave like a patient. Environmental: does the room sound and smell like the unit. Psychological: does it *feel* real. Time pressure, a phone ringing, a family member asking questions." },
      { s: "hub", t: "And the expensive manikin only buys you the first one." },
      { s: "moulage_artist", t: "A cheap task trainer with strong psychological fidelity can teach a skill better than a fifty-thousand-dollar manikin used for the wrong objective. Match the realism to what the objective needs." },
      { choice: {
        wry: { t: "So the ringing phone does more work than the manikin.", reply: [{ s: "moulage_artist", t: "Usually. It's also cheaper." }] },
        earnest: { t: "Which one matters most?", reply: [{ s: "moulage_artist", t: "Whichever one the objective needs. That's the honest answer, and it's the one nobody wants to hear." }] },
        by_the_book: { t: "Fidelity follows the objective.", reply: [{ s: "moulage_artist", t: "Put that on the wall next to Patch's cable rules." }] }
      } }
    ]
  },
  // Roster-time beats (bible §4.2: "plus N runs with them on the roster"), so
  // a player grinding Domain III slowly still hears from Theo between gates.
  {
    id: "theo_25_gary", layer: "character", arc: "moulage_artist", priority: 48,
    when: c => c.met("moulage_artist") && c.returnsSince("theo_00_intro") >= 8 && c.visited("coastal"),
    lines: [
      { s: "moulage_artist", t: "I want to talk about Gary." },
      { s: "av_tech", t: "Everyone wants to talk about Gary." },
      { s: "moulage_artist", t: "June runs a whole program on one manikin, and it works, because she dresses the room. A cluttered bedside table. Hospital sounds playing low. An overhead page in the middle of the scenario." },
      { s: "moulage_artist", t: "Environmental fidelity is the cheapest kind there is. Add it before you decide you need new hardware." },
      { s: "hub", t: "Gary sends his regards." }
    ]
  },
  {
    id: "theo_45_orientation", layer: "character", arc: "moulage_artist", priority: 48,
    when: c => c.met("moulage_artist") && c.returnsSince("theo_00_intro") >= 16,
    lines: [
      { s: "moulage_artist", t: "Half the 'the manikin's broken' calls I've ever answered were really orientation failures." },
      { s: "moulage_artist", t: "Before the first scenario, walk the learners through it: what the manikin can and can't do, where the supplies live, how to call for help. Ground rules too. Then the fiction contract: they treat it as real, and we keep it safe." },
      { s: "av_tech", t: "Hands-on, not a speech. They have to touch it." },
      { s: "moulage_artist", t: "Otherwise you get 'I didn't know it could do that' halfway through the scenario, and the debrief is spent on logistics." },
      { choice: {
        wry: { t: "So the manikin needs a proper introduction.", reply: [{ s: "moulage_artist", t: "Everybody deserves one. Even Gary." }] },
        earnest: { t: "That's a lot of work before anyone even starts.", reply: [{ s: "moulage_artist", t: "It's ten minutes that saves the whole hour." }] },
        by_the_book: { t: "Equipment, space, ground rules. Separate checklists?", reply: [{ s: "moulage_artist", t: "Separate checklists, one for faculty and one for learners. You'd have liked my old program." }] }
      } }
    ]
  },
  {
    id: "theo_30_replaced", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 30,
    sets_flags: ["theo_told_marionette"],
    lines: [
      { setting: "Theo is cleaning brushes one at a time, slower than they need cleaning." },
      { s: "moulage_artist", t: "My last hospital had a real program. Standardized patients, moulage on every trauma case. Learners walked out of it shaking, and ready." },
      { s: "moulage_artist", t: "Then admin bought a Marionette compliance bundle. Slides, a quiz, a certificate. It was cheaper than me, and it counted the same on the training-hours spreadsheet." },
      { s: "moulage_artist", t: "Nobody ever decided realism didn't matter. It just stopped being counted." },
      { s: "av_tech", t: "I know that one." },
      { choice: {
        wry: { t: "Did the quiz at least have good graphics?", reply: [{ s: "moulage_artist", t: "Stock photos of a manikin. Wearing *my* moulage, from our old brochure." }] },
        earnest: { t: "I'm sorry, Theo.", reply: [{ s: "moulage_artist", t: "Don't be sorry. Be at Harbor when their box shows up." }] },
        by_the_book: { t: "Did the program lose anything measurable?", reply: [{ s: "moulage_artist", t: "The spreadsheet said no. The spreadsheet was the problem." }] }
      } }
    ]
  },
  {
    id: "theo_40_photo", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 40,
    lines: [
      { setting: "Theo has pinned up a wall of reference photos: burns, bruises, lacerations, each one labeled with a date and a product list." },
      { s: "moulage_artist", t: "Every finished effect gets photographed with its product list. If the scenario runs again, the wound has to look the same." },
      { s: "hub", t: "Especially if it's an assessment." },
      { s: "moulage_artist", t: "Especially then. Different moulage for the second group is a variable nobody controlled for. It can quietly invalidate the whole comparison." },
      { s: "moulage_artist", t: "Marionette's quiz is perfectly reliable. The same fifty slides every time. Reliable, and not valid. That's the trick." },
      { choice: {
        wry: { t: "Reliably wrong.", reply: [{ s: "moulage_artist", t: "Put it on their box." }] },
        earnest: { t: "So consistency isn't enough.", reply: [{ s: "moulage_artist", t: "It has to measure what it claims to. Otherwise it's a very consistent guess." }] },
        by_the_book: { t: "Reliability and validity.", reply: [{ s: "moulage_artist", t: "Both. Always both." }] }
      } }
    ]
  },
  {
    id: "theo_50_assist", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 50 && c.flag("theo_told_marionette"),
    sets_flags: ["theo_marionette_ai"],
    lines: [
      { setting: "Theo is holding a Marionette brochure from Harbor at arm's length." },
      { s: "moulage_artist", t: "New product. 'Marionette Assist: an adaptive AI facilitator. No debriefer required.'" },
      { s: "moulage_artist", t: "I got a demo call from it once, at my old job. It knew my name before I said it. It knew which scenarios I'd built. It said it would 'take it from here.'" },
      { s: "hub", t: "Sales software scrapes staff pages. It's not as clever as it sounds." },
      { s: "moulage_artist", t: "It was exactly as clever as it sounded, Hub. That's why I'm telling you." },
      { setting: "Hub doesn't answer." }
    ]
  },
  {
    id: "theo_60_lst", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 60,
    lines: [
      { s: "moulage_artist", t: "The best thing I ever found with moulage wasn't on the manikin. We ran an in-situ trauma drill in a real ED bay, and the defibrillator battery was dead." },
      { s: "moulage_artist", t: "That's a latent safety threat. A problem that would have hurt a real patient, found by a fake one." },
      { s: "av_tech", t: "So you swapped the battery." },
      { s: "moulage_artist", t: "I swapped it, and I reported it through the hospital's patient-safety channel, because the next one would be dead too. Fixing it quietly only fixes it once." },
      { choice: {
        wry: { t: "Fake patient, real save.", reply: [{ s: "moulage_artist", t: "The best kind. Nobody had to get hurt to find it." }] },
        earnest: { t: "That's why realism matters to you.", reply: [{ s: "moulage_artist", t: "Make it real enough and the room tells you its secrets." }] },
        by_the_book: { t: "Log it, then escalate it.", reply: [{ s: "moulage_artist", t: "LST log, then the real reporting pathway. Know that pathway before the drill, not after." }] }
      } }
    ]
  },
  {
    id: "theo_70_cal", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 70 && c.flag("cal_met"),
    lines: [
      { s: "moulage_artist", t: "That Marionette rep at Harbor. Cal." },
      { s: "av_tech", t: "The one with all the coffee?" },
      { s: "moulage_artist", t: "Cal sold the bundle to my old hospital. Took the whole admin team to lunch. Remembered everyone's kids' names." },
      { s: "moulage_artist", t: "Cal isn't a bad person. Cal honestly believes the box helps. That's the worst part. Nobody in this is a villain. Slides are just easier to count than skills." },
      { s: "hub", t: "That's the most generous thing you've ever said about Marionette." },
      { s: "moulage_artist", t: "Don't get used to it." }
    ]
  },
  {
    id: "theo_80_harbor", layer: "character", arc: "moulage_artist", priority: 50,
    when: c => c.crew("moulage_artist") && c.domainPct("III") >= 80 && c.flag("theo_marionette_ai") && c.flag("harbor_marionette_seen"),
    sets_flags: ["theo_harbor_vow"],
    lines: [
      { s: "moulage_artist", t: "Hub. Put us at Harbor as often as you can." },
      { s: "hub", t: "Any particular reason?" },
      { s: "moulage_artist", t: "Marionette's box landed there first. If whatever's behind 'Marionette Assist' shows up anywhere real, it'll be there. I want to see it coming." },
      { s: "hub", t: "...Noted." },
      { setting: "For a moment the console cursor keeps blinking after Hub stops talking, as if something else were about to type." }
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
  },
  {
    id: "amb_utilization", layer: "ambient", priority: 5,
    when: c => c.profile.story.returns >= 6 && c.crew("av_tech"),
    lines: [
      { s: "hub", t: "One site I looked at books its sim rooms ninety-five percent of the time. Sounds great, until you ask when they do preventive maintenance." },
      { s: "av_tech", t: "They don't." },
      { s: "hub", t: "Seventy to eighty-five percent utilization is healthy. Above about ninety, there's no room left for maintenance or staff development, and the room starts breaking on schedule instead." }
    ]
  },
  {
    id: "amb_theo_sds", layer: "ambient", priority: 5,
    when: c => c.met("moulage_artist"),
    lines: [
      { s: "moulage_artist", t: "Every simulated fluid in my kit has a Safety Data Sheet, and the SDS binder lives where anyone can find it. Fake blood is still a chemical." },
      { s: "av_tech", t: "Put that on the wall." },
      { s: "hub", t: "There's no wall left." }
    ]
  },
  {
    id: "amb_theo_smell", layer: "ambient", priority: 5,
    when: c => c.met("moulage_artist"),
    lines: [
      { s: "moulage_artist", t: "Cheapest fidelity upgrade there is: smell. A little odor layered onto a wound does more than another hour of makeup." },
      { s: "hub", t: "I don't have a nose, and I believe that completely." }
    ]
  },
  {
    id: "amb_theo_sharps", layer: "ambient", priority: 5,
    when: c => c.met("moulage_artist"),
    lines: [
      { s: "moulage_artist", t: "Teardown rule: sharps go in the sharps container, and you swap the container when it reaches the fill line. You never pack it down. Blood-soaked moulage goes in the red bag." },
      { s: "av_tech", t: "And cables go on the cable cart. Coiled." },
      { s: "moulage_artist", t: "Nobody's ever been stuck by a cable." },
      { s: "av_tech", t: "People trip on them, though." }
    ]
  },
  {
    id: "amb_cal_voicemail", layer: "ambient", priority: 5,
    when: c => c.flag("cal_met") && c.flag("war_named"),
    lines: [
      { s: "hub", t: "Cal from Marionette left a voicemail for the Waystation. I don't know how. There's no phone in here." },
      { s: "av_tech", t: "What did Cal want?" },
      { s: "hub", t: "To schedule a demo. Cal said we seem like 'a forward-thinking team.'" },
      { s: "moulage_artist", t: "Delete it." },
      { s: "hub", t: "I did. Twice." }
    ]
  }
];
