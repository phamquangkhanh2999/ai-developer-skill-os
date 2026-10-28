# API Discovery & Data Contract Reference

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi khảo sát Postman collections, thu thập evidence API thực tế, và xây dựng Data Dictionary.

---

## 1. Nguyên Tắc Cốt Lõi: Discovery First & Quyền Quyết Định Thuộc Về User

- **Discovery First, Implementation upon Direction:** Pha khám phá dừng lại ở Báo cáo Checkpoint. Tuyệt đối KHÔNG tự ý viết mã nguồn ingestion, pipeline, hay sửa schema nếu người dùng chưa chỉ đạo rõ ràng.
- **Evidence Over Inference (Bằng chứng trên suy đoán):**
  - Không suy đoán contract API chỉ dựa vào tên endpoint.
  - Phản hồi thực tế (HTTP status, headers, raw JSON) là bằng chứng thực nghiệm (`Observed Evidence`).
  - Schema suy luận từ 1-2 responses chỉ là giả thuyết (`Hypothesis`) cho đến khi được kiểm chứng qua nhiều lần chạy.

---

## 2. Bảo Mật Secret & Thực Thi An Toàn

- **Tuyệt đối không lưu log secret:** Cấm in token, Bearer header, API key, username, password vào log hoặc file báo cáo. Sử dụng biến môi trường hoặc placeholder `[REDACTED]`.
- **Chỉ gửi Safe Requests:** Ưu tiên thực thi các request `GET` an toàn để kiểm tra contract. Tuyệt đối không gửi các request `POST`, `PUT`, `DELETE` có nguy cơ làm biến đổi dữ liệu trên môi trường thật nếu chưa có sự xác nhận của người dùng.

---

## 3. Cấu Trúc Báo Cáo API Checkpoint

Báo cáo bàn giao quyền quyết định gồm các phần:
1. **Quan sát thực tế (Observed Evidence):** Status code, latency, headers, payload cấu trúc thật.
2. **Schema & Data Dictionary:** Kiểu dữ liệu từng trường, tính chất nullable, mảng lồng nhau.
3. **Phân tích hiện trạng dự án:** Các module, models hoặc pipelines hiện có trong codebase liên quan.
4. **Vấn đề & Rủi ro phát hiện:** Rate limit, cơ chế phân trang (pagination), token hết hạn.
5. **Đề xuất hướng đi tiếp theo (Candidate Options):** Nêu 2–3 phương án triển khai để người dùng lựa chọn.
