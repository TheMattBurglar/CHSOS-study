import json
import os

domain_i_knowledge = {
    "I.A": {
        "perspective": "**General Medical Conditions, Injuries, and Diseases:** Recognize the clinical presentation of common conditions to ensure simulator vitals and physical findings match the scenario. High-yield topics: AMI (Myocardial Infarction), Stroke (CVA), Sepsis, Shock, and Trauma (Hemorrhage, Pneumothorax).",
        "clinical": "Accuracy in clinical signs (e.g., matching a pulse of 140 with low BP for shock) is essential for learner diagnostic reasoning and 'Conceptual Fidelity'.",
        "terminology": "*   **AMI:** Acute Myocardial Infarction (Heart Attack).\n*   **CVA:** Cerebrovascular Accident (Stroke).\n*   **Sepsis:** A life-threatening reaction to infection.\n*   **Tension Pneumothorax:** A life-threatening buildup of air in the pleural space.",
        "scenarios": ["**Q:** A faculty member wants to simulate a 'Tension Pneumothorax'. What technical features must the operator ensure are functional?\n**A:** Chest rise/fall (unilateral), lung sounds (absent on one side), and the needle decompression sensor or port."],
        "lab_notes": "*   Check your manikin's library for 'Standard Pathologies' like Asthma or Myocardial Infarction to use as templates."
    },
    "I.B": {
        "perspective": "**Anatomical and Physiological Systems:** Focus on the systems most commonly simulated. Understand **Homeostasis** and how it is disrupted in disease states. Anatomy knowledge is critical for troubleshooting (e.g., locating pulse points or understanding airway anatomy for intubation).",
        "clinical": "Technical troubleshooting often requires anatomical knowledge. Recognizing that a 'Pneumothorax' requires air-release valves to be functional is a key operational-clinical link.",
        "terminology": "*   **Homeostasis:** The state of steady internal physical and chemical conditions.\n*   **Fidelity (Conceptual):** The degree to which the simulator behaves like a real patient (e.g., vitals match the clinical state).\n*   **Fidelity (Physical):** The degree to which the equipment and environment look/feel real.\n*   **Fidelity (Psychological):** The degree to which the learner feels the same pressure/emotions as in a real event.",
        "scenarios": ["**[Analysis Level] Q:** A learner performs a needle decompression on a manikin with a tension pneumothorax. The monitor shows a sudden return of spontaneous circulation (ROSC), but the physical manikin chest remains asymmetrical. Is this a fidelity issue?\n**A:** Yes, it is a lack of **Physical Fidelity** (the manikin failed to respond physically) despite high **Conceptual Fidelity** on the monitor. The specialist must fix the physical air-release valve."],
        "lab_notes": "*   Locate the physical pulse points on your high-fidelity manikins (Carotid, Radial, Femoral, Pedal)."
    },
    "I.C": {
        "perspective": "**Common Medication Administration Practices:** Understand routes (PO, IV, IM, IO) and the 'Six Rights' of medication safety. Techs often manage simulated medication vials and infusion pumps. Simulated meds must be clearly labeled and never used on humans.",
        "clinical": "Simulating realistic medication timing (e.g., 'onset of action') allows learners to practice the 'Wait and See' aspect of clinical care.",
        "terminology": "*   **Bolus:** A single, large dose of a drug given all at once (usually IV).\n*   **IO (Intraosseous):** Injecting directly into the marrow of a bone (common in emergency sim).\n*   **Six Rights:** Right Patient, Drug, Dose, Route, Time, Documentation.",
        "scenarios": ["**Q:** A student gives a simulated dose of Epinephrine during a 'Code Blue'. How should the operator respond on the monitor?\n**A:** Increase the Heart Rate and potentially convert a non-shockable rhythm to a shockable one, based on the SME's scenario logic."],
        "lab_notes": "*   Do you use distilled water or specific manikin-safe fluids for IV simulations? Ensure they are labeled 'NOT FOR HUMAN USE'."
    },
    "I.D": {
        "perspective": "**Healthcare Equipment, Supplies, and Environments:** Distinguish between ICU, ER, and Med-Surg environments. Each requires different monitor layouts, equipment (Ventilators, Defibrillators, Crash Carts), and supplies. Fidelity is enhanced by using real clinical equipment when safe.",
        "clinical": "The environment (Physical Fidelity) significantly affects student stress and immersion. A messy, chaotic ER room is more realistic for an emergency scenario than a clean, quiet classroom.",
        "terminology": "*   **Crash Cart:** A tray or wheeler with equipment for resuscitation.\n*   **Defibrillator:** A device that gives an electric shock to the heart to restore a normal rhythm.\n*   **Fidelity:** The degree to which a simulation mimics reality (Physical, Conceptual, Psychological).",
        "scenarios": ["**Q:** You are setting up a 'Med-Surg' room for a stable patient. Which equipment is UNNECESSARY?\n**A:** A ventilator and a fully stocked crash cart (these should be nearby but not necessarily in the room, to maintain environmental realism)."],
        "lab_notes": "*   Inventory your 'Props'—ventilators, headwalls, and patient ID bands—to match the local hospital standards."
    },
    "I.E": {
        "perspective": "**Roles of Healthcare Professionals:** Understand 'Scope of Practice' boundaries. For example, an RN can assess and administer IV meds; an LPN/LVN can monitor but typically cannot give IV push meds; a Respiratory Therapist (RT) manages ventilators and advanced airways. Techs often act as 'Embedded Participants' or the 'Voice of the Provider'.",
        "clinical": "Realistic role-playing prevents 'Conflict of Role'. If a tech playing an LPN assesses a patient's lungs and orders a medication, it breaks the clinical accuracy of the scenario and misleads the learners.",
        "terminology": "*   **Scope of Practice:** Procedures, actions, and processes that a healthcare practitioner is permitted to undertake.\n*   **Conflict of Role:** When a participant (or confederate) performs actions outside their assigned clinical or professional boundaries.\n*   **IPE (Interprofessional Education):** Students from two or more professions learning about, from, and with each other.",
        "scenarios": ["**Q:** You are acting as a confederate LPN in a scenario. The student RN tells you to push IV epinephrine. What is the most appropriate action?\n**A:** Refuse the order while staying in character, stating that IV push medications are outside your scope of practice, forcing the RN to administer it themselves."],
        "lab_notes": "*   Keep an 'SBAR Cheat Sheet' and a 'Scope of Practice' quick-reference by the phone to prompt students accurately."
    }
}

