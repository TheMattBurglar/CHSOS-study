# V.E: Distance/Remote Simulation

## Domain: Concepts in Instructional Design as Applied to Simulation (15%)

### [Status]: 🟢 Studied

### [Technician Perspective]
**Distance/Remote Simulation:** This is any simulation-based training where the facilitator, the manikin operator, and/or the learners are not all in the same physical room, connected instead through web-conferencing, screen-sharing, and streamed A/V (the specific version run live over telecommunications tools is often called **Telesimulation**). As the tech, your job shifts from managing a room to managing a network: you're the one ensuring bandwidth, camera framing, and audio routing don't become the story of the session. A **benefit** is reach: a single scenario and one skilled operator can now serve learners at a rural clinic, a partner hospital, or a home office who could never otherwise get to a sim center. The core **limitation** is fidelity loss — learners on a screen cannot get hands-on haptic feedback from a manikin, and the whole session lives or dies on network quality.

### [Clinical Application]
Distance simulation lets programs deliver consistent, standardized training to geographically dispersed learners (rural EMS, satellite nursing campuses, disaster-response teams) who would otherwise receive no simulation-based education at all, directly supporting equitable access to training.

### [Key Terminology]
*   **Telesimulation:** The use of telecommunication technology (web-conferencing, screen-sharing, webcams) to deliver simulation-based education to learners who are geographically remote from the instructor.
*   **Distance Simulation:** A method of healthcare training in which the learners and facilitators are in different physical locations, connected via networked simulation and communication technology.
*   **Synchronous:** Real-time delivery, where the remote learners and the facilitator/manikin interact live, together, at the same time.
*   **Asynchronous:** Delivery where the learner engages with recorded or self-paced simulation content on their own schedule, without a live facilitator present.

### [Exam Scenario]
**Q:** A regional hospital system wants to run a live, synchronous code-blue scenario for a satellite clinic 200 miles away, streaming the manikin's vitals monitor and room audio over the clinic's guest Wi-Fi. During the debrief, learners report the manikin's voice sounded delayed and "robotic," and several critical teaching moments were missed because the video froze. What should the Operations Specialist address first for the next session?
**A:** Move the connection off the shared guest network onto a dedicated, bandwidth-reserved connection (or a wired connection) to eliminate the latency and jitter causing the audio/video degradation. This is the central **limitation** of distance simulation: the educational experience is only as reliable as the network carrying it, so network quality has to be treated as a scenario design requirement, not an afterthought.

### [Notes & Lab Application]
*   Run a technical dry-run over the actual link (not just on the local LAN) before any live distance session, since a remote site's real-world bandwidth is rarely what was promised.
*   Have a low-tech backup plan (phone bridge, recorded scenario) ready in case the live connection fails mid-session, so the educational objective can still be salvaged.

*(Add more lab-specific details here)*
