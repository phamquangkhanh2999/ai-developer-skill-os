---
name: qk-orchestrator
description: Điều hướng yêu cầu của người dùng đến đúng skill với kỷ luật thép — kiểm tra preconditions, capabilities router và event bus (Control Plane Orchestrator EDAOS Architecture)
version: 2.0.0
domain: system
type: control_plane_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - ui.capture
  - browser.performance
---

# 🕹️ qk-orchestrator (v2.0 Native EDAOS Control Plane Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Điều phối luồng làm việc, định tuyến yêu cầu người dùng, kiểm tra Preconditions và gọi đúng Skill Orchestrators.
> Skill này đóng vai trò là **EDAOS Control Plane Engine**: Kết nối với `19-event-bus-runtime.yml` và `21-capability-router-runtime.yml` để điều hướng công việc chuẩn xác, không nhảy cóc các tầng an toàn.

---

## 1. Hợp Đồng Điều Phối (Control Plane Boundary)

### Consumes
* `UserIntent`: Yêu cầu hoặc tham số truyền vào từ người dùng (`./qk-[skill-name] --args`).
* `SystemState`: Trạng thái hệ thống từ `20-state-store-runtime.yml`.

### Produces
* `RoutingDecision`: Quyết định điều hướng tới Skill Orchestrator tương ứng.
* `ExecutionJob`: Đơn hàng công việc đẩy vào `25-execution-scheduler-runtime.yml`.

---

## 2. Bảng Định Tuyền Routing Table

```
User Request / Intent
         │
         ├── DETECT ────► ./qk-ui-audit v2.0
         ├── OPTIMIZE ──► ./qk-performance-tuner v2.0
         ├── REPAIR ────► ./qk-bug-resolution v2.0
         ├── CREATE ────► ./qk-feature-delivery v2.0
         ├── GOVERN ────► ./qk-engineering-standard v2.0
         ├── RELEASE ───► ./qk-production-release v2.0
         └── HEALTH ────► ./qk-project-health v2.0
```
