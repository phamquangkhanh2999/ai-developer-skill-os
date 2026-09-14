---
# ── Identity ───────────────────────────────────────────────
name: qk-project-bootstrap
version: 9.2.0
status: stable
description: "Khởi tạo dự án mới HOẶC setup DEV_PROFILE.md cho dự án đang chạy — auto-detect stack từ manifest files, không hỏi lại những gì đã có thể đọc được. Dùng skill này khi user nhắc đến: khởi tạo dự án, project setup, scaffold, bootstrap, new app, setup dev profile, detect stack, cấu hình skin — kể cả khi chỉ nói 'bắt đầu dự án mới'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── Classification ─────────────────────────────────────────
type: capability

intent:
  - project-initialization
  - dev-profile-setup
  - stack-detection
  - scaffolding

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "khởi tạo dự án"
  - "project setup"
  - "scaffold"
  - "bootstrap"
  - "new app"
  - "setup dev profile"
  - "detect stack"
  - "cấu hình skin"

# ── References ─────────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-context-loader   # Load sau khi DEV_PROFILE.md đã được tạo

knowledge_scope:
  owns:
    - project-structure
    - dev-profile-setup
    - stack-detection
  references:
    - architecture
    - security

# ── Verification ───────────────────────────────────────────
verification:
  required: true
  strategy: bootstrap

examples: []
learnings: []

# ── Runtime ────────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: create_files
produces: [dev-profile, scaffold]
consumes: [manifest-files, user-description]

token_budget:
  max_files_read: 10
  max_lines_per_read: 80
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-project-bootstrap — Project Setup & Stack Detection

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions

Trước khi khởi tạo dự án hoặc setup DEV_PROFILE.md, AI BẮT BUỘC kiểm tra:

