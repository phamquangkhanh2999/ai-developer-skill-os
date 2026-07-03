---
name: qk-bug-resolution
version: 5.0.0
updated: 2026-07-03
description: Xử lý và sửa các lỗi (bugs), đồng thời ngăn ngừa lỗi hồi quy.
category: maintenance
tags: [bugfix, debugging, troubleshooting]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-bug-resolution

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Tìm ra nguyên nhân gốc rễ (root cause) và sửa lỗi.
- ❌ Do NOT viết lại (rewrite) toàn bộ file thay vì sửa đúng dòng gây lỗi (The Rewrite Trap).

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
  - id: swallow-errors
  - id: cosmetic-refactor # (Tuyệt đối cấm refactor khi đang fix bug)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: minimal-diff # (Chỉ sửa dòng cần sửa)
```
