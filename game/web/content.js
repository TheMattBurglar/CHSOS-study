// CHSOS Roguelite — Sector 1 vertical-slice content.
// Node shape follows game/SCHEMA.md, trimmed to what the slice engine reads.

const NODES = {

  "INT-I-2019-001": {
    node_id: "INT-I-2019-001",
    type: "intel",
    domain: "I",
    ksa: "I.A",
    crew_affinity: null,
    year: 2019,
    location_name: "en route",
    title: "Field Briefing: Hypoxia",
    flavor_intro: "Hub doesn't pull up a card this time. “You should have this one. Prove it.”",
    source: { file: "expert_knowledge.json", ksa: "I.A", field: "terminology" },
    payload: {
      term: "Hypoxia",
      definition: "A condition in which the body or a region of the body is deprived of adequate oxygen supply at the tissue level.",
      flavor: "Hub: “Say it back to me without the textbook voice, or I'm not letting you off this ship.”"
    },
    effects: {
      on_pass: { integrity: 4, morale: 2, budget: 0 },
      on_fail: { integrity: -4, morale: 0, budget: 0 }
    }
  },

  "DIAG-II-2019-001": {
    node_id: "DIAG-II-2019-001",
    type: "diagnostic",
    domain: "II",
    ksa: "II.A.1",
    crew_affinity: "av_tech",
    year: 2019,
    location_name: "Fort Kessler Regional Training Center, Wing C",
    title: "Dead Zone",
    flavor_intro: "The manikin drops off the control PC every time the exercise moves it to the far end of the wing. Your AV Technician wants a second set of eyes before the OSCE starts.",
    source: { file: "mcq_bank.json", id: "MCQ.II.01" },
    payload: {
      question: "A manikin frequently disconnects from the control PC only when it is moved to the far end of the simulation wing. Which diagnostic metric is MOST relevant to troubleshoot this issue?",
      options: {
        A: "The CPU utilization of the control PC.",
        B: "The RSSI (Received Signal Strength Indicator) at the far end of the wing.",
        C: "The MAC address filtering table on the primary switch.",
        D: "The frame rate of the ceiling cameras."
      },
      answer: "B",
      rationale: "RSSI measures Wi-Fi signal strength. Intermittent drops in a specific physical location strongly suggest a signal coverage issue (dead zone).",
      time_limit_seconds: 40
    },
    effects: {
      on_pass: { integrity: 10, morale: 5, budget: 0 },
      on_fail: { integrity: -10, morale: 0, budget: 0 }
    }
  },

  "SCN-II-2019-001": {
    node_id: "SCN-II-2019-001",
    type: "scenario",
    domain: "II",
    ksa: "II.A.4",
    crew_affinity: "av_tech",
    year: 2019,
    location_name: "Fort Kessler Regional Training Center, Admin Wing",
    title: "The USB Request",
    flavor_intro: "A faculty member wants to take a recording of a student's performance home on a personal USB drive, just to grade it tonight. She's asking you, not your Technician.",
    source: { file: "mcq_bank.json", id: "MCQ.II.04" },
    payload: {
      prompt: "What do you tell her?",
      choices: [
        {
          choice_id: "refuse_offer_alt",
          tone: "by_the_book",
          text: "Refuse — student recordings are FERPA-protected educational records — and offer to export a secured, access-logged copy instead.",
          correct: true,
          effects: { integrity: 10, morale: 5, budget: 0 },
          result_text: "She's annoyed for about five seconds, then thanks you for covering her. Your Technician nods approvingly from the doorway."
        },
        {
          choice_id: "hand_it_over",
          tone: "wry",
          text: "“It's just grading” — hand over the drive and move on.",
          correct: false,
          effects: { integrity: -15, morale: -10, budget: -20 },
          sets_flags: ["kessler_ferpa_incident"],
          result_text: "Three weeks later, that drive turns up unencrypted on a shared lab computer. It's now a compliance incident with your name on the intake form."
        }
      ]
    }
  },

  "DIAG-II-2019-002": {
    node_id: "DIAG-II-2019-002",
    type: "diagnostic",
    domain: "II",
    ksa: "II.A.2",
    crew_affinity: "av_tech",
    year: 2019,
    location_name: "Fort Kessler Regional Training Center, Control Room",
    title: "The Hum",
    flavor_intro: "Playback from the last debrief has a constant electrical hum under every word. The facilitator can barely hear herself think.",
    source: { file: "mcq_bank.json", id: "MCQ.II.02" },
    payload: {
      question: "During a debriefing playback, the facilitator complains that the audio has a constant 'humming' noise that makes communication hard to hear. Which of the following is the MOST likely cause?",
      options: {
        A: "The gain on the mixer is set too low.",
        B: "An unshielded audio cable is running parallel to a high-voltage power line.",
        C: "The microphone is a condenser type and lacks phantom power.",
        D: "The NDI video bitrate is too high for the network."
      },
      answer: "B",
      rationale: "Electromagnetic interference (EMI) from power lines induces a 60Hz hum in unshielded audio cables — a classic ground-loop/interference symptom.",
      time_limit_seconds: 40
    },
    effects: {
      on_pass: { integrity: 10, morale: 5, budget: 0 },
      on_fail: { integrity: -10, morale: 0, budget: 0 }
    }
  },

  "REST-2019-001": {
    node_id: "REST-2019-001",
    type: "rest",
    domain: null,
    ksa: null,
    crew_affinity: null,
    year: 2019,
    location_name: "Waystation 4",
    title: "A Night Off",
    flavor_intro: "A quiet stretch before the next site. Spend what you've got, or save it.",
    source: null,
    payload: {
      options: [
        {
          option_id: "repairs",
          label: "Spend budget on equipment repairs",
          cost: { budget: 20 },
          effects: { integrity: 15, morale: 0 }
        },
        {
          option_id: "downtime",
          label: "Give the crew a night off",
          cost: { budget: 10 },
          effects: { integrity: 0, morale: 15 }
        },
        {
          option_id: "skip",
          label: "Push on and save the budget",
          cost: { budget: 0 },
          effects: { integrity: 0, morale: 0 }
        }
      ]
    }
  },

  "DIAG-II-2019-003": {
    node_id: "DIAG-II-2019-003",
    type: "diagnostic",
    domain: "II",
    ksa: "II.A.3",
    crew_affinity: "av_tech",
    year: 2019,
    location_name: "Fort Kessler Regional Training Center, Server Closet",
    title: "The Update",
    flavor_intro: "A mandatory Windows update rolled out overnight. The simulation suite won't launch this morning, and the review team arrives tomorrow.",
    source: { file: "mcq_bank.json", id: "MCQ.II.03" },
    payload: {
      question: "A simulation software suite fails to launch after a mandatory Windows OS update. What should be the FIRST step in the 'Troubleshooting Cycle'?",
      options: {
        A: "Reformat the hard drive and reinstall Windows.",
        B: "Check the manufacturer's website for firmware/software compatibility notes.",
        C: "Replace the PC's graphics card.",
        D: "Purchase a new manikin license."
      },
      answer: "B",
      rationale: "The first step in troubleshooting is always identification and research. Checking for known compatibility issues with the OS update is the most efficient starting point.",
      time_limit_seconds: 35
    },
    effects: {
      on_pass: { integrity: 10, morale: 0, budget: 0 },
      on_fail: { integrity: -10, morale: -5, budget: 0 }
    }
  },

  "CHK-II-2019-001": {
    node_id: "CHK-II-2019-001",
    type: "checkpoint",
    domain: "II",
    ksa: "II.A.6",
    crew_affinity: "av_tech",
    year: 2019,
    location_name: "Fort Kessler Regional Training Center, Main Bay",
    title: "Accreditation Site Visit",
    flavor_intro: "A reviewer from the accreditation board is standing in the doorway. Everything from here on, they're watching.",
    payload: {
      stages: [
        {
          stage_id: "defib",
          source: { file: "mcq_bank.json", id: "MCQ.II.06" },
          question: "You are connecting a REAL clinical defibrillator to a high-fidelity manikin. What is the MOST critical technical component required to prevent damage to the manikin?",
          options: {
            A: "A high-speed Wi-Fi router.",
            B: "A 75-ohm BNC terminator.",
            C: "An energy-absorbing adapter or internal shock-plate.",
            D: "A dedicated air compressor for the chest plate."
          },
          answer: "C",
          rationale: "Real defibrillators deliver thousands of volts. Without an energy-absorbing interface, the current will fry the manikin's sensitive internal electronics.",
          time_limit_seconds: 35
        },
        {
          stage_id: "mci_audio",
          source: { file: "mcq_bank.json", id: "MCQ.II.08" },
          question: "You are setting up a room for a 'Mass Casualty' scenario with 4 patients. The facilitator needs to hear all 4 zones. What is the MOST appropriate audio solution?",
          options: {
            A: "Give every student a handheld radio.",
            B: "Install multiple boundary microphones and a multi-channel mixer.",
            C: "Use one large shotgun mic pointed at the center of the room.",
            D: "Ask the students to shout their findings."
          },
          answer: "B",
          rationale: "Boundary mics are ideal for capturing ambient room audio. A mixer allows the operator to isolate or blend audio from different zones.",
          time_limit_seconds: 35
        }
      ]
    },
    effects: {
      on_pass: { integrity: 20, morale: 15, budget: 30 },
      on_fail: { integrity: -20, morale: -15, budget: 0 }
    }
  }

};

