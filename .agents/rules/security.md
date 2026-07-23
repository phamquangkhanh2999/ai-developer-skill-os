# Security Rule

Tránh tạo ra lỗ hổng bảo mật trong quá trình phát triển (Security khác với Safety - tránh làm hỏng hệ thống).

## Nguyên tắc cốt lõi
1. **Không commit Secret**: Tuyệt đối không hardcode API key, token, credentials, password vào mã nguồn. Nếu cần test, dùng `.env.example` hoặc placeholder.
2. **Không trust External Input**: Bất kỳ dữ liệu nào đến từ user, API bên ngoài, tham số URL đều phải được validate và sanitize trước khi sử dụng (đặc biệt trong truy vấn DB, prompt LLM, hoặc render ra DOM).
3. **Tuân thủ Least Privilege**: Khi cấu hình quyền, luôn cấp quyền tối thiểu cần thiết để hoàn thành công việc.

## Anti-Patterns (CẤM)
- Cấm in ra console hoặc log các thông tin nhạy cảm.
- Cấm bypass SSL/TLS verification (`rejectUnauthorized: false`).
- Cấm sử dụng trực tiếp string template cho SQL queries, phải dùng parameterized queries hoặc ORM an toàn.
