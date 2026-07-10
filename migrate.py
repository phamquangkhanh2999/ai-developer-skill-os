import os
import re

skills_dir = os.path.join(os.getcwd(), 'skills')

def migrate_skill(skill_dir):
    file_path = os.path.join(skills_dir, skill_dir, 'SKILL.md')
    if not os.path.exists(file_path): return
    if skill_dir in ['qk-bug-resolution', 'qk-access-policy']: return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    fm_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match: return
    frontmatter = fm_match.group(1)

    valid_fields = []
    for line in frontmatter.split('\n'):
        if not any(line.startswith(prefix) for prefix in ['behavior:', 'intent:', 'priority:', 'trigger:', 'inputs:', 'outputs:', 'allowed_tools:', 'pipeline:']):
            valid_fields.append(line.replace('v5.0', 'v6.0'))

    new_fm = '---\n' + '\n'.join(valid_fields) + '\n---'

    mission = f'Th?c thi nhi?m v? c?t lõi c?a {skill_dir}'
    limitation = 'Không vi ph?m Invariants c?a h? th?ng.'
    
    mission_section = re.search(r'## .*?Mission \(Scope\)(.*?)(?=## |---|$)', content, re.DOTALL)
    if mission_section:
        lines = mission_section.group(1).split('\n')
        pos = [l.split('- ?')[-1].strip() for l in lines if '- ?' in l]
        neg = [l.split('- ?')[-1].strip() for l in lines if '- ?' in l]
        if pos: mission = ' '.join(pos)
        if neg: limitation = ' '.join(neg)

    biases_match = re.search(r'Biases:(.*?)(?=---|$)', content, re.DOTALL)
    refuses = []
    if biases_match:
        refuses = [l.replace('- id:', '').strip() for l in biases_match.group(1).split('\n') if '- id:' in l]

    dials_match = re.search(r'Dials:(.*?)(?=---|$)', content, re.DOTALL)
    asks = []
    if dials_match:
        asks = [l.replace('- id:', '').strip() for l in dials_match.group(1).split('\n') if '- id:' in l]

    must_ask = ', '.join(asks) if asks else 'Yêu c?u m?p m?, thi?u thông tin.'
    must_refuse = ', '.join(refuses) if refuses else 'R?i ro b?o m?t, phá v? ki?n trúc.'

    bsf_content = f'''{new_fm}

# ?? Behavior Specification: {skill_dir}

## 1. Behavior (Ð?nh danh Hành vi)
`yaml
Mission: "{mission.replace('"', "'")}"
Authority: "Ðu?c quy?n th?c thi các tác v? trong ph?m vi {skill_dir}."
Responsibility: "B?o d?m ch?t lu?ng d?u ra và tuân th? chu?n h? th?ng."
Limitation: "{limitation.replace('"', "'")}"
`

## 2. Contracts (H?p d?ng)

### 2.1. Capability Contract
`yaml
Can:
  - read_code
  - execute_tests
  - modify_code
Must:
  - verify_assumptions_before_coding
Cannot:
  - execute_destructive_commands
  - bypass_validation
`

### 2.2. Output Contract
`yaml
Artifacts:
  - summary_report: "Decision Summary gi?i thích Context, Quy?t d?nh và Trade-offs."
Completion: "Nhi?m v? hoàn thành & Quality Gates passed."
`

## 3. Policies (Chính sách)

### 3.1. Context Policy
`yaml
Scope: current_repo
Priority:
  1: Project Docs
  2: Current Conversation
  3: Source Code
Trust: "official docs > code > assumptions"
Fallback: ask_user
`

### 3.2. Reasoning Boundary
`yaml
May infer: "Bi?n s? c?c b?, logic n?i b? không ?nh hu?ng h? th?ng."
Must verify: "Tác d?ng d?n các module khác."
Must ask: "{must_ask.replace('"', "'")}"
Must refuse: "{must_refuse.replace('"', "'")}"
`

### 3.3. Decision Policy
`yaml
Priority:
  1: correctness
  2: safety
  3: maintainability
  4: performance
`

### 3.4. Evidence Policy
`yaml
Accept: [logs, unit tests, official docs]
Prefer: [unit tests, CI results]
Reject: [guesswork, outdated internet search]
`

### 3.5. Escalation Policy
`yaml
Warning: "Thay d?i c?u trúc ho?c public API"
Confirmation: "Override config ho?c xóa file quan tr?ng"
Stop: "L?i Permission ho?c xung d?t Invariants"
`
'''
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(bsf_content)
    print(f'Migrated {skill_dir}')

for d in os.listdir(skills_dir):
    if os.path.isdir(os.path.join(skills_dir, d)) and not d.startswith('_'):
        migrate_skill(d)
