# Requirements & Specification Engineering

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi phân tích yêu cầu, lập PRD, đặc tả BDD, hoặc xử lý thay đổi nghiệp vụ (Changed Requirements).

---

## 1. Nguyên Tắc Cốt Lõi: Chế Độ Plan-Only

Khi người dùng chỉ yêu cầu viết spec, PRD, Acceptance Criteria hoặc lập kế hoạch:
- **TUYỆT ĐỐI KHÔNG sinh implementation code** (không tạo/sửa file code tính năng, không cài package).
- Chỉ bàn giao tài liệu đặc tả, checklist tiêu chí nghiệm thu, sơ đồ luồng (`mermaid`) và khung phác thảo màn hình (wireframe/ASCII hoặc `generative_ui`) khi có tương tác UI.

---

## 2. Phân Cấp Yêu Cầu & Lát Cắt Dọc (Vertical Slicing)

- **Task nhỏ, rõ:** Ghi ngắn mục tiêu và dấu hiệu nghiệm thu; nếu đang ở plan-only, bàn giao kế hoạch rồi kết thúc đúng sản phẩm yêu cầu.
- **Task lớn / Phức tạp:**
  - Chia nhỏ thành các lát cắt dọc (Vertical Slices) có thể kiểm chứng độc lập qua các tầng thực sự bị ảnh hưởng.
  - Phân định rõ Phase 1 (MVP) và các Phase tiếp theo.
  - Không tự ý dựng toàn bộ module phình to nếu người dùng chưa chốt phạm vi cốt lõi.

---

## 3. Đặc Tả Nghiệp Vụ BDD (Behavior-Driven Development)

Mọi luồng chức năng quan trọng cần được mô tả dưới dạng kịch bản Given / When / Then:

```gherkin
Kịch bản: [Tên kịch bản nghiệp vụ]
  Given (Cho): [Trạng thái tiền điều kiện của hệ thống]
  When (Khi):  [Người dùng thực hiện hành động hoặc sự kiện xảy ra]
  Then (Thì):  [Kết quả mong đợi hiển thị trên UI và trạng thái dữ liệu lưu trữ]
```

---

## 4. Xử Lý Thay Đổi Nghiệp Vụ (Changed Requirements)

Khi một yêu cầu thay đổi nghiệp vụ hiện có (ví dụ: đổi công thức phí, thay đổi quy tắc tính điểm):
1. **Đối chiếu Before / After:** Nêu rõ quy tắc cũ vs quy tắc mới.
2. **Dữ liệu lịch sử (Historical Compatibility):** Dữ liệu cũ áp dụng theo quy tắc nào? Có cần giữ nguyên giá trị snapshot cũ hay migrate toàn bộ?
3. **Migration & Rollback:** Kế hoạch chuyển đổi dữ liệu và phương án quay lại an toàn nếu phát sinh sự cố.

---

## 5. Gap Analysis & Rủi Ro Tiềm Ẩn

- Xác định điểm thiếu hụt giữa hạ tầng/codebase hiện tại và yêu cầu mới.
- Liệt kê các giả định kỹ thuật (Assumptions) và rủi ro (Risks).
- Đặt câu hỏi làm rõ (Clarification) nếu thiếu dữ kiện quyết định mô hình dữ liệu hoặc quyền truy cập.
