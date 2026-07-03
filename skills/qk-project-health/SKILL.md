---
name: qk-project-health
version: 5.0.0
updated: 2026-07-03
description: Kiểm toán toàn diện về Code Smells, Tech Debt, và Architecture.
category: architecture
tags: [audit, architecture, tech-debt, code-smell]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-project-health

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Phân tích tech debt và code smells.
- ❌ Do NOT bắt lỗi thụt lề, khoảng trắng (Việc của linter).

---

## ⚙️ Capabilities (Cognitive Pipeline)
```yaml
Pipeline:
  - inference
  - planning
  - execution
  - bias-review
  - ship-check
```

---

## 🎛️ Dials (Hành vi)
```yaml
Dials:
  - id: strictness
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: cosmetic-refactor
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: delegation-only # (Chỉ đọc và tư vấn, cấm tự ý đổi code)
```
