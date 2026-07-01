---
name: auth-security
description: >-
  Triển khai tính năng đăng nhập (JWT, OAuth), phân quyền (RBAC) và bảo vệ app khỏi các lỗ hổng OWASP.
version: 1.0.0
category: backend
tags: [auth, security, jwt, oauth, rbac, owasp]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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