domain_ii_knowledge = {
    "II.A.1": {
        "perspective": "**Core Networking Concepts:**\n*   **LAN vs. VLAN:** Isolated VLANs are best practice to prevent hospital network interference and reduce latency.\n*   **Static IP vs. DHCP:** Manikins usually require Static IPs or DHCP Reservations. If IP changes, connections drop.\n*   **Latency & Jitter:** Critical for distance simulation. High latency = manikin response lag.\n*   **OSI Model relevance:** Focus on Layer 1 (Physical - cables), Layer 2 (Data Link - MAC addresses/Switches), Layer 3 (Network - IP/Routers).",
        "clinical": "When a manikin loses connection intermittently during an OSCE, the most likely technical cause is an IP conflict or channel interference on the Wi-Fi. The clinical impact is that student assessment is invalidated. Immediate action is required.",
        "terminology": "*   **MAC Address:** Unique hardware identifier.\n*   **Subnet Mask:** Defines network boundaries.\n*   **Ping / Traceroute:** First line of diagnostic commands.",
        "scenarios": ["**Q:** An instructor reports the manikin is 'lagging' when they trigger a cough. Both laptop and manikin are on the hospital's main guest Wi-Fi. What is the best long-term solution?\n**A:** Move the simulation equipment to a dedicated, isolated VLAN or closed network to eliminate bandwidth contention."],
        "lab_notes": "*   Identify the MAC address of your primary manikin.\n*   Document your lab's subnet and gateway.",
    },
    "II.A.2": {
        "perspective": "**A/V Equipment Utilization:**\n*   **Signal Standards:** H.264/H.265 for compression. NDI (Network Device Interface) for video-over-IP; Dante for audio-over-IP.\n*   **Audio Chain:** Understand 'Gain Stages' (Mic -> Pre-amp -> Mixer -> Recorder). Improper gain leads to clipping or 'noise floors'.\n*   **Microphones:** Boundary mics (ambient) vs. Lavaliers (direct). Phantom power (+48V) is required for condenser mics.\n*   **PTZ (Pan-Tilt-Zoom) Cameras:** Essential for capturing non-verbal cues and environmental context.",
        "clinical": "Clear audio is critical for debriefing. If a student's closed-loop communication cannot be heard, the facilitator cannot evaluate their competency. Video latency must be <100ms to maintain immersion.",
        "terminology": "*   **NDI (Network Device Interface):** High-quality, low-latency video over standard Ethernet.\n*   **Dante:** Industry standard for digital audio networking.\n*   **Gain Staging:** Managing the level at each step of an audio signal to prevent distortion.\n*   **Phantom Power (+48V):** DC voltage used to power condenser microphones.",
        "scenarios": ["**Q:** During playback in debriefing, the video is clear but the audio has a loud humming noise. What is the most likely cause?\n**A:** A ground loop issue or unshielded audio cable running parallel to a power cable."],
        "lab_notes": "*   Map out the audio signal flow from the simulation room to the control room.",
    },
    "II.A.3": {
        "perspective": "**Software and Education Systems:**\n*   **LMS (Learning Management System):** Used for pre-brief materials, scheduling, and tracking completion.\n*   **Video Conferencing:** Zoom/Teams integration requires capturing the AV system's output as a virtual webcam.\n*   **Simulator Software:** LLEAP, Maestro, Muse. Often requires specific OS versions and dedicated graphics.",
        "clinical": "LMS integration ensures learners have completed prerequisites (like medication math) before arriving at a high-stakes simulation.",
        "terminology": "*   **SCORM / xAPI:** Standards for elearning software communication.\n*   **SSO (Single Sign-On):** Security and convenience for users.",
        "scenarios": ["**Q:** You need to stream a simulation to a remote classroom. Which setup ensures the lowest latency?\n**A:** A hardwired capture card directly encoding the camera feeds to the streaming PC, bypassing wireless networks."],
        "lab_notes": "*   Check your LMS integration capability with your AV debriefing system.",
    },
    "II.A.4": {
        "perspective": "**Systems Security:**\n*   **Physical:** Server rooms must be locked. Simulators should be secured when not in use.\n*   **Network:** WPA2/WPA3 Enterprise for Wi-Fi. Disable unused switch ports.\n*   **Data:** FERPA (student records) and HIPAA (if real patient data is used as a template, though it should be de-identified). Video recordings of students are considered educational records.",
        "clinical": "If a simulation involves standardized patients (SPs) portraying sensitive scenarios, video recordings must be stored on secure, encrypted servers, not external flash drives.",
        "terminology": "*   **FERPA:** Family Educational Rights and Privacy Act.\n*   **Encryption:** Data at rest vs. Data in transit.",
        "scenarios": ["**Q:** A faculty member asks to take a video of a student's poor performance home on a USB drive to grade it. What is the appropriate response?\n**A:** Deny the request based on FERPA regulations and provide secure, authenticated access to the video on the simulation network."],
        "lab_notes": "*   Review your center's data retention policy for video recordings.",
    },
    "II.A.5": {
        "perspective": "**Simulation Modalities:**\n*   **Manikins (High/Low Fidelity):** Best for physiological responses and psychomotor skills.\n*   **AR/VR:** High initial setup, excellent for spatial awareness and dangerous environments (e.g., fire response).\n*   **Standardized Patients (SPs):** Human actors; unparalleled for communication and empathy training.\n*   **Hybrid:** Combining SPs with task trainers (e.g., an SP wearing a suturing pad).",
        "clinical": "Choosing the right modality impacts the learner's suspension of disbelief (realism). An IV start is best on a task trainer, but breaking bad news requires an SP.",
        "terminology": "*   **Fidelity:** The degree of realism (Physical, Conceptual, Psychological).\n*   **Haptics:** Tactile feedback in VR/Task trainers.",
        "scenarios": ["**Q:** The learning objective is to teach residents how to deliver a complex diagnosis to a family. Which modality is most appropriate?\n**A:** Standardized Patient."],
        "lab_notes": "*   List the top 3 modalities used in your center and their primary use cases.",
    },
    "II.A.6": {
        "perspective": '**Healthcare vs. Simulation Equipment:**\n*   **Healthcare Equipment:** Defibrillators, ventilators. *Caution:* Real defibs require specialized simulator adapters to avoid blowing the manikin\'s motherboard.\n*   **Simulation Equipment:** Compressed air compressors, fluid fluid-mixing stations, control PCs.\n*   **Safety:** Never mix real meds/fluids with simulated ones. Clearly label "NOT FOR HUMAN USE".',
        "clinical": "Using real medical equipment increases physical fidelity but introduces clinical hazards (e.g., accidental shock from a real defib).",
        "terminology": "*   **Galvanic Isolation:** Protecting simulator circuits from real electrical shocks.",
        "scenarios": ["**Q:** A faculty member wants to use a real hospital defibrillator on a high-fidelity manikin. What must the SimOps specialist ensure?\n**A:** That the manikin is equipped with energy-absorbing posts/adapters and the software is set to receive live shocks."],
        "lab_notes": "*   Audit your lab for clear \'Simulated Use Only\' labeling.",
    },
    "II.A.7": {
        "perspective": "**Data Management:**\n*   **Storage:** Video files (MP4) consume massive space. A NAS (Network Attached Storage) or SAN is required for large centers.\n*   **Retrieval:** Naming conventions are critical (e.g., YYYYMMDD_Course_Scenario).\n*   **Retention:** Policies must dictate when videos are purged (e.g., 30 days after the semester ends) to reduce liability and storage costs.",
        "clinical": "When a student challenges a grade, the video and log files are the primary evidence. Rapid retrieval is essential.",
        "terminology": "*   **NAS:** Network Attached Storage.\n*   **Data Retention Policy:** The lifecycle of a file from creation to deletion.",
        "scenarios": ["**Q:** Your center's storage server is at 99% capacity. What is the most appropriate first step?\n**A:** Implement the center's data retention policy to purge recordings older than the specified timeframe."],
        "lab_notes": "*   What is your center's video retention policy? (e.g., 30 days, 1 year?)",
    },
    "II.A.8": {
        "perspective": "**Simulation Spaces:**\n*   **Air Supply:** Compressors provide air for chest rise/fall. They can be noisy and should be isolated from the clinical space if possible. Check PSI requirements.\n*   **Connectivity:** Hardwired drops (RJ45) in the ceiling/floor are preferred over Wi-Fi for reliability.\n*   **Limitations:** Floor loading weights for heavy equipment (e.g., MRI simulators).",
        "clinical": "A loud, knocking air compressor in the room destroys psychological fidelity and distracts from the clinical scenario.",
        "terminology": "*   **PSI / Bar:** Pressure measurements for pneumatics.\n*   **Acoustic Isolation:** Soundproofing control rooms from sim rooms.",
        "scenarios": ["**Q:** You are designing a new simulation room. Where should the manikin's air compressor be located?\n**A:** In an adjacent, sound-insulated mechanical room or closet to minimize ambient noise."],
        "lab_notes": "*   Check the maintenance schedule on your lab's air compressors (draining condensation).",
    },
    "II.A.9": {
        "perspective": "**Cable Connectivity & Adapters:**\n*   **HDMI:** Reliable up to ~50ft (15m). Subject to HDCP handshake issues.\n*   **SDI (Serial Digital Interface):** Broadcast standard, reliable up to 300ft (100m). Uses locking BNC connectors.\n*   **HDBaseT:** Extends HDMI/USB over standard Cat6 cable up to 328ft (100m).\n*   **Fiber Optic:** Used for extremely long runs or EMI-heavy environments.",
        "clinical": "A loose display cable during a scenario means the learner loses their vital signs monitor, forcing an unnatural pause in the clinical flow. Professional locking connectors (SDI/BNC) prevent this.",
        "terminology": "*   **SDI:** Serial Digital Interface; the professional standard for long video runs.\n*   **HDBaseT:** A technology that transmits 4K video, audio, and power over a single Cat6 cable.\n*   **EDID:** Data sent by a display to tell the source what resolution it supports.",
        "scenarios": ["**Q:** You are running an HDMI cable 150 feet from the control room to the sim room display. The signal is dropping. Why?\n**A:** Standard HDMI degrades after ~50 feet. You need an active HDMI cable, an HDMI-over-Ethernet (HDBaseT) extender, or an HDMI-to-SDI converter."],
        "lab_notes": "*   Standardize the display connections in all your briefing rooms.",
    },
    "II.A.10": {
        "perspective": "**Wireless Connectivity:**\n*   **Standards:** 802.11ac (Wi-Fi 5) or 802.11ax (Wi-Fi 6) are preferred. 5GHz provides faster speed but shorter range; 2.4GHz penetrates walls better.\n*   **Interference:** Microwaves, Bluetooth, and adjacent access points can cause dropped packets.\n*   **Security:** WPA2-Enterprise (802.1X) requires RADIUS authentication.",
        "clinical": "In in-situ simulations (running sim in a real hospital unit), wireless reliability is the biggest failure point due to enterprise network congestion.",
        "terminology": "*   **RSSI (Received Signal Strength Indicator):** Measures how strong the Wi-Fi signal is.\n*   **Access Point (AP):** Hardware that transmits the Wi-Fi signal.",
        "scenarios": ["**Q:** A manikin frequently disconnects only when moved to Room B. What is the first troubleshooting step?\n**A:** Check the Wi-Fi signal strength (RSSI) and identify potential physical interference (e.g., lead-lined walls) in Room B."],
        "lab_notes": "*   Perform a basic Wi-Fi heatmap check of your simulation rooms.",
    },
    "II.B.1": {
        "perspective": "**Determine AV equipment for use in the activity:**\n*   Match equipment to learning objectives. If assessing suturing, a fixed overhead camera won't work; you need a mobile or PTZ camera zoomed in.\n*   If doing a multi-room mass casualty, ensure audio routing allows the control room to hear all zones.",
        "clinical": "The AV setup dictates the debriefing quality. Poor camera angles mean the facilitator cannot point out specific clinical errors.",
        "terminology": "*   **Field of View (FOV):** How much of the room the camera captures.",
        "scenarios": ["**Q:** The objective is to evaluate a team's communication during a code blue. What is the most critical AV requirement?\n**A:** High-quality, room-wide audio capture (boundary microphones) to clearly hear closed-loop communication."],
        "lab_notes": "*   Create a standard camera preset (e.g., 'Bed focus', 'Room wide') for your PTZ cameras.",
    },
    "II.B.2": {
        "perspective": "**Recommend healthcare equipment for use:**\n*   Balance realism with budget. A $30k real ventilator might not be necessary if a $5k simulated ventilator meets the learning objectives.\n*   Ensure compatibility: Will the real IV pump connect properly to the manikin's fluid system?",
        "clinical": "Using the exact same model of IV pump in the sim lab as the hospital uses on the floor reduces cognitive load and improves transfer of skills.",
        "terminology": "*   **Transfer of Training:** Applying skills learned in sim to the real world.",
        "scenarios": ["**Q:** A faculty member wants to purchase a new brand of defibrillator for the sim lab. What is your primary recommendation?\n**A:** Purchase the exact same make and model used in the clinical environment the learners will be working in."],
        "lab_notes": "*   Audit your clinical equipment against the hospital's current standard.",
    },
    "II.B.3": {
        "perspective": "**Recommend simulation-specific equipment & Moulage:**\n*   **Equipment Spectrum:** Task trainer (skills) -> Low-fidelity (CPR) -> High-fidelity (physiology).\n*   **Moulage Materials:** Silicone (realistic, non-staining) vs. Wax/Greasepaint (cheap, stains plastic). Use 'Barrier Sprays' before applying makeup to manikins.\n*   **Patch Testing:** Always test new moulage on a hidden area of the manikin skin first.\n*   **Total Cost of Ownership (TCO):** Include maintenance and consumables (skins, blood, mock drugs).",
        "clinical": "Proper moulage (e.g., matching 'Central Cyanosis' with low SpO2) is critical for 'Conceptual Fidelity'. Using real clinical supplies (e.g., chest tubes) instead of cheaper sim-specific versions increases 'Physical Fidelity'.",
        "terminology": "*   **Moulage:** The art of applying mock injuries for training.\n*   **TCO (Total Cost of Ownership):** Initial cost + maintenance + consumables.\n*   **Patch Test:** Checking for staining/reaction on a small, hidden area.",
        "scenarios": ["**Q:** A faculty member wants to apply 'Burn Moulage' to a $100k manikin. What is the specialist's priority?\n**A:** Ensure the materials are manikin-safe (non-staining) and perform a patch test on a hidden area before application."],
        "lab_notes": "*   Create a 'Moulage Recipe' book and an inventory of manikin-safe cleaners (99% Isopropyl Alcohol).",
    },
    "II.C.1": {
        "perspective": "**Technical troubleshooting and corrective action:**\n*   **The Troubleshooting Cycle:** 1. Identify the problem. 2. Establish a theory. 3. Test the theory. 4. Establish a plan of action. 5. Verify system functionality. 6. Document findings.\n*   **Common issues:** Power, Network/Connectivity, Software crash, Hardware failure (pneumatics/fluids).",
        "clinical": "During an exam, you have roughly 30 seconds to fix an issue before the scenario must be paused, breaking realism.",
        "terminology": "*   **Root Cause Analysis:** Finding the fundamental reason for a failure, not just treating the symptom.",
        "scenarios": ["**Q:** The manikin's chest stops rising during a scenario. The software shows respiratory rate is 20. What is the most likely hardware cause?\n**A:** The pneumatic air line has disconnected or the internal compressor has failed."],
        "lab_notes": "*   Develop a 1-page 'Quick Troubleshooting Guide' for the control room.",
    },
    "II.C.2": {
        "perspective": "**Preventive/regular maintenance and policy:**\n*   **Daily:** Flush fluid lines, power down PCs properly, wipe down manikin skin.\n*   **Monthly:** Deep clean fluid tanks (prevent mold), check software updates, inspect cables for fraying.\n*   **Annually:** Manufacturer PM (Preventive Maintenance) visits, recalibrate sensors (chest compression depth).",
        "clinical": "Failure to flush simulated blood lines leads to mold and clogs, permanently damaging the manikin and ruining future hemorrhage scenarios.",
        "terminology": "*   **Preventive Maintenance (PM):** Scheduled upkeep to prevent catastrophic failure.",
        "scenarios": ["**Q:** After a scenario using simulated blood, what is the critical end-of-day maintenance task?\n**A:** Flush all fluid lines with a manufacturer-approved cleaning solution (often distilled water and isopropyl alcohol) to prevent blockages."],
        "lab_notes": "*   Create a daily shutdown checklist for your lab assistants.",
    }
}

