const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const skillsDir = 'skills';
const categories = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

categories.forEach(category => {
  const catPath = path.join(skillsDir, category);
  const skills = fs.readdirSync(catPath).filter(f => fs.statSync(path.join(catPath, f)).isDirectory());
  skills.forEach(skill => {
    if (!skill.startsWith('qk-')) {
      const oldPath = path.join(catPath, skill).replace(/\\/g, '/');
      const newPath = path.join(catPath, 'qk-' + skill).replace(/\\/g, '/');
      try {
        console.log(`Đang đổi tên: ${oldPath} -> ${newPath}`);
        execSync(`git mv "${oldPath}" "${newPath}"`);
      } catch(e) {
        console.error('LỖI (Hãy chắc chắn bạn đã tắt hoàn toàn IDE/Cursor đang mở folder này):', e.message);
      }
    }
  });
});

// Update skills.json
const skillsJsonPath = 'skills.json';
let skillsData = JSON.parse(fs.readFileSync(skillsJsonPath, 'utf8'));

// Fix entries and modify their paths
if(skillsData.skills) {
    skillsData.skills = skillsData.skills.map(s => {
        if(!s.name.startsWith('qk-')) {
            s.name = 'qk-' + s.name;
            const parts = s.path.split('/');
            const skillFolder = parts[2];
            if(!skillFolder.startsWith('qk-')) {
                parts[2] = 'qk-' + skillFolder;
            }
            s.path = parts.join('/');
        }
        return s;
    });
}
fs.writeFileSync(skillsJsonPath, JSON.stringify(skillsData, null, 2));

// Update SKILL.md names
categories.forEach(category => {
  const catPath = path.join(skillsDir, category);
  const skills = fs.readdirSync(catPath).filter(f => fs.statSync(path.join(catPath, f)).isDirectory());
  skills.forEach(skill => {
    if (skill.startsWith('qk-')) {
      const skillMdPath = path.join(catPath, skill, 'SKILL.md');
      if (fs.existsSync(skillMdPath)) {
        let content = fs.readFileSync(skillMdPath, 'utf8');
        content = content.replace(/^name:\s*([a-zA-Z0-9-]+)\s*$/m, (match, p1) => {
          if (!p1.startsWith('qk-')) return 'name: qk-' + p1;
          return match;
        });
        fs.writeFileSync(skillMdPath, content);
      }
    }
  });
});
console.log('✅ Đã đổi tên thành công toàn bộ sang hệ qk-* !');
