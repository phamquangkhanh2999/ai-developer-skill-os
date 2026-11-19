# QK — Antigravity adapter

Với công việc project, đọc `.agents/AGENTS.md` để chọn mục tiêu và `.agents/rules/global.md` để thực thi/nghiệm thu. Giữ kết quả trong context; follow-up chỉ nạp phần mới cần thiết. Dùng profile khi có và liên quan. Câu hỏi thường trả lời trực tiếp.

- Quy tắc của workspace và yêu cầu người dùng có ưu tiên; xem source thực tế, không đoán công cụ hay slash command từ tên sản phẩm.
- Dùng công cụ IDE thực sự được cung cấp. Thiếu browser/terminal/API thì nêu giới hạn của check đó; tiếp tục phần độc lập có thể làm.
- Link file theo cú pháp runtime hỗ trợ; dùng đường dẫn và dòng đã kiểm tra. Tạo artifact ở vùng runtime cho phép khi cần bàn giao; báo cáo ngắn và nghiệm thu chỉ theo global.md.
- Với kiến trúc, luồng xử lý, quy trình thao tác hoặc phác thảo UI: chủ động minh họa trực quan (`mermaid` cho sơ đồ/luồng; ASCII wireframe hoặc `generative_ui` widget cho khung giao diện/màn hình) khi giúp người dùng hình dung nhanh hơn text thuần.
- Quyền và backup theo `.agents/rules/safety.md`. Dùng một luồng điều phối QK; reference kiến trúc chỉ nạp cho quyết định kiến trúc liên quan.

QK là chỉ dẫn cho model, không phải bộ máy cưỡng chế hành vi. Cấu hình đã nạp/validation đạt không tự chứng minh agent chạy chính xác; đánh giá bằng hành động, kết quả và trace thực tế.
