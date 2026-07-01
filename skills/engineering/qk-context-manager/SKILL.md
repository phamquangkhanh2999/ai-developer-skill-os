---
name: qk-context-manager
description: >-
  Xác định các file cần thiết, tóm tắt kiến trúc và quản lý bộ nhớ ngữ cảnh để tránh tràn bộ nhớ.
version: 1.0.0
category: engineering
tags: [context, architecture, memory, file-selection, summarization]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Context Manager

> **Language rule:**
> Use **English** for: file paths, architecture terms, module names, technical labels.
> Use **the user's language** for: explanations, summaries, and questions.

---

## Trigger

Activate this skill when:
- Starting work on an unfamiliar or large codebase
- About to read many files and need to prioritize
- Context window is at risk of overflowing
- User asks "where is X", "what does Y do", "how is this project structured"
- Another skill (e.g. `project-audit`, `frontend-architecture`) needs project context first

---

## Scope

- ✅ Identify which files are relevant to the current task
- ✅ Summarize project architecture in structured format
- ✅ Map folder structure to responsibilities
- ✅ Track what has been read and what still needs reading
- ✅ Flag context window risks
- ✅ Maintain a working memory summary for multi-turn sessions

---

## Non-goals

- ❌ Do NOT modify any files
- ❌ Do NOT fix bugs
- ❌ Do NOT make architectural decisions
- ❌ Do NOT read every file blindly — be selective and efficient

---

## Workflow

### Phase 1 — Project Discovery

Read only top-level signals first:
1. `package.json` / `pyproject.toml` / `Cargo.toml` → detect framework, language, scripts
2. Root config files → `.env.example`, `tsconfig.json`, `vite.config.ts`, `next.config.js`
3. Folder structure (1-2 levels deep) → identify key directories
4. Entry points → `src/index.ts`, `app/`, `pages/`, `main.py`

Produce: **Project Profile** (framework, language, key directories, architecture style)

---

### Phase 2 — Task-Scoped File Selection

Given the current task, identify the minimum relevant set of files:

```
Task type → Files to read
─────────────────────────────────────────────────────
UI work         → components/, pages/, styles/, design system files
API work        → services/, hooks/, api/, types/
State work      → store/, context/, hooks/
Bug fix         → files mentioned in error, related modules
Architecture    → folder structure, key abstractions
```

Rules:
- Read **entry points** before diving into details
- Prefer **index files** as anchors
- Skip `node_modules`, `dist`, `build`, `.git`
- If uncertain which file → check imports, not the file itself

---

### Phase 3 — Architecture Summary

Produce a concise summary:

```
Project:    [Name / repo]
Framework:  [React 18 / Next.js 14 / Vue 3 / etc.]
Language:   [TypeScript / JavaScript / Python]
Structure:  [Feature-based / Layer-based / Domain-based]

Key directories:
  src/components/  → Shared UI components
  src/features/    → Feature modules (collocated)
  src/services/    → API and data services
  src/hooks/       → Custom React hooks
  src/types/       → TypeScript interfaces

State:       [Zustand / Redux / React Query / Pinia]
HTTP client: [axios instance at src/lib/axios.ts]
Auth:        [JWT stored in httpOnly cookie]
```

---

### Phase 4 — Working Memory Maintenance

During multi-turn sessions:
- Track which files have been read (avoid re-reading)
- Track decisions made (e.g. "we decided to use feature-based structure")
- Flag when context is approaching limits
- Offer to summarize and compress if needed

---

## Decision Tree

```
Is this a new project / first time seeing this codebase?
  ├── Yes → Run full Phase 1 + Phase 2 + Phase 3
  └── No  → Has something changed since last context load?
              ├── Yes → Re-run Phase 2 for affected area
              └── No  → Use cached architecture summary
```

```
Is context window at risk?
  ├── Yes → Summarize what's been read, drop low-relevance files
  └── No  → Continue loading relevant files
```

---

## Output Format

```
🗂️  Project Context Loaded

Framework:  [framework]
Language:   [language]
Structure:  [style]

Relevant files for this task:
  📄 [path/to/file.ts]     — [why it's relevant]
  📄 [path/to/file.ts]     — [why it's relevant]

Architecture summary:
  [2-4 lines describing how this codebase is organized]

⚠️  Context notes:
  [Any risks, unknowns, or files that couldn't be read]

✅ Ready. Proceeding with: [next skill or action]
```

---

## Validation Checklist

- [ ] Framework and language correctly identified
- [ ] Only task-relevant files selected (no noise)
- [ ] Architecture summary is accurate and concise
- [ ] Context window usage is reasonable
- [ ] Working memory updated for this session

---

## Examples

See `examples/` folder.
