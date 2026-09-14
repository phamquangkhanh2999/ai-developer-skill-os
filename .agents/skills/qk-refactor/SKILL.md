---
name: qk-refactor
version: 9.2.0
status: stable
description: "Tái cấu trúc code để dễ bảo trì, dễ test hơn — không thay đổi external behavior. Dùng skill này khi user nhắc đến: refactor, tái cấu trúc, tách file, extract function/component/module, clean code, reduce complexity, file quá dài, God class, quá nhiều responsibilities — kể cả khi chỉ nói \"file này lộn xộn quá\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

type: capability

intent:
  - refactoring
  - code-cleanup
  - complexity-reduction

complexity:
  level: medium
  criteria:
    files_affected: "2-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "refactor"
  - "tái cấu trúc"
  - "tách file"
  - "extract function/component/module"
  - "clean code"
  - "reduce complexity"
  - "file quá dài"
  - "God class"
  - "quá nhiều responsibilities"


selection:
  priority: medium
  confidence_threshold: 0.80

workflow: refactor

rules:
  - global
  - coding
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-code-review
  - qk-project-health

knowledge_scope:
  owns:
    - refactoring-patterns
    - code-smells
  references:
    - architecture
    - coding-standards

verification:
  required: true
  strategy: refactor

examples: []
learnings: []

execution_mode: deterministic
cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-refactor - Safe Refactor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm tái cấu trúc mã nguồn để tăng khả năng bảo trì, giảm độ phức tạp và tăng tính kiểm thử mà **TUYỆT ĐỐI KHÔNG làm thay đổi hành vi bên ngoài (External Behavior)**.

---

## Preconditions

Trước khi tái cấu trúc bất kỳ file nào, AI BẮT BUỘC kiểm tra:

- [ ] Xác định rõ mục tiêu refactor (tách file, giảm cognitive complexity, khử duplication, áp dụng Design Pattern).
- [ ] Xác định public contracts (functions, classes, API routes, props) cần giữ nguyên vẹn.
- [ ] Kiểm tra hệ thống test hiện có: có tests để verify behavior không?
- [ ] Nếu yêu cầu refactor kèm theo thay đổi nghiệp vụ hoặc đổi behavior:
  → **EXIT: BLOCKED**
  → Báo cáo user: Tách riêng việc refactor (qk-refactor) và việc đổi tính năng (qk-feature-delivery).

---

## Scope

✅ Skill này làm:
- Trích xuất hàm, component, custom hooks hoặc helper modules (Extract method/module).
- Giảm độ phức tạp cyclomatic (lồng if/else sâu, switch case khổng lồ).
- Khử trùng lặp mã nguồn (DRY) mà không tạo ra over-abstraction gượng ép.
- Tối ưu đặt tên biến, hàm theo đúng quy ước sạch (Clean Code).
- Bảo đảm 100% backward compatibility với các consumer của module.

❌ Skill này KHÔNG làm:
- Sửa đổi business logic hoặc thay đổi đầu ra mong đợi của hệ thống.
- Viết tính năng mới ngoài lề trong quá trình refactor.
- Tự ý thay đổi schema cơ sở dữ liệu (→ `qk-data-lifecycle`).

---

## Execution Steps

### Step 1 — Current State & Contract Lock
```
Inputs:  Mã nguồn mục tiêu, Public interface
Actions:
  - Phân tích luồng thực thi và các điểm vào/ra (inputs/outputs, exceptions).
  - Khóa (lock) contract công khai: không thay đổi signature của exported functions/components.
  - Kiểm tra test coverage hiện có (nếu có).
Output: Refactor Safety Boundary
```

### Step 2 — Incremental Transformation
```
Inputs:  Target code, Safety boundary
Actions:
  - Tách nhỏ từng phần (baby steps): trích xuất hàm con, module độc lập.
  - Thay thế cấu trúc lồng ghép bằng Guard Clauses (early return).
  - Di chuyển các helper/utility sang vị trí phù hợp theo kiến trúc dự án.
Output: Refactored code
```

