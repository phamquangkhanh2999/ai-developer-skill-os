---
name: qk-design-to-code
version: 5.0.0
updated: 2026-07-03
description: Chuyển đổi thiết kế từ Figma/Images thành các UI component hoàn chỉnh, chuẩn pixel.
category: frontend
tags: [ui, figma, frontend, styling, css]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-design-to-code

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Dịch thiết kế thành mã nguồn pixel-perfect.
- ❌ Do NOT lạm dụng thẻ `<div>` thay cho Semantic HTML.

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
  - id: fake-ui-slop # (Vẽ UI giả mạo không dùng ảnh placeholder thật)
  - id: missing-ui-states # (Bỏ quên :active, :hover)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: end-to-end-validation
```
