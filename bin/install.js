#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
let targetDir = path.join(process.cwd(), '.qk-ai-skill-os');

// Check arguments for IDE-specific paths
const args = process.argv.slice(2);
const isGemini = args.includes('--gemini') || args.includes('--antigravity');

if (isGemini) {
  targetDir = path.join(process.cwd(), '.agents', 'skills');
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('🚀 Đang cài đặt AI Developer Skill OS...');
if (isGemini) {
  console.log('⚙️ Chế độ: Gemini / Antigravity IDE (Cài vào thư mục .agents/skills/)');
} else {
  console.log('⚙️ Chế độ: Mặc định (Cài vào thư mục .qk-ai-skill-os/)');
}

const filesAndFolders = [
  'skills', 
  '_template', 
  'docs', 
  'skills.json', 
  'README.md', 
  'CHANGELOG.md', 
  'LICENSE'
];

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  filesAndFolders.forEach(item => {
    const src = path.join(sourceDir, item);
    let dest = path.join(targetDir, item);
    
    // For Gemini, we dump the contents directly into .agents/skills/
    if (fs.existsSync(src)) {
      copyRecursiveSync(src, dest);
    }
  });

  console.log(`✅ Đã cài đặt thành công vào thư mục: ${targetDir.replace(process.cwd(), '.')}`);
  console.log('\n💡 Tiếp theo, hãy tham khảo tài liệu trong mục .qk-ai-skill-os/docs/HUONG_DAN_SU_DUNG.md để biết cách tương tác với AI nhé!');
} catch (error) {
  console.error('❌ Có lỗi xảy ra trong quá trình cài đặt:', error.message);
  process.exit(1);
}
