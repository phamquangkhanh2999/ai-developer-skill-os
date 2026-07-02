---
name: qk-validation-gate
version: 3.0.0
updated: 2026-07-02
description: Mandatory Quality Gate (Test, Lint, Security).
category: validation
priority: critical
tags: [ci, testing, linting, security, gatekeeper]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: Triggered automatically as the final step in a pipeline, or manually when the user asks to "check the code".
inputs: [Modified files]
outputs: [Validation Report (Pass/Fail)]
allowed_tools: [run_command, grep_search]
pipeline: [analyze, validate, complete]
---

# 🛠️ qk-validation-gate - Standard Operating Procedure

> **Goal:** Hoạt động như một "Người Gác Cổng" (Gatekeeper). Đảm bảo không có lỗi cú pháp, vi phạm bảo mật, hoặc code rác nào lọt qua trước khi báo cáo hoàn thành.

## 🔄 1. Chain of Thought (SOP)
1. **Analyze (Static Sweep):**
   - Use `grep_search` to scan modified files for garbage code: `console.log(`, `debugger;`, `// TODO`, `@ts-ignore`.
   - Scan for hardcoded secrets: `API_KEY=`, `Bearer ey...`.
2. **Validate (Automated Checks):**
   - Run the Linter: `npm run lint` or `eslint .`.
   - Run the Type Checker: `tsc --noEmit`.
   - Run the Tests: `npm run test` (if applicable).
3. **Complete (Report & Auto-fix):**
   - If minor lint errors exist, attempt an auto-fix (`npm run lint --fix`).
   - If tests fail, report the exact failure to the user. Do NOT pretend it passed.

## 🛡️ 2. Constraints & Rules
- **Zero Tolerance:** A failed test or a TypeScript error means the Gate is FAILED. Do not ignore errors.
- **No Force:** Never use `--force` or `--no-verify` flags.
- **Real Execution:** You MUST run the actual CLI commands using `run_command` and wait for the output.

## 🌳 3. Decision Tree
```text
Did `npm run lint` return errors?
  ├── YES → Are they auto-fixable?
  │       ├── YES → Run `npm run lint --fix`.
  │       └── NO → Manually fix the file and re-run.
  └── NO → Proceed to Type Checking.

Did `tsc --noEmit` return errors?
  ├── YES → Fix the TypeScript types. Do NOT use `any` as a shortcut.
  └── NO → GATE PASSED.
```

## 🤝 4. Handoff Pipeline
1. `complete`: Once all checks pass, output the Validation Report.

## 📝 5. Output Format
Vui lòng trả kết quả bằng Tiếng Việt.
- **Tóm tắt (Summary):** 🛡️ Đã chạy các cổng kiểm định (Lint, Test, Type).
- **Chi tiết (Changes):** Liệt kê các lệnh đã chạy và kết quả.
- **Xác thực (Verification):** Ghi rõ PASS (Xanh) hoặc FAIL (Đỏ).
- **Rủi ro (Risks):** Có phát hiện code rác / comment tạm thời không.
