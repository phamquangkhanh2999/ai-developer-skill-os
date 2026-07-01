---
name: api-integration
description: >-
  Chuyển đổi API spec, curl, OpenAPI, Postman, HAR hoặc snippets mẫu thành
  integration layer production-ready cho nhiều loại dự án. Skill ưu tiên tuân
  theo convention hiện có, giữ thay đổi tối thiểu, bảo toàn tính an toàn và
  dễ mở rộng cho các hệ thống khác nhau.
version: 1.1.0
---

# API Integration & Code Generator

Biến mô tả API thành lớp tích hợp rõ ràng, có kiểu dữ liệu, dễ bảo trì và phù
hợp với kiến trúc hiện có của dự án.

## Nguyên tắc cốt lõi

1. **Respect existing architecture** — ưu tiên convention, cấu trúc và style đã có.
2. **Minimal and safe changes** — tạo file mới khi có thể, không ghi đè file cũ.
3. **Clarify assumptions** — nếu thiếu thông tin thì dừng lại và hỏi làm rõ thay vì đoán.
4. **Be framework-aware, not framework-locked** — hiểu framework hiện tại nhưng không bị ràng buộc.
5. **Deliver reviewable output** — code, docs và checklist phải sẵn sàng cho review và triển khai.

## Khi nào dùng skill này

Dùng khi người dùng cung cấp một trong các dạng input sau và cần tạo lớp tích hợp API:

- curl command
- Swagger 2.0 / OpenAPI 3.0 (YAML/JSON)
- Postman collection / HAR
- Docs dạng text (endpoint, method, request, response)
- Code mẫu (fetch/axios/custom client) để reverse-engineer

## Phạm vi hỗ trợ

- API types: REST, GraphQL, WebSocket, SSE, file upload/download, webhook
- Frameworks: React, Vue, Next.js, Nuxt, Node.js/Express, SvelteKit, plain JS/TS
- HTTP clients: axios, fetch, undici, got, superagent, custom wrapper
- State layers: React Query, Redux, Zustand, Pinia, Context, Apollo, Vuex
- Languages: TypeScript (ưu tiên), JavaScript, JSDoc

## Quy tắc an toàn

- Không ghi đè file hiện có trừ khi user explicitly yêu cầu.
- Không tự động merge khi phát hiện conflict đáng kể.
- Không hardcode URL, token, secret hay thông tin nhạy cảm.
- Không đưa `any` nếu có thể tránh được; ưu tiên typing rõ ràng.
- Không tạo dependency không cần thiết.

## Quy trình 6 phase

### Phase 1 — Input validation

Xác thực input trước khi parse:

- URL endpoint hợp lệ và không typo
- Method hợp lệ (GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS)
- Auth format hợp lệ (Bearer/API-Key/OAuth2/Basic)
- Có thông tin request (params/body/headers)
- Có thông tin response (success + error cases)
- Format response rõ ràng (JSON/binary/stream)

Nếu thiếu thông tin quan trọng → dừng lại, hỏi làm rõ, không đoán bừa.

Output mẫu:

```json
{
  "validation": {
    "status": "VALID|INVALID",
    "confidence": 0,
    "errors": [],
    "warnings": [],
    "parsed_input_type": "curl"
  }
}
```

### Phase 2 — API contract extraction

Chuyển input thành contract chuẩn:

```text
metadata: { name, domain, endpoint, method, version?, description? }
request: { pathParams, queryParams, headers, body{ type, schema }, auth }
response: { success{ statusCode, contentType, schema, pagination? }, errors[] }
rateLimit?, timeout?
```

Mỗi field cần có: `type`, `required`, và nếu có thì thêm `nullable`, `enum`, `minLength/maxLength`, `pattern`, `example`, `items`.

### Phase 3 — Project profile detection

