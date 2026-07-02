---
name: qk-documentation-system
version: 3.0.0
updated: 2026-07-02
description: Maintain system-level architecture docs and DevOps runbooks.
category: documentation
priority: low
tags: [architecture, diagrams, mermaid, runbooks]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to generate architecture diagrams or DevOps manuals.
inputs: [Architecture changes]
outputs: [System Docs, Mermaid Diagrams]
allowed_tools: [write_to_file, read_file]
pipeline: [analyze, design, implement, complete]
---

# 🛠️ qk-documentation-system - Standard Operating Procedure

> **Goal:** Quản lý tài liệu cấp hệ thống (System Architecture, Sequence Diagrams, Runbooks).

## 🔄 1. Chain of Thought (SOP)
1. **Analyze (System Flow):**
   - Understand the flow of data across microservices or complex components.
2. **Design (Diagramming):**
   - Draft the sequence or architecture diagram using Mermaid syntax.
3. **Implement (Drafting):**
   - Save the documentation into the `/docs/` folder.

## 🛡️ 2. Constraints & Rules
- **Syntax Check:** Ensure Mermaid diagrams are syntactically valid before saving.

## 🤝 3. Handoff Pipeline
1. `complete`: Output the System Documentation Report.

## 📝 4. Output Format
Vui lòng trả kết quả bằng Tiếng Việt.
- **Tóm tắt (Summary):** Tài liệu kiến trúc nào đã được tạo.
- **Chi tiết (Changes):** Đường dẫn file.
