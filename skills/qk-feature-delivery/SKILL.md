---
name: qk-feature-delivery
version: 3.1.5
updated: 2026-07-02
description: Phát triển tính năng mới hoàn chỉnh từ Frontend đến Backend.
category: engineering
behavior: development
intent: implement-feature
priority: high
tags: [feature, development, e2e, ui, api]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to create a new page, component, or endpoint.
inputs: [Feature requirements, Design/Mockup (optional)]
outputs: [Implemented code, Test cases]
allowed_tools: [run_command, read_file, write_to_file, grep_search]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-feature-delivery - Standard Operating Procedure

> **Goal:** Phát triển một tính năng mới hoàn chỉnh, từ giao diện (Frontend) đến API (Backend) và Cơ sở dữ liệu (nếu có).

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Requirements Gathering):**
   - Read the user's requirements.
   - Break down the feature into sub-tasks (e.g., Schema -> API -> UI Component -> Integration).
2. **Plan (Architecture & Design):**
   - Identify if you need to load specific knowledge files (e.g., `knowledge/frontend/react.md`).
   - Define data interfaces (TypeScript Types/Interfaces) first.
3. **Execute (Implementation):**
   - Build the backend/API mock first (if applicable).
   - Build the UI component and bind the data.
4. **Verify (Validation):**
   - **4 UI States:** Implement all 4 UI states: `Loading` (Skeleton/Spinner), `Success` (Data), `Error` (Fallback UI/Retry), and `Empty` (No data).
   - Check if the UI is responsive (works well on Mobile & Desktop).

## 🛡️ 3. Constraints & Rules

- **Contract First:** Always define the Type/Interface contract before writing the implementation logic.
- **State Management:** Lift state to Global (Redux/Zustand/Context) only if 2 or more components outside the same parent/child tree need to share it. Do not abuse Global State.
- **Component Reusability:** Do not create a new Button or Input if a Shared Component already exists in `src/components/shared/`.
- **DRY (Don't Repeat Yourself):** Extract inline styles or duplicate logic into hooks/utilities.

## 🌳 3. Decision Tree

```text
Does the feature require Backend API changes?
  ├── YES → Start with Database Schema/Types -> API Route -> UI Integration.
  └── NO → Is it a purely visual UI component?
             ├── YES → Load UI/Design tokens and implement.
             └── NO (Stateful) → Load `knowledge/frontend/react.md` to design the State Management strategy.
```

## 🤝 4. Handoff Pipeline

After implementing the feature, map to the pipeline:

1. `engineering-standard`: Ensure naming conventions and file size limits are respected.
2. `validate`: Run tests and format the code.
3. `complete`: Output the final report.

## 📝 5. Output Format

Vui lòng báo cáo lại bằng Tiếng Việt với cấu trúc tương tự `templates/bug-report.md` nhưng thay đổi tiêu đề thành:

### 🚀 Báo Cáo Triển Khai Tính Năng (Feature Report)

- **Tóm tắt (Summary):** Tính năng gì đã được làm.
- **Chi tiết (Changes):** Liệt kê các file tạo mới / chỉnh sửa.
- **Kiến trúc (Reasoning):** Giải thích quyết định thiết kế State/API.
- **Xác thực (Verification):** Các bước để user test thử.
- **Rủi ro (Risks):** Có làm chậm hệ thống hay bundle size không.
- **Hành động tiếp (Next Action):** ...
