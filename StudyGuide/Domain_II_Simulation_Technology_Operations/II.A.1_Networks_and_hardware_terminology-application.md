# II.A.1: Networks and hardware terminology/application

## Domain: Simulation Technology Operations (35%)

### [Status]: 🟢 Studied

### [Technician Perspective]
**Core Networking Concepts:**
*   **LAN vs. VLAN:** Isolated VLANs are best practice to prevent hospital network interference and reduce latency.
*   **Static IP vs. DHCP:** Manikins usually require Static IPs or DHCP Reservations. If IP changes, connections drop.
*   **Latency & Jitter:** Critical for distance simulation. High latency = manikin response lag.
*   **OSI Model relevance:** Focus on Layer 1 (Physical - cables), Layer 2 (Data Link - MAC addresses/Switches), Layer 3 (Network - IP/Routers).

### [Clinical Application]
When a manikin loses connection intermittently during an OSCE, the most likely technical cause is an IP conflict or channel interference on the Wi-Fi. The clinical impact is that student assessment is invalidated. Immediate action is required.

### [Key Terminology]
*   **MAC Address:** Unique hardware identifier.
*   **Subnet Mask:** Defines network boundaries.
*   **Ping / Traceroute:** First line of diagnostic commands.

### [Exam Scenario]
**Q:** An instructor reports the manikin is 'lagging' when they trigger a cough. Both laptop and manikin are on the hospital's main guest Wi-Fi. What is the best long-term solution?
**A:** Move the simulation equipment to a dedicated, isolated VLAN or closed network to eliminate bandwidth contention.

### [Notes & Lab Application]
*   Identify the MAC address of your primary manikin.
*   Document your lab's subnet and gateway.

*(Add more lab-specific details here)*
