#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const sourceDir = path.join(__dirname, '..');
let targetDir = path.join(process.cwd(), '.qk-ai-skill-os');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Đang chuẩn bị cài đặt AI Developer Skill OS...\n');

const questionText = `Vui lòng chọn IDE/AI Assistant bạn đang sử dụng để tự động cấu hình (Auto-Generate Config):
(1) Cursor
(2) Windsurf
(3) Cline / Roo Code
(4) Antigravity / Gemini
(5) Codex
(6) Kilo Code
(0) Bỏ qua (Không tạo file config)

Nhập số (0-6): `;

rl.question(questionText, (answer) => {
  let isGemini = false;
  let ruleFile = null;

  switch(answer.trim()) {
    case '1': ruleFile = '.cursorrules'; break;
    case '2': ruleFile = '.windsurfrules'; break;
    case '3': ruleFile = '.clinerules'; break;
    case '4': 
      isGemini = true; 
      targetDir = path.join(process.cwd(), '.agents', 'skills');
      ruleFile = path.join('.agents', 'AGENTS.md');
      break;
    case '5': ruleFile = '.codexrules'; break;
    case '6': ruleFile = '.kilorules'; break;
    case '0': 
    default:
      console.log('👉 Bỏ qua bước tạo file cấu hình tự động.');
      break;
  }

  const baseFolder = isGemini ? '.agents/skills' : '.qk-ai-skill-os';

  const systemPrompt = `[Role]
You are an elite AI Software Engineer. You must strictly follow the rules in this project.
Vui lòng tìm đọc danh sách kỹ năng tại file \`./${baseFolder}/skills.json\`.

[Trigger Mechanism]
Bất cứ khi nào người dùng gõ lệnh bắt đầu bằng \`./qk-[tên-skill]\`, bạn BẮT BUỘC phải đọc file \`SKILL.md\` tương ứng trong thư mục \`./${baseFolder}/...\` (hoặc dùng tool view_file để đọc file đó) trước khi làm bất cứ việc gì. Đừng bao giờ đoán mò.

[Command Arguments]
Người dùng có thể truyền thêm tham số vào lệnh (ví dụ: \`./qk-ui-builder --fw=react --css=tailwind\`). 
Nếu người dùng sử dụng tham số (argument), bạn BẮT BUỘC phải tuân thủ tuyệt đối các công nghệ/yêu cầu được chỉ định trong tham số đó thay vì dùng mặc định.`;

  if (isGemini) {
    console.log('\n⚙️ Chế độ: Gemini / Antigravity IDE (Cài vào thư mục .agents/)');
  } else {
    console.log('\n⚙️ Chế độ: Mặc định (Cài vào thư mục .qk-ai-skill-os/)');
  }

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
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

    filesAndFolders.forEach(item => {
      const src = path.join(sourceDir, item);
      let dest = path.join(targetDir, item);
      
      if (fs.existsSync(src)) {
        copyRecursiveSync(src, dest);
      }
    });

    if (ruleFile) {
        const fullRulePath = path.join(process.cwd(), ruleFile);
        const ruleDir = path.dirname(fullRulePath);
        if (ruleDir !== process.cwd() && !fs.existsSync(ruleDir)) {
            fs.mkdirSync(ruleDir, { recursive: true });
        }
        
        let writeContent = systemPrompt;
        if (isGemini) {
            writeContent = `\n<RULE[ai_skill_os]>\n---\ntrigger: always_on\n---\n${systemPrompt}\n</RULE[ai_skill_os]>\n`;
        }

        if (fs.existsSync(fullRulePath)) {
            fs.appendFileSync(fullRulePath, "\n\n" + writeContent);
            console.log(`✅ Đã GHI THÊM cấu hình tự động vào file: ${ruleFile}`);
        } else {
            fs.writeFileSync(fullRulePath, writeContent);
            console.log(`✅ Đã TẠO MỚI file cấu hình: ${ruleFile}`);
        }
    }

    console.log(`✅ Đã cài đặt thư viện thành công vào thư mục: ${targetDir.replace(process.cwd(), '.')}`);
    console.log('\n💡 Hãy tận hưởng trải nghiệm Auto-Config và Command Arguments (VD: ./qk-ui-builder --fw=react)!');
  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình cài đặt:', error.message);
  } finally {
    rl.close();
  }
});
