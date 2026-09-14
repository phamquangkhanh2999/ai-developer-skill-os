---
# ── Identity ───────────────────────────────────────────────
name: qk-api-consumer
version: 9.2.0
status: stable
description: "Consume API (REST/GraphQL/tRPC), quản lý State, xử lý loading/error/empty states, bind vào UI — bất kể FE framework nào, tuân thủ kiến trúc dự án. Dùng skill này khi user nhắc đến: tích hợp api, gọi api, fetch data, consume api, kết nối api, bind data, state management, api consumer — kể cả khi chỉ nói 'gọi endpoint này để hiển thị lên bảng'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── Classification ─────────────────────────────────────────
type: capability

intent:
  - api-integration
  - state-management
  - data-binding

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
  - "kết nối api"
  - "bind data"
  - "state management"
  - "api consumer"


# ── References ─────────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-api-lifecycle    # Nếu API chưa tồn tại → dùng qk-api-lifecycle trước
  - qk-ui-builder       # Nếu cần build UI sau khi có data

knowledge_scope:
  owns:
    - api-integration
    - state-management
    - data-binding
    - loading-error-empty-states
  references:
    - architecture
    - anti-patterns

# ── Verification ───────────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: medium
  confidence_threshold: 0.80

# ── Runtime ────────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: edit_files
produces: [code]
consumes: [json-payload, context-graph]

token_budget:
  max_files_read: 4
  max_lines_per_read: 120
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-api-consumer — API Integration & State Binding

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions

Trước khi bắt đầu, AI PHẢI xác nhận:

- [ ] API endpoint đã tồn tại (có docs, OpenAPI spec, hoặc code thực tế)
  → Nếu chưa có: `BLOCKED` — chỉ dẫn dùng `qk-api-lifecycle` trước
- [ ] Biết response schema (ít nhất success shape)
  → Nếu chưa biết: đọc route handler hoặc hỏi user cung cấp sample response
- [ ] Biết auth requirement (public / JWT / API key)
  → Nếu chưa biết: đọc middleware config hoặc hỏi

---

## Scope

✅ Skill này làm:
- Tạo service/hook/store để gọi API
- Map response về đúng type/interface
- Xử lý loading / error / empty states
- Cache, refetch, invalidation strategy
- Optimistic update khi cần
- Bind data vào component

❌ Skill này KHÔNG làm:
- Thiết kế API contract (→ `qk-api-lifecycle`)
- Viết backend route handler (→ `qk-api-lifecycle`)
- Xây dựng UI component từ đầu (→ `qk-ui-builder`)
- Thiết kế DB schema (→ `qk-data-lifecycle`)

---

## Execution Steps

### Step 1 — Đọc API contract
```
Inputs:  API docs / route handler / OpenAPI spec
Actions:
  - Xác định: method, path, auth header, request shape, response shape
  - Xác định: error codes (400/401/403/404/500) và error shape
  - Ghi lại: base URL pattern của project (axios instance? fetch wrapper?)
Outputs: Typed interface cho Request + Response
Exit: BLOCKED nếu không tìm được contract
```

### Step 2 — Xác định state strategy (theo stack từ DEV_PROFILE.md)
```
Inputs:  detected_stack (React Query / SWR / Zustand / Pinia / Redux / plain fetch)
Actions:
  - React + React Query   → useQuery / useMutation pattern
  - React + SWR           → useSWR / useSWRMutation
  - React + Redux RTK     → createApi slice
  - Vue + Pinia           → defineStore + action
  - Vue + VueQuery         → useQuery (vue-query)
  - Next.js Server Comp   → async server component + fetch cache
  - Vanilla / no library  → custom hook với useReducer
  - Angular               → HttpClient service + RxJS
  - Không có DEV_PROFILE  → hỏi user trước khi code
Outputs: Quyết định state pattern
```

