---
# ── Identity ───────────────────────────────────────────────
name: qk-fe-api-integration
version: 8.3.1
status: stable
description: "Consume API Backend, quản lý State, bind vào UI — tuân thủ kiến trúc Base dự án"
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - api-integration
  - frontend-development

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "tích hợp api"
  - "gọi api"
  - "fetch data"
  - "consume api"

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
  - qk-ui-builder

knowledge_scope:
  owns:
    - api-integration
    - state-management
  references:
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: edit_files
produces: [code]
consumes: [json-payload, context-graph]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-fe-api-integration — Frontend API Consumer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions
- [ ] Backend JSON payload hoặc API endpoint schema được cung cấp
- [ ] Project's API client pattern được xác định (Axios wrapper, RTK Query, React Query, etc.)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần cung cấp: JSON response mẫu VÀ xác nhận API client pattern hiện tại của dự án."
```

---

## Scope
- ✅ Identify existing API client pattern (NEVER default to raw fetch if wrapper exists)
- ✅ Generate strict TypeScript interfaces from JSON payload
- ✅ Implement service layer (API calls separated from UI)
- ✅ Handle all 3 UI states: Loading, Success, Error
- ✅ Map backend payload → DTO before injecting into UI components

## Non-Goals
- ❌ Hardcode API Base URLs in UI components — use env vars or centralized config
- ❌ Inject API logic inside presentational (dumb) components
- ❌ Introduce new state management libraries without explicit user approval
- ❌ Hallucinate data fields not in provided JSON payload
- ❌ Create Node.js/Python scripts to patch — edit files directly
- ❌ Read entire files > 100 lines — use targeted reads
- ❌ Default to raw fetch if wrapper exists — ALWAYS reuse existing client

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Identify existing API client (grep package.json, src/api/) | Never |
| P2 | Generate TypeScript interfaces from JSON payload | Never |
| P3 | Implement service layer (API calls) | Never |
| P4 | Bind to UI with Loading + Success + Error states | Budget < 30% |
| P5 | Cache invalidation after mutations (POST/PUT/DELETE) | Budget < 60% |
| P6 | DTO mapping (backend payload → clean UI data) | Budget < 70% |

---

## Workflow

### Phase 1 — Identify Base Architecture

**Steps:**
1. `grep_search` in `package.json` → identify: axios, react-query, rtk-query, swr, or custom
2. `view_file[src/api/]` (first 30 lines) → confirm wrapper pattern
3. Identify: base URL config, auth header injection, error interceptor location

**Decision:**
```
IF wrapper/client found (e.g., apiClient.ts, axiosInstance.ts)
  → Use it. Ưu tiên bọc (wrap) bằng TanStack Query (useQuery/useMutation) nếu có thể. NEVER bypass with raw fetch/axios in components.
  → Confidence: HIGH → go to Phase 2

ELSE IF no wrapper found
  → Confirm with user: "Dùng raw fetch hay tạo wrapper mới?"
  → Confidence: MEDIUM → go to Phase 2

ELSE IF conflicting patterns found (mix of fetch + axios + rtk)
  → EXIT: BLOCKED — ask which pattern to follow
```

**Exit When:**
- API client pattern identified → go to Phase 2
- `max_files_read` reached → go to Phase 2 with MEDIUM confidence

---

### Phase 2 — Generate Types & Validation

**Steps:**
1. Parse provided JSON payload → extract all fields
2. Generate **Zod schema** (`z.object({...})`) for runtime validation
3. Export TypeScript interface via inferred Zod type (`export type Response = z.infer<typeof schema>`)
4. Flag any field that could be `null` or optional with `.nullable()` or `.optional()`

**Decision:**
```
IF all fields clearly typed from JSON
  → Khởi tạo Zod schema chính xác.
  → Confidence: HIGH → go to Phase 3

ELSE IF some fields ambiguous (null | undefined)
  → Mark as optional in Zod (`.optional()`) + add comment "// verify with backend"
  → Confidence: MEDIUM → go to Phase 3

ELSE IF nested objects contain mixed null/non-null patterns
  → EXIT: BLOCKED — cannot safely generate types without backend clarification
