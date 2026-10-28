---
name: qk-code-review
version: 10.4.0
status: stable
subtitle: "Review Code & Security Audit"
description: "Đánh giá mã nguồn chỉ đọc (Read-Only): Phát hiện lỗ hổng bảo mật, vi phạm kiến trúc, nợ kỹ thuật với bằng chứng cụ thể. Dùng khi: review code, code review, kiểm tra code, đánh giá code, security audit, scan lỗ hổng, owasp, secret leak."
platforms: [antigravity, claude, opencode]
runtime_version: 1
references:
  - ../../references/backend-data.md
  - ../../references/ui.md
rules:
  - global
  - coding-standards
  - safety
workflow: code-review
triggers:
  - "review code"
  - "code review"
  - "kiểm tra code"
  - "đánh giá code"
  - "security audit"
  - "scan lỗ hổng"
  - "owasp"
  - "secret leak"
---

# qk-code-review — Kiểm Toán Mã Nguồn & Bảo Mật

> **Hợp đồng cốt lõi:** Tuân thủ [.agents/rules/global.md](../../rules/global.md). Dòng mở đầu bắt buộc: `Dùng qk-code-review vì <mục tiêu review cụ thể>.`

---

## 1. Nguyên Tắc Cốt Lõi: Chế Độ Đọc Tuyệt Đối (Strict Read-Only)

- **TUYỆT ĐỐI KHÔNG sửa mã nguồn:** Working tree của dự án phải giữ nguyên vẹn 100%. Không tự ý chỉnh sửa file, không refactor, không tạo file memory khi chỉ được yêu cầu review.
- **Bằng chứng xác thực (Evidence-First):** Mọi phát hiện (finding) BẮT BUỘC phải trích dẫn đường dẫn `file:dòng`, đoạn mã cụ thể, và phân tích cơ chế gây rủi ro.
- **Không bịa điểm số tổng:** Cấm đưa ra các thang điểm cảm tính, giả định (như "85/100" hay "92% clean") mà không có công thức đo lường tự động có thể tái lập.
- **Bảo mật theo ngữ cảnh (Contextual Security):** Chỉ kiểm toán các danh mục OWASP thực sự liên quan. Với các file cấu hình hoặc UI thuần túy, các tiêu chí injection/DB đánh dấu là N/A thay vì cố ép nhận xét hình thức.

---

## 2. Nạp Kiến Thức Chuyên Môn Theo Nhu Cầu

- **Khi review Auth / Database / API:** Đọc [backend-data.md](../../references/backend-data.md) — Rà soát IDOR, SQL injection, transaction rollback, rò rỉ secret trong code.
- **Khi review Giao diện / Client:** Đọc [ui.md](../../references/ui.md) — Rà soát WCAG a11y, contrast ratio, visual regression, tràn viền mobile.

---

## 3. Cấu Trúc Báo Cáo Kiểm Toán (Review Report)

Báo cáo kết quả review gồm:
- **Tóm tắt điều hành:** Số lượng vấn đề phát hiện theo mức độ nghiêm trọng (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
- **Chi tiết từng phát hiện (Findings):**
  - Mức độ nghiêm trọng (Severity).
  - Vị trí (`file:dòng`) và trích dẫn mã nguồn có vấn đề.
  - Cơ chế và tác động tiềm ẩn (Impact).
  - Đề xuất giải pháp và lý do kỹ thuật (Fix Rationale).
- **Trạng thái:** `VERIFIED` (đã đối chiếu evidence trên code).