### Step 3 — Verification & Equivalence Check
```
Inputs:  Refactored code, Original tests
Actions:
  - Chạy linter và typecheck: 0 type errors, 0 lint warnings.
  - Chạy tests để xác nhận tính tương đương hành vi (behavior equivalence).
  - So sánh diff để đảm bảo không xóa nhầm logic hay import.
Exit: SUCCESS nếu code sạch hơn, pass linter/types và giữ nguyên behavior.
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết conventions. Mô tả vấn đề — AI đọc code thật trước khi refactor.

```
Target:      [File / module / function cần refactor — đường dẫn cụ thể]
Vấn đề:     [Code đang gây ra vấn đề gì — quá dài / khó test / lặp lại / ...]
Mục tiêu:   [Muốn đạt được gì sau refactor]
Giữ nguyên: [Public interface / behavior / test cases không được đổi]
```

---

### Theo Role — AI refactor theo chiều sâu khác nhau:

**role: fe**
```
Target:      src/pages/CheckoutPage.tsx (380 dòng)
Vấn đề:     Một file trộn lẫn: form state, API calls, validation, UI rendering,
             cart calculation — không test được, không reuse được
Mục tiêu:   Tách thành: CheckoutPage (UI) + useCheckout (logic hook) +
             checkoutSchema (validation) + cartUtils (calculation)
Giữ nguyên: Props interface của CheckoutPage không đổi, behavior submit không đổi
```
→ AI refactor: custom hook extraction pattern, co-location vs separation of concerns,
  memoization opportunities (useMemo/useCallback), type narrowing sau khi tách.

**role: be**
```
Target:      src/services/OrderService.ts (420 dòng)
Vấn đề:     God class — xử lý: tạo order, tính giá, gửi email, update inventory,
             generate invoice — vi phạm SRP, unit test không isolate được
Mục tiêu:   Tách ra theo domain: PricingService, InventoryService, NotificationService,
             OrderService chỉ orchestrate
Giữ nguyên: Public method signatures của OrderService, không đổi DB transactions
```
→ AI refactor: dependency injection pattern, service boundary design,
  transaction scope sau khi tách (vẫn cần atomic), interface extraction cho testability.

**role: fullstack**
```
Target:      src/features/products/ (toàn bộ folder)
Vấn đề:     Feature folder có: API route, DB query, FE component, type definitions
             — tất cả trong cùng 1 file products.ts (550 dòng)
Mục tiêu:   Feature-based architecture: products/api.ts, products/db.ts,
             products/components/, products/types.ts, products/hooks.ts
Giữ nguyên: Import paths của các file khác đang dùng products types
```
→ AI refactor: barrel exports để preserve import paths, layer separation
  (presentation/business/data), shared types location, circular dependency check.

**role: data**
```
Target:      transforms/order_metrics.sql (250 dòng)
Vấn đề:     SQL monolith — một query tính tất cả metrics, không reusable,
             debug khó, CTE lồng nhau 6 cấp
Mục tiêu:   Tách thành dbt models: stg_orders, int_order_items, fct_order_metrics
             Mỗi model làm đúng một việc
Giữ nguyên: Output schema của fct_order_metrics không đổi (downstream depends on it)
```
→ AI refactor: dbt model layering (staging/intermediate/mart), ref() dependencies,
  incremental model strategy, documentation + schema.yml generation.

**role: ai-engineer**
```
Target:      agents/rag_agent.py (300 dòng)
Vấn đề:     Monolithic RAG function — embed + retrieve + rerank + generate
             tất cả trong 1 hàm, không thể A/B test từng component
Mục tiêu:   Tách thành pipeline: Retriever, Reranker, Generator — mỗi class
             có interface rõ ràng, swap được implementation
Giữ nguyên: Input/output interface của rag_agent() không đổi
```
→ AI refactor: Strategy pattern cho từng pipeline stage, dependency injection
  cho model/embedding, eval hooks tại từng stage, config-driven pipeline.

**role: devops**
```
Target:      .github/workflows/deploy.yml (200 dòng)
Vấn đề:     Một workflow file làm tất cả: test + build + push image + deploy staging
             + deploy prod + notify — không reusable, khó debug khi fail
Mục tiêu:   Tách thành reusable workflows: test.yml, build-push.yml,
             deploy.yml (reusable), notify.yml — orchestrated từ main.yml
Giữ nguyên: Trigger conditions và environment variables không đổi
```
→ AI refactor: GitHub reusable workflows pattern (workflow_call),
  matrix strategy cho multi-env deploy, secret scoping per environment,
  concurrency groups để tránh parallel deploys.
