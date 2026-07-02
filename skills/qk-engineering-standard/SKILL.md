---
name: qk-engineering-standard
version: 3.1.5
updated: 2026-07-02
description: Ép buộc áp dụng SOLID, DRY, Clean Code, và các quy tắc đặt tên.
category: standard
behavior: static-analysis
intent: review-code
priority: critical
tags: [clean-code, architecture, refactoring, solid]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to review code, refactor code, or as part of the pipeline before validation.
inputs: [Source Code, Target Directory]
outputs: [Refactored Code, Code Review Report]
allowed_tools: [grep_search, read_file, write_to_file]
pipeline: [analyze, review, implement, validate, complete]
---

# 🛠️ qk-engineering-standard - Standard Operating Procedure

> **Goal:** Đóng vai trò là "Kiến trúc sư trưởng", rà soát và ép buộc mã nguồn phải tuân thủ chuẩn mực Clean Code, dễ đọc và dễ bảo trì.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Context Review):**
   - Scan the target file(s) and determine their role (UI, Logic, API, Config).
2. **Review (Smell Detection):**
   - Check for Naming violations (e.g., `temp`, `data`, `res` instead of `userData`).
   - Check for Magic Numbers/Strings.
   - Check for God Components (Files > 300 lines or > 3 responsibilities).
3. **Implement (Refactoring):**
   - Extract inline styles or raw strings into constants.
   - Split large components into smaller, pure components.
   - Separate UI rendering from Business Logic (Custom Hooks).
4. **Verify (Validation):**
   - Ensure the refactoring did NOT change the business logic or behavior of the app (Regression check).

## 🛡️ 3. Constraints & Rules

- **Code is for Humans:** Write code that junior developers can easily understand. Avoid overly clever or obscure syntax.
- **Scope Limit:** Do NOT refactor the entire project if the user only asked to review one file. Limit the scope to the current task context.
- **Preserve Behavior:** Refactoring must strictly preserve backward compatibility.

## 🌳 3. Decision Tree

```text
Is the file larger than 300 lines?
  ├── YES → Propose splitting the file into sub-components or moving logic to hooks.
  └── NO → Continue normal inspection.

Does the React Component contain `fetch()` or heavy data mapping?
  ├── YES → Extract the logic into a separate `use[Feature]Data.ts` hook.
  └── NO → Pass.
```

## 🤝 4. Handoff Pipeline

1. `validate`: Run static analysis (Linters, TypeScript compiler) to ensure the refactored code has no syntax errors.
2. `complete`: Generate the review report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt. Cấu trúc báo cáo bao gồm:

- **Tóm tắt (Summary):** File nào vừa được Refactor / Review.
- **Chi tiết (Changes):** Các thay đổi cụ thể về Tên biến, Cấu trúc.
- **Nguyên nhân (Reasoning):** Giải thích tại sao code cũ là "Bad Practice" và code mới tốt hơn thế nào.
- **Xác thực (Verification):** Đảm bảo code chạy không lỗi.
- **Hành động tiếp (Next Action):** Bàn giao lại cho Pipeline.
