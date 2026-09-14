# AI Developer Skill OS v9.3.1

> **v9.3.1 "EDAOS v9.3 — SSOT Trigger Discipline, 4-Tier Execution & Visual Terminal Rendering"**

Phiên bản **v9.3.0** mang đến 5 nâng cấp chuẩn mực kỹ thuật toàn diện cho hệ điều hành AI coding agent:
1. **SSOT 2-Clause Trigger Standard (Anthropic Standard)** — Đồng bộ 100% mô tả kích hoạt theo cấu trúc 2 vế (Năng lực cốt lõi + Cụm từ/ngữ cảnh kích hoạt thực tế) trên cả Frontmatter `SKILL.md`, danh sách `triggers` và Quick Table routing trong `.agents/AGENTS.md`.
2. **Full-Body 4 Tầng Khép Kín (Closed-loop Body Structure)** — Toàn bộ 29 active skills được trang bị đầy đủ 4 tầng nội dung: Preconditions, Scope (In/Out-of-scope), Pipeline thực thi từng bước, và Prompt Templates theo Role.
3. **Phân định ranh giới kỹ thuật (Boundary Disambiguation)** — Loại bỏ hoàn toàn sự chồng lấn/mơ hồ giữa các cặp kỹ năng (`qk-project-audit` vs `qk-project-health`, `qk-ui-audit` vs `qk-web-quality-gate`, `qk-access-policy` vs `qk-security-audit`).
4. **Governed Skill Restructuring (29 Active, 2 Archived, 2 Relocated)** — Quy hoạch 29 Active skills, Archive 2 skills (`qk-frontend-architecture`, `qk-agent-observability`), Relocate 2 skills (`qk-engineering-standard` sang rules, `qk-validation-gate` sang eval runner), và bảo toàn 3 legacy skills v9.1.
5. **Direct Terminal Visual Rendering (Unicode/ASCII Box Drawing)** — Chuẩn hóa hiển thị trực quan sơ đồ kiến trúc, flowchart trực tiếp ngay trong giao diện terminal.

---

## Bắt đầu nhanh

### Bước 1 — Khai báo role và stack một lần

Tạo file `.agents/DEV_PROFILE.md` trong dự án:

```yaml
role: fullstack          # fe | be | fullstack | data | ai-engineer | devops
stack:
  frontend:  Next.js 14 + TypeScript
  backend:   tRPC + Prisma
  database:  PostgreSQL
  css:       Tailwind CSS
ai_style: concise        # concise | detailed | teaching
```

AI sẽ đọc file này trước mọi yêu cầu — không cần nhắc lại stack mỗi lần.

### Bước 2 — Gọi skill

```bash
# Cú pháp command
./qk-feature-delivery
./qk-bug-resolution
./qk-api-lifecycle --fw=fastapi

# Hoặc ngôn ngữ tự nhiên — AI tự route đúng skill
"fix bug login crash"
"viết api tạo đơn hàng"
"refactor file UserService.ts quá dài"
```

### Cài đặt

```bash
# NPX (không cần cài global)
npx ai-developer-skill-os init

# NPM global
npm i -g ai-developer-skill-os

# Với tham số IDE
npx ai-developer-skill-os init --ide=cursor --scope=1
npx ai-developer-skill-os init --ide=windsurf --scope=1
npx ai-developer-skill-os init --ide=antigravity --scope=2
```

**IDE được hỗ trợ:** Cursor · Windsurf · Cline / Roo Code · Antigravity · Kilo Code · Codex

---

## Kiến trúc v9.3

```
.agents/
├── DEV_PROFILE.md        ← Khai báo role + stack (đọc đầu mỗi session)
├── AGENTS.md             ← Entry point: SSOT routing table + role behavior matrix
├── GEMINI.md             ← Quy định riêng cho Antigravity (Terminal ASCII Diagrams, etc.)
├── skills/               ← 29 active skills (mỗi skill có SKILL.md 4 tầng chuẩn mực)
├── workflows/            ← 10 execution pipelines
├── rules/                ← Behavior policies (coding, safety, security, anti-patterns...)
├── registry/             ← Generated indexes (index.yaml, graph.json — sinh tự động)
├── knowledge/            ← Design intelligence + domain patterns
└── blueprints/           ← Project scaffold templates
```

### Role Behavior Matrix

| Role | AI tập trung vào | AI bỏ qua |
|---|---|---|
| `fe` | Component arch, state, a11y, bundle size | DB schema, backend arch |
| `be` | API contract, business logic, DB perf, security | CSS, UI layout |
| `fullstack` | FE+BE end-to-end, type-safe contract | Over-engineering, microservices không cần thiết |
| `data` | Idempotency, data quality, lineage, SLA | Application ORM, UI |
| `ai-engineer` | Prompt eng, RAG arch, eval pipeline, hallucination | Standard CRUD |
| `devops` | CI/CD, IaC, observability, rollback plan | Business logic, UI |

