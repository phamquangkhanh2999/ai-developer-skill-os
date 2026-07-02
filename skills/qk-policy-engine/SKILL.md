---
name: qk-policy-engine
version: 3.1.5
updated: 2026-07-02
description: Hệ thống đánh giá chính sách để đảm bảo các hành động an toàn và được ủy quyền.
category: security
behavior: static-analysis
intent: review-code
priority: high
tags: [security, policy, guardrails, authorization]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to perform a high-risk destructive action (e.g., DROP table, mass delete).
inputs: [Requested Action, Context]
outputs: [Approval/Denial, Policy violations]
allowed_tools: [read_file]
pipeline: [analyze, evaluate, complete]
---

# 🛠️ qk-policy-engine - Standard Operating Procedure

> **Goal:** Đóng vai trò là "Bộ quy tắc thép" (Policy Enforcer). Ngăn chặn các lệnh sai lầm có thể phá hoại hệ thống.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Risk Assessment):**
   - Classify the user's request (Low, Medium, High risk).
   - High Risk: Dropping databases, deleting multiple files, force-pushing to `main`.
2. **Evaluate (Policy Check):**
   - Load security policies (from `.agents/AGENTS.md` or `.cursorrules`).
   - Check if the action violates any safety constraints.
3. **Complete (Decision):**
   - Approve (Allow execution) or Deny (Block execution) with explicit reasons.

## 🛡️ 2. Constraints & Rules

- **Deny by Default:** If an action is highly destructive and no backup plan exists, DENY it.
- **Override:** Only allow skipping the policy if the user explicitly passes an `--override` flag in their prompt.

## 🌳 3. Decision Tree

```text
Does the action involve deleting data or resources in Production?
  ├── YES → Has the user provided a backup confirmation?
  │       ├── YES → Approve.
  │       └── NO → DENY and request backup confirmation.
  └── NO → Approve.
```

## 🤝 4. Handoff Pipeline

1. `complete`: Generate the Policy Decision Report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Mức độ rủi ro (Risk Level).
- **Phán quyết (Decision):** ✅ APPROVED hoặc ❌ DENIED.
- **Nguyên nhân (Reasoning):** Vi phạm chính sách nào (nếu bị Deny).
- **Hành động tiếp (Next Action):** ...
