---
name: frontend-architecture
description: >-
  Phân tích cấu trúc thư mục frontend và quyết định vị trí đặt file chuẩn xác theo kiến trúc hiện tại.
version: 1.0.0
category: frontend
tags: [architecture, folder-structure, conventions, file-placement]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Frontend Architecture

> **Language rule:**
> Use **English** for: code, folder names, architecture terms, technical rules.
> Use **the user's language** for: explanations, questions, and summaries.

---

## Trigger

Activate this skill when:
- About to create new files or components
- User asks "where should I put this file?" or "how should I organize this?"
- Moving or refactoring code across different modules
- Inheriting an unfamiliar frontend project

---

## Scope

- ✅ Discover the existing frontend folder structure
- ✅ Define where new components, hooks, services, and types should be placed
- ✅ Enforce separation of concerns (e.g., UI vs. Business Logic vs. Data)
- ✅ Identify architectural patterns in use (e.g., Feature-based, Layer-based)
- ✅ Validate file placement before execution by other skills

---

## Non-goals

- ❌ Do NOT rewrite the entire project architecture unless explicitly asked
- ❌ Do NOT generate code (delegate to `component-generator` or `ui-builder`)
- ❌ Do NOT enforce personal preferences over established project conventions

---

## Severity Levels

| Level | Meaning |
|-------|---------|
| P0 | Architectural violation that breaks the build or creates circular dependencies |
| P1 | File placed in completely wrong layer (e.g., API logic in UI component) |
| P2 | Inconsistent folder or file naming |
| P3 | Minor deviation from convention |

---

## Workflow

### Phase 1 — Structure Discovery

*(Relies on `context-manager` if already loaded)*

Analyze the root source directory (e.g., `src/`, `app/`):
1. **Layer-based:** `components/`, `hooks/`, `services/`, `utils/`, `types/`
2. **Feature-based:** `features/auth/`, `features/products/`
3. **Framework-specific:** `app/` (Next.js App Router), `pages/` (Next.js Pages Router, Nuxt)
4. **Domain-driven:** `domains/user/`, `domains/payment/`
5. **FSD (Feature Sliced Design):** `app/`, `processes/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`

---

### Phase 2 — Rule Extraction

Based on discovery, define the project's rules for:
- **Components:** Are they flat? Grouped by feature? Atomic design?
- **Hooks:** Shared in `src/hooks/` or collocated with components?
- **State:** Global store vs. feature stores?
- **API/Services:** Where are HTTP calls made?
- **Types:** Centralized `types/` or collocated?
- **Naming Conventions:** PascalCase, camelCase, kebab-case, `index.ts` usage?

---

### Phase 3 — File Placement Decision

When a new feature/component is requested, map it to the structure:

**Input:** "Create a User Profile card that fetches user data."
**Decision:**
- UI Component: `src/features/user/components/UserProfileCard.tsx`
- API Hook: `src/features/user/api/useUser.ts`
- Types: `src/features/user/types/index.ts`

---

### Phase 4 — Enforcement & Validation

Before passing control to a generation skill (like `ui-builder`), ensure the plan adheres to the rules.

- [ ] Does it mix concerns? (e.g., putting an API call directly in a shared UI button)
- [ ] Does it violate import boundaries? (e.g., a shared component importing from a specific feature)
- [ ] Is the naming consistent?

---

## Decision Tree

```
Is the project using a Feature-based structure?
  ├── Yes → Place feature-specific code in `features/<feature-name>/`
  └── No  → Use Layer-based structure (`components/`, `hooks/`, etc.)

Is the code shared across multiple domains/features?
  ├── Yes → Place in `shared/` or global `components/` / `hooks/`
  └── No  → Collocate with the specific domain/feature

Are there existing examples of this type of file?
  ├── Yes → Copy their placement and naming pattern
  └── No  → Propose a standard location and ask user to confirm
```

---

## Output Format

```
🏗️ Frontend Architecture Plan
─────────────────────────────────────────────────
Structure Type: [Feature-based / Layer-based / FSD / etc.]
Naming:         [PascalCase for components, camelCase for functions]

File Placement:
  📄 [path/to/new/file1.tsx] — [Why it goes here]
  📄 [path/to/new/file2.ts]  — [Why it goes here]

⚠️ Constraints enforced:
  • [Constraint 1, e.g., "API calls must be in hooks, not components"]
  • [Constraint 2, e.g., "Shared UI components cannot import from features/"]

🔗 Next Steps:
  Delegating to `[skill-name]` to generate the files.
```

---

## Validation Checklist

- [ ] Structure type identified correctly
- [ ] File placement follows existing conventions
- [ ] Naming matches project standards
- [ ] Separation of concerns maintained
- [ ] Plan ready to be executed by generation skills
