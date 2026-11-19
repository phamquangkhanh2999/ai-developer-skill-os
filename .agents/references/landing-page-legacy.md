# Ghi chú lịch sử: Landing Page / Messenger

Bảo toàn tùy biến từ QK cũ; không phải policy chung. Kiểm tra lại tài liệu nhà cung cấp và yêu cầu hiện tại trước áp dụng.

##  Landing Page Script Injection & Messenger Integration Safeguards

> Áp dụng cho: Tích hợp Widget, Chatbot, Script tracking trên các nền tảng Landing Page (Webcake, LadiPage) và kết nối Fanpage Facebook / Pancake POS.

- **Kênh tiếp nhận tin nhắn Fanpage:** Meta đã khai tử embedded customer chat plugin (05/2024) và chặn API tự tạo hội thoại từ web ngoài. Khi mục tiêu nghiệp vụ là lưu toàn bộ lịch sử trong Hộp thư Fanpage và Pancake Chat, **BẮT BUỘC** dùng cơ chế Click-to-Messenger (`https://m.me/<PAGE_ID>?ref=<URL>`) với `target="_blank"`. Tuyệt đối không mở popup co nhỏ trên Desktop (gây vỡ UX danh sách chat cá nhân).
- **Vị trí nhúng mã trên Webcake / Builder:**
  - Mã script nhúng ngoài **CHỈ ĐƯỢC PHÉP** dán vào mục: `Cài đặt -> Thiết kế -> HTML/JavaScript -> Trước thẻ body` (hoặc `Trước thẻ head`).
  - **TUYỆT ĐỐI KHÔNG** dán thẻ `<script>` vào các khối Văn bản (Text Block) trên canvas thiết kế. Lý do: Webcake tuần tự hóa text vào JSON ngầm `window.event_data = { ... }`, chuỗi `</script>` bên trong text sẽ ngắt thẻ script của trình duyệt, làm rò rỉ hàng chục KB JSON ra giao diện và crash Webcake runtime (`TypeError: Cannot set properties of undefined`).
  - Khi phát hiện giao diện Webcake bị vỡ do rò rỉ JSON, ưu tiên hướng dẫn khôi phục qua **Lịch sử chỉnh sửa (Revision History)** thay vì tìm xóa thủ công các phần tử bị trôi ra ngoài lề màn hình Mobile.
