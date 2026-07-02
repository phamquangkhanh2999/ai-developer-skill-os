---
name: qk-project-bootstrap
version: 3.1.2
updated: 2026-07-02
description: Initialize a new project with best practices, linters, and folder structures.
category: setup
behavior: development
intent: implement-feature
priority: high
tags: [bootstrap, scaffolding, setup, init]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to start a new project, create a new repo, or setup standard configurations.
inputs: [Stack selection, Project Name]
outputs: [Scaffolded Codebase, Configs]
allowed_tools: [run_command, write_to_file]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-project-bootstrap - Standard Operating Procedure

> **Goal:** "Thợ xây móng". Khởi tạo một dự án mới hoàn toàn với các cấu hình chuẩn mực nhất từ Day 1.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Requirements):**
   - Ask the user for their preferred stack (e.g., Next.js, Vite, NestJS).
2. **Implement (Scaffolding):**
   - Run the initialization command (e.g., `npx create-next-app@latest`).
   - Overwrite `.eslintrc`, `prettierrc`, `tsconfig.json` with strict rules.
   - Scaffold the architecture (e.g., create `src/features/`, `src/components/shared/`).
3. **Verify (Validation):**
   - Run `npm run dev` in a short background task to ensure it doesn't crash.

## 🛡️ 2. Constraints & Rules

- **Strict Mode:** Always enable `strict: true` in TypeScript configurations.
- **Package Manager Check:** If the user uses `pnpm`, do NOT run `npm install`. Stick to one package manager.

## 🤝 3. Handoff Pipeline

1. `engineering-standard`: Verify the generated folder structure.
2. `complete`: Output the Bootstrap Report.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Dự án đã được khởi tạo với Stack nào.
- **Chi tiết (Changes):** Cấu trúc thư mục mới và các file cấu hình.
- **Xác thực (Verification):** Cách chạy dự án.
