---
name: qk-fe-api-integration
category: frontend
version: 1.0.0
description: "Chuyên biệt hóa việc tiêu thụ (consume) API Backend, quản lý State, và ghép nối vào Giao diện (UI) tuân thủ chặt chẽ Base dự án."
---

# qk-fe-api-integration

## Scope
- Consume RESTful/GraphQL APIs from Backend (Plan & Execute).
- Automatically generate Types/Interfaces based on JSON Response.
- Manage UI states (Loading, Success, Error) and Pagination.
- Bind data to existing UI Components or create new ones based on the Design System.

## Verbs
- `[ANALYZE_BASE]`: Perform targeted, zero-overhead searches (e.g., grep `package.json` or check `src/api`) to rapidly identify existing API conventions (Axios, RTK Query, React Query). DO NOT execute exhaustive project scans.
- `[GENERATE_TYPES]`: Analyze cURL/JSON payloads to construct strict, type-safe TypeScript Interfaces/Types.
- `[INTEGRATE]`: Implement API consumption logic, execute Data Transfer Object (DTO) mapping, and bind state seamlessly to UI Components.

## Constraints
```yaml
must:
  - "Execute a targeted lookup to identify the project's [Base API Client] architecture before writing network logic; NEVER default to raw fetch/axios if a wrapper exists"
  - "Define explicit TypeScript Interfaces for both Request and Response schemas prior to implementation"
  - "Thoroughly handle all 3 UI lifecycle states: Loading, Success, Error (via toast/alert mechanisms)"
  - "Sanitize and map Backend payloads (DTO pattern) before injecting them into Dumb Components to prevent data leakage"
  - "Maximize the reuse of existing project UI Components (Table, Form, Modal) over creating custom ones"
must_not:
  - "Hardcode API Base URLs or Endpoint paths directly within UI components (enforce env vars or centralized config)"
  - "Inject API calling logic (Smart logic) inside purely presentational components (Dumb components)"
  - "Arbitrarily introduce new State/Fetching management libraries that conflict with the project's established standards"
  - "Hallucinate or presume the existence of data fields not explicitly defined in the provided JSON samples"
```

## Policies
```yaml
prefer:
  - "Strict architectural separation between the Services layer (API calls) and the View layer (UI display)"
  - "Implementation of Cache Invalidation strategies after successful Mutations (POST/PUT/DELETE) for state managers like React Query/RTK Query"
  - "Surfacing user-friendly, localized error messages (Toast/Alert) rather than raw console logs"
  - "Utilization of Optional Chaining (?.) and Nullish Coalescing (??) to construct resilient UIs that do not crash on malformed payloads"
```

## Escalation
```yaml
stop:
  - "The project's Base API Client is indiscernible or the overarching API architecture is ambiguous"
  - "The provided Backend JSON lacks mandatory fields essential for rendering the requested UI components"
```

## Output
- Strict Type/Interface definition files (e.g., `types.ts`).
- Modular API Services files (e.g., `api.ts`).
- Presentational UI Components with complete data binding and state handling.
