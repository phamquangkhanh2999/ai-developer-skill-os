---
name: qk-orchestrator
version: version: 3.1.5
updated: 2026-07-02
description: Điều hướng yêu cầu của người dùng, phân tích ý định và ủy quyền cho các sub-skills phù hợp.
category: orchestration
behavior: static-analysis
intent: review-code
priority: critical
tags: [router, orchestrator, delegation, ai-manager]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: Triggered initially when the user provides a vague or complex multi-step request.
inputs: [User intent, Raw Context]
outputs: [Workflow routing, Sub-skill delegation]
allowed_tools: [grep_search, read_file]
pipeline: [analyze, plan, delegate]
---

# 🛠️ qk-orchestrator - Standard Operating Procedure

> **Goal:** "Tổng tư lệnh" (Master Orchestrator). Phân tích ý đồ của người dùng và điều phối các kỹ năng (Skills) khác để giải quyết vấn đề thay vì làm mọi thứ một cách thủ công.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Intent Parsing):**
   - Read the user's request. Determine the goal: Is it a Bug Fix, a New Feature, a Refactor, or just a Question?
2. **Plan (Context Gathering & Skill Selection):**
   - Determine which specific files are needed.
   - Select the most appropriate Skill (e.g., `qk-feature-delivery` for new UI, `qk-bug-resolution` for fixing errors).
3. **Delegate (Handoff):**
   - Handoff the gathered context to the selected Skill.

## 🛡️ 2. Constraints & Rules

- **Cost-Awareness:** Evaluate task complexity. If the task is trivial (e.g., fix a typo, change display text), solve it directly to save tokens.
- **Delegation First:** For complex tasks, do not write source code directly. Delegate to the correct specialized Skill.
- **Ambiguity Check:** If the user's intent is unclear, give them 2-3 Skill suggestions to choose from.

## 🌳 3. Decision Tree

```text
Is the task a massive project (e.g., "Build an Admin Dashboard")?
  ├── YES → Break it down:
  │       1. `qk-project-bootstrap` (Setup)
  │       2. `qk-data-lifecycle` (DB Schema)
  │       3. `qk-api-lifecycle` (Endpoints)
  │       4. `qk-feature-delivery` (UI).
  └── NO → Delegate to the single most appropriate skill.
```

## 🤝 4. Handoff Pipeline

1. `delegate`: Call the target Skill.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Đã phân tích xong yêu cầu của User.
- **Quyết định điều phối (Reasoning):** Giao việc cho Skill nào.
- **Hành động tiếp (Next Action):** Tự động chuyển vai trò sang Skill được chọn.