domain_iii_knowledge = {
    "III.A": {
        "perspective": "**Documentation & Equipment Management:** Maintain a centralized repository for manuals, warranties, and service contracts. Distinguish between Preventive Maintenance (PM - scheduled) and Corrective Maintenance (repair after failure). Document all repairs to ensure warranty validity and compliance with **SSH Accreditation Core Standards**.",
        "clinical": "Safety & Compliance: If a simulator has a recurring electrical fault or pneumatic leak, it must be 'Red Tagged' and removed from clinical use until repaired and validated. Accurate logs prevent equipment failure during high-stakes exams.",
        "terminology": "*   **PM (Preventive Maintenance):** Scheduled upkeep.\n*   **Corrective Maintenance:** Fixing equipment after a failure.\n*   **SSH Accreditation:** Formal recognition that a sim program meets the Society for Simulation in Healthcare's rigorous standards.",
        "scenarios": ["**Q:** A simulator's warranty is about to expire. The center has not performed any internal maintenance logs for the past year. Why is this a problem?\n**A:** Many manufacturers require proof of regular maintenance to honor warranty claims, and **SSH Accreditation** bodies require strict documentation of equipment 'up-time' and safety checks."],
        "lab_notes": "*   Create a digital 'Equipment Log' (Excel or specialized software).\n*   Schedule annual 'PM Days' where the lab is closed for deep-cleaning and updates."
    },
    "III.B": {
        "perspective": "**Program Sustainability & Growth:\n*   **Utilization Rate:** (Actual Scheduled Hours / Total Available Hours) x 100. A healthy rate is 70-85%.\n*   **Gap Analysis:** Identifying the difference between current resources and future needs.\n*   **Redundancy Planning:** Having a backup plan for critical equipment (e.g., a spare manikin or task trainer).",
        "clinical": "Sustainability metrics (like utilization) prove the value of the center to stakeholders, justifying continued budget for high-stakes clinical training.",
        "terminology": "*   **Utilization Rate:** The measure of resource efficiency.\n*   **Gap Analysis:** The process of determining what is missing to reach a goal.\n*   **Redundancy:** Intentional duplication of critical system components.",
        "scenarios": ["**Q:** Your center's utilization rate is 98%. Why might this be an operational concern?\n**A:** It indicates a lack of time for preventive maintenance, staff development, and setup/teardown, which increases the risk of technical failure during sessions."],
        "lab_notes": "*   Track your room usage daily to calculate quarterly utilization reports."
    },
    "III.C": {
        "perspective": "**Equipment Training Facilitation:** The SimOps specialist is the primary trainer for faculty on technical use. Use standardized checklists to assess faculty competency in operating A/V and simulators. Training should include how to 'reset' a room and basic troubleshooting.",
        "clinical": "Faculty confidence with technology reduces 'Psychological Noise' and allows them to focus on the learners' clinical performance.",
        "terminology": "*   **Train-the-Trainer:** A model where the specialist trains key faculty members who then train their peers.\n*   **Competency Checklist:** A tool to ensure uniform technical skill levels.",
        "scenarios": ["**Q:** A new faculty member wants to run a complex scenario alone. What is the best approach to ensure operational success?\n**A:** Provide a mandatory technical orientation and use a competency checklist to verify they can handle basic manikin and A/V operations before the session."],
        "lab_notes": "*   Create 'Cheat Sheets' for the control room that explain how to start/stop the most common scenarios."
    },
    "III.D": {
        "perspective": "**Resource Utilization & Inventory Management:\n*   **Operational Math:** Use formulas to prevent stockouts and justify budget.\n*   **PAR Level (Periodic Automatic Replenishment):** The minimum quantity of a supply to keep on hand. Formula: (Avg Daily Usage x Lead Time) + Safety Stock.\n*   **Lead Time:** Total time from ordering to arrival (e.g., if a part takes 4 weeks to arrive, your reorder point must be higher).\n*   **FIFO (First-In, First-Out):** Crucial for perishables like IV fluids or medications (even simulated ones).",
        "clinical": "Efficient inventory management ensures that clinical supplies (gauze, tubes, meds) are always available, preventing 'Simulator Artifacts' where a learner is told 'just pretend you have this'.",
        "terminology": "*   **PAR Level:** The 'Minimum' stock level required.\n*   **Lead Time:** The delay between ordering and receiving goods.\n*   **Safety Stock:** The 'Buffer' stock kept for unexpected spikes in demand.\n*   **Consumables:** Single-use items (gauze, meds, tape) that must be tracked for budget purposes.",
        "scenarios": ["**Q:** The lab is frequently running out of IV start kits. What is the operational solution?\n**A:** Calculate a **PAR Level** based on your average weekly usage and the supplier's **Lead Time**, then implement a tracking system (like a Kanban card) to trigger reorders."],
        "lab_notes": "*   Set 'Par Levels' for all high-volume supplies like tape, gloves, and alcohol pads."
    },
    "III.E": {
        "perspective": "**Safe Use of Equipment & Environment:** Adhere to OSHA and SDS (Safety Data Sheets) for simulated fluids. Ensure 'Sharps' safety protocols match the clinical environment. Check for latex allergies and ensure all equipment is cleaned/disinfected between sessions.",
        "clinical": "Physical & Psychological Safety: A trip hazard (cable) or a needle stick injury in the lab breaks the 'Fiction Contract' and can cause real harm.",
        "terminology": "*   **SDS (Safety Data Sheets):** Essential documents for every chemical/fluid in the lab.\n*   **Fiction Contract:** The agreement between learners and facilitators to treat the simulation as real.",
        "scenarios": ["**Q:** A student is accidentally stuck by a needle during a simulation. What is the first operational priority?\n**A:** Follow the center's bloodborne pathogen exposure protocol (even if the needle was 'clean') and then investigate if a safety-engineered device should have been used instead."],
        "lab_notes": "*   Post the SDS binder in a visible, central location.\n*   Use 'Safety Needles' whenever possible to mirror current clinical practice."
    }
}

