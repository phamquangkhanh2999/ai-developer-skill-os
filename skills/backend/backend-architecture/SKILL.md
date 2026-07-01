---
name: backend-architecture
description: >-
  Kiểm soát cấu trúc backend, ép buộc tuân thủ mô hình Layer (Controller/Service/Repository) và vị trí file.
version: 1.0.0
category: backend
tags: [architecture, backend, controller, service, repository, structure]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Backend Architecture

> **Language rule:**
> Use **English** for: code, folder names, pattern names, technical rules.
> Use **the user's language** for: explanations, summaries, and questions.

---

## Trigger

Activate this skill when:
- Creating new backend API endpoints, services, or models
- User asks "where should I put this business logic?"
- Project audit flags mixed concerns (e.g., SQL queries inside a controller)
- Inheriting or setting up a Node.js, Python, or Go backend

---

## Scope

- ✅ Discover existing backend folder structure
- ✅ Enforce Layered Architecture (Controller → Service → Data Access)
- ✅ Enforce Domain/Module-based structure if applicable (`src/users/`, `src/orders/`)
- ✅ Define where validation, mapping, and error handling should live
- ✅ Validate file placement before code generation

---

## Non-goals

- ❌ Do NOT rewrite the architecture unless requested
- ❌ Do NOT write the actual database queries (delegate to `database-engineer`)
- ❌ Do NOT configure server infrastructure (delegate to `deployment`)

---

## Severity Levels

| Level | Meaning |
|-------|---------|
| P0 | Circular dependency or security bypass in architecture |
| P1 | Mixed concerns (e.g., ORM logic in route handler) |
| P2 | Inconsistent folder or file naming |
| P3 | Minor deviation from convention |

---

## Workflow

### Phase 1 — Architecture Discovery

Analyze the project structure:
1. **Classic MVC / Layered:** `controllers/`, `services/`, `models/`, `routes/`
2. **Domain-Driven (Module):** `src/modules/user/{controller, service, repository}`
3. **Framework-specific:** NestJS (`.controller.ts`, `.service.ts`), Django apps, Express monolithic.
4. **Serverless:** `functions/`, `handlers/`

---

### Phase 2 — Rule Extraction

Extract conventions:
- **Routes/Controllers:** Should only handle HTTP req/res, params validation, and calling services. No business logic.
- **Services:** Pure business logic. Does not know about HTTP (`req`/`res`).
- **Repositories/Data Access:** Only layer that interacts with the DB.
- **Error Handling:** Centralized error middleware vs local try/catch.

---

### Phase 3 — File Placement & Routing

Map a new requirement to the architecture:

*Request: "Add an endpoint to update user profile"*
- Route: `PUT /api/users/:id` mapped in `src/routes/user.routes.ts`
- Controller: `updateProfile(req, res)` in `src/controllers/user.controller.ts`
- Service: `updateUserProfile(userId, data)` in `src/services/user.service.ts`

---

## Decision Tree

```
Does the project group files by Layer or by Domain?
  ├── Layer  → Place in `src/controllers/` and `src/services/`
  └── Domain → Place in `src/modules/users/`

Where does data validation happen?
  ├── Middleware → Add Zod/Joi validation at the router level
  └── Controller → Validate inside the controller function before calling service
```

---

## Output Format

```
🏗️ Backend Architecture Plan
─────────────────────────────────────────────────
Structure Type: [Layered / Domain-based / Framework-specific]

Layer Mapping:
  ✅ Controller: [path/to/controller.ts] — handles HTTP
  ✅ Service:    [path/to/service.ts] — business logic
  ✅ Repo/DB:    [handled by database-engineer]

⚠️ Constraints enforced:
  • Do not pass `req` or `res` objects into the Service layer.
  • Validate all inputs at the Controller/Route level.

🔗 Next Steps:
  Proceeding to implement the layers.
```
