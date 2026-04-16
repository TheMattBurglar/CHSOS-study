# CHSOS Study App

A self-study toolkit for the **Certified Healthcare Simulation Operations Specialist (CHSOS)** certification exam. Includes a Python CLI quiz engine for the terminal and a full static web app you can use on your phone or share with colleagues — no server required.

---

## What Is the CHSOS?

The CHSOS is a professional certification for healthcare simulation technicians and operations specialists, administered by SSH (Society for Simulation in Healthcare). The exam covers five domains drawn from the 2024 Examination Blueprint:

| Domain | Topic | Exam Weight |
|--------|-------|-------------|
| I | Concepts in Healthcare as Applied to Simulation | 10% |
| II | Simulation Technology Operations | **35%** |
| III | Healthcare Simulation Practices, Principles & Procedures | 25% |
| IV | Professional Role: Behavior, Capabilities & Leadership | 15% |
| V | Concepts in Instructional Design as Applied to Simulation | 15% |

---

## Features

- **49 KSAs** (Knowledge, Skills, Abilities) covering all five exam domains
- **Scenario Drills** — clinical Q&A scenarios with official rationales
- **Terminology Flashcards** — definition drills for all key terms
- **Spaced Repetition** — Leitner system (levels 0–5) that automatically prioritises your weakest areas
- **Progress Dashboard** — per-domain mastery bars, overall readiness percentage, and exam weighting reminders
- **Export / Import** — save your progress as a JSON file and load it on another device
- **Keyboard shortcuts** in the web app — `Space`/`Enter` to reveal, `Y`/`N` to grade, `→` for next question

---

## Project Structure

```
CHSOS/
├── docs/                        # Static web app (served by GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── expert_knowledge.json    # Copy of study data (auto-synced)
│
├── StudyGuide/                  # Generated Markdown study notes, one file per KSA
│   ├── Domain_I_.../
│   ├── Domain_II_.../
│   ├── Domain_III_.../
│   ├── Domain_IV_.../
│   └── Domain_V_.../
│
├── expert_knowledge.json        # Master study data for all 49 KSAs
├── blueprint.json               # Exam domain/KSA structure
├── architect.py                 # Scaffolds the StudyGuide folder structure
├── study_generator.py           # Populates StudyGuide .md files from expert_knowledge.json
├── update_knowledge.py          # Injects new domain content + syncs docs/ copy
├── quiz_engine.py               # Interactive CLI quiz (terminal)
└── currentState.md              # Project status notes
```

---

## Using the Web App

The web app is hosted on GitHub Pages and requires no installation:

**[https://themattburglar.github.io/CHSOS-study/](https://themattburglar.github.io/CHSOS-study/)**

On mobile, tap the share button in your browser and choose **"Add to Home Screen"** for an app-like experience.

Progress is stored in your browser's `localStorage` — it persists between sessions on the same device. Use the **Export Progress** button to back it up or move it to another device.

### Running the web app locally

The web app requires an HTTP server (browsers block `fetch()` from `file://` URLs).

```bash
python3 -m http.server 8080 --directory docs
# Then open http://localhost:8080
```

---

## Using the Python CLI

Requires Python 3.7+. No external packages needed.

```bash
python3 quiz_engine.py
```

**Menu options:**
1. Random Scenarios — scenario drill from any domain
2. Random Terminology — flashcard-style term definitions
3. Spaced Repetition — Leitner system, prioritises weak areas
4. Reset Progress

Progress is saved to `progress.json` (git-ignored, stays local to your machine).

---

## Updating Study Content

To add or revise knowledge content, edit the domain dictionaries in `update_knowledge.py`, then run:

```bash
python3 update_knowledge.py
```

This writes changes to `expert_knowledge.json` **and** automatically copies it to `docs/expert_knowledge.json` so the web app stays in sync.

To regenerate all the Markdown study notes in `StudyGuide/`:

```bash
python3 study_generator.py
```

---

## Deployment (GitHub Pages)

The web app is deployed from the `docs/` folder on the `main` branch.

### First-time setup

1. Fork or clone this repo
2. Go to **Settings → Pages** in your GitHub repository
3. Under **Branch**, select `main` and set the folder to `/docs`
4. Click **Save**

Your app will be live at `https://<your-username>.github.io/<repo-name>/` within about a minute.

### Pushing updates

```bash
git add .
git commit -m "describe your change"
git push
```

GitHub Pages redeploys automatically on every push to `main`.

---

## Adding Your Own Lab Notes

Each KSA file in `StudyGuide/` contains a `[Notes & Lab Application]` section at the bottom. Fill these in with your specific lab's details — IP addresses, manikin models, equipment makes — to make the material directly applicable to your work environment.

---

## Roadmap

- [ ] Timed 115-question mock exam mode (simulates the real 2-hour window)
- [ ] PWA manifest for full "install to home screen" support
- [ ] Per-device progress sync via a free backend (e.g. Firebase)