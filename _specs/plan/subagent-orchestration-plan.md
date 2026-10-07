# ĐẶC TẢ KỸ THUẬT & KẾ HOẠCH TRIỂN KHAI (SPEC & IMPLEMENTATION PLAN)
## Tích Hợp Subagent Swarm Orchestration (Multi-Agent Dispatch) Vào AI Developer Skill OS

- **Mã kế hoạch:** `SPEC-SUBAGENT-SWARM-01`
- **Ngày lập:** 07/10/2026
- **Trạng thái:** `Superseded by v10.3.0 implementation plan and verification report`
- **Mức độ phức tạp:** `L3 (High)` | **Mức độ rủi ro:** `R1 (Low - Skin/Rules configuration)`
- **Áp dụng cho môi trường:** Antigravity IDE (Gemini Cockpit) & Platform Agnostic Skins

---

## 1. Bối Cảnh & Vấn Đề (Problem Statement)

### 1.1. Hiện trạng
Hệ thống **AI Developer Skill OS** hiện tại đã sở hữu:
- 14 Roles chuyên biệt trong `DEV_PROFILE.md` và `AGENTS.md`.
- 11 Super-Skills toàn diện (`qk-code-review`, `qk-feature-delivery`, `qk-bug-resolution`, `qk-backend-data`,...).
- Điều khoản sơ khởi tại Mục 6 của `GEMINI.md` về *Manager View & Reactive Task Execution*.

### 1.2. Khoảng cách kỹ thuật (The Gap)
- Các Super-Skills hiện tại đang chạy theo mô hình **Single-Agent tuần tự**: 1 AI Agent chính tự đọc file, tự phân tích, tự sửa code, tự test, tự review từ đầu đến cuối.
- Dẫn đến 3 hạn chế nghiêm trọng khi xử lý task phức tạp:
  1. **Tắc nghẽn tốc độ (Sequential Bottleneck):** Các bước kiểm tra code, quét bảo mật, audit thư mục và kiểm tra test case phải chờ nhau.
  2. **Bội thực Context Window (Context Bloat):** Một agent nhồi nhét quá nhiều log, nội dung file và diff vào một luồng hội thoại duy nhất.
  3. **Điểm mù tư duy (Single Perspective Blindspot):** Agent vừa tự code vừa tự đánh giá sẽ có xu hướng "tự biên tự diễn", dễ bỏ lọt lỗ hổng bảo mật và edge cases.

### 1.3. Mục tiêu (Objective)
Tích hợp quy chế **Subagent Swarm Orchestration** native của Antigravity IDE vào các Super-Skills của `ai-developer-skill-os`:
- Khi gặp task quy mô vừa và lớn (Complexity ≥ L2 hoặc Risk ≥ R2), Agent chính tự động chuyển sang vai trò **Lead Orchestrator / Engineering Manager**.
- Chủ động kích hoạt công cụ `invoke_subagent` để spawn một tổ đội gồm 2–4 Subagents chuyên môn hóa chạy song song trong background (hiển thị trực quan từng card Subagent kèm spinner trên UI Antigravity như hình mẫu).
- Thu thập phản hồi từ các Subagents qua cơ chế tin nhắn phi đồng bộ (Reactive Messaging - Không polling).
- Tổng hợp báo cáo đa chiều và bàn giao kết quả minh bạch cho người dùng.

---

## 2. Kiến Trúc Điều Phối Subagents (Subagent Swarm Architecture)

### 2.1. Sơ đồ luồng điều phối (Dispatch Flowchart)

