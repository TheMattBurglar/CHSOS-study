# II.A.9: Cable connectivity and applications (ports, adapters)

## Domain: Simulation Technology Operations (35%)

### [Status]: 🟢 Studied

### [Technician Perspective]
**Cable Connectivity & Adapters:**
*   **HDMI:** Reliable up to ~50ft (15m). Subject to HDCP handshake issues.
*   **SDI (Serial Digital Interface):** Broadcast standard, reliable up to 300ft (100m). Uses locking BNC connectors.
*   **HDBaseT:** Extends HDMI/USB over standard Cat6 cable up to 328ft (100m).
*   **Fiber Optic:** Used for extremely long runs or EMI-heavy environments.
*   **Legacy Analog Ports:** VGA (15-pin D-sub) and RCA composite/component are analog; connecting either to a digital HDMI/DisplayPort input needs an *active* (not passive) converter, and RCA composite video carries no audio, so a separate stereo cable is required.
*   **Digital Video Ports:** DVI-D and DisplayPort are common PC-side alternatives to HDMI in control rooms; DisplayPort supports daisy-chaining multiple monitors from one output.
*   **USB Family (Inputs/Outputs):** USB-A/B carry data and power for peripherals like mixers, capture cards, and printers; USB-C adds video output via DisplayPort/HDMI "Alt Mode" and Power Delivery over the same cable. A "charge-only" USB-C cable is a common, easy-to-miss cause of a no-signal video fault.
*   **Audio Connectors:** 3.5mm TRS (consumer, unbalanced) vs. 1/4" TRS/TS vs. XLR (professional, balanced, locking). Balanced XLR runs resist EMI far better than unbalanced 3.5mm/RCA cable over long distances.
*   **Dongles:** Small pass-through adapters/receivers, e.g., a USB Wi-Fi or Bluetooth dongle for a control PC lacking built-in wireless, a wireless presentation dongle (e.g., ClickShare/Barco) for BYOD screen sharing, or a CAT5/6 "network dongle" (keystone coupler) used to join two Ethernet runs.

### [Clinical Application]
A loose display cable during a scenario means the learner loses their vital signs monitor, forcing an unnatural pause in the clinical flow. Professional locking connectors (SDI/BNC) prevent this.

### [Key Terminology]
*   **SDI:** Serial Digital Interface; the professional standard for long video runs.
*   **HDBaseT:** A technology that transmits 4K video, audio, and power over a single Cat6 cable.
*   **EDID:** Data sent by a display to tell the source what resolution it supports.
*   **VGA:** Legacy 15-pin analog video connector; needs an active (powered) converter, not a passive cable, to display correctly on a digital HDMI/DisplayPort input.
*   **DisplayPort:** Royalty-free digital video/audio standard common on PCs; supports daisy-chained multi-monitor setups.
*   **USB-C / Alt Mode:** A reversible USB connector that can carry video (via DisplayPort or HDMI Alt Mode), data, and power delivery over a single cable.
*   **XLR:** A locking, balanced 3-pin audio connector used for professional microphone and line-level runs; its balanced design rejects electromagnetic interference (EMI) far better than unbalanced connectors.
*   **Dongle:** A small hardware adapter or receiver plugged into a port to add or convert a capability (e.g., a USB wireless dongle, a wireless presentation dongle, or a network keystone coupler).

### [Exam Scenario]
**Q:** You are running an HDMI cable 150 feet from the control room to the sim room display. The signal is dropping. Why?
**A:** Standard HDMI degrades after ~50 feet. You need an active HDMI cable, an HDMI-over-Ethernet (HDBaseT) extender, or an HDMI-to-SDI converter.

### [Notes & Lab Application]
*   Standardize the display connections in all your briefing rooms.

*(Add more lab-specific details here)*
