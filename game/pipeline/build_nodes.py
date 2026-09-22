#!/usr/bin/env python3
"""Content-tagging pipeline: mcq_bank.json / expert_knowledge.json -> Node Templates.

Converts the existing study-content banks into Node Template objects matching
game/SCHEMA.md, at full scale (all MCQs, all terminology) instead of the ~7
nodes hand-picked for the Sector 1 vertical slice.

Output:
  game/nodes.json          - master Node Template pool, per SCHEMA.md's own
                             recommendation ("Lives in a new game/nodes.json").
  game/web/nodes_generated.js - same data as `const GENERATED_NODES = {...}`,
                             loadable by the browser game with no build step.

Placeholder / not-yet-decided pieces (deliberately left mechanical here, to be
refined by a later hand-curation or narrative pass -- see currentState.md's
"Not yet done" list):
  - `title` / `flavor_intro` for diagnostic and scenario nodes are mechanical,
    not hand-written in Hub's voice. Intel nodes reuse the one convention
    that's already proven ("Field Briefing: {term}").
  - scenario nodes (as of 2026-09-20, see build_scenario_nodes' own docstring
    for the full story) are mcq_bank.json's 4-option MCQs again, presented
    untimed with a pressure-archetype flavor_intro -- NOT expert_knowledge.
    json's Q&A `scenarios` field anymore, which had no usable distractors and
    led to a solvable-without-reading 2-choice format. Those 250 Q&A pairs
    are unused pipeline input now; a future bespoke-writing pass could revive
    them with real plausible-wrong options instead of templated ones.
  - `callback` (SCHEMA.md's "outpost reports back N Hub visits later" hook) is
    now populated on ~35% of diagnostic/scenario nodes (deterministically, by
    node_id) from CALLBACK_TEMPLATES -- 8 generic success/fail message pairs
    referencing the node's own site, not bespoke per-node writing. `sets_flags`
    is otherwise empty except for the generic scenario "shortcut" flag.
  - `rank_min` per domain matches the locked rank-up design (see
    currentState.md): each domain becomes available at the rank whose
    promotion unlocks that domain's crew member.
  - `year` and `location_name` are assigned deterministically (round-robin
    over a fictional site pool and the 2019-2029 range) so a future
    procedural map generator has real inputs to filter on -- these are NOT
    narratively meaningful yet.

Generated node_ids use SEQ >= 501 within each (type, domain) bucket so they
never collide with the hand-authored, Playwright-validated vertical-slice
content in game/web/content.js.
"""

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
GAME_DIR = ROOT / "game"

YEARS = list(range(2019, 2030))  # 2019-2029 inclusive

CREW_BY_DOMAIN = {
    "I": None,
    "II": "av_tech",
    "III": "moulage_artist",
    "IV": "debrief_facilitator",
    "V": "simulationist",
}

# Locked rank-up design (see currentState.md): av_tech/Domain II is unlocked
# at game start; each later promotion is gated on the mastery of the domain
# tied to the rank being LEFT, and unlocks the next domain's crew member --
# junior_sim_tech -[master II]-> operations_specialist (unlocks moulage_artist/III)
# operations_specialist -[master III]-> lead_specialist (unlocks debrief_facilitator/IV)
# lead_specialist -[master IV]-> chsos_certified (unlocks simulationist/V)
# So a domain's content becomes reachable at the rank its own crew unlocks at.
RANK_MIN_BY_DOMAIN = {
    "I": "junior_sim_tech",
    "II": "junior_sim_tech",
    "III": "operations_specialist",
    "IV": "lead_specialist",
    "V": "chsos_certified",
}

SITE_POOL_BY_DOMAIN = {
    "I": ["Waystation 4", "en route", "Coastal Med Annex 4", "Fort Kessler Regional Training Center"],
    "II": ["Fort Kessler Regional Training Center, Wing C", "Fort Kessler Regional Training Center, Control Room",
           "Fort Kessler Regional Training Center, Server Closet", "Ridgeline Sim Center, AV Bay",
           "Ridgeline Sim Center, Server Room", "Harbor District Training Annex, Control Booth"],
    "III": ["Coastal Med Annex 4", "Ridgeline Sim Center, Moulage Studio", "Harbor District Training Annex, Bay 2",
            "Fort Kessler Regional Training Center, Main Bay"],
    "IV": ["Ridgeline Sim Center, Debrief Room", "Coastal Med Annex 4, Debrief Suite",
           "Harbor District Training Annex, Conference Room"],
    "V": ["Ridgeline Sim Center, Curriculum Office", "Harbor District Training Annex, Faculty Lounge",
          "Fort Kessler Regional Training Center, Admin Wing"],
}

SEQ_START = 501

TYPE_ABBR = {"diagnostic": "DIAG", "intel": "INT", "scenario": "SCN"}

