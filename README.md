# AI Developer Skill OS v11.0.0 — Lean 5-Core Skills Architecture

> **v11.0.0: Tinh gọn 11 xuống 5 Core Skills, nạp tài liệu chuyên môn theo nhu cầu và quản lý migration an toàn.**

## Kiến Trúc Lean 5 Core Skills trong v11.0.0

- **5 Core Skills chính:**
  1. `qk-feature-delivery`: Xây dựng tính năng mới, đổi yêu cầu, tích hợp API, lập đặc tả (chế độ plan-only, discovery-only, prompt-only).
  2. `qk-bug-resolution`: Chẩn đoán nguyên nhân gốc rễ và sửa lỗi mã nguồn theo chu trình khép kín: Observe → Evidence → Cause → Minimal Fix → Verify.
  3. `qk-code-review`: Kiểm toán mã nguồn và bảo mật chỉ đọc (Read-Only) với bằng chứng cụ thể.
  4. `qk-code-cleaner`: Tái cấu trúc bảo toàn hành vi (Zero Behavior Change), nâng cấp thư viện an toàn và viết test.
  5. `qk-devops-release`: Vận hành nền tảng CI/CD, Docker, phát hành có rollback, cập nhật tài liệu và quản lý memory khi được yêu cầu.

- **Tài liệu tham khảo chuyên môn (On-demand References):**
  - Đặt tại `.agents/references/`: `requirements.md`, `ui.md`, `backend-data.md`, `api-discovery.md`, `prompt-authoring.md`, `context-discovery.md`.
  - Nạp khi cần thiết, không làm phình context ban đầu.

- **Ánh xạ lệnh cũ (Legacy Aliases):**
  - Khai báo tại `.agents/skill-aliases.yml`: chuyển hướng các tên lệnh cũ (`qk-ui-engineer`, `qk-backend-data`, `qk-api-data-discovery`, `qk-product-spec`, `qk-prompt-compiler`, `qk-orchestrator`) về core skill và reference tương ứng.
  - Bảo đảm các chế độ không sinh code: `plan-only`, `prompt-only`, `discovery-only`.

- **Quản lý phát hành & Migration Manifest:**
  - File quản lý `.ai-skill-os-managed.json` tự động theo dõi checksum của mọi file hệ thống.
  - Khi nâng cấp: tự động dọn sạch các file cũ đã retire mà người dùng không sửa đổi, đồng thời bảo toàn 100% file custom và private memory (`DEV_PROFILE.md`, `.ai-local/`).

### Nâng cấp và cài đặt

```bash
npx ai-developer-skill-os@11.0.0 --ide=antigravity --scope=local --force
```

Installer backup toàn bộ thư mục đích trước khi cập nhật, hỗ trợ rollback tức thì.

---

## Cấu Trúc Hệ Thống

```
.agents/
├── DEV_PROFILE.md        ← Khai báo role + stack của bạn (AI đọc đầu mỗi session)
├── AGENTS.md             ← Entry Point chính điều phối đến 5 Core Skills
├── skill-aliases.yml     ← Ánh xạ lệnh cũ sang 5 core skills
├── skills/               ← 5 Core Skills
├── references/           ← Tài liệu chuyên môn nạp theo nhu cầu (UI, Backend, API, Spec)
├── workflows/            ← Workflows thực thi tương ứng
├── rules/                ← Hợp đồng thực thi chung (global.md, safety, security...)
└── registry/             ← Metadata và graph được tạo tự động (index.yaml, graph.json)
```
├── AGENTS.md             ← Entry point: Quick Routing Table 9 Super-Skills + 14 Roles Matrix
├── GEMINI.md             ← Quy chuẩn cockpit riêng cho Antigravity IDE
├── skills/               ← 11 Core Super-Skills (mỗi skill có SKILL.md độc lập)
│   ├── qk-orchestrator/
│   ├── qk-prompt-compiler/
│   ├── qk-product-spec/
│   ├── qk-feature-delivery/
│   ├── qk-bug-resolution/
│   ├── qk-ui-engineer/
│   ├── qk-backend-data/
│   ├── qk-api-data-discovery/
│   ├── qk-code-review/
│   ├── qk-code-cleaner/
│   └── qk-devops-release/
├── workflows/            ← 10 execution pipelines liên kết trực tiếp
├── rules/                ← Behavior policies (global, coding, safety, security...)
└── registry/             ← Index O(1) sinh tự động (index.yaml, graph.json)
```

---

## Bắt Đầu Nhanh

### Bước 1 — Khai báo role và stack một lần

Tạo hoặc chỉnh sửa `.agents/DEV_PROFILE.md` trong dự án của bạn:

```yaml
role: fullstack          # fe | be | fullstack | data | ai-engineer | devops | qa | pm | ba...
stack:
  frontend:  Next.js 15 + TypeScript
  backend:   Node.js + Fastify / NestJS
  database:  PostgreSQL + Prisma
  css:       Tailwind CSS
