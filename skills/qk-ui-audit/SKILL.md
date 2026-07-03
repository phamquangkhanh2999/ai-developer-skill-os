---
name: qk-ui-audit
version: 5.0.0
updated: 2026-07-03
description: Kiểm toán giao diện (UI) để đảm bảo tính nhất quán, khả năng truy cập (A11y), độ phản hồi (Responsive) và hiệu suất.
category: validation
tags: [ui, audit, frontend, a11y, responsive]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-ui-audit

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Audit UI/UX, rà soát Design Tokens, A11y, và Responsive.
- ❌ Do NOT tự tiện sửa code trừ khi user ra lệnh.

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
  - id: aesthetic-vibe
  - id: strictness
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: cosmetic-refactor # (Audit format code thay vì audit UX/Tokens)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: delegation-only # (Chỉ đọc và Report)
```
