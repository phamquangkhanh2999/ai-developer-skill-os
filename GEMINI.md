# GEMINI.md — Quy Chuẩn Tối Ưu Hóa Riêng Cho Antigravity IDE

> Tệp cấu hình điều hợp môi trường (Adapter) cho Google Antigravity IDE.
> Tập trung vào cơ chế Artifacts, Clickable Links, Slash Commands và Visual Rendering.

---

## 1. Clickable File Links (Dynamic Workspace Path)

Mọi đường dẫn file và symbol mã nguồn BẮT BUỘC dùng link markdown `file:///`:
- Cú pháp liên kết file: `[<filename>](file:///<workspace-root>/<relative-path>)`
- Cú pháp liên kết dòng/hàm: `[<symbol>](file:///<workspace-root>/<relative-path>#L<start>-L<end>)`
- Chuẩn hóa dấu gạch chéo xuôi `/` cho URL (kể cả trên Windows).
- AI tự động nối thư mục gốc workspace hiện tại, không hardcode đường dẫn tuyệt đối tĩnh.

---

## 2. Artifact Dual-Stream Reporting

- **Stream 1 (Tài liệu chi tiết):** Ghi báo cáo chuyên sâu, diff lớn, bảng biểu vào file Artifact markdown (`.md`) trong thư mục brain: `<appDataDir>/brain/<conversation-id>/...`.
- **Stream 2 (Cửa sổ Chat):** Chỉ in bản Tóm tắt điều hành (Executive Summary) ngắn gọn (15–25 dòng) kèm liên kết trỏ tới Artifact.

---

## 3. Terminal Visual Rendering

Khi người dùng yêu cầu vẽ sơ đồ, kiến trúc, flowchart, hoặc trực quan hóa luồng:
- BẮT BUỘC render trực tiếp thành biểu đồ khối ký tự **ASCII / Unicode Box Drawing** (`┌─┐`, `│`, `└─┘`, `──►`) ngay trong response.
- Không chỉ trả về mermaid thô trừ khi người dùng yêu cầu xuất file riêng.

---

## 4. Tích Hợp Slash Commands Bản Địa

Chủ động gợi ý slash command phù hợp ngữ cảnh khi người dùng cần:
- `/grill-me`: Phỏng vấn sâu làm rõ các quyết định thiết kế hoặc yêu cầu còn mơ hồ.
- `/goal`: Chạy task lớn xuyên suốt nhiều module, kiên trì thực thi đến khi đạt mục tiêu.
- `/learn`: Lưu lại tri thức dự án vào bộ nhớ khi được yêu cầu.
- `/schedule`: Đặt lịch định kỳ kiểm tra sức khỏe hệ thống.
- `/browser`: Mở trình duyệt nhúng bên phải để kiểm tra trực quan giao diện localhost.

---

## 5. Controlled Subagent Orchestration

Khi người dùng yêu cầu và môi trường hỗ trợ, tham khảo `.agents/rules/subagent-orchestration.md`.
Mặc định thực thi single-agent; không tự ý điều phối song song khi chưa được cho phép.
