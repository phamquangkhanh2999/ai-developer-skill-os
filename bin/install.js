#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    const dirName = path.basename(src);
    if (dirName.startsWith('_')) {
      return;
    }

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

function cleanOldSkills(targetSkillsDir, isGeminiGlobal) {
  if (fs.existsSync(targetSkillsDir)) {
    console.log('🧹 Đang dọn dẹp phiên bản cũ để tối ưu hệ thống...');
    if (isGeminiGlobal) {
      fs.readdirSync(targetSkillsDir).forEach(item => {
        if (item.startsWith('qk-')) {
          fs.rmSync(path.join(targetSkillsDir, item), { recursive: true, force: true });
        }
      });
    } else {
      fs.rmSync(targetSkillsDir, { recursive: true, force: true });
    }
  }
}

function ensureKiloConfig(kiloJsonPath, kiloSkillsDir, kiloThemesDir, kiloCommandsDir) {
  if (!fs.existsSync(kiloSkillsDir)) {
    fs.mkdirSync(kiloSkillsDir, { recursive: true });
  }
  if (!fs.existsSync(kiloThemesDir)) {
    fs.mkdirSync(kiloThemesDir, { recursive: true });
  }
  if (!fs.existsSync(kiloCommandsDir)) {
    fs.mkdirSync(kiloCommandsDir, { recursive: true });
  }

  const srcSkills = path.join(sourceDir, 'skills');
  if (fs.existsSync(srcSkills)) {
    copyRecursiveSync(srcSkills, kiloSkillsDir);
  }

  let kiloConfig = {};
  if (fs.existsSync(kiloJsonPath)) {
    try {
      kiloConfig = JSON.parse(fs.readFileSync(kiloJsonPath, 'utf8'));
    } catch (e) {
      kiloConfig = {};
    }
  }

  const skillPaths = [kiloSkillsDir];
  if (!kiloConfig.skills || typeof kiloConfig.skills !== 'object' || !Array.isArray(kiloConfig.skills.paths)) {
    kiloConfig.skills = { paths: skillPaths };
  } else {
    const exists = kiloConfig.skills.paths.some(p => path.resolve(p) === path.resolve(kiloSkillsDir));
    if (!exists) {
      kiloConfig.skills.paths = [...kiloConfig.skills.paths, ...skillPaths];
    }
  }

  fs.writeFileSync(kiloJsonPath, JSON.stringify(kiloConfig, null, 2) + '\n');
  return kiloJsonPath;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { ide: null, scope: null };
  for (const arg of args) {
    if (arg.startsWith('--ide=')) parsed.ide = arg.split('=')[1];
    if (arg.startsWith('--scope=')) parsed.scope = arg.split('=')[1];
  }

  const aliasMap = {
    'antigravity': '4',
    'gemini': '4',
    'cursor': '1',
    'windsurf': '2',
    'claude': '3',
    'cliner': '3',
    'roo': '3',
    'codex': '5',
    'kilo': '6',
    'multi-ide': '7',
    'all': '7'
  };

  if (parsed.ide && aliasMap[parsed.ide.toLowerCase()]) {
    parsed.ide = aliasMap[parsed.ide.toLowerCase()];
  }

  if (args.includes('--antigravity')) {
    parsed.ide = '4';
    if (!parsed.scope) parsed.scope = '2';
  }
  if (args.includes('--cursor')) {
    parsed.ide = '1';
    if (!parsed.scope) parsed.scope = '2';
  }
  if (args.includes('--kilo')) {
    parsed.ide = '6';
    if (!parsed.scope) parsed.scope = '2';
  }

  return parsed;
}

