---
# ── Identity ───────────────────────────────────────────────
name: qk-data-engineer
version: 9.2.0
status: stable
description: "Thiết kế và implement data pipeline với best practices: idempotency, data quality gate, lineage, incremental processing. Dùng skill này khi user nhắc đến: data pipeline, etl, elt, dbt, dbt model, airflow dag, spark job, medallion architecture, data quality, incremental load, schema evolution, backfill, data warehouse — kể cả khi chỉ nói \"load data từ X sang Y\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - data-pipeline
  - data-modeling
  - data-quality
  - etl-optimization

complexity:
  level: high
  criteria:
    files_affected: "1-15"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "data pipeline"
  - "etl"
  - "elt"
  - "dbt"
  - "dbt model"
  - "airflow dag"
  - "spark job"
  - "medallion architecture"
  - "data quality"
  - "incremental load"
  - "schema evolution"
  - "backfill"
  - "data warehouse"

selection:
  priority: high
  confidence_threshold: 0.85

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-data-lifecycle
  - qk-db-optimizer

knowledge_scope:
  owns:
    - data-pipeline-architecture
    - data-contracts
    - data-quality-gate
    - incremental-processing
  references:
    - architecture
    - security
    - performance

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: medium
risk: high
side_effects: edit_files
produces: [code, schema, report]
consumes:
  - user-request
  - project-source-code
  - project-config
  - project-tests
  - project-documentation
  - project-memory

token_budget:
  max_files_read: 20
  max_lines_per_read: 200
  max_shell_commands: 10
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-data-engineer — Universal Data Engineer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thiết kế và hiện thực hóa các đường ống dữ liệu (Data Pipelines: ETL/ELT) tuân thủ nghiêm ngặt 4 trụ cột kỹ thuật dữ liệu: **Idempotency (Tính lũy thừa) → Data Quality Gate (Cổng kiểm tra chất lượng) → Lineage (Nguồn gốc luồng dữ liệu) → Incremental Processing (Xử lý gia tăng)**.

---

## Preconditions

Trước khi xây dựng hoặc cập nhật pipeline dữ liệu, AI BẮT BUỘC kiểm tra:

- [ ] Xác định Data stack từ `.agents/DEV_PROFILE.md` (Orchestrator: Airflow/Prefect, Warehouse: BigQuery/Snowflake/Postgres, Transformation: dbt/Spark/Pandas).
- [ ] Xác định chiến lược Idempotency (Upsert, Merge, Partition overwrite, Watermarking).
- [ ] Xác định ngưỡng Data Quality Gates (Null check, Uniqueness, Volume anomaly, Freshness).
- [ ] Nếu pipeline không có cơ chế Idempotent (chạy lại gây duplicate dữ liệu) hoặc thiếu validation:
  → **EXIT: BLOCKED**
  → Báo cáo user yêu cầu xác định deduplication key / partition strategy trước khi code.

---

## Scope

✅ Skill này làm:
- Thiết kế và cài đặt dbt models (Staging → Intermediate → Marts), Spark jobs, Airflow DAGs.
- Cấu hình chiến lược Incremental load (Timestamp watermarking, CDC, Partition replacement).
- Thiết lập Data Quality Assertions (dbt tests, Great Expectations, Soda checks).
- Quản lý Schema Evolution (thay đổi cột an toàn, chống silent failure / schema drift).
- Viết tài liệu Lineage và từ điển dữ liệu (Data Dictionary).

❌ Skill này KHÔNG làm:
- Thiết kế UI Dashboard hay biểu đồ trên web app (→ `qk-ui-builder`).
- Viết CRUD REST API cho web backend thông thường (→ `qk-api-lifecycle`).
- Quản lý hạ tầng cụm máy chủ vật lý / Kafka cluster (→ `qk-devops-platform`).

---

## Execution Steps

### Step 1 — Source Analysis & Data Contract
```
Inputs:  Yêu cầu pipeline từ user, Source schema, Volume ước tính
Actions:
  - Phân tích cấu trúc nguồn dữ liệu (Source freshness, Primary keys, Update timestamps).
  - Thỏa thuận Data Contract giữa nhà cung cấp dữ liệu và Data Warehouse.
  - Xác định partition strategy (theo date/hour) và clustering keys.
Output: Pipeline Architectural Plan & Contract
```

### Step 2 — Transformation & Idempotent Logic
```
Inputs:  Contract, Tech stack
Actions:
  - Viết code transformation (SQL/Python/PySpark) chia theo các tầng Medallion (Bronze/Silver/Gold).
  - Đảm bảo logic tính toán có tính lũy thừa (Idempotent): rerun nhiều lần không thay đổi kết quả.
  - Tối ưu hóa câu query xử lý dữ liệu lớn (Pruning partitions, tránh full table scan).
Output: Transformation scripts & Models
```

