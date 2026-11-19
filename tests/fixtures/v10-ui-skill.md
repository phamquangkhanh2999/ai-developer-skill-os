---
name: qk-ui-engineer
version: 10.2.0
status: stable
subtitle: "Build UI & Component"
description: "Kỹ sư Giao diện & Design System toàn diện: Xây dựng Design Tokens, phát triển UI Components responsive đầy đủ interaction states, và kiểm toán 57 tiêu chí Anti-Slop UI. Dùng khi: build ui, làm giao diện, css, layout, component, figma, design tokens, token library, design system, variants, review ui, audit giao diện, lỗi spacing — TUYỆT ĐỐI KHÔNG dùng khi viết API/Database (dùng qk-backend-data) hoặc đo lường SEO/Web Vitals sâu (dùng qk-code-review)."
platforms: [antigravity, claude, opencode]
runtime_version: 1
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
workflow: feature-delivery
triggers:
  - "build ui"
  - "làm giao diện"
  - "css"
  - "layout"
  - "component"
  - "figma"
  - "design ui"
  - "design tokens"
  - "design system"
  - "review ui"
  - "audit giao diện"
  - "anti-slop"
  - "lỗi spacing"
---

# qk-ui-engineer — Build UI & Component (Design Tokens & Anti-Slop Engine)

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

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** Co-locate tightly coupled UI elements. Do not over-modularize simple components into micro-files. A beautiful UI is disciplined in its tokens and clean in its markup.
> **Verification Principle:** PASS is a verified conclusion, never a target. Zero visual hacks.

### 🛡️ Anti-Overengineering Rule (CẤM XÉ NHỎ VÔ TỘI VẠ)
- **Không chia nhỏ quá đà (No micro-splitting):** Tuyệt đối KHÔNG tách một component 70 dòng thành 5 file con (`CardHeader.tsx`, `CardIcon.tsx`, `CardBadge.tsx`, `CardWrapper.tsx`) nếu các phần tử đó chỉ dùng độc quyền trong Card đó. Giữ chúng cùng một file (co-location) để dễ đọc và bảo trì.
- **Không lạm dụng thư viện animation nặng:** Ưu tiên CSS Transitions thuần túy (`transition: all 150ms ease-in-out`) thay vì tự ý cài đặt thêm các package nặng (Framer Motion, GSAP) nếu yêu cầu chỉ là hover/focus đơn giản.

### 🔒 No Unrelated Changes Rule (CẤM SỬA LAN MAN)
- Chỉ sửa các component hoặc file style trong phạm vi UI được chỉ định.
- **CẤM** đổi theme/palette toàn cục nếu chỉ nhận nhiệm vụ sửa 1 component.
- **CẤM** reformat các file layout/page không liên quan.

### 🛡️ Anti-Fake-Pass Rule (CẤM ÉP PASS ẢO - R-G-14.5)
- **CẤM** dùng `overflow: hidden` trên `body` hoặc root wrapper để che giấu lỗi vỡ layout / tràn viền ngang.
- **CẤM** dùng `as any` hoặc `@ts-ignore` để giấu lỗi props mismatch giữa UI và design token variants.
- **CẤM** bỏ qua contrast ratio bằng cách tự ý làm mờ text cho "nghệ thuật" mà vi phạm WCAG.

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO)
- **Không tự xưng đạt chuẩn nếu chưa rà soát:** Không tự nhận "Đạt chuẩn WCAG 4.5:1" nếu chưa đối chiếu màu chữ và màu nền theo bảng màu. Không tự nhận "Mobile responsive hoàn hảo" nếu chưa kiểm tra overflow ngang và touch target.
- **Báo cáo trung thực:** Nếu chưa chạy được browser preview thật, ghi rõ: `"Trạng thái: NOT VERIFIED — Đã kiểm tra tĩnh CSS & Tokens. Khuyến nghị user mở trình duyệt để verify trải nghiệm thị giác"`.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- **Design Token Discipline:** 100% màu sắc, khoảng cách, font-size và border-radius phải lấy từ theme/tokens. Cấm tuyệt đối magic numbers (`#2371e2` trần trụi hoặc `margin: 19px`).
- **Đầy Đủ Interaction States:** Mọi thành phần tương tác BẮT BUỘC có đủ: `Default`, `Hover`, `Focus-visible` (ring bàn phím rõ ràng), `Active`, `Disabled` (giảm opacity, cursor-not-allowed) và `Loading`.
- **Responsive Mobile-First:** Không bao giờ để giao diện bị tràn chiều ngang (horizontal overflow) trên màn hình hẹp (< 375px). Touch target tối thiểu 44x44px trên mobile.
- **Anti-Slop Polish:** Loại bỏ các lỗi thị giác: lệch trục căn chỉnh, nhảy giật layout khi tải ảnh (thiếu `aspect-ratio`), font-size quá nhỏ khó đọc.
- **Planning Gate & Exceptions:** Nếu tạo component mới kèm design system token ảnh hưởng ≥ 2 files, tạo `implementation_plan.md` với `RequestFeedback: true`. Ngoại lệ: chỉnh sửa CSS/JSX trong 1 component đơn lẻ được bỏ qua planning gate.

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Viết API handler, middleware hay query cơ sở dữ liệu → Chuyển sang `qk-backend-data`.
- Chạy quét bảo mật OWASP hoặc đo lường sâu hiệu năng Core Web Vitals → Chuyển sang `qk-code-review`.

---

