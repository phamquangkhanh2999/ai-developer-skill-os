---
# ── Identity ───────────────────────────────────────────────
name: qk-access-policy
version: 9.1.0
status: stable
description: "Quản lý RBAC, ABAC — định nghĩa role matrix trước, implement middleware sau."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - access-control
  - security-policy

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "cấu hình rbac"
  - "phân quyền"
  - "bảo mật api"
  - "auth middleware"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-api-lifecycle

knowledge_scope:
  owns:
    - security-policy
    - role-matrix
  references:
    - architecture
    - security
    - anti-patterns

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
risk: high
side_effects: edit_files
produces: [code, report]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-access-policy — Access Control Designer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Memory Workflow

### 0. Self-Init Protocol (Khởi Tạo Bộ Nhớ Local & Gitignore)
- Trước khi tra cứu hoặc lưu trữ tri thức, BẮT BUỘC kiểm tra sự tồn tại của thư mục `.ai-local/` tại gốc dự án:
  - **Tự động tạo mới:** Nếu `.ai-local/` chưa tồn tại, AI phải tự động tạo cấu trúc thư mục `.ai-local/knowledge/` (và file `index.yaml` nếu cần thiết) cùng `.ai-local/candidates/`. Tuyệt đối không ngưng chạy hay hỏi ý kiến người dùng về thao tác khởi tạo tiêu chuẩn này.
  - **Bảo mật Gitignore:** BẮT BUỘC kiểm tra file `.gitignore` của dự án, nếu chưa có dòng `.ai-local/` thì phải tự động thêm vào để tuyệt đối bảo mật tri thức cá nhân và tránh lộ lọt lên Git.

---

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Architecture/Pattern (vd: ma trận quyền authz, middleware rbac).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern bảo mật (vd: guard mới, chính sách Zero-Trust).

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .ai-local/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Thao tác thêm 1 route/role thông thường vào bảng quyền đã có.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---



### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.agents/knowledge/index.yaml` (Shared Project Knowledge)
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Architecture/Pattern (vd: ma trận quyền authz, middleware rbac).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern bảo mật (vd: guard mới, chính sách Zero-Trust).

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Thao tác thêm 1 route/role thông thường vào bảng quyền đã có.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern bảo mật (vd: guard mới, chính sách Zero-Trust).

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Thao tác thêm 1 route/role thông thường vào bảng quyền đã có.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern bảo mật (vd: guard mới, chính sách Zero-Trust).

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Thao tác thêm 1 route/role thông thường vào bảng quyền đã có.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] User roles and protected resources are defined
- [ ] Auth system (JWT, session, OAuth) is identified

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần định nghĩa: danh sách roles + resources cần bảo vệ."
```

---

## Scope
- ✅ Define explicit Role-Permission Matrix before coding
- ✅ Implement middleware/guards based strictly on the matrix
- ✅ Separate auth (who are you?) from authz (what can you do?)
- ✅ **Bắt buộc tuân thủ R-SEC-04: Mọi kiểm tra phân quyền phải thực hiện ở Backend (Server-side) qua Middleware. Tuyệt đối không tin tưởng JWT Claims thô chưa xác thực từ Client.**

## Non-Goals
- ❌ Grant wildcard (*) permissions
- ❌ Mix authentication logic with authorization logic
- ❌ Hardcode role checks in business logic (use middleware/guards)

---

## Priority Order
| P | Task | Skip Threshold |
|---|------|----------------|
| P1 | Define Role-Permission Matrix | Never |
| P2 | Implement deny-by-default middleware | Never |
| P3 | Add role guards to routes/controllers | Budget < 30% |
| P4 | Add audit logging for auth failures | Budget < 60% |

---

## Role-Permission Matrix Format (Required)

```
Resource          | admin | manager | user | guest
─────────────────────────────────────────────────
GET /resource     |   ✅   |    ✅    |  ✅  |   ✅
POST /resource    |   ✅   |    ✅    |  ❌  |   ❌
DELETE /resource  |   ✅   |    ❌    |  ❌  |   ❌
```

---

## Workflow

### Phase 1 — Matrix Definition
1. List all roles and resources from requirements
2. Create Role-Permission Matrix (table format above)
3. Identify conflicts or contradictions

**Decision:** `IF matrix has contradiction → EXIT: BLOCKED — resolve ambiguity`

### Phase 2 — Implementation
1. Create deny-by-default guard/middleware
2. Apply guards to routes using matrix
3. Add auth failure logging

### Phase 3 — Verification
1. Read matrix vs implementation — spot check 3 routes

---

## Evidence Format
```
[SEVERITY] src/middleware/auth.ts:LINE
Rule:       [WILDCARD | MISSING_GUARD | SOC_VIOLATION | HARDCODED_ROLE]
Reason:     [specific issue]
Confidence: HIGH
Fix:        [specific change]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Matrix defined, middleware implemented, deny-by-default applied | Implementation complete |
| PARTIAL | Implemented but missing audit logging or some routes unguarded | Post-verification minor gaps |
| BLOCKED | Roles or resources undefined — cannot create matrix | Missing inputs |
| FAILED | Contradiction in matrix or auth/authz mixed | Architectural violation |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Roles and resources explicitly defined | Build matrix and implement |
| MEDIUM | Roles inferred from codebase | Build matrix, ask user to verify |
| LOW | Authentication strategy unknown | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Route unguarded due to missing middleware | Anyone can access DELETE /users |
| HIGH | Hardcoded roles in business logic | `if (user.role === 'admin')` in service layer |
| MEDIUM | Wildcard permissions granted | `user` can access `*` |
| LOW | Audit log missing for auth failure | Unlogged 403 error |

---

## Retry Policy
```
Route verification fails
  └─ Route unguarded
       ├─ Add missing guard to route
       └─ Do NOT retry more than 1 time per route
```

---

## Escalation Rules
```
BLOCKED: Roles or resources undefined
Missing:
  - List of user roles
  - List of protected resources
Questions:
  1. Hệ thống có những role nào? (ví dụ: admin, user, manager)
  2. Những API/Route nào cần bảo vệ?
Recommended Assumptions:
  - Deny-by-default for all non-public routes
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["roles", "resources"],
  "optional_fields": ["auth_strategy"]
}
```
### Produces
```json
{
  "to": "user",
  "output_fields": ["role_matrix", "middleware_files", "guarded_routes", "exit_code"]
}
```

---