1. Tìm `.api-config.json` ở root; nếu có thì dùng luôn.
2. Nếu không có, suy ra từ các tín hiệu sau:
   - Framework: package.json, config files, build setup
   - HTTP client: imports, shared axios/fetch wrappers
   - State management: React Query, Redux, Zustand, Pinia, Apollo
   - Type system: tsconfig, JSDoc, plain JS
   - Cấu trúc thư mục: services, hooks, types, adapters, utils
   - Naming convention: camelCase, PascalCase, snake_case, file patterns
3. Đọc 1–2 file API hiện có để bắt pattern đúng hơn về import, typing, error handling và naming.

Nếu project context mơ hồ, dùng default conservatively và ghi rõ assumptions.

### Phase 4 — Conflict detection

Kiểm tra trước khi sinh code:

- **ENDPOINT_DUPLICATE** — endpoint đã tồn tại? giống thì reuse, khác thì cảnh báo
- **FUNCTION_DUPLICATE** — tên function trùng
- **TYPE_DUPLICATE** — type trùng hoặc gần trùng
- **LOGIC_OVERLAP** — logic trùng với API khác
- **IMPORT_CONFLICT** — path import xung đột

Nếu có conflict mức HIGH → dừng, xuất report chi tiết và chờ quyết định.

### Phase 5 — Code generation

Sinh output theo pattern đã được xác định. Ưu tiên tạo tập con tối thiểu nhưng đủ dùng:

- types: request/response/error schemas
- service/client: wrapper hoặc API layer
- hook/provider: nếu project có pattern phù hợp
- example usage: ví dụ mô tả cách gọi, có nhãn rõ ràng nếu chỉ để tham khảo

Nếu project đã có shared API layer, hãy extend cho phù hợp thay vì tạo cấu trúc song song.

### Phase 6 — Quality validation

Checklist bắt buộc trước khi báo READY:

- TypeScript strict, compile sạch, không `any` nếu có thể tránh
- Mọi function/param có type và return type rõ ràng
- Không import thừa, không debug code thừa
- Error handling đầy đủ (try-catch / `.catch` / fallback)
- Không hardcode URL/token/secret; dùng env var hoặc config
- Khớp naming và cấu trúc dự án
- Tái sử dụng HTTP client/interceptor/query client hiện có
- JSDoc cho public API nếu project có convention đó
- React: dependency array đúng, cleanup đúng, tránh race condition

## Output bắt buộc

Ngoài các file code, luôn sinh:

1. **ANALYSIS_REPORT.json** — chứa input, validation, api_contract, project_analysis,
   conflicts, generation_plan, assumptions, quality_metrics, next_steps, rollback_instructions.
2. **INTEGRATION_REPORT.md** — tài liệu mô tả API, những gì đã tạo, cách dùng,
   quality notes, env vars, sample test, next steps và rollback commands.

## Quy tắc PHẢI / KHÔNG

**PHẢI:** làm đúng 6 phase · kiểm tra conflict trước · tạo đủ types/service/hook/example theo mức cần thiết · sinh report · giữ code strict, typed và ready-to-use.

**KHÔNG:** bỏ qua conflict detection · auto-merge khi chưa hỏi · sinh code khi conflict HIGH còn chưa giải quyết · dùng `any` bừa bãi · hardcode URL/token/secret · ghi đè file cũ · copy code từ dự án khác mà không adapt · bỏ qua error cases hoặc documentation.

## Định dạng file tham chiếu `.api-config.json`

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
    "fileNaming": "{name}.api.ts",
    "typeFileNaming": "{Name}Type.ts",
    "hookFileNaming": "use{Name}.ts"
  },
  "httpConfig": {
    "baseURL": "process.env.REACT_APP_API_URL",
    "interceptor": "src/lib/axios.instance.ts",
    "authHeader": "Authorization",
    "timeout": 30000
  },
  "stateConfig": {
    "queryClient": "src/lib/queryClient.ts",
    "cacheTime": 300000,
    "staleTime": 60000
  },
  "templateExamples": {
    "existingService": "src/services/user.api.ts",
    "existingHook": "src/hooks/useUser.ts",
    "existingType": "src/types/user.types.ts"
  }
}
```
