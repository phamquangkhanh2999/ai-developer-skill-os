# AI Developer Skill OS v9.4.0 — Lean Core Edition

> **v9.4.0 "Lean Core Revolution & Antigravity Cockpit Integration"**

Phiên bản **v9.4.0** giải quyết triệt để vấn đề phân mảnh quá mức (extreme fragmentation) từ 37 thư mục vi kỹ năng (micro-skills) xuống còn **9 Core Super-Skills** mạnh mẽ, không làm mất bất kỳ tính năng chuyên sâu nào, đồng thời tối ưu hóa toàn diện cho IDE Antigravity.

---

## Điểm Nổi Bật Của v9.4.0

1. **Quy Hoạch 9 Core Super-Skills**: Hợp nhất logic toàn diện từ 37 thư mục cũ vào 9 khối năng lực domain chuyên sâu:
   - `qk-orchestrator`: Điều phối, nạp ngữ cảnh kiến trúc (Context Graph) và khởi tạo dự án (Bootstrap).
   - `qk-product-spec`: Phân tích yêu cầu, PRD, BDD/Gherkin acceptance criteria và Gap Analysis/Khả thi.
   - `qk-feature-delivery`: Phát triển tính năng end-to-end, tích hợp API client, state management và giao tiếp FE-BE.
   - `qk-bug-resolution`: Chẩn đoán và xử lý bug bằng chu trình khép kín 5 bước (Observe → Hypothesize → Evidence → Fix → Verify).
   - `qk-ui-engineer`: Xây dựng UI chuẩn Design Tokens, tối ưu hoá tương tác, responsive và kiểm toán 57 tiêu chí Anti-Slop.
   - `qk-backend-data`: Thiết kế REST/tRPC API, Schema & Migration an toàn, phân quyền RBAC/ABAC, tối ưu EXPLAIN database và Data Pipeline (ETL/dbt).
   - `qk-code-review`: Kiểm toán mã nguồn kiến trúc, chấm điểm sức khỏe Codebase Health Score (0–100), bảo mật OWASP Top 10 và chất lượng Web (WCAG 2.1 AA, Core Web Vitals).
   - `qk-code-cleaner`: Tái cấu trúc sạch sẽ (SOLID, giải phóng God files >300L), nâng cấp thư viện an toàn (có Rollback plan) và kỹ nghệ kiểm thử tự động (Test Pyramid).
   - `qk-devops-release`: Vận hành Platform (Docker, CI/CD GitHub Actions), cổng kiểm soát phát hành 8-Gate Production, đồng bộ tài liệu (README/OpenAPI), bộ nhớ dự án (`.ai-local/`, `/learn`) và kiến trúc AI/RAG.
2. **Hỗ Trợ Toàn Diện 14 Senior Roles**: Fullstack, Backend, Frontend, Data Engineer, Data Analyst, Data Architect, Data Scientist, DevOps, QA, Product Manager, Business Analyst, UI/UX Designer, AI/ML Engineer, Business Manager.
3. **Antigravity Cockpit Optimization**:
   - **Interactive Planning Mode**: Tự động kích hoạt modal và nút **[Proceed]** trên Antigravity trước khi thay đổi mã nguồn lớn (complexity ≥ Medium).
   - **Artifact Dual-Stream Reporting**: Tránh spam hàng trăm dòng vào cửa sổ Chat; xuất báo cáo chi tiết vào file Artifact (`review_report.md`, `health_scorecard.md`) và in bản Tóm tắt điều hành 15–25 dòng vào chat.
   - **Dynamic Workspace Path Links**: Toàn bộ đường dẫn file được định dạng theo chuẩn `file:///<workspace-root>/...` dùng forward slash, click mở ngay lập tức trong editor.
   - **Ascii / Unicode Diagram Rendering**: Vẽ sơ đồ kiến trúc và luồng dữ liệu trực tiếp trong terminal bằng Unicode Box Drawing.

---

## Cấu Trúc Hệ Thống

