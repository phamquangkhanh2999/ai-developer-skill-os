---
name: qk-api-lifecycle
category: fullstack
version: 7.5.1
description: "Thiết kế, triển khai API endpoints với Zero-Trust — contract trước, code sau."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [context-graph, user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

# qk-api-lifecycle — API Design & Implementation

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] API purpose and resource name are defined
- [ ] Request/response shape is specified (or sample JSON provided)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần định nghĩa: resource name + expected request/response shape trước khi code."
```

---

## Scope
- ✅ Define OpenAPI/Swagger contract BEFORE writing code
- ✅ Implement endpoint strictly to contract
- ✅ Validate all inputs, handle all error cases
- ✅ Ensure backward compatibility

## Non-Goals
- ❌ Introduce breaking changes without versioning
- ❌ Bypass auth checks
- ❌ Guess external API shapes without evidence

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Contract definition (TypeScript types) | Never |
| P2 | Success response + correct status code | Never |
| P3 | Input validation middleware | Never |
| P4 | Error responses (400, 401, 404, 422, 500) | Budget < 30% |
| P5 | Documentation (JSDoc or OpenAPI annotation) | Budget < 60% |

---

## Workflow

### Phase 1 — Contract Definition
1. Define TypeScript interfaces for Request + Response
2. Specify HTTP method, route, status codes
3. Document error cases

**Decision:**
```
IF contract is clear → go to Phase 2
ELSE → EXIT: BLOCKED — define contract first
```

### Phase 2 — Implementation
1. Build route handler strictly matching contract
2. Add input validation (zod/yup/class-validator)
3. Handle all error cases with correct HTTP status

### Phase 3 — Verification
1. Read implemented code vs defined contract
2. Verify: method, route, response shape, error codes match

**Decision:**
```
IF contract and implementation match → EXIT: SUCCESS
ELSE → fix gaps, EXIT: PARTIAL
```

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Contract defined, implementation matches | Report SUCCESS |
| MEDIUM | Contract inferred from context | Note assumption |
| LOW | No contract, guessing from usage | EXIT: BLOCKED |

---

## Evidence Format
```
[SEVERITY] src/routes/[resource].ts:LINE
Issue:      [mismatch between contract and implementation]
Confidence: HIGH
Fix:        [specific change needed]
```

---

## Handoff Contract
### Consumes
```json
{ "from": "user", "required_fields": ["resource_name", "request_shape", "response_shape"] }
```
### Produces
```json
{ "to": "qk-validation-gate", "output_fields": ["route_file", "types_file", "contract_doc", "exit_code"] }
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Contract defined, implemented, verified | Implementation matches contract |
| PARTIAL | Implemented but missing error cases or docs | Core logic done, edge cases missing |
| BLOCKED | No contract defined — cannot code | Missing payload/schema |
| FAILED | Implementation breaks existing contract | Backward incompatibility |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Broken contract on public API | Renamed `userId` to `id` in response |
| HIGH | Missing input validation | SQL Injection or crash on null input |
| MEDIUM | Returning 500 for validation errors | Not using 400/422 |
| LOW | Missing JSDoc | Undocumented route |

---

## Retry Policy
```
Contract verification fails
  └─ Implementation does not match contract
       ├─ Fix route handler to match contract
       └─ Do NOT retry more than 1 time
```

---

## Escalation Rules
```
BLOCKED: No contract defined
Missing:
  - Request payload structure
  - Response payload structure
Questions:
  1. Payload gửi lên (Request) có những field gì?
  2. Payload trả về (Response) có cấu trúc thế nào?
Recommended Assumptions:
  - Default JSON response with `{ data, message }` wrapper
```

---


