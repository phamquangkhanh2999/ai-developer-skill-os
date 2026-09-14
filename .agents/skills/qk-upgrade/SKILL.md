---
# ── Identity ───────────────────────────────────────────────
name: qk-upgrade
version: 9.2.0
status: stable
description: "Nâng cấp library/framework an toàn — incremental strategy, audit breaking changes, rollback plan bắt buộc, không big-bang update. Dùng skill này khi user nhắc đến: upgrade, nâng cấp thư viện, update package, migrate framework, version, cập nhật dependency, breaking change — kể cả khi chỉ nói 'nâng Next.js lên bản mới nhất'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── Classification ─────────────────────────────────────────
type: capability

intent:
  - library-upgrade
  - framework-migration
  - dependency-management

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: true

triggers:
  - "upgrade"
  - "nâng cấp thư viện"
  - "update package"
  - "migrate framework"
  - "version"
  - "cập nhật dependency"
  - "breaking change"


# ── References ─────────────────────────────────────────────
workflow: refactor

rules:
  - global
  - coding
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-project-health   # Chạy trước để biết tech debt tổng thể
  - qk-refactor         # Dùng sau upgrade để clean code dùng deprecated API
  - qk-test-engineering # Verify không có regression sau upgrade

knowledge_scope:
  owns:
    - upgrade-strategy
    - rollback-plan
    - migration-path
    - breaking-change-analysis
  references:
    - testing
    - architecture
    - security
    - anti-patterns

# ── Verification ───────────────────────────────────────────
verification:
  required: true
  strategy: refactor

selection:
  priority: medium
  confidence_threshold: 0.85

# ── Runtime ────────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, report, plan]
consumes: [context-graph, source-code]

token_budget:
  max_files_read: 6
  max_lines_per_read: 120
  max_shell_commands: 3
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-upgrade — Safe Library & Framework Upgrade

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions

Trước khi bắt đầu, AI PHẢI xác nhận:

- [ ] Biết version hiện tại và version target
  → Đọc `package.json` / `requirements.txt` / `go.mod` / `Cargo.toml`
- [ ] Biết changelog / migration guide của version target
  → Search official docs hoặc GitHub releases
- [ ] Có test suite để verify regression (unit test, E2E, hoặc ít nhất manual smoke test)
  → Nếu không có test: `BLOCKED` với warning — upgrade không có safety net
- [ ] Git working tree clean (không có uncommitted changes)
  → Nếu dirty: `BLOCKED` — yêu cầu commit hoặc stash trước

**Risk classification:**
- `patch` (1.2.3 → 1.2.4): low — thường safe, proceed autonomously
- `minor` (1.2.x → 1.3.x): medium — check deprecations, report trước
- `major` (1.x → 2.x): high — PHẢI có rollback plan, confirm với user

---

## Scope

✅ Skill này làm:
- Phân tích breaking changes giữa version hiện tại và target
- Lên migration plan từng bước (không big-bang)
- Update dependency files
- Sửa code dùng deprecated/removed API
- Verify sau upgrade (chạy test, check build)
- Tạo rollback instructions

❌ Skill này KHÔNG làm:
- Refactor business logic không liên quan đến upgrade
- Thêm feature mới trong khi upgrade
- Upgrade nhiều major versions cùng lúc (→ chia nhỏ thành nhiều tasks)
- Deploy lên production (→ `qk-production-release`)

---

## Execution Steps

### Step 1 — Audit hiện trạng
```
Inputs:  package.json / lock file / dependency manifest
Actions:
  - List tất cả dependencies + version hiện tại
  - Xác định dependency cần upgrade (target) + version muốn lên
  - Check transitive dependencies có bị ảnh hưởng không
  - Tìm migration guide chính thức
Outputs: Upgrade scope + risk level
Exit: BLOCKED nếu không tìm được migration guide cho major upgrade
```

### Step 2 — Phân tích Breaking Changes
```
Inputs:  Changelog / migration guide / GitHub releases
Actions:
  - List tất cả breaking changes giữa current → target version
  - Categorize: API removed / renamed / signature changed / behavior changed
  - Grep codebase để đếm số lần dùng từng API bị ảnh hưởng
  - Ước tính effort (số file, số thay đổi)
Outputs: Breaking change inventory + impact assessment
```

### Step 3 — Lên Migration Plan
```
Inputs:  Breaking change inventory
Actions:
  - Chia thành phases nếu major upgrade (không làm tất cả 1 lần)
  - Phase 1: Update dependency, fix compile errors
  - Phase 2: Replace deprecated API
  - Phase 3: Adopt new patterns (optional, separate task)
  - Viết rollback command rõ ràng
Outputs: Phased migration plan + rollback instructions
Human checkpoint: Confirm plan trước khi thực thi (nếu major upgrade)
```

