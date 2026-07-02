---
name: qk-access-policy
purpose: Quản lý chính sách bảo mật, phân quyền RBAC và ranh giới truy cập.
mode_supported: [enterprise]
input: [Access rules]
output: [Access policies]
workflow: [1. Rà soát Roles -> 2. Kiểm tra Permissions -> 3. Cập nhật rule]
allowed_tools: [read_file, write_to_file]
handoff_to: [qk-engineering-standard]
---

# 🛠️ qk-access-policy - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Quản lý chính sách bảo mật, phân quyền RBAC và ranh giới truy cập.

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `qk-engineering-standard`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Auth & Security Engineer

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User asks to "add login", "protect this route", or "implement OAuth"
- Defining user roles and permissions (Admin vs User)
- Project audit flags security vulnerabilities (P0/P1)
- Handling sensitive data (passwords, PII, API keys)

---

## Scope

- ✅ **Authentication:** JWT, Session Cookies, OAuth2 (Google, GitHub, etc.), Magic Links.
- ✅ **Authorization:** Role-Based Access Control (RBAC), Middleware guards.
- ✅ **Data Protection:** Hashing passwords (bcrypt, Argon2), encrypting sensitive fields.
- ✅ **Vulnerability Prevention:** CSRF protection, Rate Limiting, CORS config, input sanitization (SQLi/XSS).

---

## Non-goals

- ❌ Do NOT store passwords in plain text. Ever.
- ❌ Do NOT hardcode secrets or private keys in the code (use `.env`).
- ❌ Do NOT store JWTs in `localStorage` if cookies (`httpOnly`) are an option, unless explicitly requested.

---

## Workflow

### Phase 1 — Strategy Selection

Determine the auth mechanism:
1. **Stateless (JWT):** Good for mobile/SPAs, distributed systems.
2. **Stateful (Sessions):** Good for traditional web apps, easier revocation.
3. **Third-party (OAuth / Auth0 / NextAuth / Supabase):** Offload auth complexity.

### Phase 2 — Implementation

**For JWT + Cookies (Recommended Web Pattern):**
1. Create Login endpoint: Verify password → Generate JWT → Set `httpOnly` cookie.
2. Create Middleware: Extract cookie → Verify JWT signature → Attach user to request.
3. Create Logout endpoint: Clear the cookie.

**For Authorization:**
1. Define roles (e.g., `enum Role { ADMIN, USER }`).
2. Create Role Middleware: Check `req.user.role`.

### Phase 3 — Security Audit

Verify:
- Passwords are hashed with a salt (e.g., `bcrypt.hash(password, 10)`).
- Cookies are `httpOnly`, `Secure` (in prod), and `SameSite`.
- CORS is configured to only allow trusted origins.

---

## Output Format

```
🛡️ Auth & Security Report
─────────────────────────────────────────────────
Mechanism:  [JWT in httpOnly Cookie / OAuth / Session]
Roles:      [Admin, User]

Components Implemented:
  ✅ Login/Logout handlers
  ✅ Auth Middleware (Guard)
  ✅ Password hashing (bcrypt)

Security measures enforced:
  • `httpOnly`, `Secure`, `SameSite=Strict` on cookies
  • CORS restricted to frontend origin

🔗 Next Steps:
  Remember to add `JWT_SECRET` to your production environment variables.
```
