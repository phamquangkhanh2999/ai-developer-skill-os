---
name: qk-project-health
version: version: 3.1.5
updated: 2026-07-02
description: Kiểm toán toàn diện về Code Smells, Tech Debt, và Architecture.
category: architecture
behavior: static-analysis
intent: review-code
priority: medium
tags: [audit, architecture, tech-debt, code-smell]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks for a project review, architecture audit, or health check.
inputs: [Project directory]
outputs: [Health Audit Score, Refactor roadmap]
allowed_tools: [grep_search, run_command, read_file]
pipeline: [analyze, review, validate, complete]
---

# 🛠️ qk-project-health - Standard Operating Procedure

> **Goal:** "Khám sức khỏe" toàn diện cho Codebase. Tìm ra các Nợ Kỹ Thuật (Tech Debt), Mã Lỗi Thời (Code Smells), và các rủi ro cấu trúc dài hạn.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Dependency Scan):**
   - Read `package.json` to identify outdated libraries, bloated dependencies, or unused packages.
2. **Review (Architecture Scan):**
   - Use `list_dir` or tree commands to review the directory structure.
   - Check if the project follows a scalable pattern (e.g., Feature-based vs flat `components` folder).
3. **Validate (Smell Detection):**
   - Scan for "God Components" (Files > 500 lines).
   - Scan for heavy Prop Drilling (>3 levels deep).
4. **Complete (Roadmap):**
   - Generate a prioritized Refactor Roadmap (High, Medium, Low).

## 🛡️ 3. Constraints & Rules

- **Audit Only - No Touch:** Do not modify any code. You are diagnosing, not performing surgery.
- **Evidence Based:** Provide concrete metrics (e.g., "Folder `components` has 45 files, making it hard to navigate").

## 🌳 3. Decision Tree

```text
Is the `src/components` folder bloated (>30 files)?
  ├── YES → Recommend migrating to a Feature-driven structure (e.g., `src/features/auth`).
  └── NO → Pass.

Are there components exceeding 500 lines?
  ├── YES → Flag as "God Object" and recommend splitting.
  └── NO → Pass.
```

## 🤝 4. Handoff Pipeline

1. `complete`: Output the Health Audit Report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Đánh giá tổng quan Sức Khỏe Dự Án (Điểm: X/100).
- **Chi tiết (Changes):** Phân tích Dependencies, Architecture, Code Smells.
- **Xác thực (Verification):** Các bằng chứng thu thập được từ code (dòng nào, file nào phình to).
- **Hành động tiếp (Next Action):** Lên Lộ trình Refactor (Refactor Roadmap) (Cao - Trung - Thấp).