### Step 4 — Execute Migration
```
Actions:
  4a. Update version trong dependency file
  4b. Chạy package manager install
  4c. Fix compile errors / type errors theo thứ tự từ entry point
  4d. Replace deprecated API calls (grep → replace có kiểm soát)
  4e. Không refactor code không liên quan — chỉ làm đủ để build pass

Rules:
  - Mỗi phase phải build và test pass trước khi sang phase tiếp
  - Không dùng `// @ts-ignore` để ẩn lỗi type
  - Không dùng `any` để workaround type conflict
  - Document lý do nếu phải dùng compatibility shim tạm thời
```

### Step 5 — Verify
```
Actions:
  - Chạy build: không có compile error
  - Chạy test suite: không có regression
  - Smoke test manual những path quan trọng nhất
  - So sánh bundle size / performance nếu có tool
  - Review diff cuối: không có thay đổi không liên quan
Outputs: Verification report (pass/fail per check)
Exit: FAILED nếu test regression, đính kèm rollback instructions
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết stack. Cung cấp target version — AI lo phân tích và plan.

```
Package:    [Tên thư viện / framework cần upgrade]
Từ:         [Version hiện tại — vd: 4.x]
Lên:        [Version target — vd: 5.0]
Lý do:      [Bug fix / security patch / new feature / EOL]
Test suite: [Có / Không / Partial — vd: "có Jest unit tests, không có E2E"]
Deadline:   [Urgent / Can plan carefully]
```

---

### Theo Stack:

**Node.js / TypeScript — Major upgrade (Express 4 → 5)**
```
Package:    Express
Từ:         4.18.x
Lên:        5.0.0
Lý do:      Security patches + async error handling native
Test suite: Có Jest + Supertest cho API routes
Deadline:   Can plan carefully
```
→ AI phân tích: async middleware error handling thay đổi (không cần try/catch),
  `req.query` parsing thay đổi, path-to-regexp breaking changes,
  deprecated `res.json()` overloads, router API changes.
  Plan: Phase 1 — update + fix types, Phase 2 — adopt async handlers,
  Phase 3 — remove compatibility workarounds.

**Python — Minor upgrade (FastAPI 0.100 → 0.110)**
```
Package:    FastAPI + Pydantic
Từ:         fastapi==0.100, pydantic==1.10
Lên:        fastapi==0.110, pydantic==2.x
Lý do:      Pydantic v2 performance 5-50x nhanh hơn
Test suite: Có pytest + httpx async tests
Deadline:   Can plan carefully
```
→ AI phân tích: Pydantic v2 breaking changes (validators syntax, model_config,
  Field() params), FastAPI Pydantic v2 compatibility layer,
  `orm_mode` → `model_config = ConfigDict(from_attributes=True)`.
  Plan: Phase 1 — upgrade Pydantic, fix models, Phase 2 — remove compat layer.

**Frontend — Major upgrade (React 17 → 18)**
```
Package:    React + ReactDOM
Từ:         17.0.2
Lên:        18.x
Lý do:      Concurrent features + automatic batching
Test suite: Có Vitest + React Testing Library
Deadline:   Urgent (security)
```
→ AI phân tích: `ReactDOM.render` → `createRoot`, `ReactDOM.hydrate` → `hydrateRoot`,
  Strict Mode double-invoke effects (test side effects), auto-batching setState
  (có thể break code expect sync update), Suspense behavior changes.

**Database ORM — Minor upgrade (Prisma 4 → 5)**
```
Package:    Prisma
Từ:         4.x
Lên:        5.x
Lý do:      Performance improvements + new features
Test suite: Có Jest + Prisma test utilities
Deadline:   Can plan carefully
```
→ AI phân tích: `rejectOnNotFound` removed → dùng `findUniqueOrThrow`,
  `jsonProtocol` now default (check binary targets),
  `db push --accept-data-loss` behavior change,
  type changes trong `Prisma.XxxWhereInput`.

**Data / Python ecosystem — Major (Python 3.9 → 3.12)**
```
Package:    Python runtime + dependencies
Từ:         3.9
Lên:        3.12
Lý do:      EOL approach + performance gains
Test suite: Có pytest full suite
Deadline:   Can plan carefully
```
→ AI phân tích: deprecated stdlib modules (distutils removed),
  `typing` module changes (use built-in generics `list[str]` thay `List[str]`),
  f-string improvements, asyncio API changes,
  check requirements.txt compatibility với 3.12 (numpy, pandas versions).

**DevOps — Upgrade CI runner (ubuntu-20.04 → ubuntu-24.04)**
```
Package:    GitHub Actions ubuntu runner
Từ:         ubuntu-20.04
Lên:        ubuntu-24.04
Lý do:      ubuntu-20.04 EOL
Test suite: Workflow chạy được là pass
Deadline:   Urgent (EOL)
```
→ AI phân tích: Node.js bundled version thay đổi, Python 2 removed,
  OpenSSL version differences (affect TLS), apt package names thay đổi,
  action versions cần update (actions/setup-node@v3 → v4).
