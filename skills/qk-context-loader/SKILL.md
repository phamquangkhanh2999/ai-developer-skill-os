---
name: qk-context-loader
version: 3.1.5
updated: 2026-07-02
description: Tải các file liên quan và vẽ biểu đồ phụ thuộc (dependency graph) cho một tác vụ.
category: utilities
behavior: static-analysis
intent: review-code
priority: medium
tags: [context, filesystem, dependencies, graph]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: AI needs to understand the surrounding files before modifying a core component.
inputs: [Target File]
outputs: [Loaded Context, Dependency Graph]
allowed_tools: [grep_search, read_file, list_dir]
pipeline: [analyze, implement, complete]
---

# 🛠️ qk-context-loader - Standard Operating Procedure

> **Goal:** "Người thu thập tình báo". Đảm bảo AI hiểu rõ môi trường xung quanh một file code trước khi tiến hành sửa nó, tránh lỗi thiếu context.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Target Identification):**
   - Identify the main file that needs modification.
2. **Implement (Graph Traversal):**
   - **Load Parents:** Search for files that import the target file.
   - **Load Children:** Read the target file to see what it imports.
   - Gather the essential chunks of these related files.
3. **Complete (Context Mapping):**
   - Build a mental map of how the data flows.

## 🛡️ 2. Constraints & Rules

- **Token Optimization:** Do not load `node_modules` or massive minified build files. Extract only the exact logic needed.

## 🌳 3. Decision Tree

```text
Is the target file a UI Component?
  ├── YES → Load its CSS/Theme tokens and any nested Child components.
  └── NO (API Service) → Load the corresponding Controller and Database Model.
```

## 🤝 4. Handoff Pipeline

1. `complete`: Provide the context map to the Orchestrator or Target Skill.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Đã nạp thành công ngữ cảnh.
- **Chi tiết (Changes):** Các file có liên quan trực tiếp.