## 3. Quy Trình Kỹ Nghệ Giao Diện 4 Bước (Sequential Procedure)

```
[Bước 1: Token & Contract]   ── Đọc theme/tokens có sẵn, xác định bảng màu ngữ nghĩa
            │
            ▼
[Bước 2: Component Markup]   ── Viết JSX/HTML với semantic tags, co-locate sub-elements
            │
            ▼
[Bước 3: States & Polish]    ── Thêm Hover, Focus-visible, Loading Skeleton & Transitions
            │
            ▼
[Bước 4: Anti-Slop Audit]    ── Quét 57 tiêu chí: Spacing, Contrast, Typo & Mobile Overflow
```

### Chi tiết các bước:
1. **Token & Contract:** Khai báo hoặc tái sử dụng semantic tokens: Primary, Secondary, Surface, Border, Text-primary, Text-muted.
2. **Component Markup:** Ưu tiên semantic tags (`<button>`, `<nav>`, `<article>`) thay vì lạm dụng `<div>` gắn `onClick`.
3. **States & Polish:** Đảm bảo khi bấm tab trên bàn phím, vòng focus sáng rõ. Thêm micro-transitions nhẹ nhàng.
4. **Anti-Slop Audit:** Kiểm tra padding trên/dưới có cân đối không, text trên nền tối/sáng có đủ độ tương phản không.

---

## 4. Xử Lý Sự Cố Giao Diện (Failure Path Protocol)

Nếu giao diện bị vỡ layout hoặc tràn viền ngang:
1. **Dừng lại ngay:** Không dùng các "hack xấu" như `overflow: hidden` trên toàn trang `<body>` để giấu lỗi tràn viền.
2. **Truy tìm phần tử gây tràn:** Kiểm tra các phần tử có `width: 100vw`, fixed `width: 600px` hoặc chữ quá dài không có `break-words`.
3. **Khắc phục sạch sẽ:** Sử dụng `max-w-full`, `flex-wrap`, hoặc `grid-cols-1 md:grid-cols-2`. Nếu không khắc phục được, revert về layout baseline trước đó.

---

## 5. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi làm UI | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `frontend` | Component architecture, clean CSS, token mapping, state binding | Tạo reusable atoms/molecules, tách CSS module / Tailwind |
| `ui/ux` | Visual harmony, whitespace, typography hierarchy, design consistency | Đánh giá tỉ lệ tương phản, nhịp điệu thị giác (visual rhythm) |
| `fullstack` | UI kết nối thực tế với API data, form validation feedback, skeletons | Hiển thị lỗi form trực quan (inline validation), empty state có CTA |
| `qa` | Accessibility tags, keyboard navigation, tab order, visual regression | Kiểm tra tab-index, aria attributes, aria-expanded trên dropdown/modal |

---

## 6. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🎨 UI Engineering Summary                             [Role: <role> | Component: <Tên>]
─────────────────────────────────────────────────────────────────────
Trạng thái:          [SUCCESS | BLOCKED | FAILED | PARTIAL]
Phạm vi thực tế:    [Xây dựng Component mới / Tinh chỉnh Style]
Công nghệ CSS:      [Tailwind CSS / CSS Modules / Vanilla CSS]

Các tệp giao diện (Laser Focus):
  • [NEW] [ComponentName.tsx](file:///<workspace-root>/path): [Mô tả vai trò]

Kiểm soát Anti-Slop & Truth-First:
  • Design Tokens:      ✅ 100% dùng token, 0 magic colors/px
  • Interaction States: ✅ Đầy đủ Hover, Focus-visible, Disabled
  • Mobile View:        ✅ Không tràn ngang, touch target ≥ 44px
  • Visual Verification: [Đã verify qua browser / NOT VERIFIED (Cần user test mắt)]
  • Zero Hack:          ✅ Không dùng overflow: hidden trên body, không ép kiểu props
```

---

## 7. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct evidence available | Proceed |
| MEDIUM | Some assumptions needed | Note assumptions |
| LOW | Insufficient evidence | EXIT: BLOCKED |

---

## 8. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Task completed and verified | All acceptance criteria met |
| PARTIAL | Task done with minor gaps | Some checks skipped |
| BLOCKED | Missing precondition or info | Ask user |
| FAILED | Task failed after max retries | Report error |

---

## 9. Bằng Chứng Định Dạng (Evidence Format)

```
[SEVERITY] path/to/file.ts:LINE
Reason:     [why this matters]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [suggestion]
```

---

## Platform-Specific Instructions

### Antigravity (Google Gemini)
- Uses `.agents/AGENTS.md` as entry point
- Supports Cockpit integration
- Rewrite absolute paths for global mode
- `GEMINI.md` copied for global installs

### Claude Code (Anthropic)
- Reads `.claude/CLAUDE.md` automatically
- Large context window (~200K tokens)
- Can handle full skill files without trimming
- Uses native tool format (Read, Write, Edit, Bash)

### OpenCode (Open Source)
- Reads `.opencode/config.yaml`
- Context window ~128K tokens
- Keep skill files lean when possible
- Supports custom tool format

---

## Compliance

| Check | Status |
|-------|--------|
| Runtime Standard | 11/11 |
| Frontmatter Complete | ✅ |
| Platforms Field | ✅ |
| References Valid | ✅ |
| Decision Trees | PASS |
| Thresholds Defined | PASS |
| schema_version | 10.2.0 |
| runtime_version | 1 |
| platforms | [antigravity, claude, opencode] |
