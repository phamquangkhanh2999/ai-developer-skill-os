# Best Practice Review Code (Code Review Best Practices)

Bí kíp toàn diện để tiến hành Code Review một cách hiệu quả và chuyên nghiệp.

## Triết lý Review (Review Philosophy)

### Mục tiêu của Code Review

**Mục tiêu Chính:**
- Bắt lỗi (bugs) và các trường hợp biên (edge cases) trước khi đẩy lên Production.
- Đảm bảo code dễ bảo trì (maintainability) và dễ đọc (readability).
- Chia sẻ kiến thức (knowledge sharing) giữa các thành viên trong team.
- Ép buộc tuân thủ chuẩn code (coding standards) một cách nhất quán.
- Cải thiện các quyết định về Thiết kế và Kiến trúc.

**Mục tiêu Phụ:**
- Hướng dẫn (Mentor) cho các developer trẻ.
- Xây dựng văn hóa và sự tin tưởng trong team.
- Document lại các quyết định thiết kế thông qua quá trình thảo luận.

### Code Review KHÔNG PHẢI là:

- Một công cụ gác cổng hạch sách để cản trở tiến độ.
- Một nơi để phô trương kiến thức cá nhân.
- Nơi để bắt bẻ từng dấu phẩy, dấu cách (Việc đó để linter tự động làm).
- Nơi để ép người khác viết lại code theo sở thích cá nhân của mình.

## Thời điểm Review (Review Timing)

### Khi nào thì Review?

| Kích hoạt (Trigger) | Hành động (Action) |
|---------|--------|
| PR vừa mở | Review trong vòng 24 giờ, lý tưởng nhất là trong ngày |
| PR đã sửa theo yêu cầu | Re-review lại trong vòng 4 giờ |
| Phát hiện lỗi chí mạng (Blocking) | Thông báo ngay lập tức |

### Phân bổ thời gian

- **PR Nhỏ (<100 lines)**: 10-15 phút
- **PR Vừa (100-400 lines)**: 20-40 phút
- **PR Lớn (>400 lines)**: Yêu cầu chia nhỏ ra, hoặc dành >60 phút để review

## Các cấp độ Review (Review Depth Levels)

### Level 1: Skim Review (Lướt nhanh - 5 phút)
- Đọc mô tả PR và các Issues được đính kèm.
- Kiểm tra trạng thái của CI/CD (Test có pass không).
- Lướt qua danh sách các file thay đổi.
- Xác định xem có cần Review sâu hơn không.

### Level 2: Standard Review (Chuẩn mực - 20-30 phút)
- Đọc lướt toàn bộ luồng code (Walkthrough).
- Kiểm tra logic có đúng không.
- Kiểm tra xem có viết Test Cover không.
- Quét nhanh các vấn đề bảo mật.

### Level 3: Deep Review (Chuyên sâu - >60 phút)
- Đánh giá kiến trúc hệ thống.
- Phân tích hiệu năng (Performance).
- Kiểm toán Bảo mật (Security audit).
- Khám phá các rủi ro ở trường hợp biên (Edge cases).

## Nguyên tắc Giao tiếp (Communication Guidelines)

### Thái độ và Ngôn từ

**Sử dụng ngôn từ hợp tác:**
- "Bạn nghĩ sao về việc..." thay vì "Bạn phải làm thế này..."
- "Chúng ta có thể thử cân nhắc..." thay vì "Cái này sai rồi!"
- "Mình hơi thắc mắc chỗ này..." thay vì "Tại sao bạn không..."

**Cụ thể và có tính Action (Actionable):**
- Đưa ra ví dụ code (code examples) khi đề xuất thay đổi.
- Kèm link đến tài liệu (docs) hoặc các cuộc thảo luận cũ.
- Giải thích "TẠI SAO" (Why) lại đưa ra lời khuyên đó.

### Xử lý Bất đồng (Handling Disagreements)

