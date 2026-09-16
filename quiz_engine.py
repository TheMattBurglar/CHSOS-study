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
                data = json.load(f)
                # Migration: ensure mcqs key exists
                if "mcqs" not in data:
                    data["mcqs"] = {}
                return data
        return {"ksa": {}, "terms": {}, "mcqs": {}}

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
        self.mcqs = self.load_mcqs()
        self.blueprint = {
            "I": 0.10,
            "II": 0.35,
            "III": 0.25,
            "IV": 0.15,
            "V": 0.15
        }

    def load_knowledge(self):
        with open("expert_knowledge.json", "r") as f:
            return json.load(f)

    def load_mcqs(self):
        if os.path.exists("mcq_bank.json"):
            with open("mcq_bank.json", "r") as f:
                return json.load(f)
        return []

    def extract_terms(self):
        all_terms = {}
        
        # 1. First, load from expert_knowledge.json as a base
        for ksa_id, data in self.knowledge.items():
            if "terminology" in data:
                import re
                lines = data["terminology"].split("\n")
                for line in lines:
                    match = re.search(r"\*\*([^*:]+)\*\*[:：]?\s*(.*)$", line.strip())
                    if match:
                        term = match.group(1).strip()
                        definition = match.group(2).strip()
                        if term and definition:
                            all_terms[term.lower()] = {"name": term, "def": definition, "ksa": ksa_id}

        # 2. Overwrite/Add from the high-quality chsos_tts_vocabulary.txt
        if os.path.exists("chsos_tts_vocabulary.txt"):
            with open("chsos_tts_vocabulary.txt", "r") as f:
                content = f.read()
            
            # Simple parser for the "Term:\nDefinition\n\n" format
            import re
            domain_matches = re.split(r"=== (DOMAIN .*?) ===", content)
            for i in range(1, len(domain_matches), 2):
                domain_title = domain_matches[i]
                domain_prefix = domain_title.split(":")[0].replace("DOMAIN ", "").strip()
                # Use a dummy KSA ID for terms from the text file based on domain
                dummy_ksa = f"{domain_prefix}.X"
                
                body = domain_matches[i+1]
                # Split by Term:\nDefinition
                term_blocks = re.split(r"\n\n(?=[A-Z][A-Za-z /()-]+:)", "\n\n" + body)
                for block in term_blocks:
                    block = block.strip()
                    if ":" in block:
                        parts = block.split(":", 1)
                        term_name = parts[0].strip()
                        definition = parts[1].strip()
                        if term_name and definition:
                            all_terms[term_name.lower()] = {
                                "name": term_name, 
                                "def": definition, 
                                "ksa": dummy_ksa
                            }
        
        # Convert back to a dict with original names as keys for compatibility
        return {v["name"]: {"def": v["def"], "ksa": v["ksa"]} for v in all_terms.values()}

    def clear_screen(self):
        os.system("cls" if os.name == "nt" else "clear")

    def _wrap(self, text):
        width = shutil.get_terminal_size((80, 24)).columns
        lines = text.split("\n")
        return "\n".join(
            textwrap.fill(line, width=width) if line.strip() else "" for line in lines
        )

    def get_random_scenario(self, ksa_id):
        data = self.knowledge[ksa_id]
        scenarios = data.get("scenarios")
        if not scenarios:
            # Fallback for old single-scenario format
            return data.get("scenario", "No scenario available.")
        return random.choice(scenarios)

    def run_scenario_quiz(self, ksa_ids):
        ksa_id = random.choice(ksa_ids)
        scenario_text = self.get_random_scenario(ksa_id)

        self.clear_screen()
        print(f"--- SCENARIO DRILL: {ksa_id} ---")

        if "Q:" in scenario_text:
            parts = scenario_text.split("A:", 1)
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

    def run_mcq_quiz(self, mcq_list=None):
        if not mcq_list:
            mcq_list = self.mcqs
        
        if not mcq_list:
            print("No MCQs available in mcq_bank.json")
            return

        # Pick a question (weighted by priority if possible, or just random)
        # For now, let's use the priority system from ProgressManager
        priority_ids = self.progress.get_priority_items(
            "mcqs", [m["id"] for m in mcq_list], 5
        )
        
        # Pick one from the priority list
        target_id = random.choice(priority_ids)
        q = next(m for m in mcq_list if m["id"] == target_id)

        self.clear_screen()
        print(f"--- MULTIPLE CHOICE DRILL: Domain {q['domain']} ---")
        print(f"(KSA: {q.get('ksa', 'N/A')})")
        
        print(f"\n{self._wrap(q['question'])}")
        print("\nOptions:")
        for opt, text in q["options"].items():
            print(f"  {opt}) {text}")
        
        while True:
            choice = input("\nYour answer (A, B, C, or D): ").upper()
            if choice in q["options"]:
                break
            print("Invalid choice. Please enter A, B, C, or D.")

        correct = (choice == q["answer"])
        
        if correct:
            print(f"\n[CORRECT!]")
        else:
            print(f"\n[INCORRECT]")
            print(f"The correct answer was: {q['answer']}")
        
        print("-" * 20)
        print(f"\n[RATIONALE]:\n{self._wrap(q['rationale'])}")
        
        self.progress.update_score("mcqs", q["id"], correct)

    def run_mock_exam(self):
        self.clear_screen()
        print("=== CHSOS FULL MOCK EXAM (115 QUESTIONS) ===")
        print("This simulates the full 2024 Blueprint weights.")
        print("- 115 Questions (100 Scored, 15 Pre-test)")
        print("- Weighted by Domain (I:10%, II:35%, III:25%, IV:15%, V:15%)")
        print("- Target time: 150 minutes")
        input("\nPress Enter to begin the exam and start the timer...")

        # Build the question bank based on weights
        exam_questions = []
        domain_map = {d: [] for d in self.blueprint.keys()}
        for ksa_id in self.knowledge.keys():
            domain = ksa_id.split('.')[0]
            if domain in domain_map:
                domain_map[domain].append(ksa_id)

        for domain, weight in self.blueprint.items():
            count = round(weight * 115)
            # Sample KSAs for this domain (allowing repeats if domain is small, 
            # but picking different scenarios later)
            for _ in range(count):
                if domain_map[domain]:
                    exam_questions.append(random.choice(domain_map[domain]))
        
        # Shuffle and trim/pad to exactly 115
        random.shuffle(exam_questions)
        exam_questions = exam_questions[:115]
        
        correct_count = 0
        total_questions = len(exam_questions)
        start_time = time.time()

        for i, ksa_id in enumerate(exam_questions, 1):
            self.clear_screen()
            elapsed_time = time.time() - start_time
            elapsed_str = time.strftime("%H:%M:%S", time.gmtime(elapsed_time))
            
            print(f"--- MOCK EXAM | Question {i} of {total_questions} | Time: {elapsed_str} ---")
            print(f"(Domain {ksa_id.split('.')[0]})")
            
            scenario_text = self.get_random_scenario(ksa_id)

            if "Q:" in scenario_text:
                parts = scenario_text.split("A:", 1)
                question = parts[0].strip()
                answer = parts[1].strip() if len(parts) > 1 else "No answer provided."
            else:
                question = scenario_text
                answer = "See full content for rationale."

            print(f"\n{self._wrap(question)}")
            input("\n[Think of your answer, then press Enter to reveal...]")
            print("-" * 20)
            print(f"\n[OFFICIAL RATIONALE]:\n{self._wrap(answer)}")

            while True:
                valid = input("\nDid you get it right? (y/n): ").lower()
                if valid in ['y', 'n']:
                    break
            
            if valid == 'y':
                correct_count += 1
                
        end_time = time.time()
        total_time = end_time - start_time
        time_str = time.strftime("%H:%M:%S", time.gmtime(total_time))
        
        # Scored out of 100 (simulating 15 unscored questions)
        # In reality, we don't know which are unscored, so we just use the raw % 
        # but normalize it to the 100-scored standard.
        score_percent = (correct_count / total_questions) * 100
        
        self.clear_screen()
        print("=== EXAM COMPLETE ===")
        print(f"Total Time: {time_str}")
        print(f"Score: {correct_count}/{total_questions} ({score_percent:.1f}%)")
        
        # Passing threshold is typically ~71% for CHSOS
        if score_percent >= 71:
            print("\nResult: PASS")
            print("You are performing at the level of a certified specialist.")
        else:
            print("\nResult: FAIL")
            print("Focus on the Domains where you struggled (see progress tracker).")
            
        input("\nPress Enter to return to menu...")

    def main_menu(self):
        while True:
            self.clear_screen()
            print("=== CHSOS ENHANCED QUIZ ENGINE ===")
            print("1. Random Scenarios (All Domains)")
            print("2. Random Terminology")
            print("3. Multiple Choice Questions (Exam Style)")
            print("4. Spaced Repetition (Prioritize Weak Areas)")
            print("5. MOCK EXAM MODE (Timed)")
            print("6. Reset Progress")
            print("Q. Quit")

            choice = input("\nSelect an option: ").lower()

            if choice == "1":
                self.run_scenario_quiz(list(self.knowledge.keys()))
            elif choice == "2":
                self.run_term_quiz(list(self.terms.keys()))
            elif choice == "3":
                self.run_mcq_quiz()
            elif choice == "4":
                # Mix of priority scenarios, terms, and MCQs
                mode = random.choice(["ksa", "terms", "mcqs"])
                if mode == "ksa":
                    p_ksas = self.progress.get_priority_items(
                        "ksa", list(self.knowledge.keys()), 5
                    )
                    if p_ksas: self.run_scenario_quiz(p_ksas)
                elif mode == "terms":
                    p_terms = self.progress.get_priority_items(
                        "terms", list(self.terms.keys()), 5
                    )
                    if p_terms: self.run_term_quiz(p_terms)
                else:
                    self.run_mcq_quiz()
            elif choice == "5":
                self.run_mock_exam()
            elif choice == "6":
                confirm = input(
                    "Are you sure? This will wipe your study history (y/n): "
                )
                if confirm == "y":
                    self.progress.data = {"ksa": {}, "terms": {}, "mcqs": {}}
                    self.progress.save_progress()
            elif choice == "q":
                break

            if choice in ["1", "2", "3", "4"]:
                input("\nPress Enter to return to menu...")


if __name__ == "__main__":
    engine = EnhancedQuizEngine()
    engine.main_menu()
