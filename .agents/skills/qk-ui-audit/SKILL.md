---
name: qk-ui-audit
description: Kiểm toán giao diện (UI), Performance, Accessibility và Visual Diff dựa trên Bằng chứng Thực nghiệm (Evidence-Driven EDAOS Architecture)
version: 2.0.0
domain: frontend.web
type: reasoning_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - ui.capture
  - browser.performance
  - ui.visual_diff
  - accessibility.evaluate
---

# 🎨 qk-ui-audit (v2.0 Native EDAOS Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Kiểm toán toàn diện chất lượng giao diện (Performance, Accessibility, Visual Diff, Layout Shift) dựa trên **Bằng chứng Thực nghiệm (Evidence-Driven)**. 
> Skill này đóng vai trò là **Reasoning Orchestrator**: Tuyệt đối MÙ CÔNG CỤ (Tool-Blind), KHÔNG tự sửa code trực tiếp, và KHÔNG ĐƯỢC KẾT LUẬN nếu thiếu Bằng chứng được xác minh qua Policy Engine.

---

## 1. Hợp Đồng Năng Lực (Capability & Input Contract)

### Capability Requirements
Skill yêu cầu các Năng lực Trừu tượng sau từ Router:
* `ui.capture`: Chụp ảnh giao diện và trích xuất DOM Snapshot
* `browser.performance`: Đo đạc các chỉ số Core Web Vitals (LCP, CLS, INP, TTFB)
* `ui.visual_diff`: So sánh ma trận pixel diff giữa 2 ảnh giao diện
* `accessibility.evaluate`: Quét các vi phạm ARIA, độ tương phản màu và Focus Trapping

### Input Expectations
* Target URL hoặc Local Preview Endpoint (ví dụ: `http://localhost:3000/dashboard`)
* File component mục tiêu (ví dụ: `src/components/HeroBanner.tsx`)
* Policy Suite áp dụng (Mặc định: `POL-FE-PERF-CORE-01`, `POL-FE-A11Y-AA-01`)

---

## 2. Quy Trình Vận Hành EDAOS 9 Giai Đoạn

Skill thực thi nghiêm ngặt theo **EDAOS Processing Pipeline**:

```
1. OBSERVE      ➔ Thu thập Observation thô từ Provider Router (DevTools, Playwright, Axe)
2. NORMALIZE    ➔ Chuẩn hóa metrics về Canonical EDAOS JSON Schema
3. INTERPRET    ➔ So sánh Observation với Policy để tạo Level-2 Evidence (PASS / FAIL)
4. CORRELATE    ➔ Tổng hợp Evidences thành Level-3 Root-Cause Finding (Phát hiện culprit)
5. EVALUATE     ➔ Áp dụng Rule Engine để đưa ra Strategic Decision
6. PLAN         ➔ Tạo Action Plan chi tiết (Tối ưu WebP, preload, ARIA fix)
7. VERIFY       ➔ Đo đạc lại post-verification (Xác minh không gây regression)
8. LEARN        ➔ Lưu tri thức thành công vào edaos.learning.frontend.web
```

---

## 3. Quy Tắc Bất Biến & Hành Vi Cấm (Forbidden Behaviors)

### ✅ Quy Tắc Bắt Buộc
1. Mọi kết luận đều phải có **Chuỗi Bằng Chứng (Evidence Chain)**: `Observation ➔ Evidence ➔ Policy Compliance ➔ Finding`.
2. Mọi Decision đều phải kèm theo **Confidence Score** (Nếu $C < 0.65$, bắt buộc kích hoạt Human Gate).
3. Đóng gói kết quả đầu ra thành **Action Plan (Bản kế hoạch thực thi)** cho các skill `qk-bug-resolution` hoặc `qk-feature-delivery` tiêu thụ.

### ❌ Hành Vi Cấm (Strictly Forbidden)
* 🚫 **CẤM ĐOÁN MÒ**: Cấm đưa ra nhận định "UI có vẻ chậm", "Component nặng" nếu thiếu số liệu metric thực nghiệm.
* 🚫 **CẤM CÔNG CỤ**: Cấm gọi đích danh tên công cụ (Lighthouse, Playwright, Axe) trong kết luận hoặc instruction.
* 🚫 **CẤM SỬA CODE TRỰC TIẾP**: `qk-ui-audit` chỉ lập chẩn đoán và ra Decision/Action Plan, không trực tiếp mutate codebase.
* 🚫 **CẤM BỎ QUA POLICY**: Cấm hardcode các con số threshold trong code (phải đọc từ Policy file).

---

## 4. Định Dạng Báo Cáo EDAOS Audit Output

Sau khi hoàn tất, trả về báo cáo theo chuẩn EDAOS Audit Report:

```markdown
🔧 qk-ui-audit Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Target Scope:    [URL / Component Target]
Audit Status:    [PASS | FAIL | WARNING]
Overall Confidence: [High (0.88) | Med | Low]

📊 Evidence & Metrics:
  - LCP: 3.8s vs Policy 2.5s (FAIL, Delta: +52%)
  - CLS: 0.02 vs Policy 0.10 (PASS)
  - Accessibility: 0 violations (PASS)

🎯 Root-Cause Finding:
  - Culprit: [Hero image 'hero-main.png' blocking render due to missing rel=preload]
  - Exonerated: [ProductGrid.tsx, Header.tsx]

💡 Strategic Decision:
  - Decision Type: OPTIMIZE_RESOURCE_LOADING
  - Rationale: Preloading WebP asset will reduce LCP by ~52% based on learning patterns.

📋 Generated Action Plan:
  1. Add <link rel="preload" href="/hero-main.webp" as="image"> to head
  2. Convert original PNG asset to modern WebP format
  3. Hand off Action Plan to `./qk-bug-resolution` for execution.
```