```
.agents/
├── DEV_PROFILE.md        ← Khai báo role + stack của bạn (AI đọc đầu mỗi session)
├── AGENTS.md             ← Entry point: Quick Routing Table 9 Super-Skills + 14 Roles Matrix
├── GEMINI.md             ← Quy chuẩn cockpit riêng cho Antigravity IDE
├── skills/               ← 9 Core Super-Skills (mỗi skill có SKILL.md độc lập)
│   ├── qk-orchestrator/
│   ├── qk-product-spec/
│   ├── qk-feature-delivery/
│   ├── qk-bug-resolution/
│   ├── qk-ui-engineer/
│   ├── qk-backend-data/
│   ├── qk-code-review/
│   ├── qk-code-cleaner/
│   └── qk-devops-release/
├── workflows/            ← 9 execution pipelines liên kết trực tiếp
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
./qk-product-spec              # Viết PRD, user stories, acceptance criteria
./qk-feature-delivery          # Phát triển tính năng mới end-to-end
./qk-bug-resolution            # Sửa bug và điều tra nguyên nhân gốc
./qk-ui-engineer               # Thiết kế UI, tokens, audit anti-slop
./qk-backend-data              # Viết API, schema migration, tối ưu DB, pipeline
./qk-code-review               # Review code, health score (0-100), OWASP, WCAG
./qk-code-cleaner              # Refactor God files, nâng cấp library, viết test
./qk-devops-release            # Docker, CI/CD, 8-gate release, docs, RAG

# Hoặc dùng ngôn ngữ tự nhiên — AI tự động nhận diện:
"fix bug crash màn hình checkout"         → qk-bug-resolution
"thiết kế api đặt hàng và migration db"   → qk-backend-data
"review bảo mật và đo nợ kỹ thuật dự án"  → qk-code-review
"tách file UserService.ts bị quá dài"     → qk-code-cleaner
"chuẩn bị release lên production"         → qk-devops-release
```

---

## Danh Mục 9 Core Super-Skills

| Super-Skill | Phụ Đề Dev (Nhiệm vụ cốt lõi) | Phạm vi & Năng lực thực chiến | Các kỹ năng cũ đã hợp nhất |
|---|---|---|---|
| `qk-orchestrator` | **Điều hướng & Context** | Điều phối tổng thể, nạp context đồ thị phụ thuộc (Context Graph), khởi tạo cấu hình dự án (Bootstrap) | `qk-orchestrator`, `qk-context-loader`, `qk-project-bootstrap`, `qk-help` |
| `qk-product-spec` | **Viết Spec & PRD** | Đặc tả sản phẩm, phân tích PRD, Acceptance Criteria (BDD/Gherkin), Gap Analysis và Đánh giá tính khả thi | `qk-product-specification`, `qk-project-audit` |
| `qk-feature-delivery` | **Build Feature mới** | Phát triển tính năng mới trọn gói, tích hợp API Client, xử lý loading/error states, quản lý State | `qk-feature-delivery`, `qk-api-consumer`, `qk-fe-api-integration` |
| `qk-bug-resolution` | **Debug & Fix Bug** | Chẩn đoán và dập lỗi theo chu trình khép kín 5 bước, loại bỏ giả định mù quáng | `qk-bug-resolution` |
| `qk-ui-engineer` | **Build UI & Component** | Xây dựng UI component chuẩn Design Tokens, tương tác micro-animations, kiểm toán 57 tiêu chí Anti-Slop | `qk-ui-builder`, `qk-design-system-engineering`, `qk-ui-system-builder`, `qk-ui-audit`, `qk-frontend-architecture` |
| `qk-backend-data` | **API & Database** | Kiến trúc REST/tRPC API, Database Schema & Migration an toàn, phân quyền RBAC/ABAC, tối ưu EXPLAIN query, Data Pipeline (ETL/dbt) | `qk-api-lifecycle`, `qk-data-lifecycle`, `qk-access-policy`, `qk-db-optimizer`, `qk-data-engineer` |
| `qk-code-review` | **Review Code & Audit** | Đánh giá mã nguồn kiến trúc, đo lường chỉ số nợ kỹ thuật (Health Score 0–100), quét bảo mật OWASP Top 10, kiểm toán chất lượng Web WCAG AA | `qk-code-review`, `qk-project-health`, `qk-security-audit`, `qk-web-quality-gate`, `qk-validation-gate` |
| `qk-code-cleaner` | **Refactor & Viết Test** | Tái cấu trúc sạch (SOLID, phân tách God files >300L), nâng cấp thư viện tiệm tiến (kèm Rollback plan), kỹ nghệ kiểm thử tự động (Test Pyramid) | `qk-refactor`, `qk-upgrade`, `qk-system-evolution`, `qk-test-engineering`, `qk-engineering-standard` |
| `qk-devops-release` | **DevOps, CI/CD & Deploy** | Nền tảng CI/CD (Docker, GitHub Actions), cổng kiểm soát phát hành 8-Gate Release, đồng bộ tài liệu (README, OpenAPI), bộ nhớ dự án (`.ai-local/`), AI/RAG Pipeline | `qk-devops-platform`, `qk-production-release`, `qk-docs`, `qk-project-memory`, `qk-ai-builder`, `qk-agent-observability` |

---

## Công Cụ & Scripts Quản Trị

```bash
# Tái tạo runtime registry O(1) từ 9 Super-Skills:
node tooling/build-registry.js
```
