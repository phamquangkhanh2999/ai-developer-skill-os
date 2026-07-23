---
name: qk-production-release
description: Chuẩn bị release production với 8-gate checklist bắt buộc (Release Governance Orchestrator EDAOS Architecture)
version: 2.0.0
domain: frontend.web
type: release_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - ui.capture
  - browser.performance
  - code.ast
---

# 🚀 qk-production-release (v2.0 Native EDAOS Release Governance Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Kiểm soát chất lượng và cấp phép triển khai mã nguồn lên Production (Runtime Delivery Governance).
> Skill này đóng vai trò là **Release Governance Orchestrator**: Trả lời câu hỏi *"Release Candidate này có đủ điều kiện an toàn để triển khai lên Production hay không?"*, đánh giá nghiêm ngặt qua **8 Release Gates**, lập kế hoạch Rollback an toàn và thực hiện Kiểm tra sau triển khai (Post-Release Validation).

---

## 1. Hợp Đồng Cấp Phép Release (Release Governance Boundary)

### Consumes (Đầu vào bắt buộc)
Skill tiếp nhận thông tin từ `ReleaseCandidate`:
* `ReleaseCandidate`: Mã phiên bản, danh sách file thay đổi và commit hash.
* `GovernanceDecision`: Báo cáo chấp thuận kiến trúc từ `qk-engineering-standard`.
* `ValidationReport`: Báo cáo kết quả kiểm thử từ `12-validation-framework.md`.
* `EvidenceBundle`: Báo cáo Performance, Security, Accessibility.

### Produces (Đầu ra chuẩn hóa)
* `ReleaseDecision`: Đưa ra 1 trong 4 kết luận:
  - `APPROVED`: Chấp thuận 100% triển khai Production.
  - `APPROVED_WITH_RISK`: Chấp thuận triển khai kèm theo Feature Flag/Cảnh báo rủi ro.
  - `HUMAN_APPROVAL_REQUIRED`: Kích hoạt Human Gate do thay đổi kiến trúc/DB high-risk.
  - `BLOCKED`: Chặn đứng triển khai do vi phạm gate an toàn.

---

## 2. Chuẩn 8 Release Gates (The 8-Gate Release Quality Checklist)

Mọi Release Candidate đều phải vượt qua 8 Cổng Kiểm soát An toàn theo thứ tự:

```
┌────────────────────────────────────────────────────────────────────────┐
│ GATE 1: Engineering Compliance ➔ Pass qk-engineering-standard         │
│ GATE 2: Validation Integrity   ➔ Pass 12-validation-framework report   │
│ GATE 3: Security Review        ➔ Zero critical dependencies/secrets   │
│ GATE 4: Performance Budget     ➔ LCP <= 2.5s, Bundle <= 600KB, CLS <=0.1│
│ GATE 5: Accessibility Check    ➔ Zero critical A11y AA violations      │
│ GATE 6: Migration Safety       ➔ Reversible DB/API migration & rollback│
│ GATE 7: Deployment Readiness   ➔ Config, secrets & feature flags OK    │
│ GATE 8: Post-Release Monitoring➔ Post-deploy baseline verification     │
└────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> **Không Pass Gate = Không Deploy!** Bất kỳ vi phạm nào ở Gate 1 đến Gate 6 đều dẫn đến kết luận **BLOCKED** ngay lập tức.

---

## 3. Quy Trình Vận Hành EDAOS Release Workflow

Skill thực thi nghiêm ngặt theo **Release Lifecycle**:

```
1. RECEIVE RELEASE CANDIDATE ➔ Nhận Release Candidate metadata & commit hash
2. EVALUATE 8 RELEASE GATES ➔ Chạy tự động kiểm tra từ Gate 1 đến Gate 7
3. ASSESS RELEASE RISK       ➔ Phân loại mức độ rủi ro (Low / Medium / High / Critical)
4. FORMULATE RELEASE DECISION➔ Đưa ra kết luận APPROVED hoặc BLOCKED
5. DEPLOY TO PRODUCTION      ➔ Thực thi triển khai Production (nếu Approved)
6. POST-RELEASE VALIDATION   ➔ Thực hiện Gate 8: Đo đạc lại chỉ số production baseline
7. STORE RELEASE LEARNING    ➔ Lưu bài học release vào edaos.learning.frontend.web
```

---

## 4. Định Dạng Output Release Report

```markdown
🚀 qk-production-release Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Release Candidate: [v2.4.0-rc1 - Hash: #a8f9c2e]
Target Environment: [Production]
Release Status:   [APPROVED]
Overall Risk:     [LOW]

📋 8-Gate Compliance Audit:
  - Gate 1 (Engineering Compliance): ✅ PASS (qk-engineering-standard: ACCEPT)
  - Gate 2 (Validation Integrity):   ✅ PASS (Validation Report: 100% Invariants OK)
  - Gate 3 (Security Review):        ✅ PASS (0 secrets, 0 critical CVEs)
  - Gate 4 (Performance Budget):     ✅ PASS (LCP: 1.8s <= 2.5s, Bundle: 412KB <= 600KB)
  - Gate 5 (Accessibility Check):    ✅ PASS (Zero A11y AA violations)
  - Gate 6 (Migration Safety):       ✅ PASS (No DB schema mutation)
  - Gate 7 (Deployment Readiness):   ✅ PASS (Configs & Feature Flags active)
  - Gate 8 (Post-Release Check):     ✅ PASS (Baseline verified post-deploy)

🛡️ Rollback Policy & Safety:
  - Automatic Rollback Trigger: Error Rate > 1% or LCP > 3500ms within 5 mins
  - Compensating Rollback Plan: `git revert #a8f9c2e` active
```