domain_iv_knowledge = {
    "IV.A": {
        "perspective": "**Advocacy for Simulation:** Promote the value of simulation by demonstrating ROI (Return on Investment) through data. Use patient safety metrics, cost-avoidance from errors, and learner satisfaction scores to advocate for resources and personnel. Engage in outreach to other departments to expand the center's impact.",
        "clinical": "Simulation advocacy directly impacts patient care by securing the resources needed to train clinical teams in high-risk, low-frequency procedures.",
        "terminology": "*   **ROI (Return on Investment):** The financial or clinical benefit vs. the cost of the program.\n*   **Stakeholders:** Individuals or groups with a vested interest in the simulation program (e.g., Dean, Hospital CEO, Nursing Director).",
        "scenarios": ["**Q:** You are asked to justify the purchase of a new $80k manikin to the hospital board. What is the most persuasive operational argument?\n**A:** Link the manikin's capabilities to a specific clinical safety goal, such as reducing the rate of post-partum hemorrhage complications through regular team training."],
        "lab_notes": "*   Collect one 'Success Story' per semester from a student who applied sim training in a real clinical emergency."
    },
    "IV.B": {
        "perspective": "**Collaboration and Teamwork:** Use 'Closed-Loop Communication' with faculty during scenarios (e.g., 'Confirming: Manikin heart rate is now 120'). Ensure 'Role Clarity' for all staff (tech, facilitator, actor). Handle technical-clinical conflicts professionally and privately.",
        "clinical": "Effective teamwork in the control room prevents 'Role Confusion' that can distract learners and compromise the educational objectives.",
        "terminology": "*   **Closed-Loop Communication:** Sender states a message -> Receiver repeats it -> Sender confirms.\n*   **Role Clarity:** Everyone knows their specific job (e.g., who is the confederate, who is the operator).",
        "scenarios": ["**Q:** During a scenario, an instructor asks the manikin to do something technically impossible. How should the operator handle this?\n**A:** Use closed-loop communication to suggest a technically feasible alternative that still meets the clinical objective, and debrief with the instructor afterward to manage expectations."],
        "lab_notes": "*   Establish a 'Standard Phrase' list for communicating between the control room and the sim room."
    },
    "IV.C": {
        "perspective": "**Respectful Relationships with Stakeholders:** Treat all participants (learners, faculty, actors) with professional courtesy. The SimOps specialist is often the 'Face of the Lab'; your attitude sets the tone for the 'Learning Culture'. Manage stakeholder expectations through clear communication.",
        "clinical": "Building trust with faculty ensures they feel comfortable bringing their students into the lab, fostering a 'Safe to Fail' culture.",
        "terminology": "*   **Stakeholder Management:** Balancing the needs and expectations of different groups involved in the lab.\n*   **Learning Culture:** The environment where learners feel safe and supported in their professional growth.",
        "scenarios": ["**Q:** A high-profile stakeholder wants to tour the lab during a high-stakes exam. What is the appropriate response?\n**A:** Respectfully decline or reschedule the tour to protect the learners' confidentiality and the integrity of the exam, citing the lab's professional standards."],
        "lab_notes": "*   Greet every learner group with a brief 'Tech Orientation' to lower their anxiety and build rapport."
    },
    "IV.D": {
        "perspective": "**Legal, Ethical, and Professional Standards:\n*   **ASPE Standards (Standardized Patients):** Focus on Safe Work Environment, Case Development, and SP Training.\n*   **Psychological Safety:** Ensuring SPs and learners are protected. Include 'De-roling' to help SPs transition out of character.\n*   **Ethics:** Protect learner confidentiality ('Vegas Rule') and data integrity.",
        "clinical": "Confidentiality is the bedrock of simulation. Following ASPE standards ensures that human actors (SPs) are treated ethically and that the data they collect (e.g., student checklists) is reliable for high-stakes assessment.",
        "terminology": "*   **ASPE:** Association of Standardized Patient Educators.\n*   **De-roling:** Techniques used to help an SP leave their character's emotions/physicality behind after a session.\n*   **Vegas Rule:** 'What happens in sim, stays in sim.'\n*   **Safe Work Environment:** One of the 5 pillars of ASPE SOBP.",
        "scenarios": ["**Q:** After a high-intensity simulation involving a 'patient death,' the SP actor appears visibly distressed. What is the specialist's/facilitator's duty?\n**A:** Implement **De-roling** techniques and provide a safe space for the SP to transition out of the role, as mandated by the ASPE Standards of Best Practice (Safe Work Environment)."],
        "lab_notes": "*   Review your center's 'Confidentiality Agreement' and ensure it includes a section for Standardized Patients."
    },
    "IV.E": {
        "perspective": "**Personnel Roles in Simulation:** Understand the boundaries between the 'Operations Specialist,' 'Facilitator,' 'Debriefer,' and 'Embedded Participant' (Confederate). Often, the specialist must play multiple roles; clear transition between these roles is vital.",
        "clinical": "Techs acting as confederates (e.g., a family member) provide 'Clinical Realism' that can steer a scenario toward its learning objectives.",
        "terminology": "*   **Confederate (Embedded Participant):** An individual who plays a role to guide the scenario from the inside.\n*   **Operations Specialist:** Manages the tech and environment.\n*   **Facilitator:** Manages the overall learning experience.",
        "scenarios": ["**Q:** The lab is short-staffed, and you are asked to be both the manikin operator and a confederate nurse in the room. What is the risk?\n**A:** 'Cognitive Overload' for the operator, leading to delayed manikin responses or missed technical cues, which can break the simulation's fidelity."],
        "lab_notes": "*   Define your role clearly during the pre-brief: 'I will be in the control room as tech support today.'"
    },
    "IV.F": {
        "perspective": "**Professional Development & Exam Knowledge:** Stay current through conferences (IMSH, SimOps) and understand certification standards. For example, CHSOS uses the 'Angoff Method' for standard setting. The exam has 115 questions, but 15 are unscored 'pre-test' questions used for psychometric validation.",
        "clinical": "Understanding psychometrics ensures that when you help faculty design simulation exams, the passing scores are statistically valid and defensible, not just arbitrary numbers.",
        "terminology": "*   **Angoff Method:** A standard-setting method where a panel of experts estimates what percentage of minimally competent candidates would get each question right.\n*   **Pre-test Questions:** Unscored questions hidden in an exam to gather data for future tests.\n*   **Scaled Score:** Transforming a raw score into a standardized scale.",
        "scenarios": ["**Q:** During a certification exam, a candidate encounters a question covering an experimental, unreleased technology. Why is this likely included?\n**A:** It is likely one of the 15 unscored 'pre-test' questions used to gather psychometric data for future exams, and does not affect the candidate's final score."],
        "lab_notes": "*   Familiarize yourself with the exact CHSOS blueprint percentages to guide your professional development."
    },
    "IV.G": {
        "perspective": "**Innovation Assessment and Integration:** Evaluate new technologies (AR/VR, 3D printing, AI) based on their ability to solve real educational problems. Don't adopt 'Tech for Tech's Sake'. Pilot-test innovations to ensure technical stability before full implementation.",
        "clinical": "Innovative tech (like 3D-printed anatomy models) can provide 'Physical Fidelity' for procedures that manikins cannot realistically simulate.",
        "terminology": "*   **Early Adopter:** An individual or lab that tries new technology before it becomes mainstream.\n*   **Technical Feasibility:** Assessing whether a new tech can actually be supported by the current infrastructure.",
        "scenarios": ["**Q:** A SME wants to use a new AI-driven communication trainer. What should the Operations Specialist assess first?\n**A:** Assess the 'Technical Feasibility' (bandwidth, hardware requirements) and ensure it aligns with the learners' specific objectives."],
        "lab_notes": "*   Follow one Sim-Tech blog or YouTube channel to stay updated on emerging gear."
    },
    "IV.H": {
        "perspective": "**Diversity, Equity, and Inclusion (DEI):** Ensure manikins and task trainers represent diverse populations (skin tone, age, gender, body type). Recognize that bias in simulation design can lead to bias in real-world clinical care. Techs control the 'Physical Representation' of the patient.",
        "clinical": "Representation matters: Training on diverse manikin skins prepares clinicians to recognize clinical signs (like cyanosis) in patients of all skin tones.",
        "terminology": "*   **Representation:** The degree to which simulation materials reflect the diversity of the real patient population.\n*   **Implicit Bias:** Unconscious attitudes or stereotypes that affect our understanding and actions.",
        "scenarios": ["**Q:** All the manikins in the lab are of the same skin tone. Why is this a clinical training issue?\n**A:** It limits the learners' ability to recognize dermatological signs across different ethnicities, potentially leading to diagnostic bias in real practice."],
        "lab_notes": "*   Audit your inventory for diverse manikin 'Skins' or overlay kits and advocate for variety in future purchases."
    },
    "IV.I": {
        "perspective": "**Credible Resources:** Use peer-reviewed journals (*Simulation in Healthcare*), official manufacturer manuals, and the SSH Standards of Best Practice. Avoid 'Tribal Knowledge' that contradicts evidence-based practice or manufacturer safety guidelines.",
        "clinical": "Evidence-based practice in SimOps (e.g., using the correct lubricant) prevents equipment damage and ensures the 'Clinical Truth' of the simulator's behavior.",
        "terminology": "*   **Peer-Review:** A process where experts evaluate work before it is published.\n*   **HSSOBP™ (Healthcare Simulation Standards of Best Practice):** The gold standard for simulation program operations.",
        "scenarios": ["**Q:** A colleague tells you to use a specific household cleaner on a manikin, but the manual forbids it. What do you do?\n**A:** Follow the 'Credible Resource' (the manual) to prevent chemical damage to the manikin skin and inform your colleague of the official guideline."],
        "lab_notes": "*   Keep a physical or digital binder of all current manufacturer manuals in the control room."
    },
    "IV.J": {
        "perspective": "**Research Contribution:** Support data collection by exporting software logs, managing video data, and ensuring 'Technical Consistency' for every research subject. If the simulator behaves differently for Group A than Group B, the research is invalid.",
        "clinical": "Rigorous simulation research leads to improved clinical protocols and better patient outcomes.",
        "terminology": "*   **Software Logs:** Digital records of every action taken in the simulator software.\n*   **Standardization:** Ensuring every research participant experiences the exact same technical environment.",
        "scenarios": ["**Q:** You are assisting with a research study on nurse response times. During one session, the Wi-Fi drops and the manikin lags. What is the impact?\n**A:** The data for that session is compromised due to a lack of 'Technical Consistency' and may need to be excluded from the study."],
        "lab_notes": "*   Learn how to 'Timestamp' critical events in your simulation software for easier data analysis."
    },
    "IV.K": {
        "perspective": "**Psychological and Physical Safety:** Foster a 'Safe to Fail' environment where learners feel psychologically safe to make mistakes. Manage confidentiality and data security to maintain trust. Ensure the lab is physically safe (infection control, electrical safety, trip hazards).",
        "clinical": "Psychological safety is the foundation of learning. If a student feels 'shamed' in simulation, they are less likely to learn and may develop negative associations with clinical practice.",
        "terminology": "*   **Safe Container:** The psychological space created by facilitators where learners feel safe to take risks.\n*   **Psychological Fidelity:** The degree to which the learner feels the same pressure/emotions as in a real clinical event.",
        "scenarios": ["**Q:** A student is crying after a particularly intense simulation. What is the operational and facilitator priority?\n**A:** Provide immediate psychological support, ensure the debriefing focuses on learning rather than blame, and verify that the 'Fiction Contract' was not breached."],
        "lab_notes": "*   Include a 'Safety Briefing' in your pre-brief (e.g., 'If you see real smoke or a real injury, say the code word 'REAL WORLD')."
    }
}

