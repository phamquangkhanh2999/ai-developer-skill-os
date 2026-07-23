---
name: qk-performance-tuner
description: Tối ưu hóa hiệu năng Frontend (LCP, CLS, INP, Bundle) dựa trên Chiến lược Thực nghiệm (Optimization Orchestrator EDAOS Architecture)
version: 2.0.0
domain: frontend.web
type: optimization_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - browser.performance
  - bundle.analyze
  - code.react-analysis
---

# 🚀 qk-performance-tuner (v2.0 Native EDAOS Optimization Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Định hình chiến lược tối ưu hóa hiệu năng Frontend dựa trên `Finding` chẩn đoán.
> Skill này đóng vai trò là **Optimization Orchestrator**: Trả lời câu hỏi *"Giải quyết vấn đề bằng chiến lược tối ưu nào?"*, lựa chọn Strategy, đóng gói Action Plan và ủy quyền thực thi (Execution Delegation) cho các skill chuyên trách (`qk-feature-delivery` / `qk-bug-resolution`).

---

## 1. Hợp Đồng Năng Lực & Trách Nhiệm Miền (Domain Responsibility)

### Phân Định Ranh Giới
* **`qk-ui-audit`**: Chẩn đoán lỗi ("What is wrong?") ➔ Sinh ra `Finding`.
* **`qk-performance-tuner`**: Lựa chọn chiến lược tối ưu ("How to solve?") ➔ Tiêu thụ `Finding`, sinh ra `Decision` & `Action Plan`.

### Capability Requirements
Skill yêu cầu các Năng lực Trừu tượng sau từ Router:
* `browser.performance`: Đo đạc chỉ số runtime Core Web Vitals
* `bundle.analyze`: Phân tích kích thước chunk, tree-shaking và vendor JS
* `code.react-analysis`: Phân tích re-render, Fiber state và Hook dependencies

---

## 2. Quy Trình Vận Hành EDAOS Optimization Flow

Skill thực thi nghiêm ngặt theo **Optimization Workflow**:

```
1. CONSUME FINDING ➔ Tiếp nhận Finding chẩn đoán từ qk-ui-audit (ví dụ: FIND-LCP-001)
2. CLASSIFY        ➔ Phân loại nhóm nghẽn (Render Blocking, Bundle Oversize, Layout Shift)
3. SELECT STRATEGY ➔ Tra cứu Cây Quyết Định (Decision Tree) chọn Chiến lược Tối ưu
4. FORMULATE DECISION ➔ Áp dụng Rule Engine đưa ra Decision chiến lược
5. CREATE ACTION PLAN ➔ Đóng gói các bước hành động cụ thể + Compensating Actions
6. DELEGATE        ➔ Ủy quyền thực thi code cho `./qk-feature-delivery` hoặc `./qk-bug-resolution`
7. VERIFY          ➔ Re-observe chỉ số runtime (Xác minh đạt mốc cải thiện mục tiêu)
8. LEARN           ➔ Lưu bài học tối ưu thành công vào edaos.learning.frontend.web
```

---

## 3. Các Chiến Lược Tối Ưu Hóa (Optimization Strategies)

| Nhóm Nghẽn (Bottleneck) | Chiến Lược Tối Ưu (Strategy) | Target Outcome |
| :--- | :--- | :--- |
| **LCP Render Blocking** | `lcp-optimization.strategy.yml` | LCP reduction $\ge 40\%$ |
| **CLS Layout Shift** | `cls-stabilization.strategy.yml` | CLS ratio $\le 0.10$ |
| **Bundle Oversize** | `bundle-reduction.strategy.yml` | Bundle JS $\le 250KB$ |
| **React Re-render Cost** | `runtime-performance.strategy.yml` | FPS $\ge 55fps$ |

---

## 4. Định Dạng Output Optimization Report

```markdown
🚀 qk-performance-tuner Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Input Finding:   [FIND-LCP-001: Hero Image Render Blocking]
Target Metric:   LCP (Current: 3.8s ➔ Target: <= 2.5s)
Selected Strategy: [lcp_image_loading_optimization]

💡 Strategic Decision:
  - Decision Type: OPTIMIZE_RESOURCE_LOADING
  - Expected Improvement: ~52% LCP reduction (3.8s ➔ 1.8s)

📋 Action Plan & Execution Delegation:
  1. Convert asset 'hero-main.png' to modern WebP format
  2. Add <link rel="preload"> hint to HTML head
  3. Define explicit width/height to avoid CLS regression
  4. Delegate code implementation to `./qk-feature-delivery`

✅ Post-Verification Plan:
  - Re-run `browser.performance` observation post-execution
  - Target: LCP <= 2500ms, Zero CLS regression.
```