const SECTOR_1_MAP = {
  start: ["INT-I-2019-001", "DIAG-II-2019-001", "SCN-II-2019-001"],
  edges: {
    "INT-I-2019-001": ["DIAG-II-2019-002", "REST-2019-001"],
    "DIAG-II-2019-001": ["DIAG-II-2019-002", "REST-2019-001"],
    "SCN-II-2019-001": ["REST-2019-001"],
    "DIAG-II-2019-002": ["DIAG-II-2019-003"],
    "REST-2019-001": ["DIAG-II-2019-003"],
    "DIAG-II-2019-003": ["CHK-II-2019-001"],
    "CHK-II-2019-001": []
  }
};

// Layout for the positioned map view. "start" is a virtual anchor (no node
// content of its own) representing where the crew begins before node 1.
const MAP_VIEWBOX = { w: 640, h: 520 };

const NODE_POSITIONS = {
  start: { x: 40, y: 260 },
  "INT-I-2019-001": { x: 190, y: 100 },
  "DIAG-II-2019-001": { x: 190, y: 260 },
  "SCN-II-2019-001": { x: 190, y: 420 },
  "DIAG-II-2019-002": { x: 380, y: 180 },
  "REST-2019-001": { x: 380, y: 340 },
  "DIAG-II-2019-003": { x: 480, y: 260 },
  "CHK-II-2019-001": { x: 590, y: 260 }
};

// Full static edge list for drawing every line on the map (including the
// virtual start), independent of which branch the player has actually taken.
function allSectorEdges() {
  const edges = SECTOR_1_MAP.start.map(to => ["start", to]);
  Object.keys(SECTOR_1_MAP.edges).forEach(from => {
    SECTOR_1_MAP.edges[from].forEach(to => edges.push([from, to]));
  });
  return edges;
}

const DOMAIN_LABELS = {
  I: "Concepts in Healthcare",
  II: "Simulation Technology Operations",
  III: "Sim Practices & Procedures",
  IV: "Professional Role",
  V: "Instructional Design"
};

const HUB_LINES = {
  first_visit: "First rotation. Try not to disappear on me — paperwork's a nightmare when a Junior Tech goes missing mid-leap.",
  second_visit_bonus: "You know, the board keeps asking why I need a bigger training budget instead of just buying the next model manikin. As if the manikin's the part that breaks.",
  default: "Deployment logged. Get some rest before the next one."
};
