---
# ── Identity ───────────────────────────────────────────────
name: qk-bug-resolution
version: 9.2.0
status: stable
description: "Sửa lỗi (bugs) bằng chu trình khép kín: Observe → Hypothesize → Evidence → Fix → Verify. Dùng skill này khi user nhắc đến: fix bug, sửa lỗi, crash, error, exception, not working, bị lỗi, debug — kể cả khi chỉ paste stack trace hoặc mô tả triệu chứng mà không nói rõ là \"bug\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - bug-fixing
  - debugging
  - error-resolution

complexity:
  level: medium
  criteria:
    files_affected: "2-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "fix bug"
  - "sửa lỗi"
  - "crash"
  - "error"
  - "exception"
  - "not working"
  - "bị lỗi"
  - "debug"


selection:
  priority: high
  confidence_threshold: 0.65

# ── V8: References ─────────────────────────────────────────
workflow: bug-resolution

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-context-loader
  - qk-test-engineering

knowledge_scope:
  owns:
    - bug-diagnosis
    - fix-strategies
    - root-cause-analysis
  references:
    - testing
    - language-specific-features
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: bug-fix

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [stack-trace, error-message, user-description, context-graph]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-bug-resolution — Diagnose & Repair

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm chẩn đoán và khắc phục lỗi mã nguồn theo chu trình khép kín: **Observe (Quan sát) → Hypothesize (Giả thuyết) → Evidence (Bằng chứng) → Fix (Sửa chữa) → Verify (Xác thực)**. Tuyệt đối không đoán mò hoặc áp dụng "quick-hack" làm che giấu lỗi gốc.

---

## Preconditions

Trước khi sửa bất kỳ dòng code nào, AI BẮT BUỘC kiểm tra:

- [ ] Thu thập đầy đủ triệu chứng lỗi: error message, stack trace, hoặc mô tả hành vi sai lệch (reproduction steps).
- [ ] Xác định file/hàm nghi vấn và đọc source code thực tế.
- [ ] Tái hiện hoặc tìm được bằng chứng trực tiếp xác nhận nguyên nhân gốc (root cause).
- [ ] Nếu không có đủ thông tin hoặc không thể xác định được nguyên nhân:
  → **EXIT: BLOCKED**
  → Báo cáo user yêu cầu bổ sung context, logs hoặc reproduction steps.

---

## Scope

✅ Skill này làm:
- Phân tích stack traces, server logs, console errors.
- Điều tra nguyên nhân gốc rễ (Root Cause Analysis) tại tầng logic, type mismatch, hoặc concurrency.
- Đưa ra giải pháp khắc phục triệt để (surgical fix) nhắm đúng nguyên nhân gốc.
- Thêm hoặc cập nhật test cases để tái hiện bug và ngăn chặn hiện tượng hồi quy (regression).
- Bảo toàn hành vi ban đầu của các tính năng không liên quan.

❌ Skill này KHÔNG làm:
- Viết lại toàn bộ module hoặc đổi kiến trúc lớn chỉ để sửa 1 bug (→ `qk-refactor`).
- Xây dựng thêm tính năng mới chưa từng tồn tại (→ `qk-feature-delivery`).
- Tự động thay đổi DB schema nếu chưa đánh giá tính tương thích ngược (→ `qk-data-lifecycle`).

---

## Execution Steps

### Step 1 — Observe & Reproduce
```
Inputs:  Error logs, Stack trace, Mô tả từ user
Actions:
  - Phân tích vị trí file, dòng code gây lỗi.
  - Xác định điều kiện biên (edge cases) hoặc trạng thái dữ liệu kích hoạt bug.
Output: Symptom breakdown & Target files
```

### Step 2 — Hypothesize & Evidence Gathering
```
Inputs:  Target code, Runtime environment
Actions:
  - Đặt giả thuyết về nguyên nhân cốt lõi (null pointer, race condition, state mutation, network failure).
  - Đọc code liên quan để kiểm chứng giả thuyết (xem callers, callees, data flow).
Exit: BLOCKED nếu giả thuyết không có bằng chứng logic chứng minh.
```

### Step 3 — Surgical Fix
```
Inputs:  Verified root cause
Actions:
  - Sửa lỗi chính xác tại nơi phát sinh (surgical modification).
  - Đảm bảo xử lý triệt để các edge cases liên đới.
  - Giữ nguyên coding style và quy ước hiện hữu của dự án.
Output: Targeted code fix
```

