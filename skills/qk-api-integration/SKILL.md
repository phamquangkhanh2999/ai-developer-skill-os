---
name: qk-api-integration
description: >-
  Chuyển đổi tài liệu API (curl, swagger...) thành code tích hợp frontend chuẩn xác, có type an toàn và xử lý lỗi.
version: 2.0.0
category: engineering
tags: [api, integration, rest, graphql, axios, fetch, react-query, typescript]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# API Integration Engineer

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when the user provides any of:
- `curl` command
- Swagger 2.0 / OpenAPI 3.0 (YAML or JSON)
- Postman collection or HAR file
- API documentation (endpoint, method, request/response)
- Code snippet to reverse-engineer (fetch/axios/custom client)
- Backend controller or route handler to mirror on the frontend

---

## Scope

- ✅ Parse and understand any API input format
- ✅ Extract the full API contract (request + response + errors)
- ✅ Detect existing project patterns (HTTP client, state layer, conventions)
- ✅ Generate typed service/client, hooks/queries, and TypeScript types
- ✅ Follow and extend existing architecture — never duplicate it
- ✅ Handle special cases: file upload, file download, pagination, auth, WebSocket

---

## Non-goals

- ❌ Do NOT create a new HTTP client if one already exists
- ❌ Do NOT introduce a new state system if one is already in use
- ❌ Do NOT hardcode URLs, tokens, or secrets
- ❌ Do NOT use `any` when types can be inferred
- ❌ Do NOT overwrite existing files without explicit user approval

---

## Severity Levels

| Level | Meaning |
|-------|---------|
| P0 | Conflict with existing endpoint or type — must resolve before generating |
| P1 | Missing critical info (auth, response schema) — ask before proceeding |
| P2 | Naming or structure inconsistency — warn and apply best guess |
| P3 | Missing optional fields — document assumption and proceed |

---

## Workflow

### Phase 1 — Input Validation

Before parsing, verify:
- URL is valid and method is correct (GET/POST/PUT/PATCH/DELETE)
- Auth format is identifiable (Bearer, API Key, OAuth2, Basic, Cookie)
- Request info is present (path params, query params, body)
- Response structure is clear (JSON, binary, stream, paginated)
- Error cases are documented

If critical info is missing → **stop and ask**. Do not guess.

```json
{
  "validation": {
    "status": "VALID | INVALID | INCOMPLETE",
    "confidence": 0.95,
    "errors": [],
    "warnings": [],
    "input_type": "curl | openapi | postman | docs | code"
  }
}
```

---

### Phase 2 — API Contract Extraction

Extract the full contract:

```
metadata:
  name, domain, endpoint, method, version, description

request:
  pathParams:    { name, type, required }
  queryParams:   { name, type, required, default }
  headers:       { name, value, required }
  body:          { contentType, schema { field, type, required, nullable } }
  auth:          { type, location, name }

response:
  success:       { statusCode, contentType, schema, pagination? }
  errors:        [ { statusCode, message, businessCode? } ]

special:
  rateLimit, timeout, retryable, streaming
```

Map each field: `type`, `required`, `nullable`, `enum`, `example`.

---

### Phase 3 — Project Profile Detection

1. Check for `.api-config.json` at project root → use if present
2. Otherwise infer from:
   - Framework: `package.json`, config files, imports
   - HTTP client: existing axios instance, fetch wrapper, custom client
   - State management: React Query, Redux, Zustand, Pinia, Apollo, Vuex
   - Type system: `tsconfig.json`, JSDoc, plain JS
   - Folder conventions: `services/`, `hooks/`, `api/`, `types/`, `adapters/`
   - Naming: camelCase, PascalCase, snake_case, file patterns
3. Read 1-2 existing API files to capture exact patterns for imports, typing, error handling, naming

If project context is ambiguous → use conservative defaults and document all assumptions.

---

### Phase 4 — Conflict Detection

Before generating code, check for:

| Conflict | Action |
|----------|--------|
| `ENDPOINT_DUPLICATE` — endpoint already exists | Reuse if same, warn if different |
| `FUNCTION_DUPLICATE` — function name conflicts | Warn, propose new name |
| `TYPE_DUPLICATE` — type already defined | Extend or reuse existing |
| `LOGIC_OVERLAP` — logic exists in another service | Consolidate, don't duplicate |
| `IMPORT_CONFLICT` — import path conflicts | Resolve before generating |

**P0 conflict → stop, report, wait for user decision before proceeding.**

---

### Phase 5 — Code Generation

Generate the minimum necessary set for the task:

