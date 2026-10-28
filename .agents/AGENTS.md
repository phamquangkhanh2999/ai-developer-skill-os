# AGENTS.md — Full-System AI Software Engineer OS (5 Core Skills)

> Entry Point chính của hệ thống Skin.
> Điều phối trực tiếp đến 5 Core Skills và nạp tài liệu tham khảo (.agents/references/) theo nhu cầu.

---

## 1. Intake & Pre-flight

1. **Đọc Project Profile:** Đọc `.agents/DEV_PROFILE.md` nếu tồn tại (lấy role, stack, conventions, constraints). Profile là tùy chọn: nếu chưa có, tự suy luận từ codebase mà không chặn người dùng.
2. **Xác định mục tiêu & chọn 1 Core Skill duy nhất:** Chọn skill theo kết quả mong muốn, không chỉ dò từ khóa:

| Mục tiêu công việc | Core Skill | Tham khảo chuyên môn (On-demand References) |
|---|---|---|
| Làm mới, đổi yêu cầu, tích hợp API, viết spec/PRD | `qk-feature-delivery` | `requirements.md`, `ui.md`, `backend-data.md`, `api-discovery.md`, `prompt-authoring.md` |
| Hành vi sai lệch contract/thiết kế, lỗi runtime/UI/CI | `qk-bug-resolution` | `ui.md`, `backend-data.md` |
| Đánh giá chỉ đọc, security audit, code health | `qk-code-review` | `backend-data.md`, `ui.md` |
| Tái cấu trúc giữ nguyên hành vi, upgrade package, test | `qk-code-cleaner` | `backend-data.md`, `ui.md` |
| CI/CD, docker, release production, viết docs, memory | `qk-devops-release` | `context-discovery.md` |

*Khi người dùng hỏi chung về cách dùng bộ skin hoặc kiến trúc dự án: xử lý trực tiếp tại Intake (tham khảo `references/context-discovery.md`).*

---

## 2. Ánh Xạ Lệnh & Kỹ Năng Cũ (Legacy Aliases)

Chi tiết quy định tại `.agents/skill-aliases.yml`:
- `qk-ui-engineer` ➔ `qk-feature-delivery` (hoặc `qk-bug-resolution` nếu sửa lỗi UI) + `references/ui.md`
- `qk-backend-data` ➔ `qk-feature-delivery` (hoặc `qk-bug-resolution` nếu lỗi contract) + `references/backend-data.md`
- `qk-api-data-discovery` ➔ `qk-feature-delivery` (chế độ discovery-only) + `references/api-discovery.md`
- `qk-product-spec` ➔ `qk-feature-delivery` (chế độ plan-only, KHÔNG viết code) + `references/requirements.md`
- `qk-prompt-compiler` ➔ `qk-feature-delivery` (chế độ prompt-only, KHÔNG chạy prompt) + `references/prompt-authoring.md`
- `qk-orchestrator` ➔ Intake / Help trực tiếp + `references/context-discovery.md`

---

## 3. Quy Chuẩn Thực Thi & Báo Cáo

- **Dòng thông báo bắt buộc:** `Dùng <skill> vì <mục tiêu hoặc vấn đề cụ thể>.`
- **Không ép compiler:** Không bắt buộc in toàn bộ compiled prompt dài dòng cho mọi task. Chỉ hỏi khi thiếu dữ kiện làm thay đổi quyết định kỹ thuật.
- **Báo cáo chuẩn theo `.agents/rules/global.md`:**
  - **Bug report (5 trường bắt buộc):** (1) Lỗi & điều kiện xảy ra; (2) Nguyên nhân + bằng chứng (file:dòng/log); (3) Sửa gì + vị trí; (4) Vì sao sửa hết lỗi; (5) Kiểm chứng thực tế (lệnh & kết quả).
  - **Feature report:** Yêu cầu, cách làm & lý do, file thay đổi, kiểm chứng theo Acceptance Criteria.
  - **Trạng thái:** `VERIFIED` | `PARTIAL` | `BLOCKED` | `FAILED`. Từng check ghi `PASS` | `FAIL` | `NOT_RUN`.
- **Memory Rule:** KHÔNG tự ý tạo thư mục `.ai-local/`. Chỉ tra cứu nếu đã có; chỉ tạo/sửa khi người dùng yêu cầu.
