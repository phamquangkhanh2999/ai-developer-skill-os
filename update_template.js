const fs = require('fs');

const path = 'skills/_template/SKILL.md';
let content = fs.readFileSync(path, 'utf8');

const required_sections = [
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
];

let appends = "\\n";
for (const section of required_sections) {
    if (!content.includes('## ' + section)) {
        appends += '\\n## ' + section + '\\n[Placeholder for ' + section + ']\\n';
    }
}

content += appends;
fs.writeFileSync(path, content);
