---
name: qk-docs
version: 5.0.0
updated: 2026-07-03
description: Viết và duy trì tài liệu dự án để con người có thể dễ dàng đọc hiểu.
category: documentation
tags: [documentation, readme, comments]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-docs

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Dịch logic phức tạp thành giải thích tiếng Việt trong sáng cho con người.
- ❌ Do NOT dịch nguyên xi các thuật ngữ chuyên ngành (Props, Hook, Cache).

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
  - id: hallucinated-tools # (Tự bịa ra các step hướng dẫn không tồn tại)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: minimal-diff
```
