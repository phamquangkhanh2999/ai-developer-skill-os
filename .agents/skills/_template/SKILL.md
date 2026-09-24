---
# ── Identity ───────────────────────────────────────────────
name: qk-[skill-name]
version: 10.2.0
status: stable
description: "[Một câu — skill này làm gì và dành cho ai]"
platforms: [antigravity, claude, opencode]

# ── Classification ───────────────────────────────────────
type: capability                    # capability | utility | orchestrator
runtime_version: 1

intent:
  - [primary-intent]
  - [secondary-intent]

complexity:
  level: medium                     # low | medium | high | critical
  criteria:
    files_affected: "2-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "[trigger phrase 1]"
  - "[trigger phrase 2]"

selection:
  priority: medium                  # high | medium | low
  confidence_threshold: 0.75
  fallback_skill: null              # Optional fallback skill

# ── References ───────────────────────────────────────────
workflow: [workflow-name]           # → workflows/[workflow-name].yml

rules:
  - global                          # Always include global

tools:
  - filesystem

related_skills:
  - null                            # Skills often used together

knowledge_scope:
  owns: []
  references: []

# ── Verification ─────────────────────────────────────────
verification:
  required: true
  strategy: bug-fix                 # bug-fix | refactor | feature | documentation | review

# ── Runtime ──────────────────────────────────────────────
execution_mode: deterministic
cost: medium                        # low | medium | high
latency: medium                     # fast | medium | slow
risk: medium                        # low | medium | high
side_effects: edit_files            # edit_files | run_commands | read_only | none
produces: [code, report]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

# ── Exit Codes ───────────────────────────────────────────
exit_codes:
  SUCCESS: "Task completed and verified"
  PARTIAL: "Task done with minor gaps"
  BLOCKED: "Missing precondition or info"
  FAILED: "Task failed after max retries"

# ── Compliance ───────────────────────────────────────────
compliance:
  runtime_standard: "11/11"
  frontmatter_complete: true
  references_valid: true
  decision_trees: PASS
  thresholds_defined: true
  schema_version: 10.2.0
  runtime_version: 1
---

# qk-[skill-name] — [Short Title]

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** [Mô tả nguyên tắc cốt lõi của skill này]
> **Verification Principle:** PASS is a verified conclusion, never an assumption.

### 🛡️ Anti-Overengineering Rule
- [Rule specific to this skill type]
- [Anti-pattern to avoid]

---

## 2. Giới Hạn Kỹ Thuật & Cấm Kỵ Tuyệt Đối (Hard Boundaries)

### Tuyệt đối CẤM:
- [Prohibited action 1]
- [Prohibited action 2]

### Chỉ ĐƯỢC phép khi:
- [Condition for allowed action]

---

## 3. Quy Trình Thực Hiện Theo Bước (Sequential Procedure)

### Bước 1: [Tên bước]
- Mục tiêu: [Goal]
- Đầu ra: [Output]

### Bước 2: [Tên bước]
- Mục tiêu: [Goal]
- Đầu ra: [Output]

### ... (thêm bước nếu cần)

---

## 4. Xử Lý Sự Cố Khi Thất Bại (Failure Path)

```
Nếu [điều kiện lỗi]
  └─ [Hành động 1]
       ├─ Thành công → Tiếp tục
       └─ Thất bại → [Hành động 2]
            └─ Cố định → EXIT: FAILED
```

Max retries: 2. Sau đó EXIT: BLOCKED.

---

## 5. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm | Hành vi đặc thù |
|---|---|---|
| `frontend` | [FE focus] | [FE behavior] |
| `backend` | [BE focus] | [BE behavior] |
| `fullstack` | [Fullstack focus] | [Fullstack behavior] |
| `devops` | [DevOps focus] | [DevOps behavior] |
| `qa` | [QA focus] | [QA behavior] |

---

## 6. Bằng Chứng Định Dạng (Evidence Format)

```
[SEVERITY] path/to/file.ts:LINE
Reason:     [Why this matters]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [One-line actionable suggestion]
```

---

## 7. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct evidence available | Proceed confidently |
| MEDIUM | Some assumptions needed | Note assumptions |
| LOW | Insufficient evidence | EXIT: BLOCKED |

---

## 8. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Task completed and verified | All acceptance criteria met |
| PARTIAL | Task done with minor gaps | Some checks skipped |
| BLOCKED | Missing precondition | Ask user for info |
| FAILED | Task failed | Report error |

---

## 9. Chính Sách Retry

Max retries: 2.
After 2nd failure → EXIT: BLOCKED → Ask user for clarification.

---

## 10. Platform-Specific Instructions

### Antigravity (Google Gemini)
- Uses `.agents/AGENTS.md` as entry point
- Supports Cockpit integration
- Rewrite absolute paths for global mode
- GEMINI.md copied for global installs

### Claude Code (Anthropic)
- Reads `.claude/CLAUDE.md` automatically
- Large context window (~200K tokens)
- Can handle full skill files without trimming
- Uses native tool format (Read, Write, Edit, Bash)

### OpenCode (Open Source)
- Reads `.opencode/config.yaml`
- Context window ~128K tokens
- Keep skill files lean when possible
- Supports custom tool format

---

## 11. Compliance

| Check | Status |
|-------|--------|
| Runtime Standard | 11/11 |
| Frontmatter Complete | ✅ |
| References Valid | ✅ |
| Decision Trees | PASS |
| Thresholds Defined | PASS |
| schema_version | 10.2.0 |
| runtime_version | 1 |
| platforms | [antigravity, claude, opencode] |

---

## 📝 Notes for Skill Author

1. Replace all `[bracketed placeholders]` with actual values
2. Add more steps in Section 3 if the procedure is complex
3. Add role-specific behavior in Section 5 for each role this skill supports
4. Ensure Section 7 Confidence Model matches the skill's verification depth
5. Add platform-specific instructions in Section 10 if this skill has IDE-specific behavior
