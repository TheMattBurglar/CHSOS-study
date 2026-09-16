# II.A.7: Data management (storage, retrieval, file types)

## Domain: Simulation Technology Operations (35%)

### [Status]: 🟢 Studied

### [Technician Perspective]
**Data Management:**
*   **Storage:** Video files (MP4) consume massive space. A NAS (Network Attached Storage) or SAN is required for large centers.
*   **Retrieval:** Naming conventions are critical (e.g., YYYYMMDD_Course_Scenario).
*   **Retention:** Policies must dictate when videos are purged (e.g., 30 days after the semester ends) to reduce liability and storage costs.
*   **File Types:** Video is stored in a "container" (MP4, MOV, AVI) wrapping a compressed CODEC (H.264, MPEG-4); simulator vitals/event logs export as CSV or XML; moulage/equipment photos are JPEG or PNG; checklists and reports are PDF. Using the wrong container/CODEC combination for your playback software is a common cause of "file won't open" errors.

### [Clinical Application]
When a student challenges a grade, the video and log files are the primary evidence. Rapid retrieval is essential.

### [Key Terminology]
*   **NAS:** Network Attached Storage.
*   **Data Retention Policy:** The lifecycle of a file from creation to deletion.
*   **Container vs. CODEC:** A video file type (e.g., MP4) is the "container" holding a compressed stream encoded with a CODEC (e.g., H.264); a device missing the matching CODEC cannot play the file even though it plays elsewhere.
*   **RAID (Redundant Array of Independent Disks):** Spreads data across multiple drives so a single drive failure doesn't cause data loss. RAID protects availability, not disaster recovery; it is not a substitute for a true backup.

### [Exam Scenario]
**Q:** Your center's storage server (protected by RAID 5) is at 99% capacity, and a faculty member argues RAID means backups aren't necessary. What is your first action, and how do you correct the misconception?
**A:** Immediately apply the data retention policy to purge recordings past the retention window to free space. Separately, clarify that RAID only protects against a single drive failure (availability); it does not protect against fire, theft, ransomware, or accidental deletion affecting the whole array, so an independent, preferably off-site or cloud, backup is still required.

### [Notes & Lab Application]
*   What is your center's video retention policy? (e.g., 30 days, 1 year?)

*(Add more lab-specific details here)*
