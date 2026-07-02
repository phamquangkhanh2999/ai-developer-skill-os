---
name: qk-[skill-name]
version: 1.0.0
updated: YYYY-MM-DD
description: Brief, action-oriented description of what this skill does.
category: engineering # general category
behavior: static-analysis # static-analysis | development | validation | maintenance
intent: review-code # review-code | fix-bug | implement-feature | validate | maintain
priority: medium # low | medium | high | critical
tags: [tag1, tag2]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: Natural language trigger phrase.
inputs: [List of required inputs]
outputs: [Expected output format]
allowed_tools: [read_file, write_to_file]
pipeline: [analyze, plan, implement, validate, complete]
---

# 🛠️ qk-[skill-name] - Standard Operating Procedure

> **Goal:** [State the primary objective of this skill clearly]

## 🔄 1. Chain of Thought (SOP)
1. **Analyze:**
   - Step 1...
2. **Plan:**
   - Step 2...
3. **Implement:**
   - Step 3...
4. **Verify:**
   - Step 4...

## 🛡️ 2. Constraints & Rules
- **Rule 1:** [Hard constraint 1]
- **Rule 2:** [Hard constraint 2]

## 🤝 3. Handoff Pipeline (Optional)
- Pass to `qk-validation-gate` upon completion if necessary.
