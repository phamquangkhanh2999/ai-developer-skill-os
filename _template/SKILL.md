---
name: qk-template
version: 5.0.0
updated: 2026-07-03
description: Bản mẫu siêu gọn để tạo skill theo chuẩn Agent OS v5.0.
category: template
tags: [template, boilerplate]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ [Tên Kỹ Năng]

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Các xử lý tư duy nội bộ sẽ dựa vào các thông số dưới đây và trả về Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Làm gì.
- ❌ Không được làm gì.

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
  - id: strictness # (Import từ dial-library/strictness.md)
  - id: complexity-budget # (Import từ dial-library/complexity-budget.md)
```

---

## 🛡️ Biases (Sửa lỗi mặc định của AI)
```yaml
Biases:
  - id: cosmetic-refactor # (Import từ bias-library/cosmetic-refactor.md)
  - id: enterprise-crud # (Import từ bias-library/enterprise-crud.md)
```

---

## 🛫 Ship Criteria (Điều kiện xuất xưởng)
```yaml
Rules:
  - id: minimal-diff # (Import từ rule-library/minimal-diff.md)
```
