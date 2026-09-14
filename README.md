# AI Developer Skill OS v9.2.0

> **v9.2.0 "EDAOS v9.2 — Role-Aware Execution & Semantic Naming"**

Phiên bản **v9.2.0** tập trung vào 3 nâng cấp cốt lõi:
1. **Role-Aware Execution** — AI tự động điều chỉnh chiều sâu phân tích theo role khai báo trong `DEV_PROFILE.md`
2. **Semantic Naming** — Đổi tên skills, workflows theo đúng mục đích thực tế, loại bỏ tên trừu tượng
3. **Prompt Templates theo Role** — Mỗi skill có examples cụ thể cho từng role (fe/be/fullstack/data/ai-engineer/devops)

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

## Kiến trúc v9.2

```
.agents/
├── DEV_PROFILE.md        ← Khai báo role + stack (đọc đầu mỗi session)
├── AGENTS.md             ← Entry point: routing table + role behavior matrix
├── skills/               ← 33 capabilities — mỗi skill có SKILL.md
├── workflows/            ← 10 execution pipelines
├── rules/                ← 8 behavior policies
├── registry/             ← Generated indexes (không sửa tay)
├── knowledge/            ← Design intelligence + domain patterns
└── blueprints/           ← Project scaffold templates
```

### Role Behavior Matrix

| Role | AI tập trung vào | AI bỏ qua |
|---|---|---|
| `fe` | Component arch, state, a11y, bundle size | DB schema, backend arch |
| `be` | API contract, business logic, DB perf, security | CSS, UI layout |
| `fullstack` | FE+BE end-to-end, type-safe contract | Over-engineering |
| `data` | Idempotency, data quality, lineage, SLA | Application ORM, UI |
| `ai-engineer` | Prompt eng, RAG arch, eval pipeline, hallucination | Standard CRUD |
| `devops` | CI/CD, IaC, observability, rollback | Business logic, UI |

---

## 33 Skills (v9.2.0)

### Core & Orchestration
| Skill | Mô tả |
|---|---|
| `qk-orchestrator` | Route yêu cầu đến đúng skill, kiểm tra preconditions |
| `qk-context-loader` | Load context, vẽ dependency graph trước khi code |
| `qk-project-memory` | Lưu/tra cứu project knowledge (Architecture, Convention, Pattern, Hard Bug) |
| `qk-project-bootstrap` | Khởi tạo dự án mới với Blueprint Plugins (RAG/Coding/Workflow) |

### Product & Architecture
| Skill | Mô tả |
|---|---|
| `qk-product-specification` | Idea → Requirement → Acceptance Criteria → Technical Spec |
| `qk-frontend-architecture` | Quyết định kiến trúc FE: component strategy, state, routing |
| `qk-project-audit` | Gap Analysis, Feasibility, Risk Assessment — báo cáo trước khi code |

### Frontend & UI
| Skill | Mô tả |
|---|---|
| `qk-ui-builder` | Build/edit/audit/redesign UI từ Figma/ảnh/design reference |
| `qk-ui-system-builder` | Build Design System và token library từ DESIGN.md |
| `qk-design-system-engineering` | Quản trị design system: tokens, component variants, governance |
| `qk-api-consumer` | Consume API (REST/GraphQL/tRPC), manage state, bind vào UI |
| `qk-ui-audit` | Audit UI với 57-check Anti-Slop checklist |
| `qk-web-quality-gate` | A11y, SEO, Web Performance, Security, UX Heuristics |

### Backend & Data
| Skill | Mô tả |
|---|---|
| `qk-api-lifecycle` | Design + implement API với Zero-Trust — contract trước, code sau |
| `qk-data-lifecycle` | Schema management + safe migrations (freeze → compat → cleanup) |
| `qk-data-engineer` | Data pipelines: dbt, Spark, Airflow, Delta Lake — idempotency first |
| `qk-access-policy` | RBAC/ABAC — định nghĩa role matrix trước, implement middleware sau |
| `qk-db-optimizer` | Evidence-based DB optimization: EXPLAIN → analyze → index |

### Engineering & Delivery
| Skill | Mô tả |
|---|---|
| `qk-feature-delivery` | End-to-end feature: Requirements → Context → Design → Implement |
| `qk-bug-resolution` | Closed-loop bug fix: Observe → Hypothesis → Evidence → Fix |
| `qk-refactor` | Tái cấu trúc code không đổi behavior — extract, simplify, decouple |
| `qk-upgrade` | Nâng cấp library/framework an toàn — incremental, rollback bắt buộc |
| `qk-docs` | Viết/cập nhật docs chính xác tuyệt đối — match code thực tế |

### Quality & Testing
| Skill | Mô tả |
|---|---|
| `qk-test-engineering` | Test strategy: pyramid, coverage, regression, mock |
| `qk-validation-gate` | Quality gate: linters, tests, scorecard.yaml (0–100) |
| `qk-project-health` | Audit: Code Smells, Tech Debt, Architecture (0–100 score) |
| `qk-code-review` | 4-Phase elite code review với Architect mindset |
| `qk-engineering-standard` | Enforce SOLID, DRY, Clean Code với ngưỡng metric cụ thể |

### Security, DevOps & AI
| Skill | Mô tả |
|---|---|
| `qk-security-audit` | OWASP, dependency risk, secret detection, permission model |
| `qk-devops-platform` | CI/CD strategy, deployment architecture, environment management |
| `qk-production-release` | 8-gate mandatory checklist trước khi deploy production |
| `qk-ai-builder` | Governed AI Agent & RAG pipeline design — eval pipeline included |
| `qk-agent-observability` | Monitor AI skin routing decisions, failure patterns |

---

## Changelog

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
npm run test:agent      # Routing intelligence tests
npm run test:graph      # Capability graph validation
npm run test:registry   # Registry consistency check
```
