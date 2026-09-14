---
# ── Identity ───────────────────────────────────────────────
name: qk-web-quality-gate
version: 9.2.0
status: experimental
description: "Đo lường chất lượng kỹ thuật Web: Accessibility violations (WCAG), Core Web Vitals, Lighthouse score, SEO tags, security headers. Output là số đo và lỗi kỹ thuật cụ thể. Dùng skill này khi user nhắc đến: a11y, accessibility, wcag, lighthouse, core web vitals, seo audit, page speed, performance score, security headers — KHÔNG dùng cho review thiết kế UI hay spacing."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - web-performance
  - accessibility
  - seo
  - lighthouse
  - ux-audit

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "a11y"
  - "accessibility"
  - "wcag"
  - "lighthouse"
  - "core web vitals"
  - "seo audit"
  - "page speed"
  - "performance score"
  - "security headers"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-ui-audit
  - qk-ui-builder

knowledge_scope:
  domain:
    - web-performance
    - web-accessibility
  concepts:
    - lighthouse
    - seo
    - ux-heuristics
  references:
    - architecture

decision_boundary:
  owns:
    - lighthouse audit
    - accessibility review
    - performance audit
    - seo audit
  does_not_own:
    - ui component implementation
  conflicts_with: []

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: web-quality-review

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: slow
risk: low
side_effects: read_only
produces: [report]
consumes: [user-description, source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-web-quality-gate — Web Quality, A11y & Performance Auditor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm đo lường và đánh giá các chỉ số chất lượng kỹ thuật của ứng dụng Web: **Accessibility (WCAG 2.1 AA) → Core Web Vitals (LCP, FID/INP, CLS) → SEO meta tags → Security Headers**. Xuất báo cáo định lượng và chỉ dẫn khắc phục cụ thể.

---

## Preconditions

Trước khi audit chất lượng web, AI BẮT BUỘC kiểm tra:

- [ ] Xác định trang hoặc component web cần kiểm tra.
- [ ] Xác định frontend framework và rendering method (SSR, SSG, CSR, Next.js, Nuxt) từ `.agents/DEV_PROFILE.md`.
- [ ] Đảm bảo có thể truy cập mã nguồn template HTML / JSX để đọc semantic tags.
- [ ] Nếu trang hoàn toàn là client-side SPA mà không có mã nguồn cấu trúc DOM:
  → **EXIT: BLOCKED**
  → Báo cáo user cung cấp URL môi trường staging hoặc file mã nguồn template tương ứng.

---

## Scope

✅ Skill này làm:
- Kiểm toán Accessibility (A11y theo chuẩn WCAG 2.1 AA):
  - Semantic HTML (`<main>`, `<nav>`, `<header>`, `<h1>-<h6>` thứ tự đúng).
  - ARIA attributes (`aria-label`, `aria-expanded`, `aria-hidden`, `role`).
  - Keyboard navigation (tab order, focus trap trong modals, skip links).
  - Alt text cho hình ảnh và caption cho media.
- Phân tích Core Web Vitals & Performance:
  - LCP (Largest Contentful Paint): Tối ưu hóa ảnh (next/image, webp, priority loading).
  - CLS (Cumulative Layout Shift): Khai báo width/height cho hình ảnh, placeholder cho ad slots.
  - INP/FID: Tối ưu bundle size, dynamic imports / code-splitting.
- Kiểm tra SEO Technical: Title tag, Meta description, OpenGraph tags, Canonical link, Robots/Sitemap.
- Kiểm tra HTTP Security Headers khuyến nghị: CSP, X-Frame-Options, HSTS.

❌ Skill này KHÔNG làm:
- Đánh giá tính thẩm mỹ hoặc spacing thị giác (→ `qk-ui-audit`).
- Tự viết component UI mới từ đầu (→ `qk-ui-builder`).
- Thiết lập hạ tầng CDN hoặc server proxy Nginx/Cloudflare (→ `qk-devops-platform`).

---

## Execution Steps

### Step 1 — Semantic & A11y DOM Inspection
```
Inputs:  Page/Component source code
Actions:
  - Kiểm tra tính hợp lệ của cây phân cấp headings (h1 -> h2 -> h3, không nhảy cóc).
  - Soát tất cả thẻ `<img>` thiếu `alt` hoặc thẻ tương tác (`<button>`, `<a>`) thiếu text/aria-label.
  - Kiểm tra form inputs có gắn kèm `<label>` tường minh hay không.
Output: A11y violation list
```

### Step 2 — Performance & Core Web Vitals Analysis
```
Inputs:  Asset imports, Rendering architecture
Actions:
  - Kiểm tra cách load font chữ (font-display: swap) và CSS render-blocking.
  - Phát hiện các ảnh dung lượng lớn chưa được responsive srcset hoặc nén modern formats (AVIF/WebP).
  - Đánh giá chiến lược lazy-loading cho các components nằm dưới màn hình đầu tiên (below the fold).
Output: Web Vitals bottleneck map
```

### Step 3 — SEO & Security Header Audit
```
Inputs:  HTML Head configuration, Next.js metadata / Nuxt useHead
Actions:
  - Soát độ dài Title (50-60 ký tự) và Description (150-160 ký tự).
  - Kiểm tra cấu hình thẻ mạng xã hội (og:image, og:title, twitter:card).
  - Đánh giá Content Security Policy (CSP).
Output: SEO & Security posture report
```

### Step 4 — Remediation Guide Formulation
```
Inputs:  Findings across all categories
Actions:
  - Tổng hợp thành bảng điểm định lượng và phân loại độ ưu tiên (P0: Blockers, P1: High, P2: Polish).
  - Cung cấp đoạn code JSX/HTML sửa mẫu trực quan.
Exit: SUCCESS
```

---

## Prompt Template

```
Trang / URL:       [Đường dẫn file page hoặc route URL cần kiểm tra]
Trọng tâm audit:   [A11y WCAG / Core Web Vitals / SEO Technical / Tất cả]
Vấn đề ghi nhận:   [Chậm tải trang, lighthouse điểm đỏ, cảnh báo screen reader, ...]
```