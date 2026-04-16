import json
import os
import random
import shutil
import textwrap
import time


class ProgressManager:
    def __init__(self, filename="progress.json"):
        self.filename = filename
        self.data = self.load_progress()

    def load_progress(self):
        if os.path.exists(self.filename):
            with open(self.filename, "r") as f:
                return json.load(f)
        return {"ksa": {}, "terms": {}}

    def save_progress(self):
        with open(self.filename, "w") as f:
            json.dump(self.data, f, indent=2)

    def update_score(self, category, item_id, success):
        if item_id not in self.data[category]:
            self.data[category][item_id] = {"level": 0, "last_reviewed": 0}

        current = self.data[category][item_id]
        if success:
            current["level"] = min(current["level"] + 1, 5)
        else:
            current["level"] = max(current["level"] - 1, 0)

        current["last_reviewed"] = time.time()
        self.save_progress()

    def get_priority_items(self, category, items, limit=10):
        # Sort by level (ascending) and then by last_reviewed (ascending)
        scored_items = []
        for item_id in items:
            score = self.data[category].get(item_id, {"level": -1, "last_reviewed": 0})
            scored_items.append((item_id, score))

        scored_items.sort(key=lambda x: (x[1]["level"], x[1]["last_reviewed"]))
        return [x[0] for x in scored_items[:limit]]


class EnhancedQuizEngine:
    def __init__(self):
        self.progress = ProgressManager()
        self.knowledge = self.load_knowledge()
        self.terms = self.extract_terms()

    def load_knowledge(self):
        with open("expert_knowledge.json", "r") as f:
            return json.load(f)

    def extract_terms(self):
        all_terms = {}
        for ksa_id, data in self.knowledge.items():
            if "terminology" in data:
                # Basic parsing of markdown list to dict
                lines = data["terminology"].split("\n")
                for line in lines:
                    if "**:" in line:
                        parts = line.strip("* ").split("**:")
                        if len(parts) == 2:
                            term = parts[0].strip("* ")
                            definition = parts[1].strip()
                            all_terms[term] = {"def": definition, "ksa": ksa_id}
        return all_terms

    def clear_screen(self):
        os.system("cls" if os.name == "nt" else "clear")

    def _wrap(self, text):
        width = shutil.get_terminal_size((80, 24)).columns
        # Wrap each line independently to preserve intentional line breaks
        lines = text.split("\n")
        return "\n".join(
            textwrap.fill(line, width=width) if line.strip() else "" for line in lines
        )

    def run_scenario_quiz(self, ksa_ids):
        ksa_id = random.choice(ksa_ids)
        data = self.knowledge[ksa_id]

        self.clear_screen()
        print(f"--- SCENARIO DRILL: {ksa_id} ---")
        scenario_text = data.get("scenario", "No scenario available for this KSA.")

        if "Q:" in scenario_text:
            parts = scenario_text.split("A:")
            question = parts[0].strip()
            answer = parts[1].strip() if len(parts) > 1 else "No answer provided."
        else:
            question = scenario_text
            answer = "See full content for rationale."

        print(f"\n{self._wrap(question)}")
        input("\n[Think of your answer, then press Enter to reveal...]")
        print("-" * 20)
        print(f"\n[OFFICIAL RATIONALE]:\n{self._wrap(answer)}")

        valid = input("\nDid you get it right? (y/n): ").lower()
        self.progress.update_score("ksa", ksa_id, valid == "y")

    def run_term_quiz(self, term_names):
        term = random.choice(term_names)
        data = self.terms[term]

        self.clear_screen()
        print(f"--- TERMINOLOGY DRILL ---")
        print(f"\nDEFINE: **{term}**")
        input("\n[Press Enter to reveal definition...]")
        print("-" * 20)
        print(f"\n{self._wrap(data['def'])}")
        print(f"(Related KSA: {data['ksa']})")

        valid = input("\nDid you get it right? (y/n): ").lower()
        self.progress.update_score("terms", term, valid == "y")

    def main_menu(self):
        while True:
            self.clear_screen()
            print("=== CHSOS ENHANCED QUIZ ENGINE ===")
            print("1. Random Scenarios (All Domains)")
            print("2. Random Terminology")
            print("3. Spaced Repetition (Prioritize Weak Areas)")
            print("4. Reset Progress")
            print("Q. Quit")

            choice = input("\nSelect an option: ").lower()

            if choice == "1":
                self.run_scenario_quiz(list(self.knowledge.keys()))
            elif choice == "2":
                self.run_term_quiz(list(self.terms.keys()))
            elif choice == "3":
                # Mix of priority scenarios and terms
                p_ksas = self.progress.get_priority_items(
                    "ksa", list(self.knowledge.keys()), 5
                )
                p_terms = self.progress.get_priority_items(
                    "terms", list(self.terms.keys()), 5
                )
                if random.random() > 0.5 and p_ksas:
                    self.run_scenario_quiz(p_ksas)
                elif p_terms:
                    self.run_term_quiz(p_terms)
                else:
                    print("No priority items yet. Keep studying!")
                    time.sleep(2)
            elif choice == "4":
                confirm = input(
                    "Are you sure? This will wipe your study history (y/n): "
                )
                if confirm == "y":
                    self.progress.data = {"ksa": {}, "terms": {}}
                    self.progress.save_progress()
            elif choice == "q":
                break

            if choice in ["1", "2", "3"]:
                input("\nPress Enter to return to menu...")


if __name__ == "__main__":
    engine = EnhancedQuizEngine()
    engine.main_menu()
