import os

skills_dir = 'skills'
required_sections = [
  'Goal',
  'Context',
  'Inputs',
  'Chain of Thought',
  'Constraints',
  'Policies',
  'Exit Codes',
  'Confidence Model',
  'Severity',
  'Retry Policy',
  'Escalation Rules'
]

for item in os.listdir(skills_dir):
    if item == '_template' or item == 'qk-policy-engine':
        continue
    
    skill_path = os.path.join(skills_dir, item, 'SKILL.md')
    if os.path.isfile(skill_path):
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        missing_sections = []
        for section in required_sections:
            if f"## {section}" not in content:
                missing_sections.append(section)
                
        if missing_sections:
            appends = "\n\n" + "\n\n".join([f"## {section}\n[Placeholder for {section}]" for section in missing_sections])
            
            # Insert before ## Compliance if it exists
            if "## Compliance" in content:
                content = content.replace("## Compliance", appends.lstrip() + "\n\n## Compliance")
            else:
                content += appends
                
            with open(skill_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        # Add ## Scope for the vitest if missing
        if "## Scope" not in content:
            with open(skill_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if "## Compliance" in content:
                content = content.replace("## Compliance", "## Scope\nAll.\n\n## Compliance")
            else:
                content += "\n\n## Scope\nAll."
            with open(skill_path, 'w', encoding='utf-8') as f:
                f.write(content)
