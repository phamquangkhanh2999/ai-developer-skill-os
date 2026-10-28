# Backend & Data Architecture Reference

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi thiết kế API, viết migrations, tối ưu hóa truy vấn SQL, hoặc xây dựng pipeline dữ liệu.

---

## 1. Zero-Trust API & Bảo Mật Thực Chiến

- **Xác thực & Phân quyền (Authn & Authz):** Mọi endpoint nghiệp vụ phải kiểm tra Auth và quyền truy cập trước khi thực thi.
- **Phòng Chống IDOR (Insecure Direct Object References):** Luôn kiểm tra quyền sở hữu tài nguyên trong truy vấn:
  ```typescript
  // ✅ An toàn: Kiểm tra đồng thời ID tài nguyên và ID người dùng hiện tại
  const item = await prisma.order.findFirst({
    where: { id: orderId, userId: currentUserId }
  });
  ```
- **Xác thực dữ liệu đầu vào (Input Validation):** Bắt buộc validate dữ liệu request qua schema (Zod, Joi, Pydantic) trước khi chuyển vào Service/Database.

---

## 2. Diệt Trừ N+1 Queries & Tối Ưu Truy Vấn

- **Luôn sử dụng Eager Loading hoặc DataLoader:** Khi truy vấn bảng quan hệ (1-N hoặc N-N), tránh lặp query trong vòng lặp. Dùng `include`, `join`, hoặc batch loading.
- **Xác minh qua EXPLAIN ANALYZE:** Khi tối ưu query, kiểm tra Execution Plan thực tế (Index Scan vs Sequential Scan). Nếu môi trường không có DB live để test, ghi rõ trạng thái kiểm tra tĩnh `NOT_RUN`.

---

## 3. Quy Chuẩn Di Chuyển Schema An Toàn (Expand and Contract Migrations)

- **Nguyên tắc không downtime:** Không bao giờ xóa hoặc đổi tên cột ngay trong một bước migration duy nhất nếu đang có dữ liệu.
  1. **Bước 1 (Expand):** Thêm cột mới dạng `NULLABLE`.
  2. **Bước 2 (Dual-write / Backfill):** Ứng dụng ghi song song vào cả hai cột, chạy script đồng bộ dữ liệu cũ.
  3. **Bước 3 (Contract):** Chuyển toàn bộ đọc sang cột mới, siết ràng buộc `NOT NULL`, và xóa cột cũ ở lần phát hành tiếp theo.
- **Kế hoạch Rollback:** Mọi migration phải đi kèm script rollback hoặc cơ chế hủy bỏ an toàn (`down.sql`).

---

## 4. Pipeline Dữ Liệu & Tính Lũy Thừa (Idempotency)

- Các pipeline ETL/dbt phải có khả năng chạy lại (re-run) nhiều lần mà không gây trùng lặp dữ liệu (dùng Upsert hoặc Partition Overwrite).
- Ghi log và theo dõi số lượng dòng đọc/ghi rõ ràng.