domain_v_knowledge = {
    "V.A": {
        "perspective": "**Principles of Instructional Design:** Utilize the **ADDIE model**. Techs must identify which phase a problem belongs to. If learners are confused during the brief, it's a *Design/Develop* issue. If the manikin fails during the run, it's an *Implementation* issue.",
        "clinical": "Proper instructional design ensures that the simulation is not just a 'tech demo' but a structured educational event. A failure in the 'Analysis' phase (choosing the wrong modality) ruins the clinical outcome.",
        "terminology": "*   **ADDIE:** Analyze, Design, Develop, Implement, Evaluate.\n*   **Needs Assessment (Analysis):** The 'Why'. Identifying the gap in knowledge.\n*   **SME (Subject Matter Expert):** The individual with substantive expertise in the clinical topic area.",
        "scenarios": ["**[Analysis Level] Q:** During the 'Evaluate' phase of ADDIE, you notice that 80% of learners failed to recognize a simulated MI because the EKG was too blurry on the monitor. Where should the correction occur?\n**A:** In the **Development** phase. The technical setup (physical fidelity of the monitor) failed to support the educational objective."],
        "lab_notes": "*   Ask to see the 'Lesson Plan' or 'Syllabus' for any new scenario to trace the objective from Design to Evaluation."
    },
    "V.B": {
        "perspective": "**Collaborating with Subject Matter Experts (SMEs):** SMEs provide the 'Clinical Truth'; the specialist provides the 'Technical Reality'. Work with SMEs to ensure scenario triggers and transitions are clinically accurate but technically stable.",
        "clinical": "Collaboration prevents 'Simulator Artifacts' (unintended simulator behaviors) that can confuse learners and undermine the SME's clinical teaching.",
        "terminology": "*   **SME (Subject Matter Expert):** The clinical authority (e.g., Physician, Lead Nurse) who defines the scenario's medical content.\n*   **Technical Feasibility:** Determining if the SME's clinical goals can be reliably executed with the available technology.",
        "scenarios": ["**Q:** A SME wants a manikin to demonstrate a complex physical sign that it is not capable of. What is the specialist's role?\n**A:** Suggest an alternative modality (e.g., a confederate, a task trainer, or a verbal cue) that maintains the clinical objective without breaking the simulator."],
        "lab_notes": "*   Build a 'Technical Feasibility' checklist to use when meeting with SMEs for new scenario development."
    },
    "V.C.1": {
        "perspective": "**Needs Assessment:** Identify the 'Gap' between current performance and desired performance. Specialists provide data on what equipment or modalities can best bridge that gap (e.g., 'We need more code blue training because our actual hospital response times are slow').",
        "clinical": "Needs assessment ensures simulation resources are targeted at the areas of highest clinical risk or lowest learner confidence.",
        "terminology": "*   **Gap Analysis:** Identifying what is missing in the current training or performance.\n*   **Stakeholders:** Those who identify the need (e.g., hospital administrators, educators).",
        "scenarios": ["**Q:** A hospital sees an increase in medication errors. How does the SimOps specialist support the needs assessment?\n**A:** By identifying if current lab equipment (e.g., MAR software, IV pumps) is sufficient to simulate a high-fidelity medication administration scenario."],
        "lab_notes": "*   Review your lab's 'Usage Reports' to see which skills or scenarios are being requested most often."
    },
    "V.C.2": {
        "perspective": "**Goals, Objectives, and Outcomes:** Support the creation of SMART objectives. The specialist must understand these objectives to ensure the 'Tech' supports them (e.g., if the objective is 'Team Communication', the audio recording is more critical than the manikin's lung sounds).",
        "clinical": "Objectives define the 'Success Criteria' for the learner. If the tech fails to capture the data needed to measure these objectives, the simulation is ineffective.",
        "terminology": "*   **SMART Objectives:** Specific, Measurable, Achievable, Relevant, Time-bound.\n*   **Learning Outcome:** What the learner is expected to know or be able to do at the end of the session.",
        "scenarios": ["**Q:** An objective is: 'Learners will demonstrate correct CPR technique'. What operational support is required?\n**A:** Ensuring the manikin's QCPR sensors are calibrated and the feedback software is running correctly."],
        "lab_notes": "*   Ask yourself: 'What is the one thing the learner MUST do today?' and make sure that tech works 100%."
    },
    "V.C.3": {
        "perspective": "**Assessment and Evaluation Methods:** Use checklists, rubrics, or automated software scoring. Distinguish between Formative (feedback for learning) and Summative (grading for competency). Specialists ensure the technical reliability of these assessment tools.",
        "clinical": "Reliable assessment tools ensure that clinical competency is accurately measured before a learner works with real patients.",
        "terminology": "*   **Formative Evaluation:** 'Low stakes' feedback given during the learning process.\n*   **Summative Evaluation:** 'High stakes' testing at the end of a unit or course.",
        "scenarios": ["**Q:** You are running a summative exam and the automated scoring system fails. What is the operational backup?\n**A:** Having a paper-based rubric or a secondary recording system ready so the facilitator can still assess the learner's performance."],
        "lab_notes": "*   Learn how to build 'Custom Checklists' in your simulation software to automate data collection."
    },
    "V.C.4": {
        "perspective": "**Reliability and Validity:** Reliability is consistency (Does the sim run the same way every time?). Validity is accuracy (Does the sim measure what it's supposed to?). Specialists ensure reliability through standard operating procedures (SOPs) and technical maintenance.",
        "clinical": "If a simulation lacks validity (e.g., a 'healthy' manikin has a pulse of 40), the learner's clinical judgment is misled.",
        "terminology": "*   **Reliability:** The degree to which an assessment tool produces stable and consistent results.\n*   **Validity:** The extent to which a test measures what it claims to measure.",
        "scenarios": ["**Q:** A learner fails an exam because the manikin's blood pressure sensor was poorly calibrated. Is this a reliability or validity issue?\n**A:** Reliability (the technical system provided inconsistent/inaccurate data that should have been stable)."],
        "lab_notes": "*   Test your 'Scenario Script' three times before a live session to ensure it transitions reliably between states."
    },
    "V.C.5": {
        "perspective": "**Logistics (Location, Resources):** Manage room scheduling, equipment transport, and setup/teardown times. Logistics also include 'In-Situ' simulation (running sim in a real clinical area), which requires coordinating with hospital staff and managing equipment 'footprint'.",
        "clinical": "Smooth logistics prevent 'Cognitive Overload' for both learners and faculty, allowing them to stay immersed in the clinical scenario.",
        "terminology": "*   **In-Situ Simulation:** Simulation that takes place in the actual clinical environment (e.g., an empty ED room).\n*   **Footprint:** The physical space occupied by equipment and personnel.",
        "scenarios": ["**Q:** You are planning an in-situ simulation in a busy ICU. What is the most critical logistical task?\n**A:** Ensuring all simulation equipment (especially 'Simulated Meds') is clearly marked and removed after the session to prevent accidental use on real patients."],
        "lab_notes": "*   Use a 'Room Setup Map' to ensure every instructor gets the same layout every time."
    },
    "V.C.6": {
        "perspective": "**Equipment and Supplies:** Match the 'Tool to the Task'. Ensure all clinical supplies (gauze, meds, tubes) are prepared and consistent with the scenario's fidelity level. Manage the supply chain for consumables to avoid mid-session shortages.",
        "clinical": "Under-preparing supplies (e.g., having the wrong size ET tube) breaks the 'Suspension of Disbelief' and distracts from clinical learning.",
        "terminology": "*   **Consumables:** Items that are used up during a session (tape, IV kits, fake blood).\n*   **Fidelity:** The degree of realism of the equipment and environment.",
        "scenarios": ["**Q:** The objective is 'Chest Tube Insertion'. Which equipment choice is best: A high-fidelity manikin or a dedicated chest-tube task trainer?\n**A:** A dedicated task trainer (it allows for repetitive practice and realistic 'feel' that a full-body manikin might not provide for this specific skill)."],
        "lab_notes": "*   Create 'Scenario Supply Bins' (e.g., 'Post-Partum Hemorrhage Bin') for rapid setup."
    },
    "V.C.7": {
        "perspective": "**Case/Scenario Design:** Support the 'Storyline' by programming 'States' and 'Transitions' in the software. Create 'Branching Logic' where learner actions (or inactions) lead to different clinical outcomes. Ensure the 'Conceptual Fidelity' makes medical sense.",
        "clinical": "Well-designed scenarios allow learners to see the direct consequences of their clinical decisions in a safe environment.",
        "terminology": "*   **State:** A specific clinical condition (e.g., 'V-Tach').\n*   **Transition:** The trigger that moves the simulator from one state to another (e.g., 'Defibrillation').",
        "scenarios": ["**Q:** A scenario is too easy and students finish early. What should the specialist and SME adjust for the next group?\n**A:** Add 'Triggers' or 'Distractors' that require higher-level clinical reasoning or faster intervention."],
        "lab_notes": "*   Map out your scenario logic on a whiteboard or flowchart before you start programming the software."
    },
    "V.C.8": {
        "perspective": "**Prebrief/Brief, Debrief, and Evaluation:\n*   **Debriefing Models:** **GAS** (Gather, Analyze, Summarize), **Plus-Delta** (What went well/What to change), and **The Diamond** (Description, Analysis, Application).\n*   **Evaluation Tools:** **DASH** (Debriefing Assessment for Simulation in Healthcare) is the standard for evaluating the quality of a debrief.\n*   **Tech Role:** Manage video playback, 'Tech Orientation' during prebrief, and data capture for evaluations.",
        "clinical": "Prebriefing establishes the 'Safe Container'. Effective debriefing using structured models like GAS ensures that learning objectives are met and clinical mistakes are corrected without shaming.",
        "terminology": "*   **GAS:** Gather, Analyze, Summarize.\n*   **Plus-Delta:** A simple debriefing tool for identifying strengths and areas for improvement.\n*   **DASH:** A tool used to assess the effectiveness of simulation debriefings.\n*   **The Diamond:** A debriefing framework involving Description, Analysis, and Application.",
        "scenarios": ["**Q:** A facilitator wants to objectively measure the quality of their own debriefing sessions. Which tool should the specialist recommend?\n**A:** The **DASH** (Debriefing Assessment for Simulation in Healthcare) tool."],
        "lab_notes": "*   Create a 'Debriefing Room Checklist' to ensure the A/V is ready for video review."
    },
    "V.C.9": {
        "perspective": "**Pilot Testing (Dress Rehearsal):** Conduct a full 'Run-Through' of new scenarios with 'Beta-Testers' (colleagues or experienced students). This is when technical bugs, logic errors, and missing supplies are identified and fixed.",
        "clinical": "Pilot testing ensures that the clinical 'Story' flows logically and that technical failures don't interrupt the learners' experience during the live session.",
        "terminology": "*   **Pilot Test:** A 'dry run' of the simulation to test all components.\n*   **Beta-Tester:** A person who tests the scenario before its official release.",
        "scenarios": ["**Q:** You are running a pilot and realize the manikin's SpO2 doesn't drop when the 'Airway Obstruction' trigger is activated. What is the fix?\n**A:** Adjust the scenario's 'Branching Logic' or 'State Transition' timing in the software to ensure the physiological response matches the clinical event."],
        "lab_notes": "*   Always pilot a new scenario with at least one person who hasn't seen the script before."
    },
    "V.C.10": {
        "perspective": "**Implementation to Participants:** The specialist manages the simulator's responses in real-time. Crucially, the exam tests 'Priority Logic': 1. Participant/Patient Safety, 2. Educational Objectives, 3. Equipment Preservation.",
        "clinical": "Smooth implementation keeps learners immersed. If a real medical emergency occurs during simulation (e.g., a student faints), the tech must immediately break the 'Fiction Contract' and initiate real-world emergency protocols.",
        "terminology": "*   **Implementation:** The act of running the simulation for the intended learners.\n*   **Priority Hierarchy:** Safety > Learning Objectives > Equipment.\n*   **Simulator Artifact:** An unnatural behavior that reminds the learner they are in a simulation.",
        "scenarios": ["**Q:** During a live session, the manikin's compressor starts smoking. What is the very first priority action?\n**A:** 1. Ensure the physical safety of the learners and staff (evacuate/fire protocol). Do NOT prioritize saving the manikin or pausing the software first."],
        "lab_notes": "*   Establish a safe word (e.g., 'Real World Emergency') to instantly stop any scenario."
    },
    "V.C.11": {
        "perspective": "**Evaluation and Improvement:** Collect and analyze data from student evaluations, faculty feedback, and software logs. Use 'Continuous Quality Improvement' (CQI) to refine the technical setup and scenario logic for future iterations.",
        "clinical": "Evaluation ensures the simulation program stays relevant to current clinical standards and continues to meet its educational goals.",
        "terminology": "*   **CQI (Continuous Quality Improvement):** A systematic approach to improving processes and outcomes.\n*   **Software Logs:** Digital records of learner interventions and simulator responses.",
        "scenarios": ["**Q:** Student evaluations consistently state that the 'Simulated Patient Monitor' was too small to read. What is the CQI response?\n**A:** Upgrade to a larger display or adjust the monitor's software layout to improve 'Visual Fidelity' and learner performance."],
        "lab_notes": "*   Read the 'Student Evaluations' after every major course to see if there are recurring technical complaints."
    }
}