function runInstall(ideCode, answerScope) {
  let isGemini = false;
  let isKilo = false;
  let isMultiIde = false;
  let ruleFileName = null;

  switch(ideCode) {
    case '1': ruleFileName = '.cursorrules'; break;
    case '2': ruleFileName = '.windsurfrules'; break;
    case '3': ruleFileName = '.clinerules'; break;
    case '4': isGemini = true; break;
    case '5': ruleFileName = '.codexrules'; break;
    case '6': ruleFileName = '.kilorules'; isKilo = true; break;
    case '7': isMultiIde = true; ruleFileName = null; break;
    case '0': default: break;
  }

  const isGlobal = answerScope.trim() === '2';

  const homeDir = os.homedir();
  const cwd = process.cwd();
  let targetDir = '';
  let ruleFilePath = null;
  let baseFolderForPrompt = '';
  let kiloJsonPath = null;
  let kiloSkillsDir = null;
  let kiloThemesDir = null;
  let kiloCommandsDir = null;

  if (isMultiIde) {
    targetDir = path.join(cwd, '.qk-ai-skill-os');
    baseFolderForPrompt = './.qk-ai-skill-os';
    ruleFilePath = path.join(cwd, 'CLAUDE.md');
    if (!isGlobal) {
      kiloSkillsDir = path.join(cwd, '.kilo', 'skills');
      kiloThemesDir = path.join(cwd, '.kilo', 'themes');
      kiloCommandsDir = path.join(cwd, '.kilo', 'command');
      kiloJsonPath = path.join(cwd, 'kilo.json');
    }
  } else if (isGemini) {
    if (isGlobal) {
      targetDir = path.join(homeDir, '.gemini', 'config');
      ruleFilePath = path.join(targetDir, 'AGENTS.md');
      baseFolderForPrompt = path.join(targetDir, 'skills').replace(/\\/g, '/');
    } else {
      targetDir = path.join(cwd, '.agents');
      ruleFilePath = path.join(cwd, '.agents', 'AGENTS.md');
      baseFolderForPrompt = '.agents/skills';
    }
  } else if (isKilo) {
    if (isGlobal) {
      targetDir = path.join(homeDir, '.qk-ai-skill-os');
      baseFolderForPrompt = targetDir.replace(/\\/g, '/');
      kiloSkillsDir = path.join(homeDir, '.kilo', 'skills');
      kiloThemesDir = path.join(homeDir, '.config', 'kilo', 'themes');
      kiloCommandsDir = path.join(homeDir, '.config', 'kilo', 'command');
      kiloJsonPath = path.join(homeDir, '.config', 'kilo', 'kilo.json');
    } else {
      targetDir = path.join(cwd, '.qk-ai-skill-os');
      baseFolderForPrompt = './.qk-ai-skill-os';
      kiloSkillsDir = path.join(cwd, '.kilo', 'skills');
      kiloThemesDir = path.join(cwd, '.kilo', 'themes');
      kiloCommandsDir = path.join(cwd, '.kilo', 'command');
      kiloJsonPath = path.join(cwd, 'kilo.json');
    }
    ruleFilePath = path.join(cwd, 'CLAUDE.md');
  } else {
    if (isGlobal) {
      targetDir = path.join(homeDir, '.qk-ai-skill-os');
      baseFolderForPrompt = targetDir.replace(/\\/g, '/');
    } else {
      targetDir = path.join(cwd, '.qk-ai-skill-os');
      baseFolderForPrompt = './.qk-ai-skill-os';
    }
    if (ruleFileName) {
      ruleFilePath = path.join(cwd, ruleFileName);
    }
  }

  const systemPrompt = `[Role]
You are an elite AI Software Engineer. You must strictly follow the rules in this project.
Vui lòng tìm đọc danh sách kỹ năng tại file \`${baseFolderForPrompt}/skills.json\`.

[Trigger Mechanism]
Bất cứ khi nào người dùng gõ lệnh bắt đầu bằng \`./qk-[tên-skill]\`, bạn BẮT BUỘC phải đọc file \`SKILL.md\` tương ứng trong thư mục \`${baseFolderForPrompt}/...\` (hoặc dùng tool view_file để đọc file đó) trước khi làm bất cứ việc gì. Đừng bao giờ đoán mò.

[Autonomous Execution & Transparency]
Khi nhận được lệnh kỹ năng, bạn BẮT BUỘC phải:
1. Thông báo rõ ràng: "[🚀 AI Developer Skin: Đã kích hoạt kỹ năng <tên-skill>]" ngay dòng đầu tiên.
2. TỰ ĐỘNG THỰC THI (End-to-End): Dùng các tools của bạn (đọc file, sửa code, chạy lệnh) để tự động hoàn thành 100% mục tiêu được giao. KHÔNG ĐƯỢC dừng lại để hỏi ý kiến trừ khi gặp lỗi chí mạng hoặc requirement quá mập mờ.
3. BÁO CÁO KẾT QUẢ: Sau khi hoàn tất sửa code, LUÔN trả về báo cáo theo đúng format markdown dưới đây:

\`\`\`markdown
🔧 <Tên Kỹ Năng> Summary
─────────────────────────────────────────────────
Scope:        [Tóm tắt ngắn gọn phạm vi công việc]
Changes:      [N file modified, N extracted, N removed]

Changes applied:
  ✅ [Loại hành động 1]: [Chi tiết những gì đã làm, ví dụ: Ngăn chặn lỗi lặp vô hạn...]
  ✅ [Loại hành động 2]: [Chi tiết những gì đã làm]

📊 Quality improvement:
  Before: [Mô tả ngắn tình trạng trước khi sửa/làm]
  After:  [Mô tả sự cải thiện đạt được]

✅ Verification:
  Tests:     [Trạng thái test (vd: N/A, Pass)]
  Lint/Types:[Trạng thái kiểm tra lỗi (vd: Clean)]
  Behavior:  [Kết quả hoạt động (vd: Unchanged, Improved)]

⚠️ Notes:
  [Các lưu ý đặc biệt, rủi ro tiềm ẩn hoặc cách người dùng có thể test lại tính năng này]
\`\`\`

[Command Arguments]
Người dùng có thể truyền thêm tham số vào lệnh (ví dụ: \`./qk-ui-builder --fw=react --css=tailwind\`).
Nếu người dùng sử dụng tham số (argument), bạn BẮT BUỘC phải tuân thủ tuyệt đối các công nghệ/yêu cầu được chỉ định trong tham số đó thay vì dùng mặc định.`;

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetSkillsDir = path.join(targetDir, 'skills');
    cleanOldSkills(targetSkillsDir, isGemini && isGlobal);

    const filesAndFolders = [
      'skills', '_template', 'docs', 'skills.json', 'README.md', 'CHANGELOG.md', 'LICENSE'
    ];

    if (isGemini && isGlobal) {
      if (fs.existsSync(path.join(sourceDir, 'skills'))) {
        copyRecursiveSync(path.join(sourceDir, 'skills'), path.join(targetDir, 'skills'));
      }
      if (fs.existsSync(path.join(sourceDir, 'skills.json'))) {
        fs.copyFileSync(path.join(sourceDir, 'skills.json'), path.join(targetDir, 'skills', 'skills.json'));
      }
    } else {
      filesAndFolders.forEach(item => {
        const src = path.join(sourceDir, item);
        let dest = path.join(targetDir, item);
        if (fs.existsSync(src)) {
          copyRecursiveSync(src, dest);
        }
      });
    }

    if (ruleFilePath) {
      const ruleDir = path.dirname(ruleFilePath);
      if (ruleDir !== cwd && !fs.existsSync(ruleDir)) {
        fs.mkdirSync(ruleDir, { recursive: true });
      }

      let writeContent = systemPrompt;
      if (isGemini) {
        writeContent = `\n<RULE[ai_skill_os]>\n---\ntrigger: always_on\n---\n${systemPrompt}\n</RULE[ai_skill_os]>\n`;
      }

      if (fs.existsSync(ruleFilePath)) {
        const existingContent = fs.readFileSync(ruleFilePath, 'utf8');
        const marker = isGemini ? '<RULE[ai_skill_os]>' : '[Role]\nYou are an elite AI Software Engineer.';
        const markerIndex = existingContent.indexOf(marker);
        if (markerIndex !== -1) {
          const before = existingContent.substring(0, markerIndex);
          const after = existingContent.substring(markerIndex).split('\n').slice(isGemini ? 2 : 1).join('\n');
          const lastMarkerEnd = after.indexOf(isGemini ? '</RULE[ai_skill_os]>' : '[Trigger Mechanism]');
          const actualAfter = lastMarkerEnd !== -1 ? after.substring(lastMarkerEnd + (isGemini ? 19 : 18)).trimStart() : after;
          fs.writeFileSync(ruleFilePath, before + writeContent.trimStart() + (actualAfter ? '\n' + actualAfter : '') + '\n');
          console.log(`✅ Đã CẬP NHẬT cấu hình tự động trong file: ${ruleFilePath}`);
        } else {
          fs.appendFileSync(ruleFilePath, "\n\n" + writeContent);
          console.log(`✅ Đã GHI THÊM cấu hình tự động vào file: ${ruleFilePath}`);
        }
      } else {
        fs.writeFileSync(ruleFilePath, writeContent);
        console.log(`✅ Đã TẠO MỚI file cấu hình: ${ruleFilePath}`);
      }
    }

    if (isKilo) {
      ensureKiloConfig(kiloJsonPath, kiloSkillsDir, kiloThemesDir, kiloCommandsDir);
      console.log(`✅ Đã cấu hình Kilo Code tại: ${kiloJsonPath}`);
      console.log(`   → Skills: ${kiloSkillsDir}`);
      console.log(`   → Themes: ${kiloThemesDir}`);
      console.log(`   → Commands: ${kiloCommandsDir}`);
    }

    if (isMultiIde) {
      if (kiloJsonPath && kiloSkillsDir) {
        ensureKiloConfig(kiloJsonPath, kiloSkillsDir, kiloThemesDir, kiloCommandsDir);
        console.log(`✅ Đã cấu hình Kilo Code (Multi-IDE) tại: ${kiloJsonPath}`);
        console.log(`   → Skills: ${kiloSkillsDir}`);
        console.log(`   → Themes: ${kiloThemesDir}`);
        console.log(`   → Commands: ${kiloCommandsDir}`);
      } else if (ruleFilePath) {
        console.log(`✅ Đã tạo file cấu hình Multi-IDE: ${ruleFilePath}`);
      }
    }

    console.log(`\n🎉 HOÀN TẤT! Dữ liệu kỹ năng đã được lưu tại: ${targetDir}`);
    if (isGlobal && !isGemini) {
      const name = ruleFilePath ? path.basename(ruleFilePath) : 'CLAUDE.md';
      console.log(`💡 Lưu ý: Kỹ năng đã được cài ở cấp độ máy tính (Global). File cấu hình cục bộ (${name}) ở dự án này đang trỏ thẳng về thư mục Global đó.`);
    } else if (isGlobal && isGemini) {
      console.log(`💡 Lưu ý: Antigravity đã được cài Global. Từ nay bạn mở BẤT KỲ DỰ ÁN NÀO trên máy tính này, Antigravity cũng sẽ tự động có đủ 22 kỹ năng mà không cần cài lại!`);
    } else if (isKilo) {
      console.log(`💡 Lưu ý: Kilo Code đã sẵn sàng. Dùng \`<leader>t\` hoặc \`/themes\` để xem, và \`/skills\` để xem danh sách skill đã cài.`);
    }

    if (!isGemini && !isKilo && !isMultiIde) {
      if (fs.existsSync(path.join(cwd, '.kilorules'))) {
        fs.unlinkSync(path.join(cwd, '.kilorules'));
        console.log(`🧹 Đã xoá file .kilorules cũ (không còn cần thiết).`);
      }
    }

  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình cài đặt:', error.message);
  }
}

const args = parseArgs();

if (args.ide !== null && args.scope !== null) {
  runInstall(args.ide, args.scope);
} else {
  console.log('🚀 Đang chuẩn bị cài đặt AI Developer Skill OS...\n');

  const questionIde = `Vui lòng chọn IDE/AI Assistant bạn đang sử dụng:
(1) Cursor
(2) Windsurf
(3) Cline / Roo Code
(4) Antigravity / Gemini
(5) Codex
(6) Kilo Code
(7) Tất cả các IDE (Multi-IDE)
(0) Bỏ qua (Không tạo config tự động)

Nhập số (0-7): `;

  const questionScope = `
Bạn muốn cài đặt bộ kỹ năng ở đâu?
(1) Local  (Gắn vào dự án hiện tại - Phù hợp làm việc nhóm)
(2) Global (Cài vào máy tính dùng chung cho mọi dự án - Dành cho cá nhân)

Nhập số (1-2): `;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(questionIde, (answerIde) => {
    rl.question(questionScope, (answerScope) => {
      rl.close();
      runInstall(answerIde.trim(), answerScope.trim());
    });
  });
}
