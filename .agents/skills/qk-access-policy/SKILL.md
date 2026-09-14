---
# ── Identity ───────────────────────────────────────────────
name: qk-access-policy
version: 9.2.0
status: stable
description: "Quản lý và thiết lập chính sách phân quyền RBAC/ABAC, định nghĩa permission matrix, sinh auth middleware bảo vệ endpoint. Dùng skill này khi user nhắc đến: phân quyền, rbac, abac, auth middleware, access control, bảo mật api, quyền truy cập, role permission — kể cả khi chỉ nói 'chỉ admin mới được xóa bài viết'."
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
  - "phân quyền"
  - "rbac"
  - "abac"
  - "auth middleware"
  - "access control"
  - "bảo mật api"
  - "quyền truy cập"
  - "role permission"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding
  - security

tools:
  - filesystem
  - terminal

related_skills:
  - qk-api-lifecycle
  - qk-security-audit

knowledge_scope:
  owns:
    - security-policy
    - role-matrix
    - permission-middleware
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
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-access-policy — Access Control & Authorization Designer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thiết kế và triển khai cơ chế kiểm soát truy cập (RBAC / ABAC), bảo đảm nguyên tắc Least Privilege và Zero-Trust: **định nghĩa role matrix trước, implement middleware/guard sau**.

---

## Preconditions

Trước khi bắt đầu code, AI BẮT BUỘC xác nhận các thông tin sau:

- [ ] Danh sách Roles & Entities trong hệ thống (e.g. `guest`, `user`, `editor`, `admin`).
- [ ] Danh mục tài nguyên (Resources) và thao tác (Actions: create, read, update, delete).
- [ ] Cơ chế truyền tải identity hiện tại (JWT payload claims, Session cookie, hay Header API Key).
- [ ] Nếu yêu cầu ABAC: Xác định rõ thuộc tính ngữ cảnh (e.g. `owner_id === user.id`, `tenant_id === org.id`).

*Nếu thiếu thông tin về Role hoặc Auth mechanism:*
→ **EXIT: BLOCKED**
→ Thông báo user: "Vui lòng xác nhận danh sách Roles và cơ chế Identity hiện tại trước khi thiết lập phân quyền."

---

## Scope

✅ Skill này làm:
- Thiết lập **Role-Permission Matrix** rõ ràng (dạng bảng Markdown đối chiếu).
- Tạo Type definitions / Enums cho `Role`, `Permission`, `Resource`, `Action`.
- Xây dựng Auth Middleware / Guard / Decorator kiểm tra quyền truy cập.
- Xử lý phân quyền theo ngữ cảnh / sở hữu tài nguyên (Resource Ownership check).
- Phân tách rõ ràng mã trạng thái HTTP: `401 Unauthorized` (chưa authenticate) vs `403 Forbidden` (đã login nhưng không đủ quyền).

❌ Skill này KHÔNG làm:
- Viết flow đăng ký, đăng nhập, hash password (thuộc auth lifecycle cơ bản).
- Lưu trữ secret/token vào client-side không an toàn.
- Chỉ đặt guard ở controller/route mà bỏ qua validation ở service layer đối với logic nhạy cảm.

---

## Execution Steps

### Step 1 — Xây dựng Role-Permission Matrix
```
Inputs:  user_description, DEV_PROFILE.md
Actions:
  - Liệt kê bảng ma trận phân quyền Role x Resource x Action:
    | Role   | Resource | Actions              | Conditions (ABAC)     |
    |--------|----------|----------------------|-----------------------|
    | user   | post     | read, create         | isOwner to update/del |
    | admin  | post     | read, create, delete | any                   |
Outputs: Markdown table Role Matrix được phê duyệt
Exit: BLOCKED nếu quyền hạn bị mâu thuẫn hoặc chưa rõ scope
```

### Step 2 — Khởi tạo Types & Constants
```
Actions:
  - Khai báo enum/type an toàn (TypeScript/Python/Go) cho Role và Permission.
  - Định nghĩa Policy / Rule registry có type-check chặt chẽ.
  - Không dùng hardcoded string rải rác trong controller.
```

### Step 3 — Triển khai Guard / Middleware
```
Actions:
  - Express/Fastify: Tạo middleware `requirePermission(perm)` hoặc `requireRole(role)`.
  - NestJS: Tạo `@Roles()`, `@Permissions()` decorator + `AuthGuard`, `RolesGuard`.
  - FastAPI: Tạo security dependency `Security(get_current_active_user, scopes=[...])`.
  - Next.js: Xử lý middleware.ts (route matching) + Server Action permission assertion.
Rules:
  - Kiểm tra 401 trước (chưa đăng nhập hoặc token hết hạn).
  - Kiểm tra 403 sau (đã đăng nhập nhưng thiếu quyền).
  - Không bao giờ trả về 500 khi vi phạm authorization.
```

### Step 4 — Verification & Guard Test
```
Actions:
  - Kiểm tra endpoint được bảo vệ: gọi không có token -> 401.
  - Gọi với role thường vào endpoint admin -> 403 Forbidden.
  - Gọi đúng quyền -> 200 OK.
  - Đảm bảo không có lỗ hổng IDOR (Insecure Direct Object Reference).
```

---

## Prompt Template

```
Hệ thống:     [Tên app / module cần phân quyền]
Roles:        [Danh sách roles: vd: viewer, editor, admin]
Resource:     [Tài nguyên cần bảo vệ: vd: documents, orders, users]
Yêu cầu:      [RBAC đơn giản hay có điều kiện sở hữu ABAC]
Stack:        [NestJS / Express / FastAPI / Next.js]
```

### Ví dụ theo Stack:

**role: be (NestJS + TypeScript)**
```
Roles:        User, Moderator, Admin
Resource:     Comment
Yêu cầu:      User chỉ sửa comment của chính mình; Moderator xóa được mọi comment; Admin toàn quyền.
Stack:        NestJS (Guards + Decorators)
```
→ AI tạo: `Role` enum, `@Roles()` decorator, `RolesGuard` implements `CanActivate`, `OwnershipGuard` kiểm tra `comment.authorId === request.user.id`.

**role: fullstack (Next.js 14 App Router)**
```
Roles:        Member, Owner
Resource:     Workspace Settings
Yêu cầu:      Chỉ Owner mới được đổi tên workspace hoặc xóa workspace. Member chỉ xem.
Stack:        Next.js Server Actions + DAL (Data Access Layer)
```
→ AI tạo: Hàm assertion `assertWorkspaceOwner(workspaceId, userId)` dùng chung trong Server Actions, redirect/throw `ForbiddenError` chuẩn SEO & UX.

