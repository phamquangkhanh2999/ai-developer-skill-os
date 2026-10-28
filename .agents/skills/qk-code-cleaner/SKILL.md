---
name: qk-code-cleaner
version: 10.4.0
status: stable
subtitle: "Refactor & Viết Test"
description: "Kỹ nghệ tái cấu trúc bảo toàn hành vi (Zero Behavior Change), nâng cấp dependency an toàn và bổ sung kiểm thử tự động. Dùng khi: refactor, tái cấu trúc, tách file, clean code, giảm complexity, upgrade thư viện, update package, viết test, unit test, integration test."
platforms: [antigravity, claude, opencode]
runtime_version: 1
references:
  - ../../references/backend-data.md
  - ../../references/ui.md
rules:
  - global
  - coding-standards
  - safety
workflow: refactor
triggers:
  - "refactor"
  - "tái cấu trúc"
  - "tách file"
  - "tách hàm"
  - "clean code"
  - "giảm complexity"
  - "upgrade thư viện"
  - "update package"
  - "viết test"
  - "unit test"
---

# qk-code-cleaner — Tái Cấu Trúc Mã Nguồn & Viết Test

> **Hợp đồng cốt lõi:** Tuân thủ [.agents/rules/global.md](../../rules/global.md). Dòng mở đầu bắt buộc: `Dùng qk-code-cleaner vì <mục tiêu refactor hoặc upgrade cụ thể>.`

---

## 1. Nguyên Tắc Cốt Lõi: Bảo Toàn Tuyệt Đối Hành Vi (Zero Behavior Change)

- **Giữ nguyên hợp đồng hành vi:** Refactor chỉ thay đổi cấu trúc bên trong mã nguồn để tăng tính dễ đọc, giảm độ phức tạp (cyclomatic complexity) hoặc tối ưu hiệu năng; **TUYỆT ĐỐI KHÔNG làm thay đổi hành vi nghiệp vụ**.
- **Nếu yêu cầu đổi hành vi:** Dừng lại và điều hướng người dùng sang `qk-feature-delivery`. Refactor không bao giờ được kiêm nhiệm thêm chức năng mới.
- **Nâng cấp Dependency an toàn:**
  - Bắt buộc kiểm tra changelog, migration guides và breaking changes trước khi bump version.
  - Chạy toàn bộ test suites sau khi nâng cấp để bảo đảm tính tương thích.
  - Có kế hoạch rollback rõ ràng (lockfile commit) nếu việc nâng cấp gặp lỗi.
- **Lưới kiểm thử bảo vệ (Regression Shield):** Đảm bảo có bộ test (unit hoặc integration) kiểm tra hành vi cũ trước khi tái cấu trúc. Sau khi refactor, mọi test case phải pass sạch sẽ.

---

## 2. Nạp Kiến Thức Chuyên Môn Theo Nhu Cầu

- **Khi refactor UI / Frontend:** Đọc [ui.md](../../references/ui.md) — Áp dụng co-location thay vì xé nhỏ quá mức, dọn magic numbers vào design tokens.
- **Khi refactor Backend / Query:** Đọc [backend-data.md](../../references/backend-data.md) — Chuẩn hóa validation schemas, loại bỏ N+1 query, bảo đảm transaction rollback.

---

## 3. Cấu Trúc Báo Cáo Tái Cấu Trúc (Refactor Report)

Báo cáo kết quả gồm:
- **Mục tiêu:** Hàm, module hoặc dependency được tái cấu trúc.
- **Cấu trúc Trước vs Sau (Before / After):** Nêu rõ sự cải thiện (giảm dòng code thừa, giảm độ phức tạp, tách trách nhiệm sạch sẽ).
- **Lý do thay đổi:** Giải thích giá trị kỹ thuật mang lại.
- **Bằng chứng giữ nguyên hành vi:** Kết quả thực chạy test suite (lệnh chạy và status `PASS`).
- **Trạng thái:** `VERIFIED` (đã chạy test thực tế chứng minh hành vi không đổi).
