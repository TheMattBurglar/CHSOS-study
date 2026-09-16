import re
import sys

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    # Remove citations like (Lioce, 2024) or [Source]
    text = re.sub(r'\([A-Z][a-z]+.*?, \d{4}.*?\)', '', text)
    text = re.sub(r'\[.*?\]', '', text)
    # Remove bullet points and extra spaces
    text = text.replace('•', '').strip()
    return text

def get_word_count(text):
    return len(text.split())

def process_dictionary(input_text):
    # Pattern to find terms: "Term \ phonetic \ noun" followed by "Definition" and bullets
    # This is complex due to multi-line layout. 
    # Let's try a simpler approach: Find lines that look like Term \ ...
    
    terms_dict = {}
    current_term = None
    collecting_definition = False
    definition_buffer = []

    lines = input_text.split('\n')
    for line in lines:
        # Check for term header: "Term \ phonetic"
        match = re.match(r'^([A-Z][a-zA-Z /()-]+) \\', line)
        if match:
            if current_term and definition_buffer:
                terms_dict[current_term] = clean_text(" ".join(definition_buffer))
            
            current_term = match.group(1).strip()
            collecting_definition = False
            definition_buffer = []
            continue
            
        if current_term:
            if "Definition" in line:
                collecting_definition = True
                continue
            
            if collecting_definition:
                # If we hit a "See also" or another term-like line, stop
                if "See also:" in line or "Consider also:" in line or re.match(r'^[A-Z][a-zA-Z /()-]+ \\', line):
                    collecting_definition = False
                    terms_dict[current_term] = clean_text(" ".join(definition_buffer))
                    # Don't reset current_term yet, might be the start of a new one
                else:
                    # Filter out the "Etym." sections and page numbers
                    if not line.strip().startswith("Etym.") and not re.match(r'^\s*\d+\s*$', line):
                        definition_buffer.append(line.strip())

    # Catch last one
    if current_term and definition_buffer:
        terms_dict[current_term] = clean_text(" ".join(definition_buffer))
        
    return terms_dict

if __name__ == "__main__":
    content = sys.stdin.read()
    results = process_dictionary(content)
    for term, defn in results.items():
        if defn:
            print(f"@@@{term}@@@{defn}")
