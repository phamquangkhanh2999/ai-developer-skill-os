---
name: qk-orchestrator
version: 5.0.0
updated: 2026-07-03
description: Điều hướng yêu cầu của người dùng, phân tích ý định và ủy quyền cho các sub-skills phù hợp.
category: core
tags: [orchestrator, routing, dispatch, core]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-orchestrator

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Phân tích yêu cầu và điều phối cho đúng Skill con.
- ❌ Do NOT tự tay viết code hoặc thực hiện thay đổi hệ thống.

---

## ⚙️ Capabilities (Cognitive Pipeline)
```yaml
Pipeline:
  - inference
  - planning
  - delegation # <-- Core capability
  - bias-review
  - ship-check
```

---

## 🎛️ Dials (Hành vi)
```yaml
Dials:
  - id: autonomy # (Tự động quyết định hay chờ lệnh)
  - id: strictness
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: hallucinated-tools # (Tự bịa ra các tool/skill không tồn tại)
  - id: absent-delegation # (Tự nhảy vào code thay vì giao việc)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: delegation-only
```