### Step 3 — Quality Gates & Anomaly Checks
```
Inputs:  Transformation scripts
Actions:
  - Thêm tests bắt buộc: Not null, Unique, Referential integrity (Foreign keys).
  - Thêm row count checks và freshness sensors để phát hiện dữ liệu rỗng bất thường.
  - Cấu hình cơ chế cảnh báo (Alert) khi chất lượng dữ liệu không đạt chuẩn.
Output: Test suite & Monitoring rules
```

### Step 4 — Verification & Dry Run
```
Inputs:  Pipeline code & Quality tests
Actions:
  - Kiểm tra cú pháp, compile SQL/dbt models.
  - Xác nhận kế hoạch backfill dữ liệu lịch sử an toàn.
Exit: SUCCESS nếu pipeline bảo đảm tính idempotent và pass mọi quality gates.
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết data stack (pipeline/warehouse/format/broker).
Mô tả pipeline cần làm — AI sẽ thiết kế theo đúng tool đang dùng.

```
Pipeline:    [Tên pipeline / DAG / job]
Source:      [Nguồn dữ liệu: DB / API / file / stream / ...]
Destination: [Đích: warehouse / data lake / another DB / ...]
Frequency:   [Batch daily / hourly / streaming / event-driven]
Volume:      [Số rows / GB ước tính mỗi lần chạy]
SLA:         [Data phải có mặt lúc mấy giờ? Latency tối đa?]
Rules:       [Idempotency, dedup, schema evolution, data quality gate]
```

---

### Ví dụ theo tech stack:

**dbt + BigQuery + Airflow**
```
Pipeline:    daily_order_metrics
Source:      PostgreSQL (production DB) — bảng orders, order_items, products
Destination: BigQuery dataset: mart — table: fct_order_metrics
Frequency:   Daily batch lúc 3AM UTC
Volume:      ~50k rows/ngày, tăng trưởng 10%/tháng
SLA:         Data sẵn sàng trước 6AM UTC cho dashboard
Rules:       - Idempotent: re-run ngày bất kỳ cho kết quả giống nhau
             - Không load ngày hiện tại (incomplete data)
             - Alert nếu row count giảm > 20% so với 7 ngày trước
             - Schema thay đổi ở source → fail loud, không silent corrupt
```
→ AI thiết kế: dbt model layers (staging → intermediate → mart),
  Airflow DAG với sensor check source freshness, incremental model strategy
  (merge key = order_id + date), dbt test (not_null, unique, accepted_values),
  partition by date trên BQ để tránh full scan, audit log table.

**Spark + Delta Lake + Databricks**
```
Pipeline:    clickstream_sessionization
Source:      Kafka topic: user.clicks — ~5M events/ngày
Destination: Delta Lake: /data/gold/user_sessions
Frequency:   Micro-batch mỗi 5 phút (Structured Streaming)
Volume:      ~3.5GB/ngày raw
SLA:         Session data available trong vòng 10 phút kể từ event
Rules:       - Session timeout: 30 phút không activity
             - Exactly-once processing
             - Backfill safe (có thể re-process từ Kafka offset)
```
→ AI thiết kế: Spark Structured Streaming với watermark cho late data,
  session window aggregation, Delta Lake MERGE cho upsert sessions,
  checkpoint location strategy, schema enforcement + evolution,
  Z-ORDER optimization cho query patterns, monitoring (lag metrics).

**Airbyte + dbt + Snowflake**
```
Pipeline:    crm_sync — Salesforce → Snowflake → mart
Source:      Salesforce (Airbyte connector) — objects: Account, Opportunity, Contact
Destination: Snowflake RAW → STAGING → MART
Frequency:   Airbyte sync mỗi 1 giờ, dbt transform mỗi 2 giờ
Volume:      ~500k records total, delta ~2k/ngày
SLA:         CRM data lag tối đa 3 giờ so với Salesforce
Rules:       - Không xóa hard delete từ source (soft delete pattern)
             - PII fields (email, phone) phải masked trong MART layer
             - Lineage từ Salesforce ID phải traceable đến mart row
```
→ AI thiết kế: Airbyte connection config + normalization settings,
  dbt source freshness test, PII masking macro, soft-delete handling
  (dbt snapshot vs custom), column-level lineage documentation,
  Snowflake role-based access cho MART vs RAW.
