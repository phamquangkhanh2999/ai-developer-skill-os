# Skill Schema V7.5 — Runtime Standard Specification

> **Mục đích:** Đây là "lint rules" chính thức cho mọi skill trong bộ V7.5.
> Bất kỳ skill nào không pass spec này đều **phải được fix trước khi publish**.

---

## Frontmatter Required Fields

```yaml
# REQUIRED — tất cả fields sau đây bắt buộc phải có
name: string               # qk-[skill-name]
category: enum             # core|frontend|backend|fullstack|security|qa|maintenance|devops|utilities
version: semver            # 7.5.x
description: string        # one sentence, ends without period
platforms: array           # [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: string     # deterministic | exploratory
skill_version: semver      # same as version
runtime_version: integer   # 1 (current runtime contract version)
schema_version: integer    # 2 (current schema version)
cost: enum                 # low | medium | high
latency: enum              # fast | medium | slow
risk: enum                 # low | medium | high
side_effects: enum         # edit_files | run_commands | read_only | none
produces: array            # [code, report, schema, plan, tokens]
consumes: array            # [context-graph, design-md, stack-trace, json-payload, none]
token_budget:
  max_files_read: integer  # 1–10
  max_lines_per_read: integer  # 50–200
  max_shell_commands: integer  # 0–5
  stop_early: boolean
exit_codes: array          # must include: [SUCCESS, BLOCKED, FAILED, PARTIAL]
```

**Lint Rule:** Bất kỳ field nào thiếu → FAIL frontmatter check.

---

## 11 Required Body Sections

Dưới đây là 11 sections bắt buộc trong body mỗi SKILL.md, theo thứ tự.
**Special skills** (redirect, help) được miễn một số section — xem `special_skill_exemptions` cuối file.

### Section 1: Language Rule Header
```
> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese (match user language).
```
**Lint Rule:** Phải có ngay sau heading `# qk-[name]`.

---

### Section 2: Preconditions
```markdown
## Preconditions
- [ ] [Condition 1]
- [ ] [Condition N]

\`\`\`
On missing precondition:
  EXIT: BLOCKED
  Message: "[specific message]"
\`\`\`
```
**Lint Rules:**
- Phải có ít nhất 1 precondition
- Phải có code block với `EXIT: BLOCKED` và `Message:`
- Không được chỉ có "Repository accessible" — phải specific

---

### Section 3: Scope + Non-Goals
```markdown
## Scope
- ✅ [What it DOES]

## Non-Goals
- ❌ [Anti-pattern — with reason]
```
**Lint Rules:**
- Scope: ≥ 2 items
- Non-Goals: ≥ 3 items
- At least one Non-Goal must be about tool usage (never create scripts / never read entire files)

---

### Section 4: Priority Order
```markdown
## Priority Order
| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1       | ...  | Never          |
```
**Lint Rules:**
- Minimum 3 priorities
- P1 must have "Never" skip threshold
- At least one Px must have a percentage threshold (e.g., "Budget < 50%")

---

### Section 5: Workflow with Decision Trees
```markdown
## Workflow

### Phase N — [Name]
**Steps:**
1. [step]

**Decision:**
\`\`\`
IF [condition] → [action]
ELSE → [action]
\`\`\`

**Exit When:**
- [condition] → go to Phase N+1 | EXIT: [code]
```
**Lint Rules:**
- Minimum 2 phases
- Each phase MUST have at least one `Decision:` block
- Each phase MUST have `Exit When:` conditions
- No phase can have only "steps" without decisions

---

### Section 6: Confidence Model
```markdown
## Confidence Model
| Level  | Condition | Action |
|--------|-----------|--------|
| HIGH   | ...       | ...    |
| MEDIUM | ...       | ...    |
| LOW    | ...       | EXIT: BLOCKED |
```
**Lint Rules:**
- Must have all 3 levels: HIGH, MEDIUM, LOW
- LOW must always lead to either BLOCKED or user confirmation

---

### Section 7: Severity
```markdown
## Severity
| Level    | Definition | Example |
|----------|-----------|---------|
| CRITICAL | ...       | ...     |
| HIGH     | ...       | ...     |
| MEDIUM   | ...       | ...     |
| LOW      | ...       | ...     |
```
**Lint Rules:**
- Must have all 4 levels: CRITICAL, HIGH, MEDIUM, LOW
- Each level must have a concrete Example column

