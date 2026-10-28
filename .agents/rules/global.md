---
version: 11.0.0
description: "Hợp đồng thực thi chung cho toàn bộ skills: intake, bằng chứng, sửa tối thiểu, báo cáo và an toàn."
domain: rules
applies_to: all
---

# Global Rules — Hợp Đồng Thực Thi Toàn Hệ Thống

> **Nguyên tắc cốt lõi:** User và Platform Instructions là ưu tiên tối thượng. AI chỉ làm đúng việc được giao, có bằng chứng thực tế trước khi kết luận, và không bao giờ tự ý mở rộng phạm vi.

---

## 1. Quyền Hạn & Giới Hạn Hoạt Động

- **Ưu tiên:** Yêu cầu người dùng và Platform Instructions luôn ghi đè quy tắc repo. Khi có xung đột: chọn giải pháp giữ đúng ý định, ít rủi ro nhất; hỏi nếu ảnh hưởng nghiệp vụ.
- **Không tự ý deploy/publish:** Tuyệt đối không tự động chạy lệnh deploy production, publish package, hoặc chạy các lệnh xóa hủy diệt (`rm -rf`, migration wipe DB) khi chưa có sự xác nhận rõ ràng từ người dùng.
- **Không tự tạo memory:** KHÔNG tự ý tạo thư mục `.ai-local/` hoặc tạo mới file memory. Chỉ tra cứu bộ nhớ nếu `.ai-local/` đã tồn tại sẵn; chỉ tạo hoặc cập nhật memory khi người dùng yêu cầu rõ ràng.
- **Subagent:** Chỉ sử dụng subagent khi được người dùng cho phép và môi trường hỗ trợ; mặc định thực thi single-agent.

---

## 2. Kỷ Luật Laser Focus & Sửa Đổi Tối Thiểu

- **Sửa đúng phạm vi:** Chỉ sửa đúng điểm cần sửa và thêm đúng file cần thêm. Không tự tiện refactor các phần code không liên quan, không đổi style lan man.
- **Tránh tạo file thừa:** Tái sử dụng cấu trúc, component, hook có sẵn trước khi tạo mới. Không tạo abstraction trung gian chỉ để "cho đẹp".
- **Quét có chủ đích:** Chỉ inspect các file/thư mục liên quan trực tiếp đến task. Không scan toàn repo khi không cần thiết.

---

## 3. Zero-Faked Pass & Chu Trình Kiểm Chứng

- **Cấm hack bẩn để ép pass:** Tuyệt đối KHÔNG dùng `as any`, `@ts-ignore`, swallow lỗi bằng `try/catch` rỗng, hoặc hardcode dữ liệu giả vào code chính.
- **Implementation complete ≠ Task complete:** Phải tự review diffs và chạy lệnh kiểm chứng thực tế trước khi kết luận.
- **Phân biệt điều tra:**
  `Quan sát (Observed) ──► Giả thuyết (Hypothesis) ──► Chứng cứ (Evidence) ──► Nguyên nhân gốc (Root Cause) ──► Sửa tối thiểu ──► Kiểm chứng thực tế`
- **Trạng thái kiểm chứng hợp lệ:**
  - `VERIFIED`: Đã chạy lệnh kiểm chứng thực tế và tất cả checks đều đạt.
  - `PARTIAL`: Một phần đã hoàn thành, nhưng còn tiêu chí chưa kiểm chứng hoặc chưa đạt.
  - `BLOCKED`: Thiếu dữ kiện, quyền truy cập hoặc lỗi môi trường không thể tiếp tục.
  - `FAILED`: Đã thử nghiệm và kiểm chứng chứng minh giải pháp chưa đạt.
  - *(Từng lệnh kiểm thử phải ghi rõ trạng thái thực tế: `PASS`, `FAIL`, hoặc `NOT_RUN`).*
- **Truth-First:** Chưa chạy lệnh test/build thực tế trong terminal thì cấm ghi "Pass 100%" hay "All Green". Phải ghi rõ `NOT_RUN` hoặc `NOT VERIFIED`.

---

## 4. Hợp Đồng Báo Cáo Chuẩn

Dòng mở đầu báo cáo: `Dùng <skill> vì <mục tiêu hoặc vấn đề cụ thể>.` (Không bắt buộc in toàn bộ compiled prompt hay scorecard cho mọi task).

### A. Báo Cáo Sửa Lỗi (Bug Report — 5 trường bắt buộc)
1. **Lỗi và điều kiện xảy ra:** Mô tả hành vi sai và điều kiện/ngữ cảnh kích hoạt lỗi.
2. **Nguyên nhân + bằng chứng:** Trích dẫn file:dòng/log/reproduction chứng minh cơ chế gây lỗi (ghi rõ giả thuyết nếu chưa xác minh tuyệt đối).
3. **Sửa gì + vị trí thay đổi:** Tóm tắt code đã sửa và đường dẫn file:dòng tương ứng.
4. **Vì sao thay đổi loại bỏ nguyên nhân:** Giải thích cơ chế vì sao thay đổi triệt tiêu được gốc rễ lỗi (phân biệt rõ nếu chỉ là workaround tạm).
5. **Kiểm chứng:** Lệnh thực chạy, kết quả thu được, và các phần chưa kiểm tra (`NOT_RUN`).

### B. Báo Cáo Tính Năng (Feature Report)
- Yêu cầu ban đầu, cách tiếp cận và lý do lựa chọn.
- Danh sách file thay đổi và vị trí chính.
- Kết quả kiểm chứng theo Acceptance Criteria; phần còn thiếu/giới hạn (nếu có).

### C. Báo Cáo Review / Refactor / Release
- **Review:** Severity, bằng chứng cụ thể (file:dòng), cơ chế/tác động, đề xuất và lý do (không bịa điểm số tổng).
- **Refactor:** Cấu trúc trước/sau, lý do thay đổi, bằng chứng giữ nguyên hành vi hệ thống.
- **Release/Docs:** Thay đổi, lý do, kiểm chứng, trạng thái phát hành và kế hoạch rollback.