ai_style: concise        # concise | detailed | teaching
```

### Bước 2 — Gọi Super-Skill

```bash
# Kích hoạt bằng lệnh trực tiếp:
./qk-orchestrator              # Điều phối, nạp ngữ cảnh dự án
./qk-prompt-compiler           # Biên dịch & chuẩn hóa prompt (hiển thị trước khi code)
./qk-product-spec              # Viết PRD, user stories, acceptance criteria
./qk-feature-delivery          # Phát triển tính năng mới end-to-end
./qk-bug-resolution            # Sửa bug và điều tra nguyên nhân gốc
./qk-ui-engineer               # Thiết kế UI, tokens, audit anti-slop
./qk-backend-data              # Viết API, schema migration, tối ưu DB, pipeline
./qk-api-data-discovery        # Khám phá API, Schema Discovery, Data Contract & Bronze
./qk-code-review               # Review code, health score (0-100), OWASP, WCAG
./qk-code-cleaner              # Refactor God files, nâng cấp library, viết test
./qk-devops-release            # Docker, CI/CD, 8-gate release, docs, RAG

# Hoặc dùng ngôn ngữ tự nhiên — AI tự động nhận diện:
"biên dịch lại prompt cho task này"        → qk-prompt-compiler
"fix bug crash màn hình checkout"         → qk-bug-resolution
"thiết kế api đặt hàng và migration db"   → qk-backend-data
"phân tích postman và lấy schema bronze"  → qk-api-data-discovery
"review bảo mật và đo nợ kỹ thuật dự án"  → qk-code-review
"tách file UserService.ts bị quá dài"     → qk-code-cleaner
"chuẩn bị release lên production"         → qk-devops-release
```

---

## Danh Mục 11 Core Super-Skills

| Super-Skill | Phụ Đề Dev (Nhiệm vụ cốt lõi) | Phạm vi & Năng lực thực chiến | Các kỹ năng cũ đã hợp nhất |
|---|---|---|---|
| `qk-orchestrator` | **Điều hướng & Context** | Điều phối tổng thể, nạp context đồ thị phụ thuộc (Context Graph), khởi tạo cấu hình dự án (Bootstrap) | `qk-orchestrator`, `qk-context-loader`, `qk-project-bootstrap`, `qk-help` |
| `qk-prompt-compiler` | **Biên Dịch & Chuẩn Hóa Prompt** | Bộ biên dịch câu lệnh thô (Raw Request) thành Execution Prompt 9 thành phần kỹ thuật, công khai minh bạch trước khi thực thi | *Mới* (tích hợp [PROMPT_RULES.md](./PROMPT_RULES.md)) |
| `qk-product-spec` | **Viết Spec & PRD** | Đặc tả sản phẩm, phân tích PRD, Acceptance Criteria (BDD/Gherkin), Gap Analysis và Đánh giá tính khả thi | `qk-product-specification`, `qk-project-audit` |
| `qk-feature-delivery` | **Build Feature mới** | Phát triển tính năng mới trọn gói, tích hợp API Client, xử lý loading/error states, quản lý State | `qk-feature-delivery`, `qk-api-consumer`, `qk-fe-api-integration` |
| `qk-bug-resolution` | **Debug & Fix Bug** | Chẩn đoán và dập lỗi theo chu trình khép kín 5 bước, loại bỏ giả định mù quáng | `qk-bug-resolution` |
| `qk-ui-engineer` | **Build UI & Component** | Xây dựng UI component chuẩn Design Tokens, tương tác micro-animations, kiểm toán 57 tiêu chí Anti-Slop | `qk-ui-builder`, `qk-design-system-engineering`, `qk-ui-system-builder`, `qk-ui-audit`, `qk-frontend-architecture` |
| `qk-backend-data` | **API & Database** | Kiến trúc REST/tRPC API, Database Schema & Migration an toàn, phân quyền RBAC/ABAC, tối ưu EXPLAIN query, Data Pipeline (ETL/dbt) | `qk-api-lifecycle`, `qk-data-lifecycle`, `qk-access-policy`, `qk-db-optimizer`, `qk-data-engineer` |
| `qk-api-data-discovery` | **Khám Phá API & Data Contract** | Phân tích Postman, thu thập Real Evidence, khám phá Schema & Data Dictionary, đánh giá tầng Bronze Medallion, Checkpoint dừng trước khi code | *Mới* (API-to-Data Engine & Contract Discovery) |
| `qk-code-review` | **Review Code & Audit** | Đánh giá mã nguồn kiến trúc, đo lường chỉ số nợ kỹ thuật (Health Score 0–100), quét bảo mật OWASP Top 10, kiểm toán chất lượng Web WCAG AA | `qk-code-review`, `qk-project-health`, `qk-security-audit`, `qk-web-quality-gate`, `qk-validation-gate` |
| `qk-code-cleaner` | **Refactor & Viết Test** | Tái cấu trúc sạch (SOLID, phân tách God files >300L), nâng cấp thư viện tiệm tiến (kèm Rollback plan), kỹ nghệ kiểm thử tự động (Test Pyramid) | `qk-refactor`, `qk-upgrade`, `qk-system-evolution`, `qk-test-engineering`, `qk-engineering-standard` |
| `qk-devops-release` | **DevOps, CI/CD & Deploy** | Nền tảng CI/CD (Docker, GitHub Actions), cổng kiểm soát phát hành 8-Gate Release, đồng bộ tài liệu (README, OpenAPI), bộ nhớ dự án (`.ai-local/`), AI/RAG Pipeline | `qk-devops-platform`, `qk-production-release`, `qk-docs`, `qk-project-memory`, `qk-ai-builder`, `qk-agent-observability` |

---

## Công Cụ & Scripts Quản Trị

```bash
# Tái tạo runtime registry O(1) từ 11 Super-Skills:
node tooling/build-registry.js
```
