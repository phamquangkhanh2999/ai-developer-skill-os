# Quyết định kiến trúc theo phạm vi

Chỉ nạp khi task thực sự cần thiết kế kiến trúc hoặc đổi contract xuyên module; không đặt vai CTO hay gate cho mọi feature.

- Bắt đầu ở mục tiêu nghiệp vụ, nguồn dữ liệu và ranh giới hiện có; ghi quyết định đang thiếu thay vì dựng đủ tầng mẫu.
- So sánh các phương án thực sự khả thi theo compatibility, coupling, dữ liệu, failure modes và chi phí có căn cứ. Không bịa SLO/ước lượng tải để lấp biểu mẫu.
- Dùng lát cắt có kết quả quan sát được; mỗi lát cắt nêu contract thay đổi, bằng chứng nghiệm thu và khôi phục khi có rủi ro.
- Chốt quyết định nghiệp vụ/quyền chưa được giao; tiếp tục phần độc lập đã được cho phép theo safety.md. Số module không tự tạo approval gate.
- ADR gọn khi có quyết định cần lưu: context, phương án, lựa chọn/lý do và hệ quả. Không bắt tạo hồ sơ quản trị cho sửa cục bộ.
- Trực quan hóa kiến trúc có chủ đích (Architecture Visualization):
  - **Topology Delta:** Khi thiết kế thay đổi/migration kiến trúc, phân tách rõ 3 phần: *Trước (Current)*, *Sau (Target)* và *Ledger thay đổi* (những gì thêm, sửa, bãi bỏ) thay vì chỉ vẽ một sơ đồ tĩnh chung chung.
  - **Ngân sách phức tạp:** Tối đa 9 nodes trên một sơ đồ tổng quan; vượt quá phải tách tầng *System Overview* $\rightarrow$ *Subsystem/Component Detail*.
  - **Đường nối có ngữ nghĩa:** Luôn ưu tiên đường vuông góc (orthogonal) bo góc tròn, xác định rõ chiều mũi tên dữ liệu và gắn nhãn giao thức (gRPC, HTTPS, Event stream) với khoảng đệm rõ ràng. Khi cần tài liệu chi tiết về kỹ thuật vẽ sơ đồ chuẩn editorial, nạp `diagram-spec.md`.

Nghiệm thu và báo cáo theo `../rules/global.md`; dùng công cụ/runtime thật, không mặc định có subagent hoặc quyền veto tự cấp.
