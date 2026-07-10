const fs = require('fs');
const path = require('path');
const skillsDir = path.join(__dirname, 'skills');

function convertToBSF(content, name) {
  // Extract Frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  
  // Create v6 Frontmatter
  let newFm = '---\n';
  newFm += fm.split('\n').filter(line => {
    return !line.startsWith('behavior:') && 
           !line.startsWith('intent:') && 
           !line.startsWith('priority:') && 
           !line.startsWith('trigger:') && 
           !line.startsWith('inputs:') && 
           !line.startsWith('outputs:') && 
           !line.startsWith('allowed_tools:') && 
           !line.startsWith('pipeline:');
  }).join('\n');
  newFm += '\n---';

  const missionMatch = content.match(/## ?? Mission \(Scope\)\n([\s\S]*?)(?=\n## |\n---|$)/);
  const missionText = missionMatch ? missionMatch[1].trim() : 'Define mission here';

  const bsf = \\

# ?? Behavior Specification: \

## 1. Behavior (Ð?nh danh Hành vi)
\\\yaml
Mission: "Th?c thi nhi?m v? c?t lõi theo chu?n v6."
Authority: "Ðu?c quy?n yêu c?u thêm thông tin n?u thi?u."
Responsibility: "B?o d?m ch?t lu?ng d?u ra."
Limitation: "Không vi ph?m Invariants c?a h? th?ng."
\\\

## 2. Contracts (H?p d?ng)

### 2.1. Capability Contract
\\\yaml
Can:
  - read_code
  - execute_tests
Must:
  - verify_assumptions_before_coding
Cannot:
  - execute_destructive_commands
\\\

### 2.2. Output Contract
\\\yaml
Artifacts:
  - summary_report
Completion: "Artifacts generated & Quality Gates passed."
\\\

## 3. Policies (Chính sách)

### 3.1. Context Policy
\\\yaml
Scope: current_repo
Priority:
  1: Project Docs
  2: Current Conversation
Trust: "official docs > code > assumptions"
Fallback: ask_user
\\\

### 3.2. Reasoning Boundary
\\\yaml
May infer: "Bi?n s? c?c b?"
Must verify: "Logic nghi?p v?"
Must ask: "Yêu c?u m?p m?"
Must refuse: "R?i ro b?o m?t"
\\\

### 3.3. Decision Policy
\\\yaml
Priority:
  1: correctness
  2: safety
  3: maintainability
\\\

### 3.4. Evidence Policy
\\\yaml
Accept: [logs, unit tests]
Prefer: [official vendor docs]
Reject: [guesswork]
\\\

### 3.5. Escalation Policy
\\\yaml
Warning: "Thay d?i c?u trúc"
Confirmation: "Xóa file"
Stop: "L?i Permission"
\\\

## 4. Protocol (Tùy ch?n)

\\\yaml
States:
  - collect_context
  - execute

Transitions:
  collect_context:
    if context_missing: -> Stop
    else: -> execute
  execute: -> Done
\\\
\;
  return bsf.replace(/\n\n\n/g, '\n\n');
}

fs.readdirSync(skillsDir).forEach(dir => {
  const fullPath = path.join(skillsDir, dir);
  if (fs.statSync(fullPath).isDirectory() && !dir.startsWith('_archive')) {
    const skillPath = path.join(fullPath, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      if (dir === 'qk-bug-resolution') return; // already done
      const content = fs.readFileSync(skillPath, 'utf8');
      const newContent = convertToBSF(content, dir);
      fs.writeFileSync(skillPath, newContent);
      console.log('Converted ' + dir);
    }
  }
});
