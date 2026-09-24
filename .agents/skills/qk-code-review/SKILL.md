---
name: qk-code-review
version: 10.2.0
status: stable
subtitle: "Review Code & Audit"
description: "Kiểm toán mã nguồn toàn diện: Đánh giá kiến trúc, chấm điểm sức khỏe Codebase Health Score (0–100), quét bảo mật OWASP Top 10 và kiểm định chất lượng Web WCAG AA. Dùng khi: review code, code review, kiểm tra code, đánh giá code, health check, nợ kỹ thuật, security audit, scan lỗ hổng, owasp, secret leak, a11y, accessibility, wcag — TUYỆT ĐỐI KHÔNG dùng khi trực tiếp sửa code (dùng qk-code-cleaner)."
platforms: [antigravity, claude, opencode]
runtime_version: 1
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
  - security
workflow: code-review
triggers:
  - "review code"
  - "code review"
  - "kiểm tra code"
  - "đánh giá code"
  - "health check"
  - "kiểm tra sức khỏe code"
  - "project score"
  - "nợ kỹ thuật"
  - "tech debt"
  - "security audit"
  - "kiểm tra bảo mật"
  - "scan lỗ hổng"
  - "owasp"
  - "tìm secret leak"
  - "a11y"
  - "wcag"
---

# qk-code-review — Review Code & Audit (360° Architecture & Security Audit Engine)

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
  - 👉 *Domain Focus:* Architecture / Convention / Pattern hiện hành của dự án (Ground Truth để thẩm định).

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
  - 👉 *Domain Harvest:* Pattern hoặc Convention mới (vd: phát hiện anti-pattern lặp đi lặp lại trong codebase).

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
- 👉 *Domain Ignore:* Các góp ý phong cách (formatting/linting) đơn lẻ trong một PR.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Giáo Điều (Anti-Dogma)

> **Core Principle:** Metrics are signals, not goals. A file of 320 lines that is cohesive, clean, and well-tested is far superior to 5 fragmented micro-files created solely to satisfy an arbitrary line-count limit.
> **Audit Principle:** PASS is a verified conclusion, never a target. Zero sugarcoating.

### 🛡️ Anti-Dogma Review Rule (CẤM BẮT BẺ VỤN VẶT)
- **Đánh giá theo ngữ cảnh:** Tuyệt đối KHÔNG trừ điểm máy móc nếu file dài hơn 300 dòng một chút nhưng cấu trúc rõ ràng (như DTOs, config, state machine hoặc generated code). Chỉ gắn cờ cảnh báo khi file đó có nhiều trách nhiệm lộn xộn (God file) và khó bảo trì.
- **Tập trung vào giá trị thực:** Ưu tiên phát hiện rủi ro bảo mật (OWASP), logic lỗi ngầm, rò rỉ bộ nhớ, và vi phạm quyền truy cập thay vì sa đà vào các nhận xét phong cách (formatting/linting) mà prettier có thể tự sửa.

### 🔒 Laser Focus & Repository Inspection Rule (R-G-13)
- Chỉ quét và kiểm toán các file thuộc diff hoặc module được người dùng chỉ định.
- **CẤM** quét toàn bộ codebase bừa bãi hoặc biến việc audit thành một bản tấu sớ lan man hàng trăm file không liên quan.

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO - R-G-14.7)
- **Không bịa đặt số liệu:** Cấm báo cáo "0 Secret Leaks" nếu chưa chạy regex quét chuỗi nhạy cảm. Cấm báo cáo "Đạt chuẩn WCAG AA" nếu chưa kiểm tra màu sắc tương phản và thẻ ARIA.
- **Rõ ràng phạm vi:** Phải nêu rõ danh sách chính xác các file đã đọc và kiểm toán. Những file chưa đọc phải ghi rõ nằm ngoài phạm vi review đợt này.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- **Tư duy Kiến trúc sư (Architect Mindset):** Đánh giá tính đóng gói, ranh giới giữa các module, luồng dữ liệu một chiều và xử lý lỗi phòng thủ.
- **Health Scorecard Định Lượng (0–100):** Chấm điểm nợ kỹ thuật theo thang đo khách quan, có đối chứng số dòng và độ sâu lồng ghép.
- **OWASP Top 10 Scan:** Quét lỗ hổng Broken Access Control (IDOR), SQL Injection, XSS, Secret Leaks (regex quét tokens, passwords, keys).
- **Dual-Stream Reporting:** Tạo file artifact `review_report.md` chi tiết tại thư mục brain, và chỉ in bản tóm tắt điều hành 15–25 dòng tại cửa sổ chat.

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Tự tiện sửa mã nguồn trong repo → Skill này là Read-Only Auditor. Để thực thi sửa đổi an toàn, chuyển giao sang `qk-code-cleaner`.

---

## 3. Thang Điểm Sức Khỏe Codebase (Health Score: 0–100)

```
Điểm khởi điểm: 100 điểm. Trừ điểm dựa trên vi phạm thực tế:
─────────────────────────────────────────────────────────────────────────────
• God File (Lộn xộn > 300L):           -5 điểm / file (Có xem xét ngữ cảnh)
• Long Function (Phức tạp > 40L):      -2 điểm / hàm
• Deep Nesting (> 3 tầng if/for):      -2 điểm / vị trí
• Hardcoded Secret (Lộ Key/Pass):      -25 điểm (CRITICAL — Báo động đỏ ngay)
• Broken Access Control (Dính IDOR):   -20 điểm (CRITICAL)
• SQL / Command Injection:             -20 điểm (CRITICAL)
─────────────────────────────────────────────────────────────────────────────
Xếp loại: 90-100 (Xuất sắc) | 75-89 (Khá) | 50-74 (Cảnh báo) | <50 (Nguy hiểm)
```

