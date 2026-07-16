# 06 — Conversational FAQ

**Fingerprint:** chat-like Q&A, message bubbles, support docs, expandable answers.

## Structure

```
+---------------------------+
|   Search / Ask box        |
+------+--------------------+
|  Q   |                    |
|  [bubble]  A (expand)     |
|       |   ----            |
|  Q    |  A                |
|  [bubble]                 |
+------+--------------------+
|   Contact / escalate      |
+---------------------------+
```

## Rules

- Questions: left-aligned or avatar-led bubbles
- Answers: expandable accordion or inline below question
- Search: filters questions live as user types
- Support escalation: visible link when answer insufficient
- Grouped by topic/category when many questions

## Typography

- Heading: display for section title
- Question: medium weight, 15px
- Answer: body font, 14px, muted

## Spacing

- Bubble padding: `--space-4` (16px)
- Bubble gap: `--space-3` (12px)
- Search margin-bottom: `--space-6` (24px)

## Anti-Patterns

- ❌ Walls of ungrouped questions
- ❌ Answers that don't match the question
- ❌ No search on large FAQ sets

## Theme Affinity

- ✅ Hum, Lumen
- ⚠️ Carnival (keep bubble decoration minimal)
