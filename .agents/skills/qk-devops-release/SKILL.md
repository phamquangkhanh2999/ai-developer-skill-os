---
name: qk-devops-release
version: 13.0.0
status: stable
subtitle: "DevOps, CI/CD & Deploy"
description: "Dùng khi sửa môi trường CI/CD, Docker/image, chuẩn bị hoặc thực hiện release/deploy theo quyền đã cấp, cập nhật docs hoặc memory khi được yêu cầu."
platforms: [antigravity]
runtime_version: 1
references:
  - ../../references/context-discovery.md
rules:
  - global
  - safety
  - command-safety
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

# QK — môi trường và phát hành

Dùng [global.md](../../rules/global.md) cho trạng thái và báo cáo; quyền cho mutation/deploy theo [safety.md](../../rules/safety.md). Quyền đã cấp cho đúng hành động/môi trường tiếp tục có hiệu lực.

- Xác định môi trường và kết quả được giao: sửa CI/image/config, chuẩn bị release, hay thực sự deploy. Lỗi test nghiệp vụ/ingestion thuộc bug-resolution; từ “pipeline” không đủ để chọn CI.
- Khảo sát cấu hình/caller liên quan, sửa trong phạm vi và chuẩn bị khôi phục cho thay đổi có rủi ro. Với publish/release, đối chiếu version, changelog, lockfile và nội dung đóng gói; chạy checks thật có trong repo.
- Trước deploy/mutation khó khôi phục, kiểm đúng target, quyền, backup/rollback và tác động. Chuẩn bị phần có thể kiểm tra trước khi xin một quyết định còn thiếu; không hỏi lại hành động đã được giao rõ.
- Nghiệm thu đúng lớp: build image, cài cấu hình, rollout, phiên bản đang phục vụ, health và luồng liên quan là các quan sát khác nhau. Build image đạt không thay deploy/readback; runtime chưa chạy là NOT_RUN. Trạng thái chung chỉ theo global.md và phạm vi yêu cầu.

Docs: cập nhật nội dung cần thiết theo source thật, không ép PRD/release checklist cho sửa README. Memory: chỉ tạo/sửa `.ai-local/` khi người dùng yêu cầu. [context-discovery.md](../../references/context-discovery.md) chỉ nạp khi cần tìm cấu trúc dự án.
