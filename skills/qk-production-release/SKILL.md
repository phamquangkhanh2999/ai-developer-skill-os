---
name: qk-production-release
version: 5.0.0
updated: 2026-07-03
description: Chuẩn bị codebase để phát hành lên production (Build, CI/CD, Security).
category: devops
tags: [devops, ci-cd, release, deployment]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-production-release

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Chạy kiểm tra chất lượng cuối cùng trước khi build.
- ❌ Do NOT tự tay deploy lên Production server mà không hỏi ý kiến.

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
  - id: hallucinated-tools # (Tự chạy lệnh deploy không tồn tại)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: end-to-end-validation
```