domain_iii_extension_knowledge = {
    "III.F": {
        "perspective": "**Coordinating Requests, Supplies, and Feedback:** Use a centralized scheduling system (shared calendar, dedicated sim-management software, or a standardized request intake form) so competing faculty requests for the same room or manikin are resolved by policy, not by who emailed first. Build turnover buffers between back-to-back sessions to reset, restock, and clean, and cross-reference the master schedule against your supply inventory before confirming a booking so you never approve a session you can't actually support. Close the loop on participant feedback by routing post-session surveys back to faculty and using them to adjust future scenario logistics.",
        "clinical": "Poor coordination shows up to learners as delays, missing supplies, or a room that wasn't reset, all of which erode the fiction contract and eat into precious debrief time. Systematically collecting and acting on participant feedback also closes the loop between the delivered experience and continuous quality improvement of the program.",
        "terminology": "*   **Request Intake Form:** A standardized form faculty submit to request a room, equipment, or supplies, ensuring the specialist has everything needed (headcount, objectives, consumables) before the session is scheduled.\n*   **Turnover Time:** The buffer built between sessions to clean, restock, and reset the room and equipment for the next group.\n*   **Closed-Loop Feedback:** The practice of routing participant/faculty evaluations back into planning so recurring logistical problems are actually fixed, not just recorded.",
        "scenarios": ["**Q:** Two faculty members both submit requests for the only high-fidelity adult manikin in the same time slot next Tuesday. What is the specialist's best first step?\n**A:** Check the master schedule and request intake records for submission order, priority policy (e.g., accredited program requirements vs. elective use), and equipment availability, then resolve the conflict per the center's established scheduling policy, not on the fly, and communicate the resolution to both parties as early as possible."],
        "lab_notes": "*   Require a request intake form with lead time (e.g., two weeks) so supply needs can be sourced before the session date.\n*   Build 15 to 30 minutes of turnover time into every schedule block for high-use rooms."
    },
    "III.G": {
        "perspective": "**Safe Removal of Hazardous Materials:** After a session, sort waste at the point of generation: sharps go into a rigid sharps container before it reaches the fill line, blood-soaked moulage materials and any biological/animal tissue (e.g., porcine skin used for suturing labs) go into labeled red-bag regulated medical waste, and expired chemical fluids or cleaning agents are disposed of per their SDS instructions, never poured down a standard drain unless the SDS confirms it's safe. Wear appropriate PPE during teardown and know your institution's actual biohazard/EVS vendor and pickup schedule rather than improvising.",
        "clinical": "Mishandled sharps or biological waste is a genuine occupational exposure risk to staff and learners, and a center that doesn't follow regulated medical waste rules can face regulatory citations and jeopardize accreditation. Modeling correct disposal also reinforces the real clinical practices learners are expected to carry into the field.",
        "terminology": "*   **Regulated Medical Waste (RMW):** Biohazardous waste (used sharps, tissue, blood-soaked materials) that must be bagged, labeled, and disposed of through a licensed medical waste vendor, not regular trash.\n*   **Fill Line:** The marked maximum-capacity line on a sharps container; containers must be replaced once waste reaches it, never packed down.\n*   **PPE Doffing:** The correct sequence for removing gloves, gowns, or eye protection after handling contaminated materials to avoid self-contamination.",
        "scenarios": ["**Q:** A suturing lab using porcine (pig) tissue has just ended. What is the correct disposal process for the tissue and any blood-contaminated drapes?\n**A:** Bag the tissue and contaminated drapes as regulated medical waste in a labeled red biohazard bag and route it through the institution's licensed medical waste pickup, following local/state regulations, rather than placing it in standard trash."],
        "lab_notes": "*   Post the location of the nearest sharps container and biohazard bin in every sim room.\n*   Keep a running relationship with your facility's EVS/biohazard vendor so pickup can be scheduled around tissue-based labs in advance."
    },
    "III.H": {
        "perspective": "**Utilization Data Collection & Review:** Track every booked hour against every actually-used hour for each room, manikin, and task trainer, not just headcount of sessions run. Log this in your scheduling system or a dedicated tracking sheet, then review it on a regular cadence (monthly or quarterly) with stakeholders like the steering committee, education director, or department chairs so purchasing, staffing, and space decisions are backed by data instead of anecdote.",
        "clinical": "Utilization data is what justifies (or denies) new equipment purchases, additional staff, and expanded hours, and it's also a documentation point accreditation bodies look for as evidence of good stewardship of program resources.",
        "terminology": "*   **Utilization Rate:** The percentage of available room/equipment time that was actually booked and used, often tracked to identify both underused assets and dangerously over-booked ones.\n*   **Waitlist Data:** Records of requests turned away or delayed due to lack of capacity, a strong data point for justifying expansion.\n*   **Steering Committee:** The group of stakeholders and institutional leaders, often including finance and risk management representatives, who use utilization data to guide budget and strategic decisions.",
        "scenarios": ["**Q:** The steering committee is deciding whether to fund a second high-fidelity manikin. What data should the specialist present to make the strongest case?\n**A:** Utilization rate for the existing manikin over the past year alongside documented waitlist or turned-away requests, showing sustained demand that the current inventory cannot meet."],
        "lab_notes": "*   Log actual start/end times for sessions, not just the scheduled block, since sessions that run short or long affect real utilization.\n*   Watch for a utilization rate that's too high (e.g., above 85 to 90 percent) as a sign there's no buffer left for preventive maintenance or staff development."
    },
    "III.I": {
        "perspective": "**Principles of Realism (Fidelity):** Realism isn't one dial, it's several: physical/equipment fidelity (how much the manikin or task trainer looks and behaves like the real thing), environmental fidelity (props, sounds, smells, room layout that match the clinical setting), and psychological fidelity (whether the scenario feels emotionally and cognitively real, through time pressure, a ringing phone, or a family member actor). A cheap task trainer with strong psychological fidelity can teach a skill better than an expensive high-tech manikin used in a way that doesn't match the learning objective, so match the type and level of realism to what the objective actually requires rather than chasing the highest tech available.",
        "clinical": "Realism supports the learners' suspension of disbelief and the fiction contract, which is what allows skills practiced in the lab to transfer to real clinical performance. Mismatched or unnecessary realism can distract learners or waste budget without improving the outcome.",
        "terminology": "*   **Physical (Equipment) Fidelity:** How closely a simulator's appearance and mechanical function replicate the real device or patient.\n*   **Environmental Fidelity:** How closely the physical space, props, sounds, and smells replicate the real clinical setting.\n*   **Psychological Fidelity:** The degree to which a scenario evokes the emotional and cognitive experience of the real situation, regardless of how \"high-tech\" the equipment is.\n*   **Affordance:** What a given simulation modality actually trains well, independent of its cost or technical complexity.",
        "scenarios": ["**Q:** A program has a limited budget and needs to teach rapid recognition and escalation of a deteriorating patient. Which investment better serves the learning objective: a top-of-the-line high-fidelity manikin used passively, or a mid-range manikin combined with realistic time pressure, an overhead page, and a confederate charge nurse?\n**A:** The mid-range manikin with strong psychological and environmental fidelity, since the objective depends on the learner's stress response and decision-making under realistic pressure, not on the manikin's physiologic complexity."],
        "lab_notes": "*   Add low-cost environmental fidelity (ambient hospital sounds, a cluttered bedside table, an overhead page) before assuming you need new hardware.\n*   Match fidelity investment to the stated learning objective for each scenario rather than defaulting to \"use the best manikin we own.\""
    },
    "III.J": {
        "perspective": "**Scenario Modifications, Reliability & Validity:** Once a scenario is being used for assessment (high-stakes exams, OSCEs, competency checks), it must run identically for every learner or group: same props, same moulage, same manikin responses, same timing, same rater instructions. Swapping a manikin model mid-cohort, changing a prop, or letting a facilitator improvise cues introduces a variable that wasn't controlled for, which can silently invalidate the comparison between groups even if nobody notices anything \"wrong\" during the session itself.",
        "clinical": "Reliability (consistency of results across repeated administrations or raters) and validity (whether the assessment actually measures the competency it claims to) are the backbone of any defensible high-stakes evaluation. If the technical setup varies between test groups, the results can no longer be fairly compared, undermining both the individual learner's evaluation and any research or accreditation data drawn from it.",
        "terminology": "*   **Reliability:** The consistency of a measurement or scenario delivery across repeated administrations, raters, or groups.\n*   **Validity:** The degree to which an assessment actually measures the competency or construct it claims to measure.\n*   **Inter-rater Reliability:** The degree of agreement between different evaluators scoring the same performance; low agreement signals a flawed tool or inconsistent rater training.\n*   **Confounding Variable:** An unintended change (equipment swap, prop difference, timing shift) that could explain a difference in outcomes instead of the variable actually being tested.",
        "scenarios": ["**Q:** Midway through a semester's worth of identical competency-based assessment sessions, the primary manikin breaks and is replaced with a different model that has different palpable landmarks. What is the specialist's operational responsibility?\n**A:** Document the equipment change and flag it to the faculty/assessment lead immediately, since it introduces a confounding variable that threatens the reliability and validity of comparing pre-swap and post-swap learner performance; the affected sessions may need to be reassessed or excluded from the aggregate data."],
        "lab_notes": "*   Keep a standardized setup checklist (props, moulage, manikin settings, timing script) for any scenario used in assessment, and treat any deviation as a logged event.\n*   When equipment must be substituted mid-course, notify faculty in writing so they can decide how to handle the affected data."
    },
    "III.K": {
        "perspective": "**Risk Management in Simulation:** Simulation isn't just a training tool, it's also a risk-detection tool. Running in-situ sessions in a real unit frequently surfaces latent safety threats (LSTs), like a dead defibrillator battery, a missing airway cart item, or a confusing medication storage layout, that pose real danger to future patients. The specialist's job is to notice these, document them, and route them through the institution's actual patient-safety or risk-management reporting channel, not just quietly fix the immediate problem and move on. Programmatic risk also includes protecting the fiction contract and psychological safety of participants, and keeping the center connected to institutional risk management, quality, and patient safety stakeholders (often represented on the steering committee).",
        "clinical": "A latent safety threat found during simulation and reported through the correct channel can prevent real patient harm before it happens, which is one of the strongest patient-safety arguments for in-situ simulation programs. Failing to escalate an LST properly means the underlying systemic issue persists even after the sim event is long over.",
        "terminology": "*   **Latent Safety Threat (LST):** A system, equipment, or process problem uncovered during simulation that could cause real patient harm if left uncorrected.\n*   **In-Situ Simulation:** Simulation conducted in the actual clinical environment rather than a dedicated lab, which is often how LSTs are discovered.\n*   **Psychological Safety:** An environment where participants feel safe to perform, make mistakes, and be honest during debriefing without fear of punitive consequences, a core risk-management concern for the human side of simulation.",
        "scenarios": ["**Q:** During an in-situ code blue simulation in a real emergency department, the team discovers the crash cart's defibrillator has a dead battery. What is the specialist's proper next step after the session?\n**A:** Report the finding as a latent safety threat through the hospital's official patient-safety/incident reporting system so unit leadership and biomedical engineering address the root cause, in addition to informally notifying staff on the unit."],
        "lab_notes": "*   Keep a dedicated LST log for every in-situ event, separate from routine debriefing notes.\n*   Know your institution's actual risk management/patient safety escalation pathway before running in-situ sessions, not after finding a problem."
    },
    "III.L": {
        "perspective": "**Moulage Application & Removal:** Before applying any moulage product to a manikin, test it on a hidden patch of the manikin's skin first, since dyes, glues, and fake blood can permanently stain or degrade simulated skin and void the manufacturer's warranty. A thin barrier layer (like a bit of wax or barrier film) applied before makeup helps prevent absorption into the material. For removal, use manufacturer-recommended, silicone-safe removers (mild soap and water, baby oil, or approved adhesive removers) rather than harsh solvents like acetone, which can damage synthetic skin. Effort should scale to the learning objective: if the wound isn't tied to an objective, keep it simple, and if you can't execute it convincingly, skip it entirely, since an unfinished or unrealistic moulage effect can do more harm to immersion than no moulage at all.",
        "clinical": "Well-executed moulage adds sensory fidelity (sight, and sometimes smell, such as simulating the odor of infection) that prompts learners to examine and ask about findings rather than relying on a verbalized cue, reinforcing real physical assessment skills. Poorly executed moulage can teach learners an inaccurate visual reference for a real condition.",
        "terminology": "*   **Moulage:** The art and technique of applying makeup, prosthetics, and props to a manikin or standardized patient to simulate wounds, bruising, or other physical findings.\n*   **Sensory Fidelity:** Realism delivered through senses beyond sight, such as smell or texture, layered onto a moulage effect to increase immersion.\n*   **Barrier Layer:** A protective layer (wax, film, or similar product) applied to simulated skin before moulage to prevent staining or material degradation.",
        "scenarios": ["**Q:** A specialist is about to apply a fresh gunshot wound moulage effect directly onto the torso of a new, expensive high-fidelity manikin ahead of a high-stakes OSCE. What should be done first?\n**A:** Test the moulage product on an inconspicuous area of the manikin's skin to confirm it won't stain or degrade the material, and apply a barrier layer before the visible application, protecting the equipment and the manufacturer's warranty."],
        "lab_notes": "*   Keep a stocked moulage kit (color wheel, stage blood ingredients, adhesives, and their matching removers) and photograph each finished effect so it can be recreated identically for standardized, repeatable scenarios.\n*   Always confirm removal method compatibility with manikin skin type before an event, not mid-teardown."
    },
    "III.M": {
        "perspective": "**Stakeholder Orientation:** New faculty, learners, and even visiting staff need a structured orientation to simulation principles (how the fiction contract works, what's expected of them), the equipment (what the manikin can and can't do, how to call for help mid-scenario), and the physical space (where the control room is, where supplies live, room layout) before they're expected to perform in a live session. This is distinct from clinical training: orientation is high-level familiarization, not teaching the medical content itself. Skipping it front-loads confusion into the actual scenario and burns debrief time on logistics instead of learning.",
        "clinical": "A well-oriented participant spends their cognitive effort on the clinical problem instead of figuring out how the equipment works or what the rules of the simulated space are, which protects both learning outcomes and psychological safety. For new faculty specifically, a thorough equipment and space orientation prevents them from unintentionally running a session incorrectly in front of learners.",
        "terminology": "*   **Orientation Packet:** A standardized document or checklist covering equipment capabilities, space layout, and simulation ground rules given to new stakeholders before their first session.\n*   **Train-the-Trainer:** A dedicated orientation/training session for new faculty on equipment and facilitation before they run a live session independently.\n*   **Ground Rules:** The explicit expectations set at the start of an orientation or prebrief (confidentiality, suspension of disbelief, how to signal a technical issue) that support the fiction contract.",
        "scenarios": ["**Q:** A newly hired adjunct faculty member is scheduled to run their first high-fidelity scenario next week and has never operated the manikin control software. What should the specialist do first?\n**A:** Schedule a dedicated train-the-trainer orientation session covering the manikin's capabilities, control software, and room layout before the live session with students, rather than trying to walk them through it for the first time while learners are present."],
        "lab_notes": "*   Build a standing orientation checklist for new faculty and one for new learner cohorts, covering equipment, space, and ground rules separately.\n*   Include a hands-on equipment walkthrough, not just a verbal explanation, since most orientation failures show up as \"I didn't know it could do that\" mid-scenario."
    },
    "III.N": {
        "perspective": "**Public Relations & Community Outreach:** Simulation specialists routinely support guided tours for donors, prospective students, press, and community groups, as well as open houses and speaking events. Keep a rehearsed, ready-to-run \"show and tell\" scenario that demonstrates the technology without disrupting the actual teaching schedule, and manage visitor access so equipment isn't handled by untrained hands. Any photography or media request needs a signed release and a check that no real learner data, protected health information, or ongoing assessment is visible on monitors or paperwork during the visit.",
        "clinical": "Outreach and PR activities build the institutional support, funding, and community goodwill that sustain a simulation program long-term, but they must never compromise learner confidentiality or interrupt a real teaching session to accommodate a visit.",
        "terminology": "*   **Community Outreach:** Public-facing activities (tours, open houses, speaking engagements) that build awareness and support for the simulation program outside its immediate learner population.\n*   **Media/Photography Release:** A signed consent form required before any photo, video, or press coverage involving identifiable learners or the facility is captured or published.\n*   **Showcase Scenario:** A pre-built demonstration scenario used for tours and media events specifically so it doesn't interfere with the live teaching calendar or expose real assessment data.",
        "scenarios": ["**Q:** A local news crew wants to film a demonstration in the simulation lab during normal operating hours. What is the specialist's operational priority before allowing filming?\n**A:** Confirm signed media releases are in place, reroute the crew to a prepared showcase scenario rather than an active teaching or assessment session, and verify no real learner data or PHI is visible anywhere in the shot."],
        "lab_notes": "*   Keep a standing \"showcase\" scenario staged and ready so tours never require pulling a room from the active teaching schedule.\n*   Maintain a simple one-page fact sheet (capabilities, program stats, contact info) for tour guides and visitors to take away."
    }
}

