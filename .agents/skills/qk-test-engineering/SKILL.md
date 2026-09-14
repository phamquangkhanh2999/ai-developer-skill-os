---
# ── Identity ───────────────────────────────────────────────
name: qk-test-engineering
version: 9.2.0
status: stable
description: "Thiết kế chiến lược kiểm thử toàn diện và viết bộ test tự động: Test Pyramid (Unit, Integration, E2E), Mocking strategy, Edge-case coverage, Regression testing. Dùng skill này khi user nhắc đến: viết test, test strategy, unit test, coverage, e2e, integration test, mock data, pytest, vitest, playwright — kể cả khi chỉ nói 'viết test cho module này'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - testing-strategy
  - unit-testing
  - integration-testing
  - e2e-testing
  - test-automation

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "viết test"
  - "test strategy"
  - "unit test"
  - "coverage"
  - "e2e"
  - "integration test"
  - "mock data"
  - "pytest"
  - "vitest"
  - "playwright"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-code-review
  - qk-bug-resolution

knowledge_scope:
  domain:
    - testing-strategy
    - quality-assurance
    - unit-testing
    - integration-testing
    - e2e-testing
  concepts:
    - test-pyramid
    - mock-strategy
    - arrange-act-assert
  references:
    - architecture
    - vitest
    - pytest
    - playwright

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: edit_files
produces: [code, test_plan]
consumes: [source-code, user-description]

token_budget:
  max_files_read: 6
  max_lines_per_read: 150
  max_shell_commands: 3
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-test-engineering — Automated Testing & Quality Architect

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thiết kế chiến lược kiểm thử cân bằng (Test Pyramid) và trực tiếp cài đặt các bộ test tự động đáng tin cậy: **Unit Tests nhanh & cô lập, Integration Tests kiểm chứng hợp đồng kết nối, và E2E Tests bảo vệ luồng nghiệp vụ sống còn.**

---

## Preconditions

Trước khi viết test, AI BẮT BUỘC xác nhận:

- [ ] Xác định Test Framework từ `DEV_PROFILE.md` hoặc manifest (Vitest, Jest, Pytest, Go `testing`, Playwright).
- [ ] Xác định code mục tiêu cần test (function, class, API endpoint, hoặc user journey).
- [ ] Xác định phụ thuộc ngoại vi (Database, External API, File system, Third-party service) để chọn phương án Mock phù hợp.

*Nếu chưa có code mục tiêu và user không yêu cầu TDD (Test-Driven Development):*
→ **EXIT: BLOCKED**
→ Yêu cầu: "Vui lòng chỉ định hàm, module hoặc file cần viết test."

---

## Scope

✅ Skill này làm:
- Thiết lập **Test Cases Matrix** bao phủ:
  - **Happy path:** Dữ liệu hợp lệ, kết quả mong đợi.
  - **Edge cases:** Giới hạn biên (0, -1, max int, chuỗi rỗng, mảng rỗng, ký tự đặc biệt UTF-8).
  - **Error boundaries:** Ném lỗi đúng loại (Custom Error / HTTP Status) khi đầu vào sai.
  - **Async / Timeout:** Xử lý promise reject, network delay.
- Viết Unit Tests theo cấu trúc kinh điển **AAA (Arrange - Act - Assert)** hoặc **Given - When - Then**.
- Viết Integration Tests kiểm chứng sự phối hợp giữa Service và Database (dùng in-memory DB hoặc Testcontainers).
- Viết E2E Tests (Playwright) cho các User Flows quan trọng nhất (Sign up → Checkout → Payment).
- Xây dựng Mocking Strategy đúng mực: Mock ở ranh giới hệ thống (HTTP client, Message queue), **không bao giờ mock implementation details nội bộ**.

❌ Skill này KHÔNG làm:
- Viết tests rỗng không có `expect` / `assert` chỉ để farm chỉ số coverage.
- Mock quá mức khiến test luôn pass dù code thật bị hỏng (Tautological tests).
- Viết E2E test cho mọi biến thể nhỏ (vi phạm kim tự tháp kiểm thử, gây chậm CI và flaky test).

---

## Execution Steps

### Step 1 — Phân tầng Kiểm thử (Pyramid Placement)
```
Quyết định tầng test phù hợp:
  - Pure function, domain logic, utils       → 70% Unit Tests (Chạy < 10ms/test).
  - Database queries, API routes, middleware → 20% Integration Tests (Mock external API).
  - Critical checkout / login flow           → 10% E2E Tests (Playwright / Cypress).
```

### Step 2 — Lập Ma trận Kịch bản (Test Scenario Matrix)
```
Ví dụ với hàm transferMoney(fromId, toId, amount):
  1. TC-01 (Happy): Chuyển tiền thành công khi số dư đủ, trừ tài khoản A, cộng tài khoản B.
  2. TC-02 (Edge): Chuyển đúng bằng số dư hiện có (số dư về 0).
  3. TC-03 (Error): Chuyển số tiền âm hoặc = 0 -> Ném ValidationError.
  4. TC-04 (Error): Số dư không đủ -> Ném InsufficientFundsError.
  5. TC-05 (Edge): fromId trùng toId -> Ném SelfTransferError.
  6. TC-06 (Concur): 2 giao dịch đồng thời -> Xử lý lock/transaction an toàn.
```

### Step 3 — Viết Code Kiểm thử (Test Implementation)
```
Tuân thủ cấu trúc AAA:
  // 1. Arrange: Chuẩn bị dữ liệu mẫu và mock
  const user = createMockUser({ balance: 100 });
  
  // 2. Act: Gọi hàm cần test
  const result = await transferMoney(user.id, recipient.id, 50);
  
  // 3. Assert: Kiểm tra kết quả
  expect(result.status).toBe('SUCCESS');
  expect(user.balance).toBe(50);
```

### Step 4 — Verification & Chạy Test Thực Tế
```
Actions:
  - Chạy lệnh test thật qua terminal (`npm test -- run`, `pytest -v`, `go test ./...`).
  - Đảm bảo toàn bộ test cases đều PASS (Màu xanh).
  - Đảm bảo test chạy độc lập (Isolated), không phụ thuộc vào thứ tự thực thi.
```

---

## Prompt Template

```
Target:       [File hoặc Function cần viết test: vd: src/services/PaymentService.ts]
Framework:    [Vitest / Jest / Pytest / Playwright]
Level:        [Unit / Integration / E2E]
Phụ thuộc:    [Cần mock Stripe API, PostgreSQL DB]
Yêu cầu:      [Cover các trường hợp lỗi mạng, thẻ hết hạn, concurrency]
```

### Ví dụ theo Stack:

**Vitest (Unit Test cho Business Logic)**
```
Target:       calculateDiscount(cart, coupon)
Framework:    Vitest + TypeScript
Yêu cầu:      Test giảm giá phần trăm, giảm giá cố định, mã hết hạn, coupon vượt quá tổng giá trị đơn hàng.
```
→ AI tạo: `tests/unit/calculateDiscount.test.ts` với đầy đủ 6 test cases, kiểm tra boundary condition `Math.max(0, total - discount)`.

**Pytest (Integration Test cho FastAPI Endpoint)**
```
Target:       POST /api/v1/items
Framework:    Pytest + httpx AsyncClient
Yêu cầu:      Test tạo item thành công (201), validate body thiếu trường bắt buộc (422), unauthenticated (401).
```
→ AI tạo: `tests/test_items_api.py`, sử dụng pytest fixture cho test DB session và test client.