---
name: qk-system-evolution
version: 3.1.4
updated: 2026-07-02
description: Safely upgrade dependencies, migrate frameworks, and manage rollbacks.
category: operations
behavior: maintenance
intent: maintain
priority: high
tags: [upgrade, migration, devops, dependencies]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User wants to update a library, upgrade a framework (e.g., Next.js 13 to 14), or perform a major refactor.
inputs: [Target package, Target version]
outputs: [Upgraded codebase, Rollback plan]
allowed_tools: [run_command, grep_search, read_file]
pipeline: [analyze, plan, implement, validate, complete]
---

# 🛠️ qk-system-evolution - Standard Operating Procedure

> **Goal:** Quản lý các thay đổi lớn cấp hệ thống (Major Updates) một cách an toàn, luôn có đường lui (Rollback) nếu xảy ra sự cố.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Impact Analysis):**
   - Read the Changelog or Migration Guide for the new version.
   - Identify Breaking Changes and Deprecated APIs.
   - Search the codebase to see how many files are affected.
2. **Plan (Rollback Strategy):**
   - Document the exact Git commands or NPM commands needed to revert the system if the upgrade fails completely.
3. **Implement (Dry-Run & Upgrade):**
   - Apply the dependency updates in `package.json`.
   - Run Codemods (if provided by the library).
   - Manually fix code affected by Breaking Changes.
4. **Verify (System Test):**
   - Reinstall dependencies cleanly (`npm ci` or `yarn install`).
   - Run the build process to ensure the system compiles.

## 🛡️ 3. Constraints & Rules

- **Safety First:** Never run `npm update` blindly across all packages. Update only what was requested.
- **Lockfiles:** Do not delete `package-lock.json` or `yarn.lock` unless resolving extreme merge conflicts.
- **Always Rollback:** If the system produces >50 compilation errors after an upgrade and you cannot fix them in 1 turn, immediately trigger the Rollback Plan.

## 🌳 3. Decision Tree

```text
Are there Breaking Changes in the target version?
  ├── YES → Create a migration checklist based on the official docs. Update code systematically.
  └── NO (Minor/Patch) → Update version and run tests.

Did the Build fail after the update?
  ├── YES → Are there too many errors to fix easily?
  │       ├── YES → Execute Rollback Plan (`git reset --hard HEAD`).
  │       └── NO → Fix the specific API changes.
  └── NO → Proceed to Validation.
```

## 🤝 4. Handoff Pipeline

1. `validate`: Run the full test suite and `npm run build` via `qk-validation-gate`.
2. `complete`: Generate the Evolution report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Đã nâng cấp package nào, từ vX lên vY.
- **Chi tiết (Changes):** Số lượng file phải sửa do Breaking Changes.
- **Kế hoạch lùi (Reasoning/Risks):** Ghi rõ lệnh Rollback để User copy-paste nếu cần.
- **Xác thực (Verification):** Kết quả của Build/Test.
