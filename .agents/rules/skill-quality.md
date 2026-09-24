---
version: 8.0.0
description: "Standards for defining, maintaining, and retiring skills in V8."
domain: rules
applies_to: [skill-authoring, skill-governance]
---

# Skill Quality Rules — Skill Governance Policy

> **Câu hỏi domain này trả lời:** *Khi nào một skill xứng đáng tồn tại, và khi nào cần gộp/loại bỏ nó?*

---

## Tiêu chuẩn tồn tại (Survival Standard)

Mỗi skill khi được add hoặc duy trì phải thỏa mãn:

### R-SQ-01: Decision Boundary Rõ Ràng
Skill không được overlap scope với skill khác. Một task cụ thể chỉ nên resolve về đúng một skill duy nhất.

### R-SQ-02: Metadata Đầy Đủ
Bắt buộc tuân thủ schema V8 (có `intent`, `trigger`, `verification`, `workflow`).

### R-SQ-03: Giá Trị Bền Vững
Không tạo skill cho những snippet cấu hình đơn giản. Skill phải đại diện cho một "capability" (năng lực xử lý) có tính mở rộng.

---

## Quy trình Audit Skill

### R-SQ-04: Đánh Giá Định Kỳ
Các skill sẽ được rà soát để đảm bảo không bị phình (bloat).

### R-SQ-05: Phát Hiện Trùng Lặp
Nếu phát hiện 2 skill có chung mục đích, cần tiến hành gộp (merge) lại và phân định ranh giới (ví dụ: chia implementation và governance).

### R-SQ-06: Loại Bỏ Có Kiểm Soát
Nếu skill không còn giá trị sử dụng hoặc đã được cover bởi core logic, đánh dấu `status: deprecated`. Không xóa ngay lập tức để giữ backward compatibility.
