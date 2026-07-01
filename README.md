# AI Developer Skill OS

**A multi-agent skill package for AI coding assistants.**
Bộ skill package đa nền tảng cho AI coding assistant.

> Compatible with: **Claude Code · Kilo Code · Antigravity/Gemini IDE · Cursor · Windsurf**

---

## What is this? / Đây là gì?

**EN:** A structured collection of skills that transform AI coding agents into specialized engineering roles. Each skill defines a precise workflow, scope, rules, and output format — so AI consistently behaves like a senior engineer, not a random code generator.

**VI:** Bộ skill có cấu trúc biến AI coding agent thành các vai trò kỹ sư chuyên biệt. Mỗi skill định nghĩa workflow, phạm vi, quy tắc và định dạng output rõ ràng — để AI hoạt động nhất quán như senior engineer, không phải code generator tùy tiện.

---

## Skill Map / Sơ đồ Skill

```
agent-orchestrator  →  Plan only. Routes work to correct skills.
context-manager     →  Understands project structure. Manages what to read.
project-audit       →  Diagnoses codebase before any changes.
         ↓
frontend-architecture  →  Decides file placement and folder conventions.
design-system          →  Enforces component library usage.
         ↓
ui-builder · component-generator · form-builder · table-crud-generator
         ↓
api-integration    →  FE ↔ BE contract layer.
state-management   →  Chooses correct state strategy.
         ↓
bug-fix · frontend-debug · refactor · migration
         ↓
frontend-testing · accessibility-audit · frontend-performance
         ↓
git-engineer       →  Commit, PR, changelog, release.
```

---

## Skills / Danh sách Skill

### Engineering (8 skills)
| Skill | Purpose |
|-------|---------|
| `agent-orchestrator` | Plans tasks, routes to correct skills — never writes code |
| `context-manager` | Selects relevant files, summarizes architecture |
| `project-audit` | Full codebase health check (Quick / Standard / Full mode) |
| `bug-fix` | Diagnose and fix specific bugs with evidence |
| `refactor` | Safe restructuring without breaking behavior |
| `api-integration` | Build production-ready API integration layers |
| `migration` | Dependency upgrades and framework migrations |
| `git-engineer` | Commit messages, PR descriptions, changelogs |

### Frontend (11 skills)
| Skill | Purpose |
|-------|---------|
| `frontend-architecture` | Folder structure, file placement conventions |
| `design-system` | Enforce component library — no raw HTML elements |
| `ui-builder` | Build UI screens from requirements |
| `component-generator` | Generate typed, reusable components |
| `state-management` | Choose and implement correct state layer |
| `form-builder` | Forms with schema validation and error handling |
| `table-crud-generator` | Admin tables with pagination, filter, sort, CRUD |
| `frontend-debug` | React errors, hydration, state, CSS issues |
| `frontend-testing` | Unit, component, and e2e tests |
| `frontend-performance` | Bundle, render, lazy load optimization |
| `accessibility-audit` | ARIA, contrast, keyboard, mobile accessibility |

### Backend (4 skills)
| Skill | Purpose |
|-------|---------|
| `backend-architecture` | Service / controller / repository pattern |
| `database-engineer` | Schema design, migrations, indexing |
| `auth-security` | JWT, OAuth, RBAC implementation |
| `deployment` | CI/CD, Docker, environment configuration |

---

## Installation / Cài đặt

### Antigravity / Gemini IDE

Place this folder in your `.agents/skills/` directory:

```
your-project/
└── .agents/
    └── skills/        ← copy the `skills/` folder here
        ├── engineering/
        ├── frontend/
        └── backend/
```

Or register globally in `C:\Users\<you>\.gemini\config\skills\`.

### Claude Code / Kilo Code / Cursor

Reference skills from your project rules file (`.cursorrules`, `CLAUDE.md`, etc.):

```md
Use skills from: ./rules-skill/skills/
When the user requests [task], load the appropriate SKILL.md and follow it precisely.
```

---

## Language / Ngôn ngữ

| Layer | Language |
|-------|----------|
| SKILL.md content | 🇬🇧 English |
| Code, identifiers | 🇬🇧 English always |
| AI responses | Matches user's language automatically |
| README, docs | 🇬🇧 English + 🇻🇳 Vietnamese |

---

## Contributing / Đóng góp

1. Copy `_template/SKILL.md`
2. Fill in all sections (Trigger, Scope, Non-goals, Workflow, Decision Tree, Output Format, Validation, Examples)
3. Add to `skills.json` with `trigger[]` and `dependencies[]`
4. Add to correct category folder under `skills/`

---

## Version / Phiên bản

**v1.0.0** — Initial release.
Engineering foundation + Frontend core complete.

---

*Built for the AI engineering community.*
*Được xây dựng cho cộng đồng AI engineering.*
