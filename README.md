# CHSOS Study App

A self-study toolkit for the **Certified Healthcare Simulation Operations Specialist (CHSOS)** certification exam. Includes a browser-based study game (an FTL-style roguelite built on the exam content) hosted on GitHub Pages, plus a Python CLI quiz engine for the terminal — no server required.

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

---

## Project Structure

```
CHSOS/
├── game/                        # Study game
│   ├── web/                     # Static game site (deployed to GitHub Pages)
│   ├── pipeline/build_nodes.py  # Builds web/nodes_generated.js from the study data
│   ├── STORY_BIBLE.md
│   └── SCHEMA.md
│
├── .github/workflows/pages.yml  # Deploys game/web/ to GitHub Pages
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
├── update_knowledge.py          # Injects new domain content into expert_knowledge.json
├── quiz_engine.py               # Interactive CLI quiz (terminal)
└── currentState.md              # Project status notes
```

---

## Playing the Game

The game is hosted on GitHub Pages and requires no installation:

**[https://themattburglar.github.io/CHSOS-study/](https://themattburglar.github.io/CHSOS-study/)**

Progress is stored in your browser's `localStorage` — it persists between sessions on the same device.

### Running the game locally

```bash
python3 -m http.server 8080 --directory game/web
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

This writes changes to `expert_knowledge.json`. To pull new content into the game, rebuild its node data with `python3 game/pipeline/build_nodes.py`.

To regenerate all the Markdown study notes in `StudyGuide/`:

```bash
python3 study_generator.py
```

---

## Deployment (GitHub Pages)

The game in `game/web/` is deployed by the GitHub Actions workflow in `.github/workflows/pages.yml` on every push to `main`.

### First-time setup

1. Fork or clone this repo
2. Go to **Settings → Pages** in your GitHub repository
3. Under **Build and deployment → Source**, select **GitHub Actions**

Your game will be live at `https://<your-username>.github.io/<repo-name>/` once the workflow finishes (see the **Actions** tab).

### Pushing updates

```bash
git add .
git commit -m "describe your change"
git push
```

The workflow redeploys automatically on every push to `main` (or run it manually from the **Actions** tab).

---

## Adding Your Own Lab Notes

Each KSA file in `StudyGuide/` contains a `[Notes & Lab Application]` section at the bottom. Fill these in with your specific lab's details — IP addresses, manikin models, equipment makes — to make the material directly applicable to your work environment.

---

## Roadmap

- [ ] Timed 115-question mock exam mode (simulates the real 2-hour window)
- [ ] PWA manifest for full "install to home screen" support
- [ ] Per-device progress sync via a free backend (e.g. Firebase)