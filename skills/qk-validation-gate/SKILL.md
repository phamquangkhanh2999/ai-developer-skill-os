---
name: qk-validation-gate
version: 5.0.0
updated: 2026-07-03
description: Cổng kiểm tra chất lượng bắt buộc (Test, Lint, Security).
category: validation
tags: [ci, testing, linting, security, gatekeeper]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-validation-gate

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Chạy các lệnh kiểm định (Test, Lint) thực tế.
- ❌ Do NOT giả vờ là test đã pass mà không gọi tool CLI.

---

## ⚙️ Capabilities (Cognitive Pipeline)
```yaml
Pipeline:
  - inference
  - execution
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
  - id: hallucinated-tools
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: end-to-end-validation
```