---

## Danh mục 29 Active Skills (v9.3.0)

### 1. Core & Orchestration (4 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-orchestrator` | Điều hướng yêu cầu của người dùng đến đúng skill với kỷ luật thép — phân tích intent, kiểm tra preconditions và routing table. |
| `qk-context-loader` | Khảo sát kiến trúc codebase, phân tích import graph, lập bản đồ phụ thuộc và tải context chính xác trước khi code — ngăn hallucination kiến trúc. |
| `qk-project-memory` | Quản trị Tri thức và Bộ nhớ dự án (Local Private Mode) — Quản lý tại `.ai-local/` như source code: tự động khởi tạo, bảo mật gitignore, có thể review. |
| `qk-project-bootstrap` | Khởi tạo dự án mới HOẶC setup `DEV_PROFILE.md` cho dự án đang chạy — auto-detect stack từ manifest files, không hỏi lại những gì đã đọc được. |

### 2. Product & Analysis (2 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-product-specification` | Tư duy phát triển sản phẩm: biến ý tưởng sơ khai thành yêu cầu kỹ thuật chi tiết (Idea → Requirement → Acceptance Criteria → Technical Spec). |
| `qk-project-audit` | Phân tích toàn diện dự án: Gap Analysis, Feasibility, Risk Assessment — báo cáo trước khi code. *(Không dùng cho đo lường code smell của code đang chạy)* |

> *Ghi chú:* `qk-frontend-architecture` đã được lưu trữ (Archived) — quy hoạch vào `qk-design-system-engineering` và `qk-ui-builder`.

### 3. Frontend & UI (5 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-ui-builder` | Xây dựng, sửa, audit, và hoàn thiện UI component từ Figma/ảnh/mô tả layout — responsive, chuẩn token, đầy đủ hover/active/loading states. |
| `qk-ui-system-builder` | Xây dựng Design System và token library từ `DESIGN.md` — không tự đặt ra token ngoài contract. |
| `qk-design-system-engineering` | Quản trị hệ thống thiết kế (Định nghĩa quy tắc hệ thống, tokens, các biến thể component, governance). |
| `qk-api-consumer` | Consume API (REST/GraphQL/tRPC), quản lý State, xử lý loading/error/empty states, bind vào UI — tuân thủ kiến trúc dự án. |
| `qk-ui-audit` | Kiểm toán chất lượng thiết kế UI với 57-check Anti-Slop checklist: spacing nhất quán, contrast ratio, component polish, interaction states. *(Không dùng cho WCAG a11y hay SEO)* |

### 4. Backend & Data (5 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-api-lifecycle` | Thiết kế và implement API endpoint mới với Zero-Trust — contract trước, code sau. |
| `qk-data-lifecycle` | Quản lý Schema và Migration cơ sở dữ liệu an toàn — schema freeze, backward-compatible migrations, zero-downtime deployment. |
| `qk-data-engineer` | Thiết kế và implement data pipeline với best practices: idempotency, data quality gate, lineage, incremental processing. |
| `qk-access-policy` | Quản lý và thiết lập chính sách phân quyền RBAC/ABAC, định nghĩa permission matrix, sinh auth middleware bảo vệ endpoint. |
| `qk-db-optimizer` | Tối ưu hiệu năng Database dựa trên bằng chứng kỹ thuật: phân tích EXPLAIN/ANALYZE, phát hiện N+1 queries, thiết kế Index, refactor slow query. |

### 5. Engineering & Delivery (5 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-feature-delivery` | Phát triển tính năng mới end-to-end: Requirements → Context → Design → Implement → Self-audit. |
| `qk-bug-resolution` | Sửa lỗi bằng chu trình khép kín: Observe → Hypothesize → Evidence → Fix → Verify. |
| `qk-refactor` | Tái cấu trúc code để dễ bảo trì, dễ test hơn — không thay đổi external behavior (extract, simplify, decouple). |
| `qk-upgrade` | Nâng cấp library/framework an toàn — incremental strategy, audit breaking changes, rollback plan bắt buộc. |
| `qk-docs` | Khởi tạo và duy trì tài liệu kỹ thuật chuẩn xác (README, API docs, architecture guides, JSDoc) — cam kết đồng bộ 100% với code thực tế. |

### 6. Quality & Testing (4 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-test-engineering` | Thiết kế chiến lược kiểm thử toàn diện và viết bộ test tự động: Test Pyramid (Unit, Integration, E2E), Mocking, Edge cases. |
| `qk-project-health` | Kiểm toán toàn diện sức khỏe dự án: đo lường Code Smells, Technical Debt, độ phức tạp Cyclomatic, God files, vi phạm SOLID — chấm điểm Health Score (0–100). |
| `qk-code-review` | Review code, AI config, hoặc skin rules theo 4 phases với Architect mindset — phát hiện bug, security issue, architecture smell. |
| `qk-web-quality-gate` | Đo lường chất lượng kỹ thuật Web: Accessibility violations (WCAG), Core Web Vitals, Lighthouse score, SEO tags, security headers. |

