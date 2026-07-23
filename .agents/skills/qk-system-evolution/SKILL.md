---
name: qk-system-evolution
description: Nâng cấp thư viện/framework và tự tiến hóa Rules/Policies an toàn với rollback plan bắt buộc (Evolution Governance Client EDAOS Architecture)
version: 2.0.0
domain: system
type: evolution_governance_client
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - code.references
---

# 🧬 qk-system-evolution (v2.0 Native EDAOS Evolution Governance Client)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Đánh giá lịch sử vận hành, đề xuất nâng cấp Rules/Policies và thực hiện tiến hóa có kiểm soát.
> Skill này giao tiếp trực tiếp với `16-rule-evolution-engine.yml`, `17-policy-feedback-loop.yml`, và `30-evolution-governance-board.yml` để đảm bảo mọi nâng cấp đều có điểm rollback an toàn.

---

## 1. Hợp Đồng Tiến Hóa (Evolution Boundary)

### Consumes
* `ExecutionHistory`: Lịch sử từ `13-execution-journal-contract.yml`.
* `SelfHealthScore`: Chỉ số sức khỏe từ `18-system-self-health.metric.yml`.

### Produces
* `EvolutionProposal`: Đề xuất nâng cấp Rule/Policy.
* `CanaryTestJob`: Kịch bản kiểm thử A/B Canary trước khi commit phiên bản mới.
