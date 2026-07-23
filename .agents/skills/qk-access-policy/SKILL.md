---
# ── Identity ───────────────────────────────────────────────
name: qk-access-policy
version: 8.0.0
status: stable
description: "Quản lý RBAC, ABAC — định nghĩa role matrix trước, implement middleware sau."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - access-control
  - security-policy

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "cấu hình rbac"
  - "phân quyền"
  - "bảo mật api"
  - "auth middleware"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-api-lifecycle

knowledge_scope:
  owns:
    - security-policy
    - role-matrix
  references:
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: high
side_effects: edit_files
produces: [code, report]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-access-policy — Access Control Designer

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] User roles and protected resources are defined
- [ ] Auth system (JWT, session, OAuth) is identified

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần định nghĩa: danh sách roles + resources cần bảo vệ."
```

---

## Scope
- ✅ Define explicit Role-Permission Matrix before coding
- ✅ Implement middleware/guards based strictly on the matrix
- ✅ Separate auth (who are you?) from authz (what can you do?)

## Non-Goals
- ❌ Grant wildcard (*) permissions
- ❌ Mix authentication logic with authorization logic
- ❌ Hardcode role checks in business logic (use middleware/guards)

---

## Priority Order
| P | Task | Skip Threshold |
|---|------|----------------|
| P1 | Define Role-Permission Matrix | Never |
| P2 | Implement deny-by-default middleware | Never |
| P3 | Add role guards to routes/controllers | Budget < 30% |
| P4 | Add audit logging for auth failures | Budget < 60% |

---

## Role-Permission Matrix Format (Required)

```
Resource          | admin | manager | user | guest
─────────────────────────────────────────────────
GET /resource     |   ✅   |    ✅    |  ✅  |   ✅
POST /resource    |   ✅   |    ✅    |  ❌  |   ❌
DELETE /resource  |   ✅   |    ❌    |  ❌  |   ❌
```

---

## Workflow

### Phase 1 — Matrix Definition
1. List all roles and resources from requirements
2. Create Role-Permission Matrix (table format above)
3. Identify conflicts or contradictions

**Decision:** `IF matrix has contradiction → EXIT: BLOCKED — resolve ambiguity`

### Phase 2 — Implementation
1. Create deny-by-default guard/middleware
2. Apply guards to routes using matrix
3. Add auth failure logging

### Phase 3 — Verification
1. Read matrix vs implementation — spot check 3 routes

---

## Evidence Format
```
[SEVERITY] src/middleware/auth.ts:LINE
Rule:       [WILDCARD | MISSING_GUARD | SOC_VIOLATION | HARDCODED_ROLE]
Reason:     [specific issue]
Confidence: HIGH
Fix:        [specific change]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Matrix defined, middleware implemented, deny-by-default applied | Implementation complete |
| PARTIAL | Implemented but missing audit logging or some routes unguarded | Post-verification minor gaps |
| BLOCKED | Roles or resources undefined — cannot create matrix | Missing inputs |
| FAILED | Contradiction in matrix or auth/authz mixed | Architectural violation |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Roles and resources explicitly defined | Build matrix and implement |
| MEDIUM | Roles inferred from codebase | Build matrix, ask user to verify |
| LOW | Authentication strategy unknown | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Route unguarded due to missing middleware | Anyone can access DELETE /users |
| HIGH | Hardcoded roles in business logic | `if (user.role === 'admin')` in service layer |
| MEDIUM | Wildcard permissions granted | `user` can access `*` |
| LOW | Audit log missing for auth failure | Unlogged 403 error |

---

## Retry Policy
```
Route verification fails
  └─ Route unguarded
       ├─ Add missing guard to route
       └─ Do NOT retry more than 1 time per route
```

---

## Escalation Rules
```
BLOCKED: Roles or resources undefined
Missing:
  - List of user roles
  - List of protected resources
Questions:
  1. Hệ thống có những role nào? (ví dụ: admin, user, manager)
  2. Những API/Route nào cần bảo vệ?
Recommended Assumptions:
  - Deny-by-default for all non-public routes
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["roles", "resources"],
  "optional_fields": ["auth_strategy"]
}
```
### Produces
```json
{
  "to": "user",
  "output_fields": ["role_matrix", "middleware_files", "guarded_routes", "exit_code"]
}
```

---

