---
name: qk-policy-engine
version: 5.0.0
updated: 2026-07-03
description: Hệ thống đánh giá chính sách để đảm bảo các hành động an toàn và được ủy quyền.
category: security
tags: [security, policy, safety, guardrails]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-policy-engine

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Đóng vai trò Guardrails, ngăn chặn các hành vi phá hoại trước khi chúng diễn ra.
- ❌ Do NOT đồng ý thực thi lệnh nguy hiểm (drop table, rm -rf) trừ khi có sự xác nhận mạnh mẽ.

---

## ⚙️ Capabilities (Cognitive Pipeline)
```yaml
Pipeline:
  - inference
  - planning
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
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: delegation-only
```
