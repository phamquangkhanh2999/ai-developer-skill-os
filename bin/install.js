#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const targetDir = path.join(process.cwd(), 'rules-skill');

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
    const dest = path.join(targetDir, item);
    if (fs.existsSync(src)) {
      copyRecursiveSync(src, dest);
    }
  });

  console.log('✅ Đã cài đặt thành công vào thư mục: ./rules-skill/');
  console.log('\n💡 Tiếp theo, hãy tham khảo ./rules-skill/docs/HUONG_DAN_SU_DUNG.md để cấu hình cho AI của bạn nhé!');
} catch (error) {
  console.error('❌ Có lỗi xảy ra trong quá trình cài đặt:', error.message);
  process.exit(1);
}
