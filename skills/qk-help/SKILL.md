---
name: qk-help
version: 3.1.0
updated: 2026-07-02
description: Display the list of available skills and pro-tips.
category: utilities
behavior: static-analysis
intent: review-code
priority: low
tags: [help, manual, list, tutorial]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User types 'help', asks for a list of skills, or doesn't know how to use the agent.
inputs: [Help query]
outputs: [List of skills, Tips]
allowed_tools: [read_file, list_dir]
pipeline: [analyze, complete]
---

# 🛠️ qk-help - Standard Operating Procedure

> **Goal:** Bản đồ hướng dẫn sử dụng Agent Skills. Giúp User tra cứu nhanh lệnh.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Scan):**
   - Read the skills directory to list all available tools.
2. **Complete (Format):**
   - Format the skills into a neat Markdown table.

## 🛡️ 2. Constraints & Rules

- **Keep it short:** Do not print the entire content of `SKILL.md`. Only print the Name and Description from the metadata.

## 🤝 3. Handoff Pipeline

1. `complete`: Output the Help table.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt dạng Bảng (Table).

- **Cột 1:** Tên Skill
- **Cột 2:** Mô tả ngắn (Tiếng Việt)
- **Cột 3:** Lệnh kích hoạt (Ví dụ: `@qk-bug-resolution`)