### Step 4 — Verify & Prevent Regression
```
Inputs:  Targeted code fix
Actions:
  - Kiểm tra xem lỗi đã được khắc phục hoàn toàn chưa.
  - Chạy linter, typecheck và unit tests liên quan.
  - Đề xuất hoặc viết regression test để đảm bảo lỗi không tái diễn.
Exit: SUCCESS nếu verification pass và không phát sinh side effects.
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết stack. Paste đúng error — AI sẽ đọc code, không đoán mò.

```
Lỗi:        [Error message / stack trace đầy đủ — paste nguyên văn]
Xảy ra khi: [Thao tác / điều kiện / input nào trigger lỗi]
Tần suất:   [Luôn luôn / đôi khi / chỉ trên production / chỉ với user X]
File nghi ngờ: [Đường dẫn nếu biết]
Đã thử:     [Những gì đã làm — để AI không lặp lại]
```

---

### Theo Role — AI điều tra theo chiều sâu khác nhau:

**role: fe**
```
Lỗi:        Uncaught TypeError: Cannot read properties of null (reading 'userId')
            at ProfileCard.tsx:47
Xảy ra khi: Vào /profile sau khi logout rồi login lại bằng account khác
Tần suất:   Luôn luôn reproduce được
File nghi ngờ: src/components/ProfileCard.tsx, src/store/authStore.ts
Đã thử:     Thêm null check ở line 47 nhưng lỗi chuyển sang line 52
```
→ AI điều tra: stale state trong Zustand/Redux khi re-login, component lifecycle
  vs store reset timing, race condition giữa auth state và component render.

**role: be**
```
Lỗi:        PrismaClientKnownRequestError: Unique constraint failed on field `email`
            at POST /api/auth/register — status 500 thay vì 409
Xảy ra khi: Register với email đã tồn tại
Tần suất:   Luôn luôn
File nghi ngờ: src/routes/auth/register.ts
Đã thử:     Chưa thử gì, mới phát hiện
```
→ AI điều tra: missing error type guard cho Prisma errors, HTTP status code mapping,
  idempotency của endpoint, có nên check trước (findUnique) hay catch lỗi.

**role: fullstack**
```
Lỗi:        Optimistic update trên FE hiện sai data, sau 2s mới sync về đúng
Xảy ra khi: Xóa item trong danh sách → item biến mất → reload lại → item vẫn còn
Tần suất:   Chỉ xảy ra khi network chậm (> 1s)
File nghi ngờ: FE: useDeleteItem.ts / BE: DELETE /api/items/:id
Đã thử:     Đã kiểm tra BE trả 200 đúng
```
→ AI điều tra: React Query mutation onMutate/onError/onSettled sequence,
  cache invalidation timing, BE rollback khi constraint violation,
  contract mismatch giữa FE optimistic state và BE response.

**role: data**
```
Lỗi:        DuplicateKeyError trên BigQuery sau khi re-run DAG ngày 2024-01-15
            Job: daily_sales_load — task: load_to_bq
Xảy ra khi: Manual re-run sau khi pipeline fail giữa chừng
Tần suất:   Mỗi lần re-run partial load
File nghi ngờ: dags/daily_sales_load.py, transforms/sales_transform.sql
Đã thử:     Xóa data ngày đó trên BQ rồi re-run — OK, nhưng không scalable
```
→ AI điều tra: idempotency gap (thiếu MERGE/UPSERT), partition-based delete trước load,
  task atomicity design, watermark checkpoint bị reset sai.

**role: ai-engineer**
```
Lỗi:        RAG trả lời sai — cite đúng document nhưng nội dung không liên quan
Xảy ra khi: Câu hỏi có nhiều từ khóa overlap với nhiều document khác nhau
Tần suất:   ~30% queries liên quan đến chủ đề "pricing"
File nghi ngờ: retrieval/vector_search.py, prompts/rag_system.txt
Đã thử:     Tăng top_k từ 3 lên 5 — không cải thiện
```
→ AI điều tra: embedding model semantic mismatch, chunk boundary cắt mất context,
  thiếu reranking layer, system prompt không enforce grounding,
  cần hybrid search (BM25 + dense) cho domain-specific terms.

**role: devops**
```
Lỗi:        GitHub Actions deploy job fail: "Error: EACCES: permission denied, open '/app/logs'"
            Stage: production — chỉ xảy ra sau khi update Docker base image
Xảy ra khi: Deploy lên production container
Tần suất:   100% sau khi merge PR #247
File nghi ngờ: Dockerfile, docker-compose.prod.yml, .github/workflows/deploy.yml
Đã thử:     Revert base image — OK, nhưng cần base image mới để patch CVE
```
→ AI điều tra: USER directive trong Dockerfile thay đổi giữa image versions,
  volume mount permission, non-root user setup, security vs functionality trade-off.