### Step 3 — Implement
```
Actions:
  3a. Tạo type definitions (TypeScript) hoặc JSDoc types (JavaScript)
  3b. Tạo service function / API caller
  3c. Tạo hook / store / query
  3d. Handle 3 bắt buộc: loading state, error state, empty state
  3e. Bind vào component (nếu được yêu cầu)

Rules:
  - KHÔNG dùng `any` cho response type
  - KHÔNG silent-catch error (console.log rồi bỏ qua)
  - KHÔNG hardcode base URL — phải dùng env variable
  - Loading UI: skeleton ưu tiên hơn spinner cho content areas
  - Error: show actionable message, không "Something went wrong"
```

### Step 4 — Verify
```
Actions:
  - Re-read code vừa viết, kiểm tra type safety
  - Kiểm tra error boundary có được set up không
  - Kiểm tra không có N+1 request (gọi API trong loop)
  - Kiểm tra cleanup (unsubscribe / AbortController nếu cần)
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết stack + state pattern. Cung cấp API contract — AI lo phần còn lại.

```
API:         [Method + Path — vd: GET /api/products]
Auth:        [public / user-jwt / api-key]
Request:     [Query params hoặc body nếu có]
Response:    [Mô tả hoặc paste sample JSON]
Dùng ở:     [Component / page nào sẽ hiển thị data này]
Behavior:    [Loading trông thế nào? Error hiện gì? Empty state ra sao?]
```

---

### Theo Role & Stack:

**React + React Query (fe / fullstack)**
```
API:         GET /api/products?page=1&limit=20&category=shoes
Auth:        public
Response:    { data: Product[], total: number, hasNextPage: boolean }
Dùng ở:     ProductList.tsx — hiển thị grid sản phẩm có infinite scroll
Behavior:    Loading → skeleton grid 6 cards, Error → banner + retry button,
             Empty → "Không tìm thấy sản phẩm" + clear filter button
```
→ AI tạo: `useProducts(params)` hook với `useInfiniteQuery`, type `Product`,
  skeleton component, error boundary fallback, `getNextPageParam` logic.

**Next.js 14 App Router (fullstack)**
```
API:         GET /api/dashboard/stats (internal — cùng Next.js app)
Auth:        session (NextAuth)
Response:    { revenue: number, orders: number, newUsers: number }
Dùng ở:     app/dashboard/page.tsx — Server Component
Behavior:    Suspense fallback với skeleton, error.tsx xử lý lỗi
```
→ AI tạo: async Server Component với `fetch` + `cache: 'no-store'`,
  `loading.tsx` skeleton, `error.tsx` boundary, session check với `getServerSession`.

**Vue 3 + Pinia (fe / fullstack)**
```
API:         POST /api/cart/items (add to cart)
Auth:        user-jwt (Bearer token từ auth store)
Request:     { productId: string, quantity: number }
Response:    { cartId: string, items: CartItem[], total: number }
Dùng ở:     ProductCard.vue — nút "Add to Cart"
Behavior:    Optimistic: tăng cart count ngay, rollback nếu API fail
```
→ AI tạo: `useCartStore` Pinia store với `addItem` action,
  optimistic update + rollback pattern, toast notification on error,
  axios interceptor inject JWT từ `useAuthStore`.

**Angular + HttpClient (fe)**
```
API:         GET /api/users/:id
Auth:        Bearer JWT
Response:    { id, name, email, role, createdAt }
Dùng ở:     UserProfileComponent
Behavior:    Loading spinner, error redirect về /login nếu 401
```
→ AI tạo: `UserService` injectable với `HttpClient`, `UserProfile` interface,
  `AsyncPipe` trong template, `HttpInterceptor` xử lý 401 → redirect.

**data / ai-engineer (server-side data fetching)**
```
API:         POST /api/ingest/predictions (nhận batch từ ML pipeline)
Auth:        api-key (header: X-API-Key)
Request:     { batchId: string, predictions: Prediction[] }
Response:    { accepted: number, rejected: number, errors: ErrorItem[] }
Dùng ở:     Python consumer script — không phải UI
Behavior:    Retry 3 lần khi 5xx, log từng batch result, dead-letter queue khi fail
```
→ AI tạo: Python `httpx` async client, retry logic với exponential backoff,
  batch result logging, structured error handling per prediction.