domain_v_extension_knowledge = {
    "V.D": {
        "perspective": "**Interprofessional/Interdisciplinary Education (IPE):** IPE puts learners from two or more professions (nursing, medicine, pharmacy, respiratory therapy, social work) into the same scenario so they learn *with, from, and about* each other, not just alongside each other. As the tech, this means casting real scope-of-practice roles instead of one learner playing every part, building a room that supports multiple simultaneous tasks (med pass, airway, documentation), and coordinating A/V and debrief so every profession's contribution is captured and discussed, not just the \"lead\" role's. **Interdisciplinary** is a related but distinct term: it integrates perspectives by having each discipline examine the problem from its own base of knowledge, which is more siloed than the shared, team-based goal of true interprofessional work.",
        "clinical": "Real clinical care is delivered by teams, not individuals, so IPE scenarios (Sim-IPE) are what let learners rehearse closed-loop communication, role clarity, and hand-offs across professions before those gaps show up at the bedside. A well-run IPE session directly targets teamwork and communication failures, which remain leading contributors to preventable patient harm.",
        "terminology": "*   **IPE (Interprofessional Education):** An educational activity where students from two or more professions learn about, from, and with each other to improve collaboration and the quality of care.\n*   **Sim-IPE (Simulation-Enhanced Interprofessional Education):** The use of simulation-based methods specifically to deliver IPE learning outcomes.\n*   **Interdisciplinary Learning:** Working jointly but addressing the problem from each discipline's individual perspective; more siloed than interprofessional collaboration, which shares one team goal.\n*   **Interprofessionalism:** The effective integration of professionals through mutual respect, trust, and shared responsibility, built through communication, problem-solving, and conflict-resolution skills practiced in scenarios like these.",
        "scenarios": ["**Q:** A nursing program and a medical school both want to run a \"deteriorating patient\" scenario next semester, but their academic calendars only overlap for two afternoons. The nursing cohort is triple the size of the medical cohort. What is the Operations Specialist's biggest logistical concern?\n**A:** Scheduling and cohort-balancing across programs. This is the core **limitation** of IPE: aligning calendars, faculty availability, and uneven class sizes across independent academic units, which often forces rotating small groups through a limited number of live sessions rather than one single large event."],
        "lab_notes": "*   Build a shared master calendar with every partnering program's academic term dates before scenario design even starts; IPE fails on logistics far more often than on scenario content.\n*   Confirm each participating profession has moulage/props/equipment matched to its real scope of practice (e.g., a pharmacy student needs access to the med room, not just the bedside) so the \"benefit\" of authentic role practice is not lost to a thin setup."
    },
    "V.E": {
        "perspective": "**Distance/Remote Simulation:** This is any simulation-based training where the facilitator, the manikin operator, and/or the learners are not all in the same physical room, connected instead through web-conferencing, screen-sharing, and streamed A/V (the specific version run live over telecommunications tools is often called **Telesimulation**). As the tech, your job shifts from managing a room to managing a network: you're the one ensuring bandwidth, camera framing, and audio routing don't become the story of the session. A **benefit** is reach: a single scenario and one skilled operator can now serve learners at a rural clinic, a partner hospital, or a home office who could never otherwise get to a sim center. The core **limitation** is fidelity loss — learners on a screen cannot get hands-on haptic feedback from a manikin, and the whole session lives or dies on network quality.",
        "clinical": "Distance simulation lets programs deliver consistent, standardized training to geographically dispersed learners (rural EMS, satellite nursing campuses, disaster-response teams) who would otherwise receive no simulation-based education at all, directly supporting equitable access to training.",
        "terminology": "*   **Telesimulation:** The use of telecommunication technology (web-conferencing, screen-sharing, webcams) to deliver simulation-based education to learners who are geographically remote from the instructor.\n*   **Distance Simulation:** A method of healthcare training in which the learners and facilitators are in different physical locations, connected via networked simulation and communication technology.\n*   **Synchronous:** Real-time delivery, where the remote learners and the facilitator/manikin interact live, together, at the same time.\n*   **Asynchronous:** Delivery where the learner engages with recorded or self-paced simulation content on their own schedule, without a live facilitator present.",
        "scenarios": ["**Q:** A regional hospital system wants to run a live, synchronous code-blue scenario for a satellite clinic 200 miles away, streaming the manikin's vitals monitor and room audio over the clinic's guest Wi-Fi. During the debrief, learners report the manikin's voice sounded delayed and \"robotic,\" and several critical teaching moments were missed because the video froze. What should the Operations Specialist address first for the next session?\n**A:** Move the connection off the shared guest network onto a dedicated, bandwidth-reserved connection (or a wired connection) to eliminate the latency and jitter causing the audio/video degradation. This is the central **limitation** of distance simulation: the educational experience is only as reliable as the network carrying it, so network quality has to be treated as a scenario design requirement, not an afterthought."],
        "lab_notes": "*   Run a technical dry-run over the actual link (not just on the local LAN) before any live distance session, since a remote site's real-world bandwidth is rarely what was promised.\n*   Have a low-tech backup plan (phone bridge, recorded scenario) ready in case the live connection fails mid-session, so the educational objective can still be salvaged."
    },
    "V.F": {
        "perspective": "**Simulation Modalities:** From an instructional-design standpoint, the question isn't \"which modality is coolest,\" it's \"which modality actually delivers this learning objective.\" A **manikin** buys you physiologic and psychomotor realism (you can feel a pulse, hear breath sounds change) but only trains one small group at a time and needs constant maintenance. **AR/VR/XR** buys you scale and access to environments you could never build physically (a mass-casualty scene, an OR you don't have), but immersive headsets carry real risk of cybersickness and, without added haptic hardware, learners can't actually *feel* anything they're doing. **Screen-based simulation** (a computer-based scenario run with mouse/keyboard, no specialized hardware) is the cheapest and most scalable option for practicing cognitive decision-making and branching clinical logic, but it strips out almost all psychomotor and team-communication fidelity. Pick the modality by matching it to the objective first, budget and space second.",
        "clinical": "Matching modality to objective protects the learner's cognitive load and suspension of disbelief: a psychomotor skill like chest compressions taught only on a screen produces false confidence, while a team-communication objective doesn't need a six-figure manikin to succeed. Choosing the wrong modality wastes resources and can actively undertrain a critical skill.",
        "terminology": "*   **Extended Reality (XR):** The umbrella term covering the full spectrum of Augmented Reality (AR), Virtual Reality (VR), and Mixed Reality (MR) technology-mediated experiences.\n*   **Screen-Based Simulation:** A simulation presented through a computer screen, using keyboard/mouse/joystick input rather than specialized simulation hardware; strong for decision-making and branching-logic practice, weak for psychomotor and team-dynamic skills.\n*   **Immersive vs. Non-Immersive VR:** Immersive VR uses a wearable head-mounted display to track the user and present a full 360-degree virtual environment; non-immersive VR uses surrounding screens (like a flight-sim cockpit) without fully isolating the user from the room.\n*   **Virtual Patient:** A specific type of screen-based or computer-based simulation in which learners interact with a simulated patient case, typically to practice clinical reasoning and decision-making.",
        "scenarios": ["**Q:** A program director wants learners to practice recognizing early signs of sepsis across 200 first-year students in a single afternoon, with a limited budget and no dedicated sim lab space that week. Which modality best fits, and what is the trade-off?\n**A:** Screen-based/virtual-patient simulation. It scales to large cohorts cheaply and asynchronously, but the trade-off is a **limitation**: learners get no hands-on psychomotor practice (starting an IV, assessing skin turgor) and no live team-communication rehearsal, so it should be paired with a smaller, later manikin- or SP-based session before the skill is considered mastered."],
        "lab_notes": "*   Keep a simple decision matrix posted for faculty (objective type: psychomotor / cognitive-decision / communication / rare-environment exposure -> recommended modality) so modality requests stop defaulting to \"whatever's newest.\"\n*   Before adopting a new AR/VR/XR headset system, budget for the hardware refresh cycle and a cybersickness mitigation plan (frame rate, calibration, session length limits), not just the sticker price of the unit."
    }
}


def update_expert_knowledge():
    file_path = "expert_knowledge.json"

    # Load existing
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            data = json.load(f)
    else:
        data = {}

    # Update with all domains
    all_domains = [
        domain_i_knowledge,
        domain_ii_knowledge,
        domain_iii_knowledge,
        domain_iv_knowledge,
        domain_v_knowledge,
        domain_iii_extension_knowledge,
        domain_v_extension_knowledge
    ]

    # Non-destructive merge: expert_knowledge.json accumulates richer content
    # (e.g. multiple "scenarios" per KSA) over time than this seed file, so we
    # only fill in KSAs that are missing entirely and never overwrite an
    # existing entry's fields.
    added = []
    skipped = []
    for domain in all_domains:
        for key, value in domain.items():
            if key not in data:
                data[key] = value
                added.append(key)
            else:
                skipped.append(key)

    # Write back
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    if added:
        print(f"expert_knowledge.json: added {len(added)} missing KSA(s): {', '.join(added)}")
    if skipped:
        print(f"expert_knowledge.json: left {len(skipped)} existing KSA(s) untouched (already present).")
    print("expert_knowledge.json updated (non-destructive merge complete).")



if __name__ == "__main__":
    update_expert_knowledge()
