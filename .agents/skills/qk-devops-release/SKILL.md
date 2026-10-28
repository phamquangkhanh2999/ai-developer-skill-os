---
name: qk-devops-release
version: 10.4.0
status: stable
subtitle: "DevOps, CI/CD & Deploy"
description: "Vận hành nền tảng, CI/CD pipelines, Docker, phát hành sản phẩm an toàn có Rollback, đồng bộ tài liệu kỹ thuật và quản lý bộ nhớ dự án (.ai-local/). Dùng khi: ci/cd, deployment, pipeline, docker, dockerfile, devops, github actions, release production, release checklist, viết docs, readme, swagger, project memory, learn."
platforms: [antigravity, claude, opencode]
runtime_version: 1
references:
  - ../../references/context-discovery.md
rules:
  - global
  - safety
  - command-safety
workflow: production-release
triggers:
  - "ci/cd"
  - "deployment"
  - "pipeline"
  - "docker"
  - "dockerfile"
  - "devops"
  - "github actions"
  - "deploy production"
  - "release production"
  - "viết docs"
  - "readme"
  - "project memory"
---

# qk-devops-release — Vận Hành Nền Tảng, CI/CD & Phát Hành

> **Hợp đồng cốt lõi:** Tuân thủ [.agents/rules/global.md](../../rules/global.md). Dòng mở đầu bắt buộc: `Dùng qk-devops-release vì <mục tiêu hạ tầng, tài liệu hoặc release cụ thể>.`

---

## 1. Nguyên Tắc Cốt Lõi: An Toàn Phát Hành & Đúng Quyền Hạn

- **Cấm tự ý Deploy / Publish:** Tuyệt đối KHÔNG tự ý thực thi các lệnh deploy lên môi trường production, publish package lên npm/PyPI, hoặc can thiệp hạ tầng đám mây nếu chưa có sự xác nhận tường minh từ người dùng.
- **Tài liệu hóa tương xứng (Proportional Docs):** Khi cập nhật README, swagger, hoặc tài liệu kỹ thuật: thực hiện ngắn gọn, chính xác, tương xứng với thay đổi; không lập PRD dài dòng hay quy trình phức tạp.
- **Phân định lỗi CI vs Lỗi ứng dụng:**
  - Nếu build/job CI fail do cấu hình môi trường (sai phiên bản Node, thiếu dependencies hệ thống, Dockerfile lỗi cú pháp) ➔ Xử lý tại đây.
  - Nếu CI fail do kiểm thử logic code hoặc crash nghiệp vụ ➔ Điều hướng sang `qk-bug-resolution`.
- **Quản lý bộ nhớ dự án (`.ai-local/`):**
  - Chỉ khởi tạo hoặc lưu trữ kiến thức vào `.ai-local/` khi có yêu cầu cụ thể từ người dùng (hoặc lệnh `/learn`).
  - Không tự ý tạo file rác trong workspace của người dùng.
- **Kế hoạch Rollback:** Mọi thay đổi release hoặc deploy lên môi trường staging/production bắt buộc phải chuẩn bị phương án quay về phiên bản trước (Revert commit, container rollback tag).

---

## 2. Quy Trình Phát Hành & Kiểm Chứng

```text
Kiểm tra cấu hình môi trường / Secrets / Dockerfile
   ↓
Dry-run kiểm thử cục bộ (linter, container build, local actions)
   ↓
Báo cáo kế hoạch triển khai & Kế hoạch Rollback
   ↓
Chỉ thực thi khi người dùng xác nhận quyền
   ↓
Báo cáo kết quả theo mẫu Release/Docs Report trong global.md
```

- **Trạng thái:** `VERIFIED` (đã chạy kiểm thử cấu hình hoặc build image), `BLOCKED` (chờ người dùng cấp quyền/secrets).
