const fs = require('fs');
const path = require('path');

const repoDir = 'd:\\ai-code-skin-mcp\\rules-skill';
const skillsJsonPath = path.join(repoDir, 'skills.json');

try {
  const data = fs.readFileSync(skillsJsonPath, 'utf8');
  const skillsConfig = JSON.parse(data);

  skillsConfig.skills.forEach(skill => {
    if (skill.path && skill.description) {
      const skillMdPath = path.join(repoDir, skill.path);
      if (fs.existsSync(skillMdPath)) {
        let content = fs.readFileSync(skillMdPath, 'utf8');
        const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
        const match = content.match(frontmatterRegex);

        if (match) {
          let frontmatter = match[1];
          // Update version to 6.0.3 in frontmatter
          if (/^version:/m.test(frontmatter)) {
            frontmatter = frontmatter.replace(/^version:.*$/m, `version: 6.0.3`);
          } else {
            frontmatter += `\nversion: 6.0.3`;
          }

          // Check if description already exists
          if (/^description:/m.test(frontmatter)) {
            frontmatter = frontmatter.replace(/^description:.*$/m, `description: "${skill.description}"`);
          } else {
            frontmatter += `\ndescription: "${skill.description}"`;
          }
          
          const newContent = content.replace(frontmatterRegex, `---\n${frontmatter}\n---`);
          fs.writeFileSync(skillMdPath, newContent, 'utf8');
          console.log(`Updated ${skillMdPath}`);
        } else {
          console.log(`No frontmatter found in ${skillMdPath}`);
        }
      } else {
        console.log(`File not found: ${skillMdPath}`);
      }
    }
  });

  // Also update package.json version
  const packageJsonPath = path.join(repoDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    pkg.version = "6.0.3";
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
    console.log('Updated package.json to 6.0.3');
  }

  // Also update skills.json version if needed
  if (skillsConfig.version) {
    skillsConfig.version = "6.0.3";
    fs.writeFileSync(skillsJsonPath, JSON.stringify(skillsConfig, null, 2), 'utf8');
    console.log('Updated skills.json version to 6.0.3');
  }

  console.log('Done!');
} catch (err) {
  console.error('Error:', err);
}
