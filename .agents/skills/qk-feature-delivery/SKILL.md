---
name: qk-feature-delivery
version: 10.4.0
status: stable
subtitle: "Build Feature mới & Tích hợp"
description: "Phát triển tính năng mới, thay đổi yêu cầu, tích hợp API, và lập đặc tả (chế độ plan-only, discovery-only, prompt-only). Dùng khi: add feature, tính năng mới, tạo mới, build new, đổi yêu cầu, tích hợp api, consume api, bind data, viết spec, prd, bdd."
platforms: [antigravity, claude, opencode]
runtime_version: 1
references:
  - ../../references/requirements.md
  - ../../references/ui.md
  - ../../references/backend-data.md
  - ../../references/api-discovery.md
  - ../../references/prompt-authoring.md
rules:
  - global
  - coding-standards
  - safety
workflow: feature-delivery
triggers:
  - "add feature"
  - "phát triển tính năng mới"
  - "tạo mới tính năng"
  - "build new feature"
  - "thêm chức năng"
  - "tích hợp api"
  - "consume api"
  - "bind data"
  - "đổi yêu cầu"
  - "viết spec"
  - "viết prd"
---

# qk-feature-delivery — Xây Dựng Tính Năng & Tích Hợp

> **Hợp đồng cốt lõi:** Tuân thủ [.agents/rules/global.md](../../rules/global.md). Dòng mở đầu bắt buộc: `Dùng qk-feature-delivery vì <mục tiêu cụ thể>.`

---

## 1. Chế Độ Vận Hành Đặc Thù (Execution Modes)

1. **Chế độ `plan-only` (Khi chỉ yêu cầu viết spec, PRD, BDD):**
   - Đọc tham khảo [requirements.md](../../references/requirements.md).
   - **TUYỆT ĐỐI KHÔNG sinh implementation code.** Chỉ bàn giao tài liệu đặc tả, tiêu chí nghiệm thu và sơ đồ luồng.
2. **Chế độ `discovery-only` (Khi khảo sát API / Postman):**
   - Đọc tham khảo [api-discovery.md](../../references/api-discovery.md).
   - Thu thập bằng chứng thực nghiệm (status, headers, payload), lập data dictionary và báo cáo checkpoint. **KHÔNG** tự ý viết pipeline ingestion hay migration.
3. **Chế độ `prompt-only` (Khi biên soạn / tối ưu prompt):**
   - Đọc tham khảo [prompt-authoring.md](../../references/prompt-authoring.md).
   - Chỉ biên tập prompt và delta; **TUYỆT ĐỐI KHÔNG** thực thi nội dung của prompt đang biên soạn.
4. **Chế độ `build` (Triển khai tính năng mới hoặc đổi yêu cầu):**
   - **Task nhỏ, rõ:** Xác định mục tiêu, tiêu chí nghiệm thu (Acceptance Criteria), triển khai trực tiếp và kiểm chứng.
   - **Task lớn / Phức tạp:** Chia nhỏ thành các lát cắt dọc (Vertical Slices), hỏi làm rõ các điểm nghiệp vụ quyết định (MVP) trước khi code.
   - **Thay đổi yêu cầu (Changed Requirements):** Nêu rõ Before / After, tương thích dữ liệu lịch sử, và chuẩn bị kế hoạch migration/rollback nếu sửa DB.

---

## 2. Nạp Kiến Thức Chuyên Môn Theo Nhu Cầu

- **Khi đụng UI / Styling / CSS:** Đọc [ui.md](../../references/ui.md) — 100% tokens (0 magic numbers), đủ 6 interaction states (Default, Hover, Focus-visible, Active, Disabled, Loading), responsive không tràn ngang (< 375px), touch target ≥ 44px.
- **Khi đụng API / Database / Pipeline:** Đọc [backend-data.md](../../references/backend-data.md) — Zero-trust validation (Zod/Pydantic), chặn IDOR, diệt N+1 (eager loading), migration theo chuẩn Expand-Contract.

---

## 3. Quy Trình Thực Thi & Kiểm Chứng

```text
Xác định mode (build | plan-only | discovery-only | prompt-only)
   ↓
Tải reference tương ứng (requirements / ui / backend-data / api-discovery)
   ↓
Sửa tối thiểu theo Acceptance Criteria (Laser Focus)
   ↓
Tự review diffs & chạy lệnh kiểm chứng thực tế (test / build / typecheck)
   ↓
Báo cáo kết quả theo mẫu Feature Report trong global.md
```

- **Controlled Subagent:** Mặc định single-agent. Chỉ điều phối subagent khi người dùng yêu cầu và môi trường hỗ trợ.
