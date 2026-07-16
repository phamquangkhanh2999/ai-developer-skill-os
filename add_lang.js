const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, 'skills');
const items = fs.readdirSync(skillsDir);

for (const item of items) {
  if (item === '_template' || item === 'qk-policy-engine') continue;
  
  const skillDir = path.join(skillsDir, item);
  if (fs.statSync(skillDir).isDirectory() && item.startsWith('qk-')) {
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      let content = fs.readFileSync(skillMdPath, 'utf8');
      if (!content.includes('> **Language rule:**')) {
        content = content.replace(/^# (.*)/m, '# \n\n> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.');
        fs.writeFileSync(skillMdPath, content);
      }
    }
  }
}
