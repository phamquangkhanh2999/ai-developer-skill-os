---
# ── Identity ───────────────────────────────────────────────
name: qk-project-audit
version: 9.2.0
status: stable
description: "Phân tích toàn diện dự án: Gap Analysis, Feasibility, Risk Assessment — báo cáo trước khi code, không tự ý implement. Dùng skill này khi user nhắc đến: phân tích dự án, gap analysis, feasibility, audit report, đánh giá rủi ro, risk assessment — kể cả khi chỉ hỏi 'hệ thống hiện tại có đáp ứng được yêu cầu X không' — KHÔNG dùng cho đo lường nợ kỹ thuật hay code smell của code đang chạy (dùng qk-project-health)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - project-analysis
  - gap-analysis
  - feasibility-study
  - risk-assessment

complexity:
  level: medium
  criteria:
    files_affected: "1-10"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "phân tích dự án"
  - "gap analysis"
  - "feasibility"
  - "audit report"
  - "đánh giá rủi ro"
  - "risk assessment"

selection:
  priority: high
  confidence_threshold: 0.85

# ── V9: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-context-loader
  - qk-product-specification
  - qk-feature-delivery
  - qk-project-health

knowledge_scope:
  owns:
    - project-analysis
    - gap-analysis
    - feasibility-assessment
    - risk-report
  references:
    - architecture
    - security
    - performance

# ── V9: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

# ── Runtime ────────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: none
produces: [report, plan]
consumes: [user-description, source-code]

token_budget:
  max_files_read: 10
  max_lines_per_read: 200
  max_shell_commands: 3
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-project-audit — Project Analysis & Gap Report

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm phân tích khoảng cách kỹ thuật (Gap Analysis), tính khả thi (Feasibility) và đánh giá rủi ro (Risk Assessment) trước khi bắt tay vào triển khai một tính năng lớn hoặc thay đổi kiến trúc. **Hoạt động ở chế độ Read-Only, cam kết không tự ý sửa đổi code.**

---

## Preconditions

Trước khi lập báo cáo phân tích, AI BẮT BUỘC kiểm tra:

- [ ] Đọc `.agents/DEV_PROFILE.md` để nắm stack, conventions và constraints.
- [ ] Xác định rõ mục tiêu kinh doanh hoặc yêu cầu kỹ thuật mới cần phân tích tính khả thi.
- [ ] Đảm bảo có quyền truy cập đọc mã nguồn liên quan trong dự án.
- [ ] Nếu yêu cầu thay đổi hoàn toàn thiếu cơ sở kỹ thuật hoặc mâu thuẫn trực tiếp với kiến trúc cốt lõi:
  → **EXIT: BLOCKED**
  → Báo cáo user lý do kiến trúc không tương thích kèm các hướng đi thay thế.

---

## Scope

✅ Skill này làm:
- Phân tích Gap giữa hiện trạng (As-Is) và mong muốn (To-Be).
- Đánh giá tính khả thi kỹ thuật (Technical Feasibility): khả năng mở rộng, độ trễ, giới hạn công nghệ.
- Đánh giá rủi ro (Risk Assessment): xung đột dữ liệu, phá vỡ hợp đồng API, hiệu năng, nợ kỹ thuật.
- Lập ma trận đánh giá chi phí / lợi ích (Cost-Benefit & Effort Estimation) cho các giải pháp.
- Đề xuất lộ trình triển khai từng bước (Phase-by-phase rollout).

❌ Skill này KHÔNG làm:
- Tự ý viết code tính năng hoặc tạo migration (→ `qk-feature-delivery`).
- Chấm điểm chi tiết chỉ số code smell/God files (→ `qk-project-health`).
- Scan lỗ hổng bảo mật chuyên sâu OWASP (→ `qk-security-audit`).

---

## Execution Steps

### Step 1 — As-Is Landscape Assessment
```
Inputs:  Yêu cầu từ user, Codebase hiện tại
Actions:
  - Rà soát các components, modules và data models liên quan trực tiếp đến yêu cầu mới.
  - Phân tích luồng dữ liệu hiện hữu và các ràng buộc hệ thống.
Output: As-Is Architecture Snapshot
```

### Step 2 — Gap Analysis & Feasibility Study
```
Inputs:  As-Is Snapshot, Yêu cầu To-Be
Actions:
  - Xác định các thành phần còn thiếu (Missing components, missing APIs, missing schemas).
  - So sánh các phương án giải pháp kỹ thuật khả thi (Option A vs Option B).
  - Đánh giá tương thích với thư viện hiện tại trong DEV_PROFILE.md.
Output: Gap matrix & Feasibility verdict
```

### Step 3 — Risk Identification & Mitigation Matrix
```
Inputs:  Proposed solutions
Actions:
  - Liệt kê các rủi ro: Khóa bảng DB, nghẽn mạng, phá vỡ backward compatibility, độ phức tạp bảo trì.
  - Xây dựng biện pháp giảm thiểu rủi ro (Mitigation plan) cho từng điểm nghẽn.
Output: Risk & Mitigation table
```

### Step 4 — Executive Summary & Phasing Roadmap
```
Inputs:  Analysis results
Actions:
  - Tổng hợp báo cáo phân tích theo mẫu chuẩn.
  - Đề xuất lộ trình phân kỳ (Phases: PoC → MVP → Production Ready).
Exit: SUCCESS
```

---

## Prompt Template

```
Yêu cầu mới:   [Mô tả tính năng lớn hoặc thay đổi kiến trúc cần phân tích]
Kỳ vọng:       [Mục tiêu kinh doanh, tải mong đợi, SLA]
Hệ thống hiện tại: [Các module hoặc file liên quan đang hoạt động ra sao]
Lo ngại chính: [Những rủi ro hoặc câu hỏi kỹ thuật bạn đang băn khoăn nhất]
```
