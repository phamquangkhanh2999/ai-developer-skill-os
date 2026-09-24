---
version: 10.2.0
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

---

## R-SQ-07: Version Standardization (V10.2)

Tất cả skill files, rule files, và workflow files MUST có version `10.2.0` trong frontmatter YAML.

### Quản lý Version:
- **Patch bump** (`10.2.0` → `10.2.1`): Fix nhỏ, không đổi behavior
- **Minor bump** (`10.2.0` → `10.3.0`): Thêm capability mới
- **Major bump** (`10.2.0` → `11.0.0`): Kiến trúc thay đổi

### Quy tắc Bump Version:
- Khi thay đổi behavior của skill → bump version trong SKILL.md frontmatter
- Khi thay đổi rule → bump version trong rules/*.md frontmatter
- Khi thay đổi workflow → bump version trong workflows/*.yml
- Bump version phải đi kèm với commit message: `chore: bump version to X.Y.Z`

