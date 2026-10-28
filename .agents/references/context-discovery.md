# Context Discovery & Architecture Reference

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi khám phá codebase mới, giải thích kiến trúc hệ thống, hoặc định vị dependency.

---

## 1. Nguyên Tắc Cốt Lõi: Khám Phá Có Mục Đích (Laser Focus Discovery)

- **Cấm scan bừa bãi:** Không quét toàn bộ repository một cách mù quáng (`find .`, `grep -r` toàn ổ đĩa).
- **Học từ cấu hình trước:** Đọc các file khai báo kiến trúc có sẵn trước khi mở source code:
  - `.agents/DEV_PROFILE.md` (Role, stack, conventions, constraints)
  - `package.json` / `pyproject.toml` / `go.mod` (Dependencies, scripts, tooling)
  - `tsconfig.json` / `vite.config` / `docker-compose.yml` (Path aliases, runtime setup)

---

## 2. Định Vị Điểm Vào (Entry Points) & Luồng Dữ Liệu

Khi cần hiểu một tính năng hoặc luồng dữ liệu:
1. **Frontend:** Tìm router/page entry (`src/app/`, `src/pages/`, `src/routes/`) → Component container → API client hook.
2. **Backend:** Tìm route controller (`src/controllers/`, `src/routes/`) → Service layer → Data Access / ORM repository.
3. **Data Pipeline:** Tìm scheduler / DAG definition → Ingestion step → Transformation pipeline → Data sink.

---

## 3. Bản Đồ Module & Ranh Giới Trách Nhiệm

- Xác định rõ ranh giới module (Domain boundaries): Shared utils vs Feature-specific modules.
- Không tự ý tạo thêm các tầng trung gian (wrapper, adapter) khi dự án đang tuân theo mô hình đơn giản.
- Khi người dùng hỏi "Bộ này dùng thế nào?", hướng dẫn tổng quan về 5 core skills và intake process mà không load toàn bộ references vào context.