```
                            ┌──────────────────────────────────────────────┐
                            │           User Giao Nhiệm Vụ Mới             │
                            └──────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │    Lead Agent (Orchestrator / Manager)       │
                            │   • Phân tích Scope & Complexity (L0-L4)     │
                            │   • Lập Ma Trận Phân Quyền Nhiệm Vụ          │
                            └──────────────────────┬───────────────────────┘
                                                   │
                        Task Complexity ≥ L2 hoặc Chạm ≥ 2 Files?
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                        CÓ                                                  KHÔNG
                         │                                                   │
                         ▼                                                   ▼
         ┌───────────────────────────────┐                       ┌───────────────────────┐
         │ Kích Hoạt Subagent Swarm      │                       │ Single-Agent Direct   │
         │   (Gọi `invoke_subagent`)     │                       │    Execution          │
         └───────────────┬───────────────┘                       └───────────────────────┘
                         │
        ┌────────────────┼──────────────────────────────┐
        ▼                ▼                              ▼
┌──────────────┐ ┌──────────────┐             ┌───────────────────┐
│  Subagent 1  │ │  Subagent 2  │             │    Subagent N     │
│   (Role A)   │ │   (Role B)   │     ...     │     (Role N)      │
└───────┬──────┘ └───────┬──────┘             └─────────┬─────────┘
        │                │                              │
        └────────────────┼──────────────────────────────┘
                         │ (Phản hồi song song qua Messaging)
                         ▼
        ┌──────────────────────────────────────────────┐
        │        Lead Agent Tổng Hợp Báo Cáo           │
        │    (Dual-Stream Report / Walkthrough)        │
        └──────────────────────────────────────────────┘
```

---

## 3. Ma Trận Đội Hình Subagent Theo Từng Super-Skill (Dispatch Matrix)

### 3.1. Kỹ năng `qk-code-review` (Review Code & Security Audit)
Đội hình 3 Subagents chuyên trách (chính xác như hình mẫu người dùng cung cấp):

| STT | Tên Role Subagent | TypeName | Nhiệm vụ chính | Tool cấp phát |
|:---:|---|---|---|---|
| 1 | `Code & Architecture Reviewer` | `research` | Rà soát cấu trúc module, SOLID, Clean Code, phát hiện God Files (>300L), Long Functions (>40L), Deep Nesting. | `view_file` |
| 2 | `Folder & File Auditor` | `research` | Quét cấu trúc thư mục, quy ước đặt tên, regex tìm Secret Leaks (API Key, Passwords, Token) và lỗ hổng OWASP. | `view_file` |
| 3 | `Test & QA Engineer` | `research` | Đánh giá độ phủ kiểm thử, phân tích Boundary Conditions, Edge Cases và tính ổn định của Test Suite. | `view_file` |

### 3.2. Kỹ năng `qk-feature-delivery` (Build Feature Mới)
Đội hình 3 Subagents phối hợp Fullstack:

| STT | Tên Role Subagent | TypeName | Nhiệm vụ chính | Workspace |
|:---:|---|---|---|---|
| 1 | `Backend & Contract Engineer` | `self` | Định nghĩa API routes, schema validation (Zod/Pydantic), DB migrations và data types. | `share` / `inherit` |
| 2 | `Frontend & UI Specialist` | `self` | Dựng UI components, quản lý state flow, đảm bảo 4 trạng thái (Loading/Success/Empty/Error), responsive. | `share` / `inherit` |
| 3 | `QA Test Engineer` | `self` | Viết assertions, unit tests, integration tests tương ứng để khóa chất lượng. | `share` / `inherit` |

### 3.3. Kỹ năng `qk-bug-resolution` (Điều Tra & Sửa Bug Phức Tạp)
Đội hình 3 Subagents cô lập sự cố:

| STT | Tên Role Subagent | TypeName | Nhiệm vụ chính |
|:---:|---|---|---|
| 1 | `Call-stack & Error Tracer` | `research` | Tái hiện lỗi, trace call-stack từ error logs, xác định tọa độ file và dòng mã gây crash. |
| 2 | `Root-Cause Diagnostician` | `research` | Đọc hiểu ngữ cảnh nghiệp vụ, truy tìm nguyên nhân cốt lõi (Root Cause) thay vì vá bề mặt. |
| 3 | `Regression Shield Verifier` | `self` | Viết fail-test trước khi sửa, xác minh bản vá phẫu thuật và bảo vệ không sinh lỗi hồi quy. |

### 3.4. Kỹ năng `qk-backend-data` & `qk-api-data-discovery`
Đội hình 2 Subagents xử lý dữ liệu:
- Subagent 1: `Data Contract & Schema Explorer` (Phân tích Postman, Schema, Data Dictionary, Bronze Layer).
- Subagent 2: `Query & Pipeline Optimizer` (Rà soát SQL EXPLAIN/ANALYZE, N+1 query, idempotency).

---

## 4. Kế Hoạch Thay Đổi Từng File (File Modification Plan)

Để tích hợp hoàn chỉnh quy chế này vào codebase mà không làm gãy kiến trúc, kế hoạch phân rã thành các bước:

