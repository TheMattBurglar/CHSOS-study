import json
import os

def build_structure():
    with open('blueprint.json', 'r') as f:
        data = json.load(f)
    
    base_dir = "StudyGuide"
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    
    for domain in data['domains']:
        domain_dir = os.path.join(base_dir, f"Domain_{domain['id']}_{domain['title'].replace(' ', '_')}")
        if not os.path.exists(domain_dir):
            os.makedirs(domain_dir)
            print(f"Created Domain Directory: {domain_dir}")
        
        for ksa in domain['ksas']:
            # Create a safe filename
            ksa_id = ksa.split(':')[0].strip()
            ksa_title = ksa.split(':')[1].strip().replace(' ', '_').replace('/', '-')
            filename = f"{ksa_id}_{ksa_title}.md"
            filepath = os.path.join(domain_dir, filename)
            
            if not os.path.exists(filepath):
                with open(filepath, 'w') as ksa_file:
                    ksa_file.write(f"# {ksa}\n\n")
                    ksa_file.write(f"## Domain: {domain['title']} ({domain['weight']})\n\n")
                    ksa_file.write("### [Status]: 🔴 Unstudied\n\n")
                    ksa_file.write("### [Technician Perspective]\n*(AI will generate content here)*\n\n")
                    ksa_file.write("### [Clinical Application]\n*(AI will generate content here)*\n\n")
                    ksa_file.write("### [Notes & Lab Application]\n*(Add your own notes about how this works in your specific lab)*\n")
                print(f"Created KSA File: {filename}")

if __name__ == "__main__":
    build_structure()
    print("\n--- Architecture Build Complete ---")
    print("Your study roadmap is now ready in the 'StudyGuide' directory.")
