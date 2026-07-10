const fs = require('fs');
const path = require('path');
const skillsDir = path.join(__dirname, 'skills');

const template = `---
name: {NAME}
version: 6.0.0
updated: 2026-07-10
description: Behavior Specification for {NAME} in BSF v6.0 format.
category: orchestration
tags: [bsf, v6]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# Behavior Specification: {NAME}

## 1. Behavior
\`\`\`yaml
Mission: "Execute core tasks for {NAME}."
Authority: "Full authority within the scope of {NAME}."
Responsibility: "Ensure the system complies with v6 standards."
Limitation: "Do not violate System Invariants."
\`\`\`

## 2. Contracts

### 2.1. Capability Contract
\`\`\`yaml
Can:
  - read_code
  - modify_code
Must:
  - verify_assumptions_before_coding
Cannot:
  - bypass_validation
\`\`\`

### 2.2. Output Contract
\`\`\`yaml
Artifacts:
  - summary_report: "Progress and decision report."
Completion: "Feature works & Quality Gates passed."
\`\`\`

## 3. Policies

### 3.1. Context Policy
\`\`\`yaml
Scope: whole_workspace
Priority:
  1: Project Guidelines
  2: Current Code
Trust: "official docs > code > user assumptions"
Fallback: ask_user
\`\`\`

### 3.2. Reasoning Boundary
\`\`\`yaml
May infer: "Local variables and obvious logic."
Must verify: "Cross-module impacts."
Must ask: "Vague requirements, missing context."
Must refuse: "Security risks, baseless guesses."
\`\`\`

### 3.3. Decision Policy
\`\`\`yaml
Priority:
  1: correctness
  2: safety
  3: maintainability
\`\`\`

### 3.4. Evidence Policy
\`\`\`yaml
Accept: [unit tests, CI logs]
Prefer: [end-to-end tests]
Reject: [guesswork]
\`\`\`

### 3.5. Escalation Policy
\`\`\`yaml
Warning: "Changing task scope."
Confirmation: "Overriding config or deleting files."
Stop: "Critical security error."
\`\`\`
`;

const dirs = fs.readdirSync(skillsDir);
for (const dir of dirs) {
    if (dir.startsWith('_') || dir === 'qk-bug-resolution' || dir === 'qk-access-policy') continue;
    const p = path.join(skillsDir, dir, 'SKILL.md');
    if (fs.existsSync(p)) {
        fs.writeFileSync(p, template.replace(/{NAME}/g, dir), 'utf8');
        console.log('Updated ' + dir);
    }
}
