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
