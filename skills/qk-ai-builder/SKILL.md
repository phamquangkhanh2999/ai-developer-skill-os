---
name: qk-ai-builder
category: core
version: 7.5.1
description: "Thiết kế AI logic, Prompts, RAG pipelines với bảo mật chống Injection — structured output bắt buộc."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, schema]
consumes: [user-description]
skill_version: 7.5.1
runtime_version: 1
schema_version: 2
token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-ai-builder — AI Integration Designer

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] AI task is defined: what input → what output
- [ ] LLM provider is specified (OpenAI, Anthropic, Gemini, local)

---

## Scope
- ✅ Design strict, deterministic system prompts
- ✅ Sanitize user inputs before LLM (Anti-Injection)
- ✅ Validate LLM output before using in business logic
- ✅ Structured output (JSON schema) over raw text

## Non-Goals
- ❌ Open-ended chat prompts without system boundaries
- ❌ Trust LLM output for critical logic without validation
- ❌ Use raw user input directly in prompts

---

## System Prompt Template (Required Structure)

```
[ROLE]
You are a [specific role]. You [specific expertise].

[TASK]
Your task is to [exact task description].

[CONSTRAINTS]
- Always [constraint 1]
- Never [constraint 2]
- If [edge case] → [specific action]

[OUTPUT FORMAT]
Return ONLY valid JSON matching this schema:
{
  "field1": "string",
  "field2": number,
  "confidence": "high|medium|low"
}

[EXAMPLES]
Input: [example]
Output: {"field1": "...", "field2": 0, "confidence": "high"}
```

---

## Anti-Injection Checklist
```
[ ] User input is wrapped in XML tags: <user_input>{input}</user_input>
[ ] System instructions are separate from user content
[ ] Input is validated/sanitized before injection (no raw HTML/JS)
[ ] Max token limit set for user input
[ ] Output is parsed as JSON (not eval'd)
[ ] Confidence field in output triggers human review if "low"
```

---

## RAG Pipeline Pattern
```
User Query
  └─ Sanitize + embed query
       └─ Vector search (top-K = 5)
            └─ Re-rank by relevance
                 └─ Build prompt: [System] + [Retrieved Context] + [User Query]
                      └─ LLM call
                           └─ Validate output schema
                                └─ Return to user
```

---


---

## Priority Order


---

## Workflow


---

## Output Format


---
## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Prompt designed with all required sections, anti-injection applied | All checks passed |
| PARTIAL | Prompt works but missing examples or output validation | Medium confidence result |
| BLOCKED | Task or output format not defined clearly enough | Cannot design without clear spec |
| FAILED | Prompt design has security vulnerability (direct injection risk) | Security gate failure |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Task clearly defined, output format specified, examples provided | Build directly |
| MEDIUM | Task clear but output format ambiguous | Note assumption, add validation layer |
| LOW | Task too vague ("make an AI assistant") | EXIT: BLOCKED — define specific task |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Prompt injection attack possible | User input directly in system prompt |
| HIGH | LLM output used without validation in business logic | JSON parse without schema check |
| MEDIUM | Missing examples leads to inconsistent output | No few-shot examples in prompt |
| LOW | Output format not explicitly stated | Returns text instead of JSON |

---

## Evidence Format
```
[SEVERITY] src/prompts/[name].ts:LINE
Issue:      [specific vulnerability or gap]
Confidence: HIGH
Fix:        [specific change]
```

**Example:**
```
[CRITICAL] src/prompts/chat.ts:34
Issue:      User input `${userMessage}` injected directly in system prompt — injection risk
Confidence: HIGH
Fix:        Wrap in <user_input>{userMessage}</user_input> XML tags
```

---

## Retry Policy
```
LLM output validation fails
  └─ Retry with stronger output format instruction (add explicit JSON schema)
       ├─ PASS on retry → EXIT: SUCCESS, note "required stronger schema enforcement"
       └─ FAIL on retry → EXIT: PARTIAL — add human review gate
            └─ Do NOT auto-retry more than 1 time — risk of infinite loop
```

---

## Escalation Rules
```
BLOCKED: AI task not specific enough to design prompt
Missing:
  - Specific task description (what input → what output)
  - Output format specification (JSON schema or text structure)
Questions:
  1. Input cụ thể là gì? (user text, document, structured data)
  2. Output cần trả về dạng gì? (JSON với field gì / plain text)
Recommended Assumptions (if proceeding):
  - Structured JSON output with confidence field
  - Deny-by-default: reject off-topic requests in system prompt
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["task_description", "input_type", "output_format"],
  "optional_fields": ["examples", "llm_provider", "max_tokens"]
}
```
### Produces
```json
{
  "to": "user or qk-validation-gate",
  "output_fields": ["system_prompt", "output_schema", "anti_injection_checklist", "exit_code"]
}
```

---