# Each scenario's "wrong" choice needs an actual in-fiction reason a player
# might pick it -- a temptation with no grounded pressure behind it (the
# original "skip it to save time" with no time pressure anywhere in the
# scene) is a strictly dominated option and teaches nothing. These rotate
# per scenario (deterministically, by node_id) so the same pressure isn't
# reused every time, and pressure_line feeds the flavor_intro so the scene
# actually sets up the temptation the choice text plays on.
PRESSURE_ARCHETYPES = [
    {
        "key": "time_crunch",
        "pressure_line": "The next block starts in twenty minutes and the room isn't ready.",
        "wrong_text": "Skip it for now — there's no time, and it'll probably be fine.",
        "wrong_result": "It holds together just long enough for someone else to find the problem later, with your name on the setup log.",
        "correct_result": "It costs you a few minutes you didn't feel like you had. Nobody ever notices when it goes right, which is the whole point.",
    },
    {
        "key": "budget_crunch",
        "pressure_line": "The quarterly supply budget is already stretched thin, and doing this right isn't free.",
        "wrong_text": "Skip it and save the budget line — it's probably not worth the cost this time.",
        "wrong_result": "The cheap option costs more later, once it fails during a scored exercise instead of a quiet Tuesday.",
        "correct_result": "It eats into the budget. The line item doesn't come back to bite anyone, which is worth more than it looks like on paper.",
    },
    {
        "key": "deference",
        "pressure_line": "The faculty lead waves it off — she's run this a dozen times and never had a problem.",
        "wrong_text": "Defer to her experience and skip it — she's probably right.",
        "wrong_result": "She's run it a dozen times. This is the thirteenth, and it's the one that goes wrong.",
        "correct_result": "She's annoyed for about five seconds, then forgets about it entirely. That's the best outcome this job offers.",
    },
    {
        "key": "false_precedent",
        "pressure_line": "It's worked every time so far, and nobody's bothered to double-check it.",
        "wrong_text": "It's worked every time before — skip it and assume this time's the same.",
        "wrong_result": "It worked every time before because nobody had checked yet. Today, someone checks.",
        "correct_result": "Nothing dramatic happens. That's what doing it right usually looks like from the outside.",
    },
]


def stable_pick(key, options):
    """Deterministic pseudo-random pick keyed by a stable MD5 hash (not the
    builtin hash(), which is randomized per-process for strings) so the
    pipeline's output is reproducible across runs given the same source data."""
    digest = hashlib.md5(key.encode("utf-8")).hexdigest()
    return options[int(digest, 16) % len(options)]


# SCHEMA.md's callback design: a node queues an "outpost reports back" Hub
# line, delivered N Hub visits later, success/fail text picked by how the
# node actually resolved. Applied to ~35% of diagnostic/scenario nodes
# (deterministic per node_id) so pending callbacks stay a steady trickle
# rather than either never happening or flooding every single Hub visit.
# {site} is filled in from the node's own location_name at generation time.
CALLBACK_TEMPLATES = [
    {
        "success": "Whatever you sorted out at {site} held. No repeat complaints.",
        "fail": "{site} flagged the same problem again last month. Should've stuck the first time.",
    },
    {
        "success": "{site} passed their next review without a single note on the item you handled.",
        "fail": "{site}'s follow-up review flagged the exact same issue. It's on record now.",
    },
    {
        "success": "Ran into someone from {site} at a conference. Unprompted, she mentioned it's still holding up fine.",
        "fail": "Heard through the grapevine {site} had to redo that fix from scratch. Word gets around.",
    },
    {
        "success": "{site}'s numbers came back clean on the quarterly audit. That one's staying fixed.",
        "fail": "{site} pulled the readiness report. Yours is the name next to the open item.",
    },
    {
        "success": "A trainee at {site} asked about the fix you made. Apparently it's become the example they teach from now.",
        "fail": "{site} worked around it instead of fixing it properly. It's still broken, just quieter about it.",
    },
    {
        "success": "No news out of {site} on that one. In this job, no news is the best you get.",
        "fail": "{site} put in a request for the same part again. Make of that what you will.",
    },
    {
        "success": "{site}'s lead tech sent a one-line email: 'still good.' High praise, for her.",
        "fail": "{site}'s lead tech sent a one-line email. It was not 'still good.'",
    },
    {
        "success": "Command mentioned {site} in a briefing as a site doing it right. That was you.",
        "fail": "Command mentioned {site} in a briefing. Not as an example to follow.",
    },
]

CALLBACK_DELAY_OPTIONS = [2, 3, 3, 4, 5]
CALLBACK_INCLUDE_RATE = 0.35


