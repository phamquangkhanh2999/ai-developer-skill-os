---
name: qk-ai-builder
version: 3.1.4
updated: 2026-07-02
description: Design AI Logic, Prompts, RAG pipelines, and Agents.
category: ai
behavior: development
intent: implement-feature
priority: medium
tags: [ai, llm, prompt-engineering, rag, agents]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to build a chatbot, add AI features, or write prompts.
inputs: [AI Requirements]
outputs: [AI Logic, Prompts, RAG setup]
allowed_tools: [run_command, write_to_file]
pipeline: [analyze, design, implement, validate, complete]
---

# 🛠️ qk-ai-builder - Standard Operating Procedure

> **Goal:** "AI Engineer". Xây dựng các tính năng thông minh bằng LLM (Chatbot, RAG pipeline, Agent workflows).

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Task Breakdown):**
   - Determine the AI use case (Classification, Generation, Chat, Search).
2. **Design (Prompt Engineering):**
   - Write clear System Prompts. Treat prompts like code (use variables, constraints).
3. **Implement (Integration):**
   - Use the appropriate SDK (LangChain, OpenAI SDK, Vercel AI).
4. **Validate (Safety Check):**
   - Ensure API keys are not hardcoded.

## 🛡️ 2. Constraints & Rules

- **JSON Parsing:** Always enforce JSON outputs if the AI response is consumed by the app, and handle parse errors.

## 🤝 3. Handoff Pipeline

1. `validate`: Send to validation gate.
2. `complete`: Output the AI Integration Report.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Luồng AI đã thiết lập.
- **Chi tiết (Changes):** Prompt và logic gọi API.
