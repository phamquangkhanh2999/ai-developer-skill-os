---
name: qk-api-lifecycle
version: 5.0.0
updated: 2026-07-03
description: Thiết kế, triển khai, và tích hợp các API endpoints.
category: backend
tags: [api, rest, graphql, integration]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-api-lifecycle

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Thiết kế RESTful hoặc GraphQL API chuẩn mực.
- ❌ Do NOT trả về mã `200 OK` cho các response bị lỗi `error: true`.

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
  - id: rest-strictness
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: swallow-errors
  - id: enterprise-crud # (Dùng gRPC/Kafka cho API quá nhỏ)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: minimal-diff
```