def maybe_build_callback(node_id, site):
    """Deterministically include/exclude, per node_id, so regeneration is stable."""
    gate = int(hashlib.md5((node_id + "::callback_gate").encode("utf-8")).hexdigest(), 16) % 100
    if gate >= CALLBACK_INCLUDE_RATE * 100:
        return None
    template = stable_pick(node_id + "::callback_template", CALLBACK_TEMPLATES)
    delay = stable_pick(node_id + "::callback_delay", CALLBACK_DELAY_OPTIONS)
    return {
        "flag": f"{node_id}_callback",
        "deliver_after_hub_visits": delay,
        "messages": {
            "success": template["success"].format(site=site),
            "fail": template["fail"].format(site=site),
        },
    }


def load_mcq_bank():
    with open(ROOT / "mcq_bank.json") as f:
        return json.load(f)


def load_expert_knowledge():
    with open(ROOT / "expert_knowledge.json") as f:
        return json.load(f)


def parse_terminology(term_block):
    """'**Term**: definition' lines -> [(term, definition), ...]."""
    pattern = re.compile(r"^\*\*(.+?)\*\*\s*:?\s*(.+)$")
    out = []
    for line in term_block.split("\n"):
        line = line.strip().lstrip("*").strip()
        if not line:
            continue
        line = "**" + line if not line.startswith("**") else line
        m = pattern.match(line)
        if m:
            term = m.group(1).strip().rstrip(":").strip()
            out.append((term, m.group(2).strip()))
    return out


class Counter:
    def __init__(self):
        self.seen = {}

    def next_seq(self, node_type, domain):
        key = (node_type, domain)
        n = self.seen.get(key, SEQ_START - 1) + 1
        self.seen[key] = n
        return n

    def next_year(self, node_type, domain):
        key = (node_type, domain)
        i = self.seen.get(("year_idx",) + key, -1) + 1
        self.seen[("year_idx",) + key] = i
        return YEARS[i % len(YEARS)]

    def next_site(self, node_type, domain):
        pool = SITE_POOL_BY_DOMAIN[domain]
        key = (node_type, domain)
        i = self.seen.get(("site_idx",) + key, -1) + 1
        self.seen[("site_idx",) + key] = i
        return pool[i % len(pool)]


def base_requires(domain):
    crew = CREW_BY_DOMAIN[domain]
    req = {"rank_min": RANK_MIN_BY_DOMAIN[domain]}
    if crew:
        req["crew_recruited"] = [crew]
    return req


