---
name: qk-project-health
description: Kiểm toán toàn diện Code Smells, Tech Debt, Architecture (Health Intelligence Orchestrator EDAOS Architecture): Health score 0–100 với actionable roadmap
version: 2.0.0
domain: frontend.web
type: health_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - code.references
  - ui.capture
  - browser.performance
---

# 🩺 qk-project-health (v2.0 Native EDAOS Health Intelligence Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Giám sát sức khỏe tổng thể, chẩn đoán suy thoái kiến trúc (Architecture Decay), xếp ưu tiên Nợ kỹ thuật (Technical Debt) và lập Roadmap cải thiện chiến lược cho hệ thống.
> Skill này đóng vai trò là **Strategic Intelligence Layer**: Trả lời câu hỏi *"Hệ thống đang khỏe hay đang suy thoái? Nợ kỹ thuật nào cần xử lý trước?"*, tính toán **Health Score (0–100)** dựa trên 6 chiều dữ liệu thực nghiệm và điều hướng các skill kỹ thuật thực thi cải tiến liên tục.

---

## 1. Hợp Đồng Giám Sát Chiến Lược (Strategic Intelligence Boundary)

### Consumes (Đầu vào bắt buộc từ toàn bộ Hệ sinh thái EDAOS)
* `EvidenceBundle` (Performance, Accessibility, Security, Visual Evidences từ `qk-ui-audit`).
* `GovernanceDecision` (Báo cáo vi phạm kiến trúc từ `qk-engineering-standard`).
* `ValidationReport` (Báo cáo kiểm thử từ `12-validation-framework.md`).
* `DeploymentLog` & `ReleaseDecision` (Báo cáo độ ổn định release từ `qk-production-release`).
* `LearningStore` (Ký ức các sự cố và bài học lịch sử).

### Produces (Đầu ra chuẩn hóa)
* `ProjectHealthReport`: Báo cáo sức khỏe tổng thể kèm **Health Score (0–100)** và Xếp loại Grade (A / B / C / D / F).
* `HealthDecision`: Đưa ra trạng thái hệ thống (`HEALTHY`, `WARNING`, `DEGRADED`, `CRITICAL`).
* `TechnicalDebtRoadmap`: Danh sách Nợ kỹ thuật được xếp ưu tiên theo công thức tác động.

---

## 2. Bộ Máy Tính Điểm Sức Khỏe 6 Chiều (The 6-Dimensional Health Score Engine)

Chỉ số Health Score tổng thể được tính toán bằng tổng trọng số 6 chiều dữ liệu:

$$\text{Health Score} = (S_{\text{Arch}} \times 0.25) + (S_{\text{Quality}} \times 0.20) + (S_{\text{Sec}} \times 0.20) + (S_{\text{Perf}} \times 0.15) + (S_{\text{Delivery}} \times 0.10) + (S_{\text{Docs}} \times 0.10)$$

```
┌────────────────────────────────────────────────────────────────────────┐
│               6-DIMENSIONAL HEALTH ENGINE WEIGHT MATRIX                │
├───────────────────────────────────────┬────────────────────────────────┤
│ 1. Architecture Health      (25%)     │ Coupling, Cohesion, Boundaries │
│ 2. Code Quality & Complexity (20%)     │ Cognitive Complexity, DRY      │
│ 3. Security Baseline        (20%)     │ CVEs, Secrets, Auth Boundaries │
│ 4. Performance & Vitals     (15%)     │ LCP, CLS, Bundle Size          │
│ 5. Delivery Reliability     (10%)     │ Release Pass Rate, Rollbacks   │
│ 6. Documentation & Alignment(10%)     │ ADRs, Spec Match, Test Coverage│
└───────────────────────────────────────┴────────────────────────────────┘
```

---

## 3. Công Thức Xếp Ưu Tiên Nợ Kỹ Thuật (Technical Debt Prioritization Formula)

Không liệt kê tràn lan, EDAOS xếp hạng ưu tiên Nợ kỹ thuật theo công thức tác động:

$$\text{Debt Priority Score} = \text{Impact} \times \text{Frequency} \times \text{Risk} \times \text{FutureCost}$$

| Nợ Kỹ Thuật (Technical Debt Issue) | Impact | Risk | Priority Score | Hand-off Skill |
| :--- | :--- | :--- | :--- | :--- |
| **Circular Dependency giữa UI & Domain** | High (9) | High (9) | **95 (CRITICAL)** | `./qk-engineering-standard` |
| **LCP Render Blocking Hero Image** | High (8) | Med (6) | **78 (HIGH)** | `./qk-performance-tuner` |
| **Cognitive Complexity > 20 ở UsersManager**| Med (6) | Med (5) | **55 (MEDIUM)** | `./qk-bug-resolution` |
| **Unused CSS Class / Minor Naming** | Low (2) | Low (2) | **12 (LOW)** | Idle / Refactor later |

---

## 4. Quy Trình Vận Hành EDAOS Health Assessment Workflow

```
1. CONSUME ECOSYSTEM EVIDENCE ➔ Thu thập toàn bộ Evidence & Reports từ 6 Skills tiền nhiệm
2. CALCULATE 6D HEALTH SCORE  ➔ Chạy 6-Dimensional Engine tính điểm tổng thể (0–100)
3. DETECT DECAY TRENDS        ➔ Phân tích xu hướng suy thoái (Worsening vs Improving)
4. PRIORITIZE TECH DEBT       ➔ Tính điểm Debt Priority Score cho các vấn đề tồn đọng
5. FORMULATE HEALTH DECISION  ➔ Đưa ra kết luận HEALTHY / WARNING / DEGRADED / CRITICAL
6. GENERATE ACTIONABLE ROADMAP➔ Phân phối công việc cụ thể cho các skill chuyên trách
7. STORE SYSTEM HEALTH HISTORY➔ Lưu nhật ký sức khỏe vào edaos.learning.frontend.web
```

---

## 5. Định Dạng Output Health Report

```markdown
🩺 qk-project-health Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Project Scope:    [VTV AdWatch Admin Dashboard]
Health Score:     [84 / 100 - Grade B+]
System Status:    [WARNING - Architecture Decay Trend Detected]

📊 6-Dimensional Health Breakdown:
  - 🏛️ Architecture Health (25%): 75 / 100 (WARNING - 2 Circular Dependencies)
  - 🧹 Code Quality        (20%): 82 / 100 (GOOD - Duplication 4.2%)
  - 🛡️ Security Baseline   (20%): 95 / 100 (EXCELLENT - 0 Secrets, 0 CVEs)
  - ⚡ Performance         (15%): 88 / 100 (GOOD - LCP 1.8s, Bundle 412KB)
  - 🚀 Delivery Reliability(10%): 90 / 100 (EXCELLENT - 100% Release Pass Rate)
  - 📚 Documentation       (10%): 70 / 100 (SATISFACTORY)

🚨 Technical Debt Prioritization Roadmap:
  1. [PRIORITY 95 - CRITICAL] Resolve Circular Dependency in UI <-> Service layer
     ➔ Target Delegate: `./qk-engineering-standard`
  2. [PRIORITY 78 - HIGH] Add Preload Hint to Hero Image Banner
     ➔ Target Delegate: `./qk-performance-tuner`
  3. [PRIORITY 55 - MEDIUM] Reduce Cognitive Complexity in UsersManager.tsx (28 -> 15)
     ➔ Target Delegate: `./qk-bug-resolution`
```