---

### Section 8: Evidence Format
```markdown
## Evidence Format
\`\`\`
[SEVERITY] path/to/file.ts:LINE
[Field]:    [value]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [suggestion]
\`\`\`
```
**Lint Rules:**
- Must include `[SEVERITY]` tag with file:LINE format
- Must include `Confidence:` field
- Must include `Fix:` field
- Must include a filled example below the template

---

### Section 9: Retry Policy
```markdown
## Retry Policy
\`\`\`
[trigger]
  └─ [action]
       ├─ [outcome A]
       └─ [outcome B] → [escalation]
            └─ Do NOT retry more than N times
\`\`\`
```
**Lint Rules:**
- Must have explicit max retry count (≤ 3)
- Must specify what happens after max retries (ESCALATE or FAILED)
- Read-only skills may have simplified retry: "Audit is read-only — no retry needed."

---

### Section 10: Escalation Rules
```markdown
## Escalation Rules
\`\`\`
BLOCKED: [specific reason]
Missing:
  - [artifact or info needed]
Questions:
  1. [specific question]
Recommended Assumptions (if proceeding):
  - [assumption]
\`\`\`
```
**Lint Rules:**
- Must have structured format: BLOCKED, Missing, Questions, Recommended Assumptions
- Cannot be just "ask user" or "STOP"
- Must have at least 1 specific question

---

### Section 11: Handoff Contract
```markdown
## Handoff Contract
### Consumes
\`\`\`json
{ "from": "...", "required_fields": [...], "optional_fields": [...] }
\`\`\`
### Produces
\`\`\`json
{ "to": "...", "output_fields": [...] }
\`\`\`
```
**Lint Rules:**
- Both Consumes and Produces must be present
- `required_fields` must be a non-empty array
- `to` in Produces must reference a real skill name or "user"

---

### Section 12: Exit Codes Table
```markdown
## Exit Codes
| Code    | Meaning | When |
|---------|---------|------|
| SUCCESS | ...     | ...  |
| PARTIAL | ...     | ...  |
| BLOCKED | ...     | ...  |
| FAILED  | ...     | ...  |
```
**Lint Rules:**
- Must have all 4 codes: SUCCESS, PARTIAL, BLOCKED, FAILED
- Each must have "When" column with specific trigger condition

---

### Section 13: Compliance Block (NEW — End of File)
```markdown
## Compliance
| Check                | Status |
|----------------------|--------|
| Runtime Standard     | 11/11  |
| Frontmatter Complete | ✅     |
| References Valid     | ✅     |
| Decision Trees       | PASS   |
| Thresholds Defined   | PASS   |
| schema_version       | 2      |
| runtime_version      | 1      |
```
**Lint Rules:**
- Must be the LAST section in every skill
- Must be auto-generated or manually updated on each change
- "References Valid" = all `references/*.md` files actually exist

---

## Reference Files Rule

If a SKILL.md mentions `references/[file].md`, that file MUST exist.

```
LINT ERROR: qk-ui-audit references "references/anti-slop-checklist.md" — FILE NOT FOUND
```

---

## Special Skill Exemptions

Some skills have reduced requirements:

| Skill Type | Exempted Sections |
|-----------|-------------------|
| Redirect skill (`qk-policy-engine`) | Sections 2-12 optional — must have redirect target |
| Help/Discovery skill (`qk-help`) | Sections 5-11 optional — must have skill list |

---

## Lint Scoring

```
Total sections: 13 (including Compliance block)
Frontmatter: Pass/Fail (binary)

Score = (sections_present / 13) × 100

Grade:
  100%  → COMPLIANT ✅
  90%+  → MINOR ISSUES ⚠️
  70%+  → NEEDS WORK ❌
  <70%  → NON-COMPLIANT 🔴
```

---

## Version History

| schema_version | runtime_version | Changes |
|---------------|-----------------|---------|
| 1             | 1               | Initial V7.0 (YAML constraints only) |
| 2             | 1               | V7.5 Runtime Standard (11 sections + metadata) |
