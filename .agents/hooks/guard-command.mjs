#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DESTRUCTIVE_PATTERNS = [
  {
    pattern: /\bgit\s+reset\s+--hard\b/,
    label: 'git reset --hard (xóa thay đổi chưa commit)'
  },
  {
    pattern: /\bgit\s+push\b[^\n]*(?:\s--force(?:-with-lease)?\b|\s-f\b)/,
    label: 'git push --force (ghi đè lịch sử nhánh từ xa)'
  },
  {
    pattern: /\bgit\s+clean\s+-[a-zA-Z]*f/,
    label: 'git clean -f (xóa vĩnh viễn file untracked)'
  },
  {
    pattern: /\b(?:DROP\s+(?:TABLE|DATABASE|SCHEMA)|TRUNCATE\s+TABLE)\b/i,
    label: 'SQL DROP/TRUNCATE (mất dữ liệu bảng/cơ sở dữ liệu)'
  },
  {
    pattern: /\bterraform\s+destroy\b/,
    label: 'terraform destroy (hủy hạ tầng)'
  },
  {
    pattern: /\bnpm\s+publish\b/,
    label: 'npm publish (phát hành gói công khai)'
  },
  {
    pattern: /\bchmod\s+(?:-R\s+)?777\b/,
    label: 'chmod 777 (mở toàn bộ quyền truy cập không an toàn)'
  },
  {
    pattern: /\brm\s+-(?:[a-zA-Z]*r[a-zA-Z]*f|[a-zA-Z]*f[a-zA-Z]*r)[a-zA-Z]*\s+(?:\/(?:\s|$)|~(?:\s|\/|$)|\$HOME\b|\.\.(?:\s|\/|$)|\*)/,
    label: 'rm -rf phạm vi rộng (/, ~, .., hoặc wildcard *)'
  }
];

export function evaluateCommand(commandLine) {
  if (typeof commandLine !== 'string' || !commandLine.trim()) {
    return { decision: 'ask' };
  }

  for (const rule of DESTRUCTIVE_PATTERNS) {
    if (rule.pattern.test(commandLine)) {
      return {
        decision: 'force_ask',
        reason: `QK Safety Gate: Phát hiện thao tác rủi ro cao [${rule.label}]. Cần xác nhận trực tiếp từ người dùng theo safety.md.`
      };
    }
  }

  // Defer to Antigravity's standard permission policy and "Always Allow" cache
  return { decision: 'ask' };
}

function main() {
  try {
    const raw = fs.readFileSync(0, 'utf8').trim();
    const payload = raw ? JSON.parse(raw) : null;
    const cmd = payload?.toolCall?.args?.CommandLine ?? payload?.toolCall?.args?.command ?? '';
    const result = evaluateCommand(cmd);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch {
    process.stdout.write(`${JSON.stringify({ decision: 'ask' })}\n`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
