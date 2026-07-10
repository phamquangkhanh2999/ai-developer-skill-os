const fs = require('fs');
const path = require('path');
const skillsDir = path.join(__dirname, 'skills');

function migrateSkill(skillDir) {
    const filePath = path.join(skillsDir, skillDir, 'SKILL.md');
    if (!fs.existsSync(filePath)) return;
    
    if (skillDir === 'qk-bug-resolution') return; // Skip already migrated

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Parse Frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return;
    let frontmatter = fmMatch[1];
    
    // Filter old fields
    const validFields = [];
    const lines = frontmatter.split('\n');
    for (const line of lines) {
        if (!line.startsWith('behavior:') && !line.startsWith('intent:') && !line.startsWith('priority:') && !line.startsWith('trigger:') && !line.startsWith('inputs:') && !line.startsWith('outputs:') && !line.startsWith('allowed_tools:') && !line.startsWith('pipeline:')) {
            validFields.push(line.replace(/v5\.0/g, 'v6.0'));
        }
    }
    const newFm = '---\n' + validFields.join('\n') + '\n---';

    // Parse Mission
    let mission = 'Th?c thi nhi?m v? c?t lõi.';
    let limitation = 'Không vi ph?m Invariants c?a h? th?ng.';
    
    const missionSection = content.match(/## ?? Mission \(Scope\)[\s\S]*?(?=## |---|$)/);
    if (missionSection) {
        const missionLines = missionSection[0].split('\n');
        const posLines = missionLines.filter(l => l.includes('- ?')).map(l => l.replace('- ?', '').trim());
        const negLines = missionLines.filter(l => l.includes('- ?')).map(l => l.replace('- ?', '').trim());
        
        if (posLines.length > 0) mission = posLines.join(' ');
        if (negLines.length > 0) limitation = negLines.join(' ');
    }

    // Parse Biases (Map to Reasoning Boundary - Must refuse)
    const biasesMatch = content.match(/Biases:[\s\S]*?(?=---|$)/);
    let refuses = [];
    if (biasesMatch) {
        const biasLines = biasesMatch[0].split('\n').filter(l => l.includes('- id:'));
        refuses = biasLines.map(l => l.replace('- id:', '').trim());
    }

    // Parse Dials (Map to Context Policy / Reasoning)
    const dialsMatch = content.match(/Dials:[\s\S]*?(?=---|$)/);
    let asks = [];
    if (dialsMatch) {
        const dialLines = dialsMatch[0].split('\n').filter(l => l.includes('- id:'));
        asks = dialLines.map(l => l.replace('- id:', '').trim());
    }

    // Generate BSF content
    const bsfContent = \\

# ?? Behavior Specification: \

## 1. Behavior (Ð?nh danh Hành vi)
\\\yaml
Mission: "\"
Authority: "Ðu?c quy?n th?c thi các tác v? trong ph?m vi \."
Responsibility: "B?o d?m ch?t lu?ng d?u ra và tuân th? chu?n h? th?ng."
Limitation: "\"
\\\

## 2. Contracts (H?p d?ng)

### 2.1. Capability Contract
\\\yaml
Can:
  - read_code
  - execute_tests
  - modify_code
Must:
  - verify_assumptions_before_coding
Cannot:
  - execute_destructive_commands
  - bypass_validation
\\\

### 2.2. Output Contract
\\\yaml
Artifacts:
  - summary_report: "Decision Summary gi?i thích Context, Quy?t d?nh và Trade-offs."
Completion: "Nhi?m v? hoàn thành & Quality Gates passed."
\\\

## 3. Policies (Chính sách)

### 3.1. Context Policy
\\\yaml
Scope: current_repo
Priority:
  1: Project Docs
  2: Current Conversation
  3: Source Code
Trust: "official docs > code > assumptions"
Fallback: ask_user
\\\

### 3.2. Reasoning Boundary
\\\yaml
May infer: "Bi?n s? c?c b?, logic n?i b? không ?nh hu?ng h? th?ng."
Must verify: "Tác d?ng d?n các module khác."
Must ask: "\"
Must refuse: "\"
\\\

### 3.3. Decision Policy
\\\yaml
Priority:
  1: correctness
  2: safety
  3: maintainability
  4: performance
\\\

### 3.4. Evidence Policy
\\\yaml
Accept: [logs, unit tests, official docs]
Prefer: [unit tests, CI results]
Reject: [guesswork, outdated internet search]
\\\

### 3.5. Escalation Policy
\\\yaml
Warning: "Thay d?i c?u trúc ho?c public API"
Confirmation: "Override config ho?c xóa file quan tr?ng"
Stop: "L?i Permission ho?c xung d?t Invariants"
\\\
\;

    fs.writeFileSync(filePath, bsfContent);
    console.log('Migrated ' + skillDir);
}

const dirs = fs.readdirSync(skillsDir);
for (const dir of dirs) {
    if (fs.statSync(path.join(skillsDir, dir)).isDirectory() && !dir.startsWith('_')) {
        migrateSkill(dir);
    }
}
