---
# ── Identity ───────────────────────────────────────────────
name: qk-code-review
version: 9.2.0
status: stable
description: "Review code, AI config, hoặc skin rules theo 4 phases với Architect mindset — phát hiện bug, security issue, architecture smell, logic error. Dùng skill này khi user nhắc đến: review code, code review, kiểm tra code, đánh giá code, review skin, review rule, review ai config, audit PR — kể cả khi chỉ nói \"xem thử code này ổn không\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - code-review
  - quality-assurance
  - architecture-review
  - ai-config-audit

complexity:
  level: high
  criteria:
    files_affected: "1-15"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "review code"
  - "code review"
  - "kiểm tra code"
  - "đánh giá code"
  - "review skin"
  - "review rule"
  - "review ai config"
  - "audit PR"


selection:
  priority: high
  confidence_threshold: 0.85

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global

tools:
  - filesystem

related_skills:
  - qk-project-health
  - qk-security-audit

knowledge_scope:
  owns:
    - code-review-standards
    - ai-configuration-review
    - feedback-delivery
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

# ── V8: Knowledge links ────────────────────────────────────
examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: medium
risk: low
side_effects: read_only
produces: [report]
consumes: [source-code, rules, workflows]

token_budget:
  max_files_read: 10
  max_lines_per_read: 300
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-code-review — Elite Review System

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Biến quá trình Code Review từ "bắt bẻ" (gatekeeping) thành "chia sẻ tri thức" (knowledge sharing) thông qua phản hồi mang tính xây dựng, phân tích có hệ thống và hợp tác cải tiến theo tư duy Kiến trúc sư (Architect mindset).

---

## Preconditions

Trước khi thực hiện review, AI BẮT BUỘC kiểm tra:

- [ ] Xác định đối tượng review: files cụ thể, diff/PR, hay cấu hình AI/rules.
- [ ] Đọc `.agents/DEV_PROFILE.md` để nắm coding standards, architectural rules, và constraints.
- [ ] Đảm bảo files cần review tồn tại và có thể đọc được nội dung.
- [ ] Nếu scope review vượt quá khả năng context (ví dụ toàn bộ repo hàng nghìn files cùng lúc):
  → **EXIT: BLOCKED**
  → Báo cáo user chia nhỏ phạm vi review theo module hoặc PR diff.

---

## Scope

✅ Skill này làm:
- Phân tích code theo 4 tầng: Bug/Logic, Security, Architecture/Maintainability, Coding Standards.
- Đánh giá chất lượng của cấu hình AI (SKILL.md, workflow YAML, system rules).
- Cung cấp feedback định lượng, phân loại độ nghiêm trọng: CRITICAL, HIGH, MEDIUM, LOW.
- Gợi ý giải pháp cụ thể (concrete diffs / refactor snippet) cho từng vấn đề.
- Hoạt động ở chế độ **read-only** (chỉ xuất báo cáo, không tự ý sửa code).

❌ Skill này KHÔNG làm:
- Tự động áp dụng code fix vào source code của user (→ user quyết định hoặc dùng `qk-refactor`).
- Quét toàn bộ vulnerabilities của third-party dependencies qua CVE database (→ `qk-security-audit`).
- Đo lường và chấm điểm tổng thể kỹ thuật dự án (→ `qk-project-health`).

---

## Execution Steps

### Step 1 — Context & Target Ingestion
```
Inputs:  Danh sách files/diff từ user, DEV_PROFILE.md
Actions:
  - Đọc nội dung source code mục tiêu.
  - Phân tích vai trò của file trong kiến trúc chung (domain, service, UI, infra).
Output: Scope boundary & Review target map
```

### Step 2 — Multi-Dimensional Analysis
```
Inputs:  Source code, Standards & Rules
Actions:
  - Phase 1: Logic & Correctness (xử lý null/undefined, race conditions, edge cases).
  - Phase 2: Security & Privacy (input validation, SQLi/XSS, secret leaks, access control).
  - Phase 3: Architecture & Clean Code (SOLID, DRY, coupled dependencies, readability).
  - Phase 4: Conventions & Performance (quy ước đặt tên, N+1 query, re-render).
Output: Raw findings list
```

