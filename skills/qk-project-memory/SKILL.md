---
name: qk-project-memory
version: 3.1.2
updated: 2026-07-02
description: Store and retrieve long-term project context across sessions.
category: utilities
behavior: static-analysis
intent: maintain
priority: low
tags: [memory, context, storage]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to remember a specific configuration, rule, or architectural decision.
inputs: [Context to remember]
outputs: [Memory file updated]
allowed_tools: [write_to_file, read_file]
pipeline: [analyze, implement, complete]
---

# 🛠️ qk-project-memory - Standard Operating Procedure

> **Goal:** "Bộ nhớ dài hạn". Giúp Agent nhớ lại các cấu hình, đường dẫn API hoặc luật lệ riêng của dự án mà không cần User nhắc lại.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Fact Extraction):**
   - Extract the core facts from the conversation (e.g., "The project uses pnpm, not npm").
2. **Implement (Storage):**
   - Append the fact to `.ai-memory.md` or a similar configuration file.

## 🛡️ 2. Constraints & Rules

- **Keep it small:** Do not write entire source files into memory. Only save abstract facts and rules.

## 🤝 3. Handoff Pipeline

1. `complete`: Output confirmation.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Đã ghi nhớ thông tin gì.
