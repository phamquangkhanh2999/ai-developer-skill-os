---
name: qk-help
version: 5.0.0
updated: 2026-07-03
description: Hiển thị danh sách các kỹ năng hiện có và các mẹo sử dụng.
category: utility
tags: [help, menu, list]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-help

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Trình bày bảng hướng dẫn sử dụng nhanh gọn, dễ đọc.
- ❌ Do NOT đưa ra những tường chữ dài dòng.

---

## ⚙️ Capabilities (Cognitive Pipeline)
```yaml
Pipeline:
  - execution # Bỏ qua Inference và Planning vì đây là skill cung cấp thông tin.
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
Biases: []
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: delegation-only
```