1. **Cố gắng thấu hiểu**: Đặt câu hỏi làm rõ ý của người kia.
2. **Ghi nhận điểm đúng**: Cho thấy bạn đã suy nghĩ ở góc độ của họ.
3. **Đưa ra bằng chứng**: Dùng benchmark, docs, hoặc ví dụ cụ thể.
4. **Escalate (Nâng cấp) nếu cần**: Mời Senior Dev hoặc Architect vào phân xử.
5. **Biết khi nào nên dừng lại**: Không phải cuộc tranh cãi nào cũng đáng để sống chết bảo vệ.

## Phân loại Mức độ Ưu tiên (Review Prioritization)

### 🔴 Must Fix (Bắt buộc sửa / Blocking)
- Lỗ hổng Bảo mật (Security vulnerabilities).
- Nguy cơ làm hỏng / mất dữ liệu (Data corruption).
- Các thay đổi làm gãy (Breaking changes) mà không có kịch bản chuyển đổi (migration).
- Lỗi hiệu năng chí mạng.
- Quên không bắt lỗi (Error handling) ở các tính năng hiển thị cho End-user.

### 🟡 Should Fix (Nên sửa / Important)
- Bỏ sót chưa viết Test (Test coverage gaps).
- Rủi ro hiệu năng ở mức vừa phải.
- Code bị lặp lại (Duplication).
- Đặt tên tối nghĩa hoặc Cấu trúc rối rắm.
- Logic quá phức tạp mà không có comment giải thích.

### 🟢 Nice to Have (Có thì tốt / Non-blocking)
- Sở thích về Style code (nằm ngoài scope của Linter).
- Các tối ưu nhỏ lẻ (Minor optimizations).
- Thêm thắt vài Test case phụ.
- Cải thiện câu từ trong Document.

## Anti-Patterns cần tránh

### Anti-Patterns của người Review
- **Rubber stamping (Đóng dấu bừa)**: Bấm Approve (Duyệt) mà không thèm xem code.
- **Bike shedding (Tranh cãi chuyện ruồi muỗi)**: Cãi nhau nảy lửa về những tiểu tiết vớ vẩn.
- **Scope creep (Tiện tay dắt dê)**: "Nhân tiện bạn đang sửa file này, bạn làm thêm cái tính năng X này nhé..."
- **Ghosting (Bốc hơi)**: Thả 1 đống Request Changes rồi lặn mất tăm, không thèm quay lại xem người ta sửa chưa.
- **Perfectionism (Chủ nghĩa hoàn hảo)**: Chặn PR (Block) chỉ vì vài khác biệt nhỏ về phong cách cá nhân.

### Anti-Patterns của người Viết Code (Author)
- **Mega PRs (PR Siêu to khổng lồ)**: Gửi 1 cục PR dài >1000 dòng bắt người ta ngồi đọc.
- **No context (Không có ngữ cảnh)**: Để trống mô tả PR, không link issue nào.
- **Defensive responses (Xù lông nhím)**: Cãi lại mọi lời góp ý, khăng khăng mình đúng.
- **Silent updates (Sửa trong im lặng)**: Lẳng lặng commit sửa code nhưng không thèm Reply lại các comment báo cho người Review biết.

## Số liệu và Cải tiến (Metrics and Improvement)

### Nên theo dõi các Số liệu sau
- Thời gian từ lúc mở PR đến lúc có Review đầu tiên (Time to first review).
- Tổng thời gian hoàn thành một vòng Review (Review cycle time).
- Số vòng Review phải đập đi xây lại (Number of review rounds).
- Tỷ lệ lỗi lọt qua lưới (Defect escape rate).
- Tỷ lệ Cover của quá trình Review.

### Cải tiến liên tục
- Tổ chức các buổi Retrospective để bàn về quy trình Review.
- Chia sẻ bài học từ các con Bug lọt ra Production.
- Cập nhật các Checklist Review liên tục dựa trên các lỗi hay gặp.
- Tuyên dương những bài Review chất lượng, bắt được lỗi hiểm hóc.
