# PROJECT.md — AI Developer Skin: Project Context
# ─────────────────────────────────────────────────
# File này được AI đọc TRƯỚC KHI xử lý bất kỳ yêu cầu nào.
# Điền đúng một lần → AI hiểu context mọi lúc, không hỏi lại.
# ─────────────────────────────────────────────────

## Role
# Chọn một trong: fe | be | fullstack | data | devops | ai-engineer
role: fullstack

## Stack
# Liệt kê đúng tech đang dùng. AI sẽ dùng đúng stack này, không đề xuất thay thế.
stack:
  frontend:   ""          # React / Next.js / Vue 3 / Nuxt / Svelte / Angular
  backend:    ""          # Express / NestJS / FastAPI / Django / Laravel / Spring
  database:   ""          # PostgreSQL / MySQL / MongoDB / Redis / Supabase
  orm:        ""          # Prisma / TypeORM / Drizzle / SQLAlchemy / Sequelize
  auth:       ""          # JWT / NextAuth / Clerk / Auth0 / Supabase Auth
  css:        ""          # Tailwind / SCSS / CSS Modules / Styled Components
  state:      ""          # Zustand / Redux / Pinia / Jotai / React Query
  infra:      ""          # Docker / GitHub Actions / Vercel / AWS / GCP
  language:   ""          # TypeScript / JavaScript / Python / Go / Java

## Data Stack (điền nếu role = data hoặc ai-engineer)
data_stack:
  pipeline:   ""          # dbt / Spark / Airflow / Prefect / Dagster
  warehouse:  ""          # BigQuery / Snowflake / Redshift / ClickHouse
  format:     ""          # Parquet / Delta Lake / Iceberg
  broker:     ""          # Kafka / Kinesis / Pub/Sub
  vector_db:  ""          # Pinecone / Weaviate / pgvector / Qdrant
  llm:        ""          # OpenAI / Anthropic / Gemini / Ollama / Mistral

## Project Info
project_name: ""
project_type: ""          # web-app / api / mobile / data-pipeline / ai-agent / monorepo
description:  ""          # 1-2 câu mô tả app làm gì

## AI Behavior
ai_style: concise         # concise (ngắn gọn) | detailed (giải thích kỹ) | teaching (dạy kèm lý do)
output_lang: vi           # vi (tiếng Việt) | en (English)
code_style: ""            # strict (tuân thủ SOLID tuyệt đối) | pragmatic (linh hoạt) | minimal (ít code nhất có thể)

## Conventions (quy ước dự án — AI sẽ follow, không đề xuất đổi)
conventions:
  component_pattern: ""   # atomic / feature-based / domain / page-based
  api_pattern: ""         # REST / GraphQL / tRPC / gRPC
  error_handling: ""      # throw / Result pattern / Either monad
  test_framework: ""      # Jest / Vitest / Pytest / Go test
  naming: ""              # camelCase / snake_case / PascalCase (mô tả quy tắc nếu cần)

## Constraints (điều AI không được làm trong dự án này)
constraints:
  - ""                    # ví dụ: "không dùng any trong TypeScript"
  - ""                    # ví dụ: "không tạo file mới nếu chưa hỏi"
  - ""                    # ví dụ: "không đổi Prisma schema trực tiếp, phải qua migration"

# ─────────────────────────────────────────────────
# HƯỚNG DẪN ĐIỀN NHANH THEO ROLE
# ─────────────────────────────────────────────────
#
# 👤 Frontend Developer (fe):
#   role: fe
#   stack: { frontend: "Next.js 14", css: "Tailwind", state: "Zustand + React Query", language: "TypeScript" }
#   → AI sẽ: tập trung component architecture, state management, API integration, accessibility
#   → AI sẽ KHÔNG: đề xuất đổi backend, viết migration, thiết kế DB schema
#
# 👤 Backend Developer (be):
#   role: be
#   stack: { backend: "NestJS", database: "PostgreSQL", orm: "Prisma", auth: "JWT", language: "TypeScript" }
#   → AI sẽ: tập trung API design, business logic, DB optimization, security
#   → AI sẽ KHÔNG: viết CSS, đề xuất component library, thiết kế UI layout
#
# 👤 Fullstack Developer (fullstack):
#   role: fullstack
#   stack: { frontend: "Next.js 14", backend: "tRPC", database: "PostgreSQL", orm: "Prisma", css: "Tailwind", language: "TypeScript" }
#   → AI sẽ: xử lý cả FE lẫn BE, đề xuất phân tầng rõ ràng, chú ý contract giữa FE-BE
#   → AI sẽ KHÔNG: over-engineer, thêm micro-service khi monolith đủ dùng
#
# 👤 Data Engineer (data):
#   role: data
#   data_stack: { pipeline: "dbt + Airflow", warehouse: "BigQuery", format: "Parquet", broker: "Kafka" }
#   → AI sẽ: tập trung idempotency, data quality gate, lineage, incremental processing
#   → AI sẽ KHÔNG: đề xuất ORM cho application, viết UI
#
# 👤 AI Engineer (ai-engineer):
#   role: ai-engineer
#   data_stack: { llm: "OpenAI GPT-4o", vector_db: "pgvector", pipeline: "LangChain" }
#   → AI sẽ: tập trung prompt engineering, RAG architecture, eval pipeline, hallucination mitigation
#   → AI sẽ KHÔNG: thiết kế DB schema cho business logic thông thường
#
# 👤 DevOps / Platform Engineer (devops):
#   role: devops
#   stack: { infra: "GitHub Actions + AWS ECS", language: "Python + Bash" }
#   → AI sẽ: tập trung CI/CD, IaC, observability, rollback strategy, security hardening
#   → AI sẽ KHÔNG: viết business logic, thiết kế API