---

## 4. Quy Trình Kiểm Toán 4 Bước & Báo Động Khẩn

```
[Bước 1: Phạm vi & Regex Scan]  ── Đọc danh sách file, quét regex tìm Secret Leaks
            │
            ▼
[Bước 2: OWASP & Logic Audit]   ── Rà soát IDOR, Injection, Null safety & Error handling
            │
            ▼
[Bước 3: Scorecarding]          ── Tính điểm Health Score, phân loại P0 (Critical) đến P3
            │
            ▼
[Bước 4: Dual-Stream Report]    ── Xuất review_report.md + Chat Executive Summary 15-25L
```

### 🚨 Giao thức Báo Động Khẩn (Critical Security Trigger):
Nếu phát hiện **Hardcoded API Key/Secret** hoặc **Lỗ hổng SQL Injection/IDOR**:
- BẮT BUỘC in cảnh báo đỏ nổi bật ngay dòng đầu tiên của chat:
  `🚨 [CRITICAL SECURITY ALERT]: Phát hiện lộ Secret/Lỗ hổng nghiêm trọng tại [TênFile.ts:L42](file:///<workspace-root>/path#L42)! Cần xử lý thu hồi ngay lập tức!`

---

## 5. Chuẩn Báo Cáo Antigravity Dual-Stream (Truth-First)

```markdown
🔍 Code Review & Health Scorecard                     [Role: <role> | Score: <Điểm>/100]
─────────────────────────────────────────────────────────────────────
Phạm vi thực tế:    [N files đã rà soát / Tên module]
Đánh giá chung:     [Xuất sắc / Khá / Cảnh báo / Nguy hiểm]

🚨 Vấn đề then chốt cần khắc phục:
  ❌ [CRITICAL/OWASP]: [Mô tả ngắn nếu có — kèm file:/// link]
  ⚠️ [TECH DEBT]:      [Các hàm phức tạp hoặc vi phạm SRP cần tách]

📊 Chỉ số đo lường thực tế (Truth-First):
  • Health Score:       <Điểm> / 100
  • Secret Leaks:       [0 (Đã quét regex) / N phát hiện]
  • OWASP Violations:   [N Critical, N Major]
  • Anti-Dogma:         ✅ Đã xem xét ngữ cảnh, không bắt bẻ file schema/config

📄 Báo cáo chi tiết & Phương án khắc phục mẫu:
  Đã lưu tại: [review_report.md](file:///C:/Users/qkhanh/.gemini/antigravity-ide/brain/f7ef21b2-6e3e-4177-a422-5ddcad5a5843/review_report.md)
  👉 Dùng `./qk-code-cleaner` để bắt đầu phân tách và dọn dẹp mã nguồn an toàn.
```

---

## 6. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi Review | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `frontend` | Component architecture, accessibility, responsive | Check JSX structure, CSS tokens, aria attributes |
| `backend` | API contracts, database queries, auth middleware | Check SQL injection, IDOR, Zod validation |
| `fullstack` | FE-BE contract, type synchronization | Check shared types, request/response schemas |
| `data` | Pipeline reliability, data quality assertions | Check dbt models, data quality rules |
| `qa` | Test coverage, edge case coverage | Check test pyramid, boundary analysis |
| `devops` | CI/CD pipeline, deployment config | Check Dockerfile, GitHub Actions workflows |

---

## 7. Xử Lý Sự Cố Khi Audit Thất Bại (Failure Path)

Nếu phát hiện CRITICAL vấn đề trong khi audit:
1. **Dừng audit ngay lập tức** — không tiếp tục scan
2. **Phát cảnh báo đỏ**: `🚨 [CRITICAL SECURITY ALERT]: ...`
3. **Report ngay** cho user với full evidence
4. **Gợi ý chuyển giao**: `./qk-code-cleaner` để fix

Nếu file không thể đọc:
1. **Skip file** — note trong báo cáo
2. **Continu với files khác**
3. **Report file chưa đọc** trong danh sách "Outside scope"

---

## 8. Bằng Chứng Định Dạng (Evidence Format)

```
[SEVERITY] path/to/file.ts:LINE
Category:   [SECURITY|ARCHITECTURE|QUALITY|ANTI-SLOP]
Rule:       [R-C-XX rule ID]
Reason:     [specific measurement vs threshold]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [one-line actionable suggestion]
Score:      -N pts (for health score calculation)
```

**Example:**
```
[HIGH] src/auth.ts:45
Category:   SECURITY
Rule:       R-SEC-01
Reason:     Hardcoded API key detected in auth middleware
Confidence: HIGH
Fix:        Move to .env.example and use process.env.API_KEY
Score:      -25 pts
```

---

## 9. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct file read with exact line quote | Report as violation |
| MEDIUM | Inferred from code patterns (no exact quote) | Note assumption, still report |
| LOW | Cannot verify without execution | Mark as "UNVERIFIED — manual check required" |

---

## 10. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All checks passed, Health Score ≥ 80 | No CRITICAL violations |
| PARTIAL | Score 60-79 or some files skipped | Budget exhausted |
| BLOCKED | Cannot read files or no target specified | Missing file path |
| FAILED | Score < 60 or CRITICAL found | Immediate action required |

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
