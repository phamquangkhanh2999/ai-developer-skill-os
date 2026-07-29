import fs from 'fs';
import path from 'path';

const targetVersion = "8.3.1";
const rootDir = process.cwd();
const skillsDir = path.join(rootDir, '.agents', 'skills');

const skills = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

let updatedCount = 0;

skills.forEach(skill => {
  const skillPath = path.join(skillsDir, skill);
  
  // 1. SKILL.md
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    let content = fs.readFileSync(skillMdPath, 'utf8');
    const newContent = content.replace(/^version:\s*["']?[\d.]+["']?/m, `version: ${targetVersion}`);
    if (content !== newContent) {
      fs.writeFileSync(skillMdPath, newContent);
      updatedCount++;
    }
  }

  // 2. capability.yaml
  const capPath = path.join(skillPath, 'capability.yaml');
  if (fs.existsSync(capPath)) {
    let content = fs.readFileSync(capPath, 'utf8');
    const newContent = content.replace(/^version:\s*["']?[\d.]+["']?/m, `version: "${targetVersion}"`);
    if (content !== newContent) {
      fs.writeFileSync(capPath, newContent);
      updatedCount++;
    }
  }

  // 3. evals/scorecard.yaml
  const evalPath = path.join(skillPath, 'evals', 'scorecard.yaml');
  if (fs.existsSync(evalPath)) {
    let content = fs.readFileSync(evalPath, 'utf8');
    const newContent = content.replace(/^version:\s*["']?[\d.]+["']?/m, `version: ${targetVersion}`);
    if (content !== newContent) {
      fs.writeFileSync(evalPath, newContent);
      updatedCount++;
    }
  }
});

console.log(`✅ Synchronized version to ${targetVersion} across ${updatedCount} files.`);