- [ ] Xác định thư mục root của dự án.
- [ ] Kiểm tra xem thư mục có file manifest nào tồn tại không (`package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, v.v.) để chọn Mode A (dự án mới) hay Mode B (dự án hiện có).
- [ ] Kiểm tra xem `.agents/DEV_PROFILE.md` đã tồn tại chưa. Nếu đã có và user không yêu cầu ghi đè:
  → **EXIT: PARTIAL**
  → Đề xuất cập nhật hoặc giữ nguyên thay vì overwrite toàn bộ.

---

## Hai chế độ hoạt động

**Mode A — New Project:** Tạo project mới từ đầu theo Blueprint template
**Mode B — Existing Project:** Scan project đang có, detect stack, tạo/cập nhật `DEV_PROFILE.md`

AI tự xác định mode dựa vào context:
- Có `package.json` / `requirements.txt` / `go.mod` tồn tại → **Mode B**
- Không có gì → **Mode A**
- User nói rõ → follow user

---

## Scope

✅ Skill này làm:
- Auto-detect tech stack từ manifest files
- Tạo / cập nhật `.agents/DEV_PROFILE.md` với stack được detect
- Tạo cấu trúc project theo Blueprint template đúng loại
- Setup `.gitignore`, `.env.example`, `README.md` ban đầu
- Gợi ý skills phù hợp với stack được detect

❌ Skill này KHÔNG làm:
- Viết business logic hay feature code
- Setup CI/CD pipeline (→ `qk-devops-platform`)
- Deploy hay publish (→ `qk-production-release`)
- Viết test (→ `qk-test-engineering`)

---

## Execution Steps — Mode B: Detect Stack cho dự án đang có

> Đây là mode quan trọng nhất — dùng khi muốn setup skin cho project hiện tại.

### Step 1 — Scan Manifest Files
```
Actions (chạy song song, đọc lần lượt từng file nếu tồn tại):

JavaScript / TypeScript:
  - package.json          → dependencies, devDependencies, scripts
  - tsconfig.json         → strict mode, paths, target
  - .nvmrc / .node-version → Node version

Python:
  - requirements.txt / requirements/*.txt
  - pyproject.toml (poetry/pdm sections)
  - setup.py / setup.cfg
  - Pipfile

Go:
  - go.mod                → module name, Go version, dependencies

Rust:
  - Cargo.toml

Java / Kotlin:
  - pom.xml / build.gradle / build.gradle.kts

Data / AI:
  - dbt_project.yml       → dbt version, profile
  - airflow.cfg / dag folder structure
  - mlflow.yml / kedro.yml
  - .env.example          → DB_URL, OPENAI_API_KEY hints

Infrastructure:
  - docker-compose.yml    → services (db type, cache, queue)
  - Dockerfile            → base image → language + version
  - .github/workflows/    → CI tools
  - terraform/ / pulumi/  → infra provider

Output: raw_detected = { language, frameworks[], databases[], tools[] }
```

### Step 2 — Classify Stack
```
Inputs:  raw_detected
Actions:
  Determine role từ stack combination:
  
  fe:          React/Vue/Angular + NO backend framework trong cùng repo
  be:          Express/FastAPI/NestJS/Django + NO React/Vue trong cùng repo
  fullstack:   Frontend framework + Backend framework TRONG CÙNG REPO
               (Next.js = fullstack mặc định; Nuxt = fullstack mặc định)
  data:        dbt / Airflow / Spark / Dagster / Prefect / Pandas heavy
  ai-engineer: LangChain / LlamaIndex / OpenAI SDK + vector DB
  devops:      Terraform / Pulumi / GitHub Actions heavy, ít application code
  
  Nếu ambiguous → default: fullstack, ghi chú để user confirm

  Map dependencies → specific stack fields:
  
  frontend:  next → "Next.js", nuxt → "Nuxt 3", react (no next) → "React",
             vue → "Vue 3", angular → "Angular", svelte → "SvelteKit"
  backend:   express → "Express", fastapi → "FastAPI", nestjs → "NestJS",
             django → "Django", laravel → "Laravel", gin → "Gin (Go)"
  database:  pg/postgres → "PostgreSQL", mysql → "MySQL",
             mongodb → "MongoDB", sqlite → "SQLite",
             supabase → "Supabase", prisma → also check schema.prisma
  orm:       prisma → "Prisma", typeorm → "TypeORM", drizzle → "Drizzle",
             sqlalchemy → "SQLAlchemy", sequelize → "Sequelize"
  css:       tailwind → "Tailwind CSS", sass/scss → "SCSS",
             styled-components → "Styled Components", @emotion → "Emotion"
  state:     zustand → "Zustand", redux → "Redux Toolkit",
             jotai → "Jotai", pinia → "Pinia", @tanstack/query → "React Query"
  auth:      next-auth/auth.js → "NextAuth", clerk → "Clerk",
             passport → "Passport.js", supabase/auth → "Supabase Auth"
  test:      jest → "Jest", vitest → "Vitest", pytest → "Pytest",
             playwright → "Playwright", cypress → "Cypress"
  language:  typescript in deps → "TypeScript", python → "Python",
             go.mod exists → "Go"

Output: classified_stack = fully mapped stack object
```

### Step 3 — Tạo / Cập nhật DEV_PROFILE.md
```
Inputs:  classified_stack, detected role
Actions:
  - Đọc DEV_PROFILE.md hiện tại nếu tồn tại (không overwrite những gì user đã điền)
  - Điền các field detect được, giữ nguyên field user đã điền tay
  - Để trống những field không detect được (không đoán mò)
  - Thêm comment "# auto-detected" sau mỗi giá trị được detect
  - Nếu có conflict giữa detected và existing → giữ existing, ghi chú

Output: .agents/DEV_PROFILE.md được điền đầy đủ phần detect được
```

### Step 4 — Report & Suggest Next Steps
```
Actions:
  - Hiển thị detected stack summary cho user confirm
  - List những field còn trống cần user điền tay
  - Suggest 3 skills phù hợp nhất để bắt đầu với stack này
  - Suggest conventions dựa trên stack (ví dụ: Next.js → feature-based folder)
```

---

## Execution Steps — Mode A: New Project

### Blueprint Types

**Type 1: Standard Web App** (fe / be / fullstack)
```
Cấu trúc:
  src/
  ├── features/          # Feature-based modules
  ├── components/        # Shared UI components  
  ├── lib/               # Utilities, helpers
  ├── hooks/             # Custom React hooks (nếu React)
  ├── types/             # TypeScript interfaces
  ├── api/               # API layer / service functions
  └── config/            # App configuration

Files sinh ra:
  .gitignore, .env.example, README.md,
  DESIGN.md (placeholder), .agents/DEV_PROFILE.md (pre-filled)
```

**Type 2: RAG / AI Agent** (ai-engineer)
```
Cấu trúc (4-folder chuẩn):
  prompts/               # System prompts, few-shot examples
  data/
  ├── raw/               # Source data — KHÔNG bao giờ edit
  ├── processed/         # Cleaned, chunked
  └── embeddings/        # Vector representations
  agents/                # Agent definitions, tool configs
  evals/
  ├── traces/            # Execution logs
  ├── datasets/          # Golden Q&A sets
  └── scorecards/        # Metric definitions

Files sinh ra:
  .gitignore (data/raw/, .env), .env.example,
  README.md, .agents/DEV_PROFILE.md (ai-engineer role pre-filled)
```

**Type 3: Data Pipeline** (data)
```
Cấu trúc:
  dags/ / pipelines/     # DAG definitions
  models/
  ├── staging/           # Raw → cleaned
  ├── intermediate/      # Business transforms
  └── mart/              # Final analytics tables
  tests/                 # Data quality tests
  docs/                  # Data lineage docs
  seeds/                 # Static reference data

Files sinh ra:
  .gitignore, .env.example, README.md,
  dbt_project.yml (nếu dbt), .agents/DEV_PROFILE.md (data role)
```

**Type 4: DevOps / Platform** (devops)
```
Cấu trúc:
  .github/workflows/     # CI/CD pipelines
  terraform/ / pulumi/   # IaC modules
  scripts/               # Automation scripts
  docs/
  ├── runbooks/          # Incident response
  └── architecture/      # System diagrams

Files sinh ra:
  .gitignore, .env.example, README.md,
  .agents/DEV_PROFILE.md (devops role)
```

---

## Prompt Template

```
Mode:    [new / existing / profile-only]
Role:    [fe / be / fullstack / data / ai-engineer / devops — hoặc "auto-detect"]
Name:    [Tên project]
Mô tả:  [1-2 câu app làm gì]
Stack:   [Nếu biết rồi — hoặc để trống để AI detect]
```

---

### Ví dụ theo từng tình huống:

**Tình huống 1 — Dự án đang có, muốn setup DEV_PROFILE nhanh**
```
Mode:    existing
Role:    auto-detect
Name:    (đọc từ project)
```
→ AI scan `package.json`, detect `Next.js + Prisma + Tailwind + TypeScript`,
  điền DEV_PROFILE.md với `role: fullstack`, toàn bộ stack fields,
  gợi ý: "Tiếp theo dùng `qk-feature-delivery` để build feature đầu tiên".

**Tình huống 2 — Dự án mới Fullstack**
```
Mode:    new
Role:    fullstack
Name:    ecommerce-platform
Mô tả:  Nền tảng thương mại điện tử B2C — quản lý sản phẩm, đơn hàng, thanh toán
Stack:  Next.js 14 + Prisma + PostgreSQL + Tailwind + TypeScript
```
→ AI tạo: folder structure theo Standard Web App blueprint,
  `.env.example` với `DATABASE_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`,
  `README.md` với setup instructions, `DEV_PROFILE.md` pre-filled.

**Tình huống 3 — Setup RAG pipeline**
```
Mode:    new
Role:    ai-engineer
Name:    internal-kb-assistant
Mô tả:  Q&A bot trả lời từ tài liệu nội bộ công ty (PDF, Confluence)
Stack:  OpenAI GPT-4o + pgvector + LangChain + FastAPI
```
→ AI tạo: 4-folder AI structure, `prompts/system.txt` placeholder,
  `evals/scorecards/rag_metrics.yml` template (faithfulness, relevance, groundedness),
  `DEV_PROFILE.md` với `role: ai-engineer`, full `data_stack` filled.

**Tình huống 4 — Data pipeline mới**
```
Mode:    new
Role:    data
Name:    sales-analytics
Mô tả:  Pipeline load sales data từ Salesforce → BigQuery, build mart cho dashboard
Stack:  dbt + Airflow + BigQuery + Python
```
→ AI tạo: dbt project structure (staging/intermediate/mart),
  `dbt_project.yml`, Airflow DAG folder, `DEV_PROFILE.md` với `role: data`,
  full `data_stack` (pipeline: "dbt + Airflow", warehouse: "BigQuery").
