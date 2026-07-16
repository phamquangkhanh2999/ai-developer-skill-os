# Routing Table — qk-orchestrator V7.5

> Full intent → skill mapping. Updated whenever a new skill is added.

---

## Primary Routes

| Intent Keywords (Vietnamese + English) | Primary Skill | Pipeline Required |
|----------------------------------------|---------------|-------------------|
| bug, lỗi, error, broken, crash, fix, sửa, không hoạt động | `qk-bug-resolution` | direct |
| tính năng, feature, thêm, mới, add, implement, xây dựng | `qk-feature-delivery` | `qk-context-loader` first |
| UI, giao diện, design, component, layout, màn hình, hiển thị | `qk-design-to-code` | DESIGN.md check |
| slow, chậm, query, index, N+1, performance DB, tối ưu DB | `qk-db-optimizer` | `qk-context-loader` first |
| deploy, release, production, CI/CD, build, xuất bản | `qk-production-release` | `qk-validation-gate` first |
| schema, migration, database, table, model, ORM | `qk-data-lifecycle` | `qk-context-loader` first |
| refactor, clean, SOLID, DRY, code quality, tái cấu trúc | `qk-engineering-standard` | direct |
| test, lint, validate, check quality, kiểm tra | `qk-validation-gate` | direct |
| upgrade, update thư viện, migrate library, nâng version | `qk-system-evolution` | direct |
| docs, documentation, README, comment, tài liệu | `qk-docs` | direct |
| API, endpoint, route, contract, swagger | `qk-api-lifecycle` | `qk-context-loader` first |
| access, role, permission, RBAC, phân quyền | `qk-access-policy` | direct |
| AI, prompt, RAG, LLM, embedding, pipeline AI | `qk-ai-builder` | direct |
| design system, token, CSS variable, design tokens | `qk-ui-system-builder` | DESIGN.md check |
| project audit, health, tech debt, kiểm toán dự án | `qk-project-health` | direct |
| new project, bootstrap, init, khởi tạo dự án | `qk-project-bootstrap` | direct |
| memory, context, recall, lưu ngữ cảnh | `qk-project-memory` | direct |
| security, policy, authorization, bảo mật | `qk-policy-engine` | → redirect to `qk-access-policy` |
| help, danh sách, list skills, hướng dẫn | `qk-help` | direct |
| consume API, tích hợp API backend, gọi API từ FE | `qk-fe-api-integration` | `qk-context-loader` first |
| UI audit, kiểm tra giao diện, anti-slop check | `qk-ui-audit` | DESIGN.md check |

---

## Pipeline Templates

### UI Pipeline
```
1. Check DESIGN.md exists (qk-project-bootstrap if missing)
2. [Optional] qk-ui-audit — audit existing UI
3. qk-design-to-code OR qk-feature-delivery (UI part)
4. qk-validation-gate — lint + type check
```

### Logic/Feature Pipeline
```
1. qk-context-loader — build dependency graph
2. qk-feature-delivery — implement
3. qk-validation-gate — test + lint
4. [Optional] qk-production-release
```

### Database Pipeline
```
1. qk-context-loader — map schema dependencies
2. qk-data-lifecycle (schema) OR qk-db-optimizer (performance)
3. qk-validation-gate — run migration tests
```

### Release Pipeline
```
1. qk-validation-gate — full test suite
2. qk-production-release — build + security gate
```

---

## Ambiguity Resolution

When 2+ skills match:

| Situation | Resolution |
|-----------|------------|
| "fix" + UI component | `qk-bug-resolution` (fix takes priority over design) |
| "refactor" + API | `qk-engineering-standard` if code quality focus, `qk-api-lifecycle` if contract change |
| "add feature" + DB | Route `qk-feature-delivery` with `qk-data-lifecycle` in pipeline |
| "optimize" without context | Ask: "DB performance or code quality?" |