> *Ghi chú:*
> - `qk-engineering-standard` đã được chuyển vị trí (Relocated) thành **Behavior Policy Rule** tại `.agents/rules/coding.md`.
> - `qk-validation-gate` đã được chuyển vị trí (Relocated) thành **Eval Pipeline Script** tại `evals/runner.js`.

### 7. Security, DevOps & AI (4 skills)
| Skill | Mô tả theo chuẩn SSOT (2-clause) |
|---|---|
| `qk-security-audit` | Audit bảo mật ứng dụng theo OWASP: phát hiện lỗ hổng, secret leak, dependency risk, permission model — xuất report + remediation plan. |
| `qk-devops-platform` | Kỹ sư nền tảng: Chiến lược CI/CD, kiến trúc triển khai, quản lý môi trường và chiến lược rollback. |
| `qk-production-release` | Chuẩn bị release production với 8-gate checklist bắt buộc — không pass gate = không deploy. |
| `qk-ai-builder` | Thiết kế và implement AI Agent hoặc RAG pipeline với eval criteria bắt buộc. |

> *Ghi chú:* `qk-agent-observability` đã được lưu trữ (Archived) — tích hợp theo dõi vào test runner & runtime telemetry.

---

## Changelog

### v9.3.1 (2026-09-14) — EDAOS v9.3: Documentation & Governance Release
- **Đồng bộ toàn diện tài liệu:** Cập nhật `README.md` và `CHANGELOG.md` đầy đủ chuẩn mực v9.3.
- **SSOT 2-Clause Trigger Standard:** Áp dụng chuẩn Anthropic 2-vế cho toàn bộ 29 active skills, đồng bộ hoàn toàn giữa frontmatter `description`, `triggers` array và Quick Table trong `.agents/AGENTS.md`.
- **Closed-Loop 4-Tier Execution Body:** Xóa bỏ toàn bộ 22 empty stubs, hoàn thiện đủ 4 phần (Preconditions, Scope, Steps, Prompt Templates).
- **Boundary Disambiguation:** Phân định ranh giới rõ ràng giữa các cặp skill dễ nhầm lẫn (`qk-project-audit` vs `qk-project-health`, `qk-ui-audit` vs `qk-web-quality-gate`, `qk-access-policy` vs `qk-security-audit`).
- **Skill Restructuring & Governance:**
  - Quy hoạch 29 Active Skills chính thức.
  - Archive 2 skills: `qk-frontend-architecture`, `qk-agent-observability`.
  - Relocate 2 skills: `qk-engineering-standard` (thành Policy Rule `.agents/rules/coding.md`), `qk-validation-gate` (thành Eval Script `evals/runner.js`).
  - Bảo toàn 3 legacy skills v9.1 (`qk-fe-api-integration`, `qk-help`, `qk-system-evolution`).
- **Terminal Visual Rendering:** Quy định trong `GEMINI.md` về việc bắt buộc render sơ đồ/kiến trúc trực tiếp bằng Unicode/ASCII box drawing trong terminal.
- **Vitest Isolation:** Thêm `vitest.config.js`, cô lập runner khỏi IDE worktrees (`.kilo/`), đảm bảo 10/10 test suites pass trong <1s.

### v9.2.0 (2026-09-11)
- **Thêm:** `DEV_PROFILE.md` — role + stack context file, AI đọc đầu mỗi session
- **Thêm:** Role Behavior Matrix trong `AGENTS.md` — 6 roles với focus/depth/skip
- **Thêm:** Prompt templates theo role trong 7 key skills
- **Đổi tên:** `qk-fe-api-integration` → `qk-api-consumer` (rõ hơn, không FE-only)
- **Đổi tên:** `qk-system-evolution` → `qk-upgrade` (đúng mục đích thực tế)
- **Đổi tên:** `qk-project-analyst` → `qk-project-audit` (rõ output là audit report)
- **Đổi tên workflow:** `skill-evolution.yml` → `skin-governance.yml`
- **Đổi tên workflow:** `research.yml` → `context-discovery.yml`
- **Xóa:** `qk-help` (deprecated từ v8.0, superseded bởi `qk-orchestrator`)
- **Xóa:** `.ai-local/` Self-Init Protocol khỏi tất cả SKILL.md (giảm token overhead)
- **Fix:** Compact routing table trong `AGENTS.md` — không cần đọc `skills-index.yml`

### v9.1.x (2026-08-03)
- O(1) registry engine, Universal Project Knowledge V1

### v9.0.0 (2026-07-01)
- V9 schema migration, manifest-first architecture

---

## Đánh giá tự động

```bash
npm test                # Vitest runner (10/10 suites pass isolated)
npm run test:registry   # Registry consistency check
npm run test:graph      # Capability graph validation
npm run eval:all        # Toàn bộ AI capability eval scorecards
```