### Step 3 — Constructive Synthesis & Remediation
```
Inputs:  Raw findings list
Actions:
  - Lọc bỏ false positives và gán nhãn mức độ nghiêm trọng (CRITICAL/HIGH/MEDIUM/LOW).
  - Với mỗi finding, viết lý do (Why) và đề xuất code snippet cải tiến (How to fix).
Output: Structured Review Report
```

### Step 4 — Verification & Delivery
```
Inputs:  Structured Review Report
Actions:
  - Rà soát tính khả thi của các đề xuất.
  - Trình bày báo cáo rõ ràng, mạch lạc theo ngôn ngữ tiếng Việt (code snippets giữ English).
Exit: SUCCESS
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết conventions + constraints. Review sẽ đánh giá theo đúng tiêu chuẩn dự án.

```
Review:     [File / folder / PR diff cần review]
Focus:      [security / performance / architecture / logic / correctness — hoặc "full"]
Context:    [Đây là feature mới / bug fix / refactor / migration / ...]
Bỏ qua:    [Những thứ không cần comment — vd: style, naming, test coverage]
```

---

### Theo Role — AI review theo tiêu chí khác nhau:

**role: fe**
```
Review:     src/features/cart/ (toàn bộ folder — PR mới)
Focus:      correctness + performance
Context:    Vừa implement giỏ hàng — lần đầu có optimistic updates
Bỏ qua:    CSS naming convention
```
→ AI xem xét: race condition trong optimistic update, stale closure trong
  useCallback/useEffect, unnecessary re-render (missing memo/deps array),
  missing error boundary, accessibility của interactive elements,
  bundle size impact của dependencies mới.

**role: be**
```
Review:     src/routes/payments/ + src/services/PaymentService.ts
Focus:      security + correctness
Context:    Tích hợp payment gateway mới (Stripe) — business critical
Bỏ qua:    Code style
```
→ AI xem xét: idempotency key usage, webhook signature verification,
  sensitive data logging (card numbers, CVV không được log),
  error handling không leak internal info ra response, DB transaction scope,
  rate limiting, secrets không hardcode.

**role: fullstack**
```
Review:     src/features/reports/ (FE + BE cùng PR)
Focus:      architecture + contract
Context:    Feature mới — export báo cáo, cả FE và BE trong cùng PR
Bỏ qua:    Test coverage (sẽ thêm sau)
```
→ AI xem xét: type contract giữa FE-BE (có dùng shared types không),
  FE không hard-code assumptions về response shape, BE thay đổi response
  có break FE không, error shape nhất quán, loading state đầy đủ.

**role: data**
```
Review:     dags/customer_churn_pipeline.py + models/mart/fct_churn.sql
Focus:      correctness + reliability
Context:    Pipeline mới chạy weekly, dữ liệu dùng cho ML model
Bỏ qua:    SQL formatting style
```
→ AI xem xét: idempotency (re-run an toàn không), partition filter đúng chưa
  (tránh full scan), data quality assertions có đủ không, schema evolution
  strategy, downstream dependencies được documented chưa, SLA realistic không.

**role: ai-engineer**
```
Review:     prompts/ + retrieval/pipeline.py
Focus:      correctness + hallucination risk
Context:    RAG pipeline sắp ra production — cần review kỹ trước khi deploy
Bỏ qua:    Code style
```
→ AI xem xét: system prompt có enforce grounding không ("chỉ dùng context được cung cấp"),
  retrieval có thể trả empty context không (edge case), temperature setting phù hợp,
  PII trong training data / retrieved context, prompt injection risk,
  eval metrics có được log không, fallback khi LLM unavailable.

**role: devops**
```
Review:     .github/workflows/ + terraform/modules/ecs/
Focus:      security + correctness
Context:    Infrastructure change — scale up ECS service + thêm ALB rule
Bỏ qua:    Resource naming convention (đã có convention riêng)
```
→ AI xem xét: secrets exposed trong logs hay env vars không, IAM least-privilege
  (role có quá nhiều permission không), rollback plan rõ ràng chưa,
  state file được lock và store an toàn không, có test trên staging trước prod không,
  blast radius nếu Terraform apply fail giữa chừng.