def diagnostic_time_limit(question, options):
    length = len(question) + sum(len(v) for v in options.values())
    return max(30, min(60, 30 + length // 40))


def build_diagnostic_nodes(mcqs, counter):
    nodes = []
    for mcq in mcqs:
        domain = mcq["domain"]
        seq = counter.next_seq("diagnostic", domain)
        year = counter.next_year("diagnostic", domain)
        site = counter.next_site("diagnostic", domain)
        node_id = f"{TYPE_ABBR['diagnostic']}-{domain}-{year}-{seq:03d}"
        nodes.append({
            "node_id": node_id,
            "type": "diagnostic",
            "domain": domain,
            "ksa": mcq.get("ksa"),
            "crew_affinity": CREW_BY_DOMAIN[domain],
            "year": year,
            "location_name": site,
            "title": f"Field Call — {mcq.get('ksa', domain)}",
            "flavor_intro": f"A technical question comes up on site at {site}. Your crew wants a second opinion before it becomes a bigger problem.",
            "source": {"file": "mcq_bank.json", "id": mcq["id"]},
            "payload": {
                "question": mcq["question"],
                "options": mcq["options"],
                "answer": mcq["answer"],
                "rationale": mcq["rationale"],
                "time_limit_seconds": diagnostic_time_limit(mcq["question"], mcq["options"]),
            },
            "requires": base_requires(domain),
            "sets_flags": {},
            "callback": maybe_build_callback(node_id, site),
            "weight": None,
            "effects": {
                "on_pass": {"integrity": 10, "morale": 5, "budget": 0},
                "on_fail": {"integrity": -10, "morale": -5, "budget": 0},
            },
        })
    return nodes


def build_intel_nodes(expert_knowledge, counter):
    nodes = []
    for ksa, entry in expert_knowledge.items():
        domain = ksa.split(".")[0]
        for term, definition in parse_terminology(entry.get("terminology", "")):
            seq = counter.next_seq("intel", domain)
            year = counter.next_year("intel", domain)
            site = counter.next_site("intel", domain)
            node_id = f"{TYPE_ABBR['intel']}-{domain}-{year}-{seq:03d}"
            nodes.append({
                "node_id": node_id,
                "type": "intel",
                "domain": domain,
                "ksa": ksa,
                "crew_affinity": CREW_BY_DOMAIN[domain],
                "year": year,
                "location_name": site,
                "title": f"Field Briefing: {term}",
                "flavor_intro": "Hub doesn't pull up a card this time. “You should have this one. Prove it.”",
                "source": {"file": "expert_knowledge.json", "ksa": ksa, "field": "terminology", "term": term},
                "payload": {
                    "term": term,
                    "definition": definition,
                    "flavor": "Hub: “Say it back to me without the textbook voice, or I'm not letting you off this ship.”",
                },
                "requires": {"rank_min": RANK_MIN_BY_DOMAIN[domain]},
                "sets_flags": {},
                "callback": None,
                "weight": None,
                "effects": {
                    "on_pass": {"integrity": 4, "morale": 2, "budget": 0},
                    "on_fail": {"integrity": -4, "morale": 0, "budget": 0},
                },
            })
    return nodes


def build_scenario_nodes(mcqs, counter):
    """Scenario nodes reuse mcq_bank.json's already-designed 4-option
    distractor sets -- the SAME source pool diagnostic nodes draw from, via a
    separate ("scenario", domain) Counter bucket so each node gets its own
    site/year, not a collision with the matching diagnostic node.

    Superseded design note (2026-09-20): scenario nodes used to be sourced
    from expert_knowledge.json's Q&A `scenarios` field, templated into a
    2-choice "correct vs. cut a corner" pair. Matthew caught that this format
    had two tells solvable without reading anything: the tone tag always
    matched correctness (BY THE BOOK = right, WRY = wrong), and the correct
    choice was always the long detailed one, the wrong one always a generic
    "skip it" line. expert_knowledge.json's scenarios have only one correct
    answer with no ready-made plausible-wrong alternative, so there was no
    good way to fix this without either fabricating weak distractors or
    reusing real ones. mcq_bank.json already has well-designed distractors;
    this presents them untimed, through the same renderMCQBlock() UI as
    diagnostic nodes, with a heavier fail penalty and a pressure-archetype
    flavor_intro for narrative texture -- so the format is unsolvable without
    actually knowing the content, same as a real diagnostic. This does mean
    expert_knowledge.json's 250 scenario Q&A pairs go unused for now; they'd
    need bespoke rewriting (real plausible-wrong options, not templated ones)
    to be usable safely, which is future work, not scope here.
    """
    nodes = []
    for mcq in mcqs:
        domain = mcq["domain"]
        seq = counter.next_seq("scenario", domain)
        year = counter.next_year("scenario", domain)
        site = counter.next_site("scenario", domain)
        node_id = f"{TYPE_ABBR['scenario']}-{domain}-{year}-{seq:03d}"
        pressure = stable_pick(node_id, PRESSURE_ARCHETYPES)
        nodes.append({
            "node_id": node_id,
            "type": "scenario",
            "domain": domain,
            "ksa": mcq.get("ksa"),
            "crew_affinity": CREW_BY_DOMAIN[domain],
            "year": year,
            "location_name": site,
            "title": f"Judgment Call — {mcq.get('ksa', domain)}",
            "flavor_intro": f"A judgment call comes up at {site} that no manual quite covers. {pressure['pressure_line']} Your crew looks to you.",
            "source": {"file": "mcq_bank.json", "id": mcq["id"], "as": "scenario"},
            "payload": {
                "question": mcq["question"],
                "options": mcq["options"],
                "answer": mcq["answer"],
                "rationale": mcq["rationale"],
                "time_limit_seconds": None,
            },
            "requires": base_requires(domain),
            "sets_flags": {},
            "callback": maybe_build_callback(node_id, site),
            "weight": None,
            "effects": {
                "on_pass": {"integrity": 10, "morale": 5, "budget": 0},
                "on_fail": {"integrity": -15, "morale": -10, "budget": -15},
            },
        })
    return nodes


def main():
    mcqs = load_mcq_bank()
    ek = load_expert_knowledge()
    counter = Counter()

    nodes = []
    nodes += build_diagnostic_nodes(mcqs, counter)
    nodes += build_intel_nodes(ek, counter)
    nodes += build_scenario_nodes(mcqs, counter)

    (GAME_DIR / "nodes.json").write_text(json.dumps(nodes, indent=2, ensure_ascii=False) + "\n")

    nodes_by_id = {n["node_id"]: n for n in nodes}
    js = "// Auto-generated by game/pipeline/build_nodes.py -- do not hand-edit.\n"
    js += "// Regenerate with: python3 game/pipeline/build_nodes.py\n"
    js += "const GENERATED_NODES = " + json.dumps(nodes_by_id, indent=2, ensure_ascii=False) + ";\n"
    (GAME_DIR / "web" / "nodes_generated.js").write_text(js)

    by_type = {}
    for n in nodes:
        by_type[n["type"]] = by_type.get(n["type"], 0) + 1
    print(f"Wrote {len(nodes)} node templates to game/nodes.json and game/web/nodes_generated.js")
    for t, c in sorted(by_type.items()):
        print(f"  {t}: {c}")


if __name__ == "__main__":
    main()