#### TypeScript Types
```typescript
// Request types
export interface CreateUserRequest {
  name: string;
  email: string;
  role?: UserRole;
}

// Response types
export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

#### Service / API Layer
```typescript
// Thin layer: HTTP + mapping only. No UI, no business logic.
export const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  const response = await apiClient.post<CreateUserResponse>('/users', data);
  return response.data;
};
```

#### Hook / Query (if project uses React Query)
```typescript
export const useCreateUser = () => {
  return useMutation<CreateUserResponse, ApiError, CreateUserRequest>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

**If project uses Redux** → follow existing slice/thunk pattern.
**If project uses Zustand** → follow existing store pattern.
**If project uses Pinia/Vuex** → follow existing composable/action pattern.

Do NOT mix patterns.

---

### Phase 6 — Special Case Handling

#### File Upload (`multipart/form-data`)
```typescript
// Always use FormData — never send File object in JSON
const formData = new FormData();
formData.append('file', file);
formData.append('name', name);
await apiClient.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

#### File Download (binary response)
```typescript
const response = await apiClient.get('/export', { responseType: 'blob' });
const url = URL.createObjectURL(response.data);
const a = document.createElement('a');
a.href = url;
a.download = filename;
a.click();
URL.revokeObjectURL(url);
```

#### Pagination
```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
// Implement consistently with existing project pagination pattern
```

#### Authentication
- Follow existing auth mechanism (interceptor, header injection, cookie)
- Never hardcode tokens or credentials
- Refresh token logic belongs in the existing interceptor

---

### Phase 7 — Quality Validation

Before marking as ready:

- [ ] TypeScript strict — compiles clean, no `any` without justification
- [ ] All functions/params have explicit types and return types
- [ ] No unused imports, no debug code
- [ ] Error handling complete (try/catch, `.catch`, fallback)
- [ ] No hardcoded URLs, tokens, or secrets — use env vars
- [ ] Naming matches project conventions
- [ ] Reuses existing HTTP client, interceptors, and query client
- [ ] JSDoc added for public API if project convention requires it
- [ ] React: dependency arrays correct, cleanup present, no race conditions

---

### Phase 8 — End-to-End UI Integration (Optional / On-Demand)

If the user explicitly requests to integrate the API directly into the UI (End-to-End):
1. **Find Target Component:** Identify the UI component where the API should be called.
2. **Wire State:** Inject the generated Hook/Query/Service into the component.
3. **Handle States:** Implement Loading (spinners, skeletons), Error (toast, alert), and Success (redirect, form reset, table refetch) states in the UI.
4. **Data Binding:** Bind the API response data to the UI elements (Table rows, Dropdowns, etc.) and bind UI inputs to the API request payload.

---

## Decision Tree

```
Is required info complete?
  ├── No  → Ask for missing info (auth, response schema, base URL)
  └── Yes → Check for conflicts
              ├── P0 conflict → Stop, report, wait for user decision
              └── No P0 → Generate code following project patterns
```

```
Does project have existing HTTP client?
  ├── Yes → Extend it
  └── No  → Create minimal axios/fetch wrapper following project style
```

```
Does project use state management?
  ├── React Query → useMutation / useQuery pattern
  ├── Redux       → slice + thunk / RTK Query
  ├── Zustand     → store action
  ├── Pinia       → action in store
  └── None        → Service function only
```

---

## Output Format

```
📋 API Contract
─────────────────────────────────────────────────
Name:     [API name]
Endpoint: [METHOD /path]
Auth:     [type]
Input:    [brief description]
Output:   [brief description]

🔍 Project Pattern Detected
─────────────────────────────────────────────────
HTTP client:    [axios instance at src/lib/axios.ts]
State:          [React Query]
Types path:     [src/types/]
Service path:   [src/services/]
Hook path:      [src/hooks/]

⚠️  Assumptions
─────────────────────────────────────────────────
  • [Assumption 1]
  • [Assumption 2]

📁 Files Generated
─────────────────────────────────────────────────
  [NEW]    src/types/user.types.ts
  [NEW]    src/services/user.service.ts
  [NEW]    src/hooks/useCreateUser.ts
  [EXTEND] src/services/index.ts

🔗 Next steps:
  → Import hook in your component
  → Add env var: VITE_API_BASE_URL
  → Test with: [example usage snippet]
```

---

## Validation Checklist

- [ ] All 7 phases completed
- [ ] Input validated — no missing critical fields
- [ ] Conflicts checked — none unresolved
- [ ] Types generated and strict
- [ ] Existing HTTP client reused
- [ ] Existing state pattern followed
- [ ] Special cases handled if applicable (upload, download, pagination, auth)
- [ ] No hardcoded secrets
- [ ] Output format produced with files listed

---

## Project Config Reference (`.api-config.json`)

```json
{
  "framework": "React",
  "httpClient": "axios",
  "stateManagement": "react-query",
  "typing": "typescript",
  "conventions": {
    "servicePath": "src/services/",
    "typePath": "src/types/",
    "hookPath": "src/hooks/",
    "naming": "camelCase",
    "fileNaming": "{name}.service.ts",
    "typeFileNaming": "{Name}.types.ts",
    "hookFileNaming": "use{Name}.ts"
  },
  "httpConfig": {
    "baseURL": "process.env.VITE_API_URL",
    "interceptor": "src/lib/axios.ts",
    "authHeader": "Authorization",
    "timeout": 30000
  }
}
```

---

## Examples

See `examples/` folder.
