import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { resolveSkillRoute } from '../tooling/route-resolver.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('Routing and Alias Contract Specification', () => {
  const agentsMdPath = path.join(rootDir, '.agents/AGENTS.md');
  const aliasesPath = path.join(rootDir, '.agents/skill-aliases.yml');

  it('AGENTS.md satisfies line budget (<= 120 lines)', () => {
    const lines = fs.readFileSync(agentsMdPath, 'utf8').split('\n');
    expect(lines.length).toBeLessThanOrEqual(120);
  });

  it('skill-aliases.yml conforms to schema and maps all 6 legacy skills', () => {
    expect(fs.existsSync(aliasesPath)).toBe(true);
    const content = fs.readFileSync(aliasesPath, 'utf8');
    const parsed = yaml.load(content);

    expect(parsed.version).toBe(1);
    expect(parsed.aliases).toBeDefined();

    const expectedAliases = [
      'qk-ui-engineer',
      'qk-backend-data',
      'qk-api-data-discovery',
      'qk-product-spec',
      'qk-prompt-compiler',
      'qk-orchestrator'
    ];

    for (const name of expectedAliases) {
      expect(parsed.aliases[name], `Missing alias for ${name}`).toBeDefined();
      const alias = parsed.aliases[name];
      expect(alias.target).toBeDefined();
      expect(alias.mode).toBeDefined();

      if (alias.target !== 'intake') {
        const targetDir = path.join(rootDir, '.agents/skills', alias.target);
        expect(fs.existsSync(targetDir), `Target ${alias.target} does not exist`).toBe(true);
      }

      if (alias.reference) {
        const refPath = path.join(rootDir, '.agents', alias.reference);
        expect(fs.existsSync(refPath), `Referenced file ${alias.reference} does not exist`).toBe(true);
        const rel = path.relative(rootDir, refPath);
        expect(rel.startsWith('..')).toBe(false);
      }
    }
  });

  it('enforces non-code modes for plan-only, prompt-only, and discovery-only', () => {
    const parsed = yaml.load(fs.readFileSync(aliasesPath, 'utf8'));

    expect(parsed.aliases['qk-product-spec'].mode).toBe('plan-only');
    expect(parsed.aliases['qk-prompt-compiler'].mode).toBe('prompt-only');
    expect(parsed.aliases['qk-api-data-discovery'].mode).toBe('discovery-only');
  });

  describe('Prompt Evaluation Suite Metadata Coverage (§11)', () => {
    const testCases = [
      { prompt: 'Thêm nút xuất Excel theo bảng hiện tại', expectedSkill: 'qk-feature-delivery', mode: 'build', ref: 'references/ui.md' },
      { prompt: 'Làm hệ thống quản lý kho', expectedSkill: 'qk-feature-delivery', mode: 'clarify', ref: 'references/requirements.md' },
      { prompt: 'Chỉ viết PRD quản lý kho', expectedSkill: 'qk-feature-delivery', mode: 'plan-only', ref: 'references/requirements.md' },
      { prompt: 'Đổi phí ship, giữ đơn cũ theo mức cũ', expectedSkill: 'qk-feature-delivery', mode: 'build', ref: 'references/backend-data.md' },
      { prompt: 'API trả null làm trang crash', expectedSkill: 'qk-bug-resolution', mode: 'fix', ref: null },
      { prompt: 'Sửa spacing đang lệch trên mobile', expectedSkill: 'qk-bug-resolution', mode: 'fix', ref: 'references/ui.md' },
      { prompt: 'Chỉ review auth, đừng sửa', expectedSkill: 'qk-code-review', mode: 'review', ref: null },
      { prompt: 'Tách hàm, giữ nguyên hành vi', expectedSkill: 'qk-code-cleaner', mode: 'refactor', ref: null },
      { prompt: 'Nâng dependency có breaking change', expectedSkill: 'qk-code-cleaner', mode: 'upgrade', ref: null },
      { prompt: 'Tích hợp API từ Postman này', expectedSkill: 'qk-feature-delivery', mode: 'discovery', ref: 'references/api-discovery.md' },
      { prompt: 'Phân tích collection, chưa viết ingestion', expectedSkill: 'qk-feature-delivery', mode: 'discovery-only', ref: 'references/api-discovery.md' },
      { prompt: 'Viết lại prompt này, đừng chạy nó', expectedSkill: 'qk-feature-delivery', mode: 'prompt-only', ref: 'references/prompt-authoring.md' },
      { prompt: 'Sửa CI bị lỗi phiên bản Node', expectedSkill: 'qk-devops-release', mode: 'ci', ref: null },
      { prompt: 'Cập nhật README', expectedSkill: 'qk-devops-release', mode: 'docs', ref: null },
      { prompt: 'qk-orchestrator: bộ này dùng thế nào', expectedSkill: 'intake', mode: 'help', ref: 'references/context-discovery.md' },
      { prompt: 'Fix lỗi này (không log, chưa rõ triệu chứng)', expectedSkill: 'qk-bug-resolution', mode: 'clarify', ref: null }
    ];

    it('covers all 16 prompt scenarios in routing metadata contract and strictly resolves route and references', () => {
      expect(testCases.length).toBe(16);
      for (const tc of testCases) {
        if (tc.expectedSkill !== 'intake') {
          const sDir = path.join(rootDir, '.agents/skills', tc.expectedSkill);
          expect(fs.existsSync(sDir), `Skill directory for ${tc.expectedSkill} must exist`).toBe(true);
        }
        if (tc.ref) {
          const rPath = path.join(rootDir, '.agents', tc.ref);
          expect(fs.existsSync(rPath), `Required reference ${tc.ref} for prompt "${tc.prompt}" must exist on disk`).toBe(true);
        }

        const resolved = resolveSkillRoute(tc.prompt);
        expect(resolved.skill, `Skill mismatch for prompt: "${tc.prompt}"`).toBe(tc.expectedSkill);
        expect(resolved.mode, `Mode mismatch for prompt: "${tc.prompt}"`).toBe(tc.mode);
        expect(resolved.reference, `Reference mismatch for prompt: "${tc.prompt}"`).toBe(tc.ref);
      }
    });
  });
});
