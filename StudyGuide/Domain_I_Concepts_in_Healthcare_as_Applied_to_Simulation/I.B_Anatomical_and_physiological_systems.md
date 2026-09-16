# I.B: Anatomical and physiological systems

## Domain: Concepts in Healthcare as Applied to Simulation (10%)

### [Status]: 🟢 Studied

### [Technician Perspective]
**Anatomical and Physiological Systems:** Know the major body systems well enough to build and troubleshoot manikin function, not just to recite anatomy. **Cardiovascular:** pulse point locations (carotid, radial, femoral, pedal) and heart sound placement drive auscultation accuracy. **Respiratory:** airway anatomy (oropharynx, vocal cords, mainstem bronchi) governs intubation depth and chest rise/lung sound sync; a tube seated too deep produces right-mainstem-only breath sounds. **Neurological:** pupil size/reactivity and GCS-relevant responses are simulated through manikin eye modules and confederate scripting. **Gastrointestinal/Genitourinary:** bowel sound quadrants and catheterization anatomy (urethral length differences) affect task trainer selection. **Integumentary:** skin layers inform moulage depth for wounds and IV/injection sites. Understand **Homeostasis** and how it is disrupted in disease states (e.g., compensated vs. decompensated shock) so simulated vitals trend correctly over time.

### [Clinical Application]
Technical troubleshooting often requires anatomical knowledge. Recognizing that a 'Tension Pneumothorax' requires air-release valves to be functional is a key operational-clinical link, as is knowing that a manikin's carotid pulse module must fire in sync with the monitor's QRS complex for the physical exam to match the electrical rhythm.

### [Key Terminology]
*   **Homeostasis:** The state of steady internal physical and chemical conditions, and the baseline a manikin's programmed vitals must deviate from realistically as a scenario progresses.
*   **Auscultation Points:** Standardized locations for heart, lung, and bowel sounds that a manikin's speaker array must reproduce accurately by anatomical location.
*   **Perfusion:** The passage of blood through the circulatory system to tissues; simulated via pulse strength, skin color/temperature cues, and capillary refill.
*   **Fidelity (Conceptual):** The degree to which the simulator behaves like a real patient (e.g., vitals match the clinical state).
*   **Fidelity (Physical):** The degree to which the equipment and environment look/feel real, including anatomically correct landmarks.
*   **Fidelity (Psychological):** The degree to which the learner feels the same pressure/emotions as in a real event.

### [Exam Scenario]
**[Analysis Level] Q:** A learner performs a needle decompression on a manikin with a tension pneumothorax. The monitor shows a sudden return of spontaneous circulation (ROSC), but the physical manikin chest remains asymmetrical. Is this a fidelity issue?
**A:** Yes, it is a lack of **Physical Fidelity** (the manikin failed to respond physically) despite high **Conceptual Fidelity** on the monitor. The specialist must fix the physical air-release valve.

### [Notes & Lab Application]
*   Locate the physical pulse points on your high-fidelity manikins (Carotid, Radial, Femoral, Pedal).

*(Add more lab-specific details here)*
