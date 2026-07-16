---
name: qk-project-bootstrap
category: fullstack
version: 7.5.0
description: "Khởi tạo dự án mới với cấu trúc chuẩn, linters, DESIGN.md — không bao giờ thiếu foundation."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
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
  stop_early: false
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-project-bootstrap — Project Foundation Builder

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

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

## Scope
- ✅ Initialize project with standard tooling
- ✅ Generate `DESIGN.md` (mandatory for any UI project)
- ✅ Configure: ESLint, Prettier, TypeScript strict mode
- ✅ Create standard directory structure

## Non-Goals
- ❌ Skip DESIGN.md for UI projects
- ❌ Hardcode outdated dependency versions
- ❌ Skip README

---

## Standard Directory Structures

### Next.js / React
```
src/
├── app/              # Pages (App Router) or pages/
├── components/       # Shared UI components
│   ├── ui/           # Design system primitives
│   └── [feature]/    # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, helpers
├── services/         # API service functions
├── types/            # TypeScript type definitions
└── styles/           # Global CSS + DESIGN.md tokens
DESIGN.md             # Brand & Design Contract
```

### NestJS / Express API
```
src/
├── modules/
│   └── [feature]/
│       ├── [feature].controller.ts
│       ├── [feature].service.ts
│       ├── [feature].repository.ts
│       └── dto/
├── common/           # Shared utilities, guards, interceptors
├── config/           # Environment configuration
└── main.ts
```

### Vite + React
```
src/
├── assets/
├── components/
├── pages/
├── router/
├── services/
├── stores/           # State management
└── types/
```

---

## Required Files Checklist
```
[ ] package.json — with lint + test + build scripts
[ ] tsconfig.json — strict: true enabled
[ ] .eslintrc / eslint.config.js — project standard
[ ] .prettierrc — formatting config
[ ] .gitignore — standard entries
[ ] README.md — project description + setup instructions
[ ] DESIGN.md — (UI projects) brand contract with color/font/spacing tokens
[ ] .env.example — all env vars listed (no actual values)
```

---

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


---

## Evidence Format


---

## Priority Order


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



