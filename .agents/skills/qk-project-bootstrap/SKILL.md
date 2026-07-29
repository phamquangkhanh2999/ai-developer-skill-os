---
# ── Identity ───────────────────────────────────────────────
name: qk-project-bootstrap
version: 8.3.1
status: stable
description: "Khởi tạo dự án mới theo chuẩn V8.2 Blueprint Plugin Generator (project.yaml, 4-folder AI RAG hoặc Coding) với cấu trúc kiên cường."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - project-initialization
  - setup

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "khởi tạo project"
  - "tạo dự án mới"
  - "bootstrap"
  - "setup project"
  - "init repo"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - safety
  - filesystem-boundary

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard

knowledge_scope:
  owns:
    - project-structure
    - initial-setup
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: bootstrap-validation

selection:
  priority: medium
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: low
side_effects: edit_files
produces: [code, schema, plan]
consumes: [user-description]

token_budget:
  max_files_read: 1
  max_lines_per_read: 50
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-project-bootstrap — Project Foundation Builder

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions
- [ ] Framework/language preference is stated (or ask before proceeding)
- [ ] Project purpose is clear (web app, API, CLI, library)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng cho biết: framework (React/Next.js/NestJS/Express...) và mục đích dự án."
```

---

## Scope & V8.2 Blueprint Generator
- ✅ **One-Click Blueprint Selection:** Choose from Blueprint Plugins (`coding`, `rag`, `workflow`, `enterprise`).
- ✅ **Generate `project.yaml`:** Copy appropriate manifest from `.agents/blueprints/<type>/project.yaml.tpl` to workspace root.
- ✅ **Initialize Project Scaffolding:** Create standard directory structure (including the **4-Folder RAG Architecture** for AI projects).
- ✅ **Configure Tooling:** Linter, Prettier, TypeScript strict mode, or Python environment depending on stack.
- ✅ **Generate `DESIGN.md`:** Mandatory brand & token contract for any UI project.

## Non-Goals
- ❌ Skip `project.yaml` workspace manifest initialization
- ❌ Skip DESIGN.md for UI projects
- ❌ Hardcode outdated dependency versions
- ❌ Skip README or documentation

---

## V8.2 Blueprint Plugins & Directory Structures

### 1. RAG & AI Agents (The 4-Folder Architecture Blueprint)
*Activated when building AI agents, RAG engines, or domain automation.*
```text
project.yaml              # ⭐ V8.2 Workspace Manifest (Profiles & Capabilities)
prompts/                  # Prompt instructions managed as code
├── system/
├── tasks/
└── tools/
data/                     # Strict data discipline
├── raw/                  # IMMUTABLE original files (PDFs, Excel, Revit/CAD)
└── processed/            # Cleaned, standardized chunks for AI ingestion
agents/                   # Agent configurations and domain micro-skills
├── skills/
└── tools/
evals/                    # Quantitative validation evidence
├── tests/
├── traces/               # Audit execution traces
└── scorecards/           # scorecard.yaml eval rubrics
```

### 2. Standard Coding Workspaces (Next.js / React / Node)
*Activated when developing software applications or UI components.*
```text
project.yaml              # ⭐ V8.2 Workspace Manifest
src/
├── app/                  # Pages or App Router
├── components/           # Shared UI components & Design system primitives
├── hooks/
├── lib/
├── services/             # API integration & State stores
├── types/
└── styles/
DESIGN.md                 # Brand & Design Contract
```

### 3. Automation Workflows (n8n & Data ETL)
```text
project.yaml              # ⭐ V8.2 Workspace Manifest
workflows/                # Automation graphs & JSON blueprints
connectors/               # API & Database integrations
pipelines/                # Transformation scripts
evals/                    # Traceability logs
```

---

## Required Files Checklist
```
[ ] project.yaml — V8.2 Machine-readable Workspace Manifest
[ ] package.json / pyproject.toml — dependencies and scripts
[ ] tsconfig.json — strict mode enabled (if TypeScript)
[ ] .eslintrc / .prettierrc — project standard linting and formatting
[ ] .gitignore — standard entries
[ ] README.md — project description + setup instructions
[ ] DESIGN.md — (UI projects) brand contract with color/font/spacing tokens
[ ] evals/scorecard.yaml — (AI/RAG/Workflow projects) eval standard
[ ] .agents/rules/anti-patterns.md — Bắt buộc phải có (chuẩn V8.3 R-C-09)
[ ] .agents/rules/security.md — Bắt buộc phải có (chuẩn V8.3 R-SEC-04)
```
-----

## DESIGN.md Minimum Template
```markdown
# Design System

