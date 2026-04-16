import json
import os
import glob

def populate_study_guide():
    # Load the expert content
    with open('expert_knowledge.json', 'r') as f:
        expert_data = json.load(f)
        
    # Load the blueprint to get titles and domain info
    with open('blueprint.json', 'r') as f:
        blueprint_data = json.load(f)
        
    study_guide_dir = "StudyGuide"
    
    # Iterate through all domains and KSA files
    for ksa_id, content in expert_data.items():
        # Search for the file that starts with the ksa_id
        pattern = os.path.join(study_guide_dir, "**", f"{ksa_id}_*.md")
        files = glob.glob(pattern, recursive=True)
        
        if not files:
            print(f"Warning: No file found for KSA {ksa_id}")
            continue
        
        file_path = files[0]
        
        # Find the domain and KSA title from blueprint
        domain_title = "Unknown Domain"
        domain_weight = "0%"
        ksa_title = "Unknown Title"
        
        for domain in blueprint_data['domains']:
            for ksa in domain['ksas']:
                if ksa.startswith(ksa_id + ":") or ksa.startswith(ksa_id + " "):
                    domain_title = domain['title']
                    domain_weight = domain['weight']
                    ksa_title = ksa.split(':', 1)[1].strip() if ':' in ksa else ksa
                    break
        
        # Build the new content structure
        new_content = f"# {ksa_id}: {ksa_title}\n\n"
        new_content += f"## Domain: {domain_title} ({domain_weight})\n\n"
        new_content += "### [Status]: 🟢 Studied\n\n"
        
        new_content += "### [Technician Perspective]\n"
        new_content += f"{content.get('perspective', '*(AI will generate content here)*')}\n\n"
        
        new_content += "### [Clinical Application]\n"
        new_content += f"{content.get('clinical', '*(AI will generate content here)*')}\n\n"
        
        if 'terminology' in content:
            new_content += "### [Key Terminology]\n"
            new_content += f"{content['terminology']}\n\n"
            
        if 'scenario' in content:
            new_content += "### [Exam Scenario]\n"
            new_content += f"{content['scenario']}\n\n"
            
        new_content += "### [Notes & Lab Application]\n"
        new_content += f"{content.get('lab_notes', '*(Add your own notes about how this works in your specific lab)*')}\n\n"
        new_content += "*(Add more lab-specific details here)*\n"
        
        with open(file_path, 'w') as f:
            f.write(new_content)
        
        print(f"Updated study material for: {os.path.basename(file_path)}")

if __name__ == "__main__":
    populate_study_guide()
    print("\n--- Study Guide Generation Complete ---")
    print("Check your 'StudyGuide' directory for the new content.")
