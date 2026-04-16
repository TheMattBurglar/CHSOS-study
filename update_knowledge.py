import json
import os

domain_ii_knowledge = {
    "II.A.1": {
        "perspective": "**Core Networking Concepts:**\n*   **LAN vs. VLAN:** Isolated VLANs are best practice to prevent hospital network interference and reduce latency.\n*   **Static IP vs. DHCP:** Manikins usually require Static IPs or DHCP Reservations. If IP changes, connections drop.\n*   **Latency & Jitter:** Critical for distance simulation. High latency = manikin response lag.\n*   **OSI Model relevance:** Focus on Layer 1 (Physical - cables), Layer 2 (Data Link - MAC addresses/Switches), Layer 3 (Network - IP/Routers).",
        "clinical": "When a manikin loses connection intermittently during an OSCE, the most likely technical cause is an IP conflict or channel interference on the Wi-Fi. The clinical impact is that student assessment is invalidated. Immediate action is required.",
        "terminology": "*   **MAC Address:** Unique hardware identifier.\n*   **Subnet Mask:** Defines network boundaries.\n*   **Ping / Traceroute:** First line of diagnostic commands.",
        "scenario": "**Q:** An instructor reports the manikin is 'lagging' when they trigger a cough. Both laptop and manikin are on the hospital's main guest Wi-Fi. What is the best long-term solution?\n**A:** Move the simulation equipment to a dedicated, isolated VLAN or closed network to eliminate bandwidth contention.",
        "lab_notes": "*   Identify the MAC address of your primary manikin.\n*   Document your lab's subnet and gateway.",
    },
    "II.A.2": {
        "perspective": "**A/V Equipment Utilization:**\n*   **PTZ (Pan-Tilt-Zoom) Cameras:** Essential for capturing non-verbal communication.\n*   **Microphones:** Boundary mics (room-wide) vs. Lavalier (lapel). Phantom power (+48V) may be needed for condenser mics.\n*   **Codecs:** H.264 / H.265 are standard for video compression.\n*   **Frame Rates & Resolution:** 1080p at 30fps is usually sufficient; 4K requires massive storage overhead.",
        "clinical": "Clear audio is critical during debriefing. If a student's closed-loop communication cannot be heard, the facilitator cannot evaluate their competency.",
        "terminology": "*   **Phantom Power:** DC voltage sent down mic cables.\n*   **Latency:** Delay between action and video display.\n*   **Bitrate:** Amount of data processed per second.",
        "scenario": "**Q:** During playback in debriefing, the video is clear but the audio has a loud humming noise. What is the most likely cause?\n**A:** A ground loop issue or unshielded audio cable running parallel to a power cable.",
        "lab_notes": "*   Map out the audio signal flow from the simulation room to the control room.",
    },
    "II.A.3": {
        "perspective": "**Software and Education Systems:**\n*   **LMS (Learning Management System):** Used for pre-brief materials, scheduling, and tracking completion.\n*   **Video Conferencing:** Zoom/Teams integration requires capturing the AV system's output as a virtual webcam.\n*   **Simulator Software:** LLEAP, Maestro, Muse. Often requires specific OS versions and dedicated graphics.",
        "clinical": "LMS integration ensures learners have completed prerequisites (like medication math) before arriving at a high-stakes simulation.",
        "terminology": "*   **SCORM / xAPI:** Standards for elearning software communication.\n*   **SSO (Single Sign-On):** Security and convenience for users.",
        "scenario": "**Q:** You need to stream a simulation to a remote classroom. Which setup ensures the lowest latency?\n**A:** A hardwired capture card directly encoding the camera feeds to the streaming PC, bypassing wireless networks.",
        "lab_notes": "*   Check your LMS integration capability with your AV debriefing system.",
    },
    "II.A.4": {
        "perspective": "**Systems Security:**\n*   **Physical:** Server rooms must be locked. Simulators should be secured when not in use.\n*   **Network:** WPA2/WPA3 Enterprise for Wi-Fi. Disable unused switch ports.\n*   **Data:** FERPA (student records) and HIPAA (if real patient data is used as a template, though it should be de-identified). Video recordings of students are considered educational records.",
        "clinical": "If a simulation involves standardized patients (SPs) portraying sensitive scenarios, video recordings must be stored on secure, encrypted servers, not external flash drives.",
        "terminology": "*   **FERPA:** Family Educational Rights and Privacy Act.\n*   **Encryption:** Data at rest vs. Data in transit.",
        "scenario": "**Q:** A faculty member asks to take a video of a student's poor performance home on a USB drive to grade it. What is the appropriate response?\n**A:** Deny the request based on FERPA regulations and provide secure, authenticated access to the video on the simulation network.",
        "lab_notes": "*   Review your center's data retention policy for video recordings.",
    },
    "II.A.5": {
        "perspective": "**Simulation Modalities:**\n*   **Manikins (High/Low Fidelity):** Best for physiological responses and psychomotor skills.\n*   **AR/VR:** High initial setup, excellent for spatial awareness and dangerous environments (e.g., fire response).\n*   **Standardized Patients (SPs):** Human actors; unparalleled for communication and empathy training.\n*   **Hybrid:** Combining SPs with task trainers (e.g., an SP wearing a suturing pad).",
        "clinical": "Choosing the right modality impacts the learner's suspension of disbelief (realism). An IV start is best on a task trainer, but breaking bad news requires an SP.",
        "terminology": "*   **Fidelity:** The degree of realism (Physical, Conceptual, Psychological).\n*   **Haptics:** Tactile feedback in VR/Task trainers.",
        "scenario": "**Q:** The learning objective is to teach residents how to deliver a complex diagnosis to a family. Which modality is most appropriate?\n**A:** Standardized Patient.",
        "lab_notes": "*   List the top 3 modalities used in your center and their primary use cases.",
    },
    "II.A.6": {
        "perspective": '**Healthcare vs. Simulation Equipment:**\n*   **Healthcare Equipment:** Defibrillators, ventilators. *Caution:* Real defibs require specialized simulator adapters to avoid blowing the manikin\'s motherboard.\n*   **Simulation Equipment:** Compressed air compressors, fluid fluid-mixing stations, control PCs.\n*   **Safety:** Never mix real meds/fluids with simulated ones. Clearly label "NOT FOR HUMAN USE".',
        "clinical": "Using real medical equipment increases physical fidelity but introduces clinical hazards (e.g., accidental shock from a real defib).",
        "terminology": "*   **Galvanic Isolation:** Protecting simulator circuits from real electrical shocks.",
        "scenario": "**Q:** A faculty member wants to use a real hospital defibrillator on a high-fidelity manikin. What must the SimOps specialist ensure?\n**A:** That the manikin is equipped with energy-absorbing posts/adapters and the software is set to receive live shocks.",
        "lab_notes": "*   Audit your lab for clear 'Simulated Use Only' labeling.",
    },
    "II.A.7": {
        "perspective": "**Data Management:**\n*   **Storage:** Video files (MP4) consume massive space. A NAS (Network Attached Storage) or SAN is required for large centers.\n*   **Retrieval:** Naming conventions are critical (e.g., YYYYMMDD_Course_Scenario).\n*   **Retention:** Policies must dictate when videos are purged (e.g., 30 days after the semester ends) to reduce liability and storage costs.",
        "clinical": "When a student challenges a grade, the video and log files are the primary evidence. Rapid retrieval is essential.",
        "terminology": "*   **NAS:** Network Attached Storage.\n*   **Data Retention Policy:** The lifecycle of a file from creation to deletion.",
        "scenario": "**Q:** Your center's storage server is at 99% capacity. What is the most appropriate first step?\n**A:** Implement the center's data retention policy to purge recordings older than the specified timeframe.",
        "lab_notes": "*   What is your center's video retention policy? (e.g., 30 days, 1 year?)",
    },
    "II.A.8": {
        "perspective": "**Simulation Spaces:**\n*   **Air Supply:** Compressors provide air for chest rise/fall. They can be noisy and should be isolated from the clinical space if possible. Check PSI requirements.\n*   **Connectivity:** Hardwired drops (RJ45) in the ceiling/floor are preferred over Wi-Fi for reliability.\n*   **Limitations:** Floor loading weights for heavy equipment (e.g., MRI simulators).",
        "clinical": "A loud, knocking air compressor in the room destroys psychological fidelity and distracts from the clinical scenario.",
        "terminology": "*   **PSI / Bar:** Pressure measurements for pneumatics.\n*   **Acoustic Isolation:** Soundproofing control rooms from sim rooms.",
        "scenario": "**Q:** You are designing a new simulation room. Where should the manikin's air compressor be located?\n**A:** In an adjacent, sound-insulated mechanical room or closet to minimize ambient noise.",
        "lab_notes": "*   Check the maintenance schedule on your lab's air compressors (draining condensation).",
    },
    "II.A.9": {
        "perspective": "**Cable Connectivity & Adapters:**\n*   **Video:** HDMI (standard, carries audio), DisplayPort (higher bandwidth, locking mechanism), SDI (broadcast standard, locking BNC connectors).\n*   **Adapters:** Active vs. Passive adapters. USB-C to HDMI often requires an active adapter if pushing 4K.\n*   **Dongles:** Label and tether them; they disappear frequently.",
        "clinical": "A loose display cable during a scenario means the learner loses their vital signs monitor, forcing an unnatural pause in the clinical flow.",
        "terminology": "*   **EDID (Extended Display Identification Data):** How a monitor tells the PC what resolutions it supports.\n*   **HDCP:** Copy protection that can sometimes block AV recording.",
        "scenario": "**Q:** You are running an HDMI cable 150 feet from the control room to the sim room display. The signal is dropping. Why?\n**A:** Standard HDMI degrades after ~50 feet. You need an active HDMI cable or an HDMI-over-Ethernet (HDBaseT) extender.",
        "lab_notes": "*   Standardize the display connections in all your briefing rooms.",
    },
    "II.A.10": {
        "perspective": "**Wireless Connectivity:**\n*   **Standards:** 802.11ac (Wi-Fi 5) or 802.11ax (Wi-Fi 6) are preferred. 5GHz provides faster speed but shorter range; 2.4GHz penetrates walls better.\n*   **Interference:** Microwaves, Bluetooth, and adjacent access points can cause dropped packets.\n*   **Security:** WPA2-Enterprise (802.1X) requires RADIUS authentication.",
        "clinical": "In in-situ simulations (running sim in a real hospital unit), wireless reliability is the biggest failure point due to enterprise network congestion.",
        "terminology": "*   **RSSI (Received Signal Strength Indicator):** Measures how strong the Wi-Fi signal is.\n*   **Access Point (AP):** Hardware that transmits the Wi-Fi signal.",
        "scenario": "**Q:** A manikin frequently disconnects only when moved to Room B. What is the first troubleshooting step?\n**A:** Check the Wi-Fi signal strength (RSSI) and identify potential physical interference (e.g., lead-lined walls) in Room B.",
        "lab_notes": "*   Perform a basic Wi-Fi heatmap check of your simulation rooms.",
    },
    "II.B.1": {
        "perspective": "**Determine AV equipment for use in the activity:**\n*   Match equipment to learning objectives. If assessing suturing, a fixed overhead camera won't work; you need a mobile or PTZ camera zoomed in.\n*   If doing a multi-room mass casualty, ensure audio routing allows the control room to hear all zones.",
        "clinical": "The AV setup dictates the debriefing quality. Poor camera angles mean the facilitator cannot point out specific clinical errors.",
        "terminology": "*   **Field of View (FOV):** How much of the room the camera captures.",
        "scenario": "**Q:** The objective is to evaluate a team's communication during a code blue. What is the most critical AV requirement?\n**A:** High-quality, room-wide audio capture (boundary microphones) to clearly hear closed-loop communication.",
        "lab_notes": "*   Create a standard camera preset (e.g., 'Bed focus', 'Room wide') for your PTZ cameras.",
    },
    "II.B.2": {
        "perspective": "**Recommend healthcare equipment for use:**\n*   Balance realism with budget. A $30k real ventilator might not be necessary if a $5k simulated ventilator meets the learning objectives.\n*   Ensure compatibility: Will the real IV pump connect properly to the manikin's fluid system?",
        "clinical": "Using the exact same model of IV pump in the sim lab as the hospital uses on the floor reduces cognitive load and improves transfer of skills.",
        "terminology": "*   **Transfer of Training:** Applying skills learned in sim to the real world.",
        "scenario": "**Q:** A faculty member wants to purchase a new brand of defibrillator for the sim lab. What is your primary recommendation?\n**A:** Purchase the exact same make and model used in the clinical environment the learners will be working in.",
        "lab_notes": "*   Audit your clinical equipment against the hospital's current standard.",
    },
    "II.B.3": {
        "perspective": "**Recommend simulation-specific equipment:**\n*   Understand the spectrum: Task trainer (skills) -> Low-fidelity (CPR) -> High-fidelity (complex physiology).\n*   Evaluate Total Cost of Ownership (TCO): Initial cost + annual maintenance + consumables (fake blood, skins).",
        "clinical": "Recommending an expensive high-fidelity manikin for basic CPR training is a poor use of resources; a specialized BLS task trainer provides better real-time compression feedback.",
        "terminology": "*   **Total Cost of Ownership (TCO):** The long-term financial impact of equipment.",
        "scenario": "**Q:** A nursing program wants to teach basic Foley catheter insertion. What equipment do you recommend?\n**A:** A dedicated IV/phlebotomy arm task trainer, not a full-body high-fidelity manikin.",
        "lab_notes": "*   Create an equipment request matrix based on learning objectives.",
    },
    "II.C.1": {
        "perspective": "**Technical troubleshooting and corrective action:**\n*   **The Troubleshooting Cycle:** 1. Identify the problem. 2. Establish a theory. 3. Test the theory. 4. Establish a plan of action. 5. Verify system functionality. 6. Document findings.\n*   **Common issues:** Power, Network/Connectivity, Software crash, Hardware failure (pneumatics/fluids).",
        "clinical": "During an exam, you have roughly 30 seconds to fix an issue before the scenario must be paused, breaking realism.",
        "terminology": "*   **Root Cause Analysis:** Finding the fundamental reason for a failure, not just treating the symptom.",
        "scenario": "**Q:** The manikin's chest stops rising during a scenario. The software shows respiratory rate is 20. What is the most likely hardware cause?\n**A:** The pneumatic air line has disconnected or the internal compressor has failed.",
        "lab_notes": "*   Develop a 1-page 'Quick Troubleshooting Guide' for the control room.",
    },
    "II.C.2": {
        "perspective": "**Preventive/regular maintenance and policy:**\n*   **Daily:** Flush fluid lines, power down PCs properly, wipe down manikin skin.\n*   **Monthly:** Deep clean fluid tanks (prevent mold), check software updates, inspect cables for fraying.\n*   **Annually:** Manufacturer PM (Preventive Maintenance) visits, recalibrate sensors (chest compression depth).",
        "clinical": "Failure to flush simulated blood lines leads to mold and clogs, permanently damaging the manikin and ruining future hemorrhage scenarios.",
        "terminology": "*   **Preventive Maintenance (PM):** Scheduled upkeep to prevent catastrophic failure.",
        "scenario": "**Q:** After a scenario using simulated blood, what is the critical end-of-day maintenance task?\n**A:** Flush all fluid lines with a manufacturer-approved cleaning solution (often distilled water and isopropyl alcohol) to prevent blockages.",
        "lab_notes": "*   Create a daily shutdown checklist for your lab assistants.",
    },
}


def update_expert_knowledge():
    file_path = "expert_knowledge.json"

    # Load existing
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            data = json.load(f)
    else:
        data = {}

    # Update with Domain II
    for key, value in domain_ii_knowledge.items():
        data[key] = value

    # Write back
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    print("expert_knowledge.json updated with Domain II content.")

    # Keep the web app in sync — copy the updated JSON into docs/
    web_path = os.path.join("docs", "expert_knowledge.json")
    if os.path.exists("docs"):
        import shutil

        shutil.copy2(file_path, web_path)
        print(f"Web app copy updated: {web_path}")
    else:
        print("Note: 'docs/' folder not found — skipping web app sync.")


if __name__ == "__main__":
    update_expert_knowledge()