## Colors (HSL)
--color-primary: hsl(220, 80%, 55%);
--color-surface: hsl(220, 15%, 12%);
--color-text: hsl(220, 10%, 90%);

## Spacing Scale (4px base)
--space-1: 4px; --space-2: 8px; --space-3: 16px;
--space-4: 24px; --space-5: 32px; --space-6: 48px;

## Typography
--font-sans: 'Inter', system-ui, sans-serif;
--font-size-base: 1rem;
--font-size-lg: 1.25rem;

## Border Radius
--radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;

## Animation
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
```

---

---

## Workflow

### Phase 1 — Blueprint Selection
**Steps:**
1. Assess Preconditions to determine framework/purpose.
2. Select appropriate blueprint (coding, rag, workflow, enterprise).

**Decision:**
```
IF framework/purpose is clear
  → Confidence: HIGH → go to Phase 2
ELSE
  → EXIT: BLOCKED — ask user
```

### Phase 2 — Scaffold Generation
**Steps:**
1. Generate `project.yaml` manifest.
2. Create directory tree structure based on blueprint.
3. Configure tooling and generate `DESIGN.md` if UI project.

**Decision:**
```
IF directories and files are generated
  → Confidence: HIGH → go to Phase 3
ELSE
  → EXIT: FAILED
```

### Phase 3 — Verification
**Steps:**
1. Check Required Files Checklist against what was actually created.
2. Ensure no mandatory files are missing.

**Decision:**
```
IF all required files exist
  → EXIT: SUCCESS
ELSE
  → EXIT: PARTIAL
```

---

## Evidence Format

```
[SEVERITY] path/to/expected-file
Issue:      [MISSING_MANIFEST | MISSING_DESIGN_MD | WRONG_STRUCTURE]
Confidence: HIGH
Fix:        [specific file to create]
```

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | project.yaml manifest created | Never |
| P2 | Core scaffolding per blueprint type | Never |
| P3 | Tooling config | Budget < 40% |
| P4 | DESIGN.md for UI projects | Never for UI |
| P5 | README | Budget < 60% |

---
## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All required files created, structure matches framework standard | Full bootstrap complete |
| PARTIAL | Structure created but DESIGN.md incomplete (UI project) | Follow-up needed |
| BLOCKED | Framework/purpose not specified | Ask user |
| FAILED | Cannot initialize (permission error, invalid framework) | Report error |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Framework explicitly stated, directory structure clear | Build directly |
| MEDIUM | Framework inferred from context (found React imports) | Note assumption, proceed |
| LOW | Cannot determine framework or project type | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|----------|
| CRITICAL | Security misconfiguration in bootstrap | .env with real secrets committed |
| HIGH | Missing mandatory file blocks all future work | No DESIGN.md for UI project |
| MEDIUM | Incomplete setup reduces developer experience | Missing ESLint config |
| LOW | Cosmetic or optional file missing | Missing .editorconfig |

---

## Retry Policy
```
File creation fails
  └─ Check: permission issue vs path error
       ├─ Path error → correct path and retry
       └─ Permission error → EXIT: FAILED, report exact path
            └─ Do NOT retry more than 1 time per file
```

---

## Escalation Rules
```
BLOCKED: Framework or project type not specified
Missing:
  - Framework name (React, Next.js, NestJS, Express, etc.)
  - Project purpose (web app, API, CLI, library)
Questions:
  1. Framework nào bạn muốn dùng?
  2. Dự án này là web app, API server, hay CLI tool?
Recommended Assumptions (if proceeding):
  - Default: Next.js 14 (App Router) + TypeScript + ESLint
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["framework", "project_purpose"],
  "optional_fields": ["project_name", "existing_dir"]
}
```
### Produces
```json
{
  "to": "qk-feature-delivery or qk-ui-builder",
  "output_fields": ["project_structure", "design_md_path", "tooling_config", "exit_code"]
}
```

---

