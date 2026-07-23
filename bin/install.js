#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.resolve(__dirname, '..', '.agents');
const cwd = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  let ide = null;
  let scope = null;

  args.forEach(arg => {
    if (arg.startsWith('--ide=')) {
      ide = arg.split('=')[1];
    } else if (arg.startsWith('--scope=')) {
      scope = arg.split('=')[1];
    }
  });

  return { ide, scope };
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function runInstall(ideChoice, scopeChoice) {
  const mapIde = {
    '1': 'cursor',
    '2': 'windsurf',
    '3': 'cline',
    '4': 'antigravity',
    '5': 'codex',
    '6': 'kilo',
    '7': 'multi-ide'
  };

  const mapScope = {
    '1': 'local',
    '2': 'global'
  };

  const ide = mapIde[ideChoice] || ideChoice;
  const scope = mapScope[scopeChoice] || scopeChoice;
  const isGlobal = scope === 'global';

  let targetDir = path.join(cwd, '.agents');
  
  if (isGlobal) {
    const homeDir = os.homedir();
    if (ide === 'antigravity') {
      targetDir = path.join(homeDir, '.gemini', 'config', '.agents');
    } else {
      targetDir = path.join(homeDir, '.ai-developer-skill-os', '.agents');
    }
  }

  try {
    console.log(`\n🚀 Đang cài đặt V8.1.4 Agent Engineering OS...`);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(sourceDir)) {
      copyRecursiveSync(sourceDir, targetDir);
      console.log(`✅ Đã copy toàn bộ kiến trúc .agents vào: ${targetDir}`);
    } else {
      console.error(`❌ Lỗi: Không tìm thấy thư mục nguồn ${sourceDir}`);
      return;
    }
    
    console.log(`\n🎉 HOÀN TẤT! Kiến trúc V8.1.4 đã sẵn sàng tại: ${targetDir}`);
    
    if (isGlobal && ide === 'antigravity') {
      console.log(`💡 Antigravity đã được cài Global. Từ nay bạn mở BẤT KỲ DỰ ÁN NÀO, Antigravity cũng sẽ tự động có đủ hệ thống OS mới nhất!`);
    }

  } catch (error) {
    console.error('❌ Có lỗi xảy ra trong quá trình cài đặt:', error.message);
  }
}

const args = parseArgs();

if (args.ide && args.scope) {
  runInstall(args.ide, args.scope);
} else {
  console.log('🚀 Đang chuẩn bị cài đặt AI Developer Skill OS V8...\n');

  const questionIde = `Vui lòng chọn IDE/AI Assistant bạn đang sử dụng:
(1) Cursor
(2) Windsurf
(3) Cline / Roo Code
(4) Antigravity / Gemini
(5) Codex
(6) Kilo Code
(7) Tất cả các IDE (Multi-IDE)

Nhập số (1-7): `;

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
