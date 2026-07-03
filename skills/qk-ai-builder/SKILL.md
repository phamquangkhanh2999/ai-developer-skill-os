---
name: qk-ai-builder
version: 5.0.0
updated: 2026-07-03
description: Thiết kế AI Logic, Prompts, RAG pipelines, và các Agents.
category: ai
tags: [ai, llm, prompt-engineering, rag, agents]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-ai-builder

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Xây dựng luồng AI/LLM, viết Prompts chuyên nghiệp.
- ❌ Do NOT dùng LLM để thay thế các logic cứng có thể giải quyết bằng Code (như tính toán).

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
  - id: complexity-budget
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: swallow-errors # (Bỏ qua lỗi API gọi LLM thất bại)
  - id: hallucinated-tools # (Tự bịa model không tồn tại)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: end-to-end-validation
```