### File 1: `GEMINI.md`
- **Mục tiêu:** Mở rộng Mục 6 từ mô tả ngắn thành **Quy Chuẩn Điều Phối Subagent Swarm (Section 6: Subagent Swarm & Manager View Protocol)**.
- **Nội dung bổ sung:**
  - Tiêu chuẩn điều kiện kích hoạt: Tự động dùng `invoke_subagent` khi `Complexity >= Medium` hoặc task ảnh hưởng ≥ 2 modules.
  - Chuẩn định dạng `Role` (2–5 từ, viết hoa chữ cái đầu theo chuẩn job title).
  - Quy tắc đồng bộ: Cấm dùng polling sleep; nhận phản hồi qua hệ thống messaging tự động.

### File 2: `.agents/skills/qk-code-review/SKILL.md`
- **Mục tiêu:** Bổ sung bước **Subagent Dispatch Phase** vào Quy trình Kiểm toán 4 Bước.
- **Nội dung bổ sung:**
  - Khi review toàn diện hoặc module lớn: Tự động spawn 3 Subagents: `Code & Architecture Reviewer`, `Folder & File Auditor`, `Test & QA Engineer`.
  - Agent chính đóng vai trò Trưởng ban Kiểm toán (Lead Auditor), gom 3 báo cáo chuyên sâu để tạo artifact `review_report.md`.

### File 3: `.agents/skills/qk-feature-delivery/SKILL.md`
- **Mục tiêu:** Tích hợp Subagent Team vào quy trình phát triển tính năng.
- **Nội dung bổ sung:** Phân nhánh Subagent cho Backend, Frontend và QA khi thực hiện fullstack feature.

### File 4: `.agents/skills/qk-bug-resolution/SKILL.md`
- **Mục tiêu:** Chuẩn hóa chu trình 4 bước chẩn đoán bằng Subagents độc lập.

### File 5: `.agents/workflows/code-review.yml` & `.agents/workflows/feature-delivery.yml`
- **Mục tiêu:** Cập nhật các bước trong workflow YAML để phản ánh bước `subagent_dispatch` (nếu chạy trên Antigravity).

### File 6: `tooling/build-registry.js` & Registry Re-generation
- **Mục tiêu:** Chạy build lại `index.yaml` và `graph.json` để đồng bộ toàn bộ metadata của Skin.

---

## 5. Tiêu Chí Nghiệm Thu (Acceptance Criteria - BDD)

```gherkin
Scenario: Kích hoạt Subagents khi review code toàn diện
  Given Người dùng yêu cầu review code một module hoặc tính năng lớn
  When Kỹ năng qk-code-review được kích hoạt trên Antigravity
  Then Lead Agent phải biên dịch Compiled Execution Prompt và phân bổ Subagent Swarm
  And Gọi công cụ invoke_subagent với 3 roles:
      | Role |
      | Code & Architecture Reviewer |
      | Folder & File Auditor |
      | Test & QA Engineer |
  And Giao diện Antigravity IDE hiển thị 3 card Subagent song song có biểu tượng spinner
  And Lead Agent thu thập kết quả và xuất báo cáo Dual-Stream mà không gặp lỗi context bloat

Scenario: Kiểm tra tính toàn vẹn của Registry hệ thống
  Given Các file SKILL.md và GEMINI.md đã được cập nhật
  When Chạy lệnh npm run test:registry và npm run test:graph
  Then Kết quả kiểm thử phải PASS 100%, không có chu trình đệ quy hay lỗi schema.
```

---

## 6. Lộ Trình Triển Khai (Execution Milestones)

- **Giai đoạn 1 (Gốc):** Cập nhật `GEMINI.md` với Subagent Swarm Protocol hoàn chỉnh.
- **Giai đoạn 2 (Kỹ năng Audit):** Cập nhật `qk-code-review/SKILL.md` (tái hiện chính xác luồng trong ảnh chụp của user).
- **Giai đoạn 3 (Kỹ năng Delivery & Bug):** Cập nhật `qk-feature-delivery/SKILL.md` và `qk-bug-resolution/SKILL.md`.
- **Giai đoạn 4 (Đồng bộ Registry & Test):** Chạy `node tooling/build-registry.js`, chạy test suite `vitest` và xác nhận PASS 100%.
