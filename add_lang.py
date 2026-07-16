import os

skills_dir = 'skills'

for item in os.listdir(skills_dir):
    if item == '_template' or item == 'qk-policy-engine':
        continue
    
    skill_path = os.path.join(skills_dir, item, 'SKILL.md')
    if os.path.isfile(skill_path):
        with open(skill_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese." not in content:
            # Look for "> **Language rule:**"
            if "> **Language rule:**" in content:
                import re
                content = re.sub(r'> \*\*Language rule:\*\*.*', '> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.', content)
            else:
                # Add it after the first # header
                import re
                content = re.sub(r'(# .*?\n)', r'\1\n> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.\n', content, count=1)
                
            with open(skill_path, 'w', encoding='utf-8') as f:
                f.write(content)
