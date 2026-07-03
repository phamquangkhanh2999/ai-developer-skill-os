---
name: qk-access-policy
version: 5.0.0
updated: 2026-07-03
description: Quản lý RBAC, ABAC và các ranh giới bảo mật.
category: security
tags: [security, rbac, abac, auth]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-access-policy

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Thiết kế và triển khai phân quyền hệ thống.
- ❌ Do NOT bỏ qua các lỗ hổng bảo mật hiển nhiên (như lộ mật khẩu, thiếu mã hóa).

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
  - id: granularity # (Coarse vs Fine-grained)
  - id: strictness
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: ui-only-security # (Chỉ ẩn nút ở frontend mà quên chặn API backend)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: end-to-end-validation
```