```

---

### Phase 3 — Implement Service + UI Binding

**Steps:**
1. Create/update service file: Viết API fetcher function.
2. Viết Custom Hook bọc fetcher function bằng **TanStack Query** (`useQuery` hoặc `useMutation`).
3. Bind to component: Dùng các states từ hook (`isLoading`, `isPending`, `isError`, `data`) thay vì tự tạo `useEffect`.
4. Bind Error state: handle HTTP errors per table below.
5. Kiểm duyệt ranh giới an toàn (R-SEC-04): Validate dữ liệu API trả về bằng Zod Schema ở (2) trước khi render.

**HTTP Error Handling (mandatory for ALL integrations):**
```
401 Unauthorized → redirect to login or show auth error toast
403 Forbidden    → show permission error toast
404 Not Found    → show empty state component (not a crash)
422 Validation   → map field errors to form fields
500 Server Error → show generic error toast + retry button
Network Error    → show offline banner or retry prompt
```

**Decision:**
```
IF all 3 states (Loading, Success, Error) implemented + service created → go to Phase 4
ELSE IF error state incomplete → EXIT: PARTIAL — missing HTTP error handling
ELSE → EXIT: BLOCKED — cannot complete binding
```

**Exit When:**
- All 3 states implemented + service created → go to Phase 4

---

### Phase 4 — Self-Audit

**Steps:**
1. Re-read service file: confirm no hardcoded URLs, no UI logic
2. Re-read component: confirm no API calls inside JSX
3. Verify cache invalidation if mutation (POST/PUT/DELETE)

**Decision:**
```
IF all audit points pass → EXIT: SUCCESS
ELSE IF 1–2 minor issues → fix inline → EXIT: SUCCESS
ELSE IF architectural violation found → fix → EXIT: PARTIAL
ELSE IF hardcoded URL (http://localhost, 127.0.0.1) found → EXIT: FAILED — do not ship
```

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | API client found, JSON payload complete, all types inferred | Implement directly |
| MEDIUM | Some fields ambiguous, wrapper partially identified | Note assumptions, proceed |
| LOW | No JSON payload provided OR conflicting API patterns OR nested nulls unresolved | EXIT: BLOCKED |

---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Security data leakage from improper DTO mapping | Auth token in dumb component |
| HIGH | Missing error state causes white screen of death | No 500 handler |
| MEDIUM | Hardcoded URL breaks in production | `axios.get("http://localhost:3000/api")` |
| LOW | Missing cache invalidation after mutation | Stale data after POST |

---

## Evidence Format

```
[SEVERITY] path/to/component.tsx:LINE
Issue:      [specific violation]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [one-line suggestion]
```

**Example:**
```
[HIGH] src/pages/Dashboard.tsx:45
Issue:      API call `axios.get('/api/data')` inside JSX render — violates smart/dumb separation
Confidence: HIGH
Fix:        Move to `src/services/dashboard.service.ts`, inject via hook
```

---

## Retry Policy

```
API call fails (runtime verification)
  └─ Check error type
       ├─ Network error → show retry button (user-triggered retry, not auto)
       ├─ 401/403 → do NOT retry — redirect or show permission error
       ├─ 500 → auto-retry once after 1s delay
       │        └─ Still fails → show error toast with "Try again" button
       └─ Never auto-retry more than 1 time (avoid hammering server)

Skill execution fails
  └─ Check failure type
       ├─ Syntax error in generated code → fix and retry once
       └─ Architectural mismatch → EXIT: FAILED, do NOT retry
```

---

## Escalation Rules

```
BLOCKED: Cannot determine API client pattern
Missing:
  - package.json contents OR
  - Location of existing API client file (e.g., src/lib/api.ts)
Questions:
  1. Dự án dùng thư viện nào để gọi API? (axios / fetch / react-query / rtk-query)
  2. Có file API wrapper/client nào sẵn không? (ví dụ: src/api/client.ts)
Recommended Assumptions (if proceeding):
  - Create new Axios instance with interceptors for auth + error handling
```

---

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-context-loader",
  "required_fields": ["json_payload_sample", "api_endpoint"],
  "optional_fields": ["existing_api_client_path", "component_to_bind"]
}
```

### Produces
```json
{
  "to": "user",
  "output_fields": ["types_file", "service_file", "component_file", "states_implemented", "exit_code"]
}
```

---

## Output Format

```
🔌 FE API Integration
─────────────────────────────────────────────────
API Client:  [identified — axiosInstance.ts | created new]
Types:       [src/types/[resource].types.ts]
Service:     [src/services/[resource].service.ts]

States implemented:
  ✅ Loading (skeleton/spinner)
  ✅ Success (data rendered)
  ✅ Error (toast/empty state per HTTP code)
  ⚠️ [any state skipped — reason]

Assumptions:
  - [any assumption made]

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Types + service + UI binding complete with all 3 states | Full integration |
| PARTIAL | Integration done, missing error/loading state or cache invalidation | Follow-up needed |
| BLOCKED | No JSON payload or conflicting API patterns | Ask user |
| FAILED | Cannot integrate without breaking existing architecture | Escalate |

---

