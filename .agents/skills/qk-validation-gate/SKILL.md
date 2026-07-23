---
name: qk-validation-gate
description: Cổng kiểm tra chất lượng bắt buộc với ngưỡng pass/fail cụ thể — chặn đứng mọi mã nguồn lỗi (Conformance Enforcement Engine EDAOS Architecture)
version: 2.0.0
domain: system
type: conformance_enforcement_engine
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - browser.performance
---

# 🛑 qk-validation-gate (v2.0 Native EDAOS Conformance Enforcement Engine)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Thực thi 5 Invariant Assertions và chạy Conformance Test Suite trước khi bất kỳ thay đổi nào được chấp thuận.
> Skill này kết nối trực tiếp với `12-validation-framework.md` và `conformance_test_suite.py` để đảm bảo hệ thống duy trì độ tin cậy tuyệt đối.

---

## 1. Hợp Đồng Kiểm Định (Conformance Boundary)

### Consumes
* `ActionPlan`: Kế hoạch thay đổi mã nguồn.
* `ValidationReport`: Kết quả chạy kịch bản kiểm thử.

### Produces
* `ConformanceStatus`: `PASSED` hoặc `REJECTED`.
* `InvariantAuditLog`: Nhật ký kiểm định 5 quy tắc bất biến.
