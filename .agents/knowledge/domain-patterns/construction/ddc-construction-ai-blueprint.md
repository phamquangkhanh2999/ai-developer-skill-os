# Reference Blueprint: Construction AI Agent System (DDC Methodology)
**EDAOS v8.2 Domain Pattern Implementation — Governed Capability Metadata & Eval Platform**

Tài liệu này đóng vai trò là **Mô hình Mẫu Thực Chiến (Reference Case Study)** cho việc áp dụng kiến trúc **EDAOS v8.2** vào các nghiệp vụ kỹ thuật chuyên sâu (Enterprise Domain AI), tiêu biểu nhất là **Ngành Xây Dựng (Construction Engineering, BIM & ERP Automation)**.

---

## 1. Triết Lý Tách Biệt Ranh Giới (Zero Interference Principle)
Trong EDAOS v8.2, các nghiệp vụ cụ thể thuộc các ngành chuyên biệt như Xây dựng (Construction), Tài chính (Finance), hay Y tế (Healthcare) là **các bản thi công tham chiếu (Reference Implementations)** được nạp theo định dạng Plugin tại Thư viện Tri thức: `.agents/knowledge/domain-patterns/*`.

Tuyệt đối không nhồi nhét 192 skill ngành Xây Dựng vào 30 Master Capabilities cốt lõi của Lập trình viên để giữ chi phí nhận thức (cognitive load) và O(1) Dependency Graph của Antigravity ở mức nhẹ nhàng, nhanh chóng nhất.

---

## 2. Bản Đồ Năng Lực DDC (192 Domain-Specific Capabilities)
Một hệ sinh thái AI Agent thực chiến cho doanh nghiệp xây dựng được cấu trúc thành 4 nhóm nghiệp vụ:

### 🛠️ Nhóm 1: Toolkit Hoạt Động Hằng Ngày (85 Skills)
- **Bóc tách & Dự toán (QTO / CWRICR):** Bóc khối lượng tự động từ mô hình IFC/Revit; tự động khớp đơn giá và tính hao phí vật liệu.
- **Phân tích BIM:** Phát hiện xung đột mô hình (Clash Detection), báo cáo chất lượng BIM và tính toán dấu chân Carbon ($\text{CO}_2$).
- **Chuyển đổi Dữ liệu CAD:** Tự động chuyển đổi hàng loạt DWG, DGN, IFC, Revit sang bảng tính Excel và ngược lại.
- **Quản trị Hiện trường:** Lập báo cáo tiến độ thi công hằng ngày, phân tích năng suất tổ đội và xử lý Lệnh Thay Đổi (Change Order).

### 🧠 Nhóm 2: Nền Tảng Dữ Liệu & Quy Trình Số (67 Skills)
- **Xử lý Silo Dữ Liệu & ETL Tự Động:** Chuẩn hóa dữ liệu thô, liên thông ERP doanh nghiệp với mô hình BIM.
- **AI / Machine Learning:** Truy vấn bằng vector search cho hồ sơ thầu, mô hình ML dự báo trượt giá và chi phí công trình.
- **Kiểm định Chất lượng Dữ liệu:** Tự động hóa QA/QC trước khi đẩy dữ liệu vào RAG.

### ⚙️ Nhóm 3: Vận Hành & Automation Workflows (20 Skills)
- **Luồng n8n Automation:** Xây dựng các pipeline tự động đồng bộ báo cáo từ hiện trường về Văn phòng chính.
- **Quản trị An toàn & Minh Bạch:** Đánh giá rủi ro lao động từ ảnh hiện trường và giám sát tiến độ theo thời gian thực.

### 📄 Nhóm 4: Sinh Tài Liệu & QA (20 Skills)
- **Soạn thảo Hợp đồng & Pháp lý:** Phân tích hợp đồng FIDIC, phát hiện các điều khoản rủi ro trong hồ sơ mời thầu.
- **Báo cáo Tài chính & Bản vẽ Hoàn công:** Lập báo cáo chênh lệch ngân sách, theo dõi vật tư và bảo hành dự án.

---

## 3. Ứng Dụng "4-Folder Blueprint" Vào Dự Án Xây Dựng
Khi bootstrap một dự án Xây dựng số với `project.yaml` (sử dụng blueprint `rag`), cấu trúc 4 thư mục quy chuẩn sẽ được kích hoạt để quản trị toàn bộ nguồn tri thức:

```text
ai-construction-project/
├── project.yaml            ← Manifest gốc nạp bộ skill DDC & profile
├── 📁 prompts/
│   ├── system/             ← chuyen-gia-fidic.md, tro-ly-bim.md
│   └── tasks/              ← boc-khoi-luong-ifc.md, phan-tich-truot-gia.md
├── 📁 data/
│   ├── raw/                ← Dữ liệu BẤT BIẾN: PDF thầu gốc, file DWG/Revit/IFC khách gửi
│   └── processed/          ← Dữ liệu SẠCH: Bảng Excel đã lược bỏ dòng lặp, JSON cho RAG
├── 📁 agents/
│   ├── skills/             ← Các micro-skills chuyên sâu được nạp theo khuôn capability.yaml
│   └── tools/              ← MCP kết nối Revit API, Excel ODBC, Google Drive
└── 📁 evals/
    ├── scorecards/         ← scorecard.yaml theo tiêu chuẩn rào dốc Ngành Xây Dựng
    └── traces/             ← Nhật ký log chứng minh Agent đã bóc đúng bản vẽ
```

---

## 4. Đặc Tả Metadata & Eval Kép Cho Ngành (Domain Capability Manifest)

### Mẫu `capability.yaml` Cho Kỹ Năng Bóc Khối Lượng IFC
```yaml
schema_version: 1
id: ddc-qto-ifc-extractor
version: "1.0.0"
description: "Tự động trích xuất và tính toán khối lượng vật liệu từ mô hình IFC xuất ra Excel chốt."
dependencies:
  - qk-validation-gate
tools:
  - read_file
  - run_command
knowledge:
  - ddc-construction-ai-blueprint
eval:
  scorecard: evals/scorecards/qto-scorecard.yaml
```

### Mẫu `scorecard.yaml` Cho Kỹ Sư Kinh Tế Xây Dựng (Inheriting Default)
Trong ngành xây dựng, một sai sót trong đơn giá hoặc bóc tách có thể dẫn đến thất Thoát hàng tỷ đồng. Do đó, bộ Scorecard chuyên biệt định nghĩa trọng số khắt khe:

```yaml
schema_version: 1
extends: default
passing_threshold: 90  # Đuôi chu du ranh giới cao tuyệt đối

criteria:
  pricing_and_qty_accuracy:
    weight: 45
    description: "Khối lượng bóc tách từ IFC phải khớp 100% với định danh công thức chuẩn CWRICR."
  contractual_compliance:
    weight: 30
    description: "Các điều khoản và tham chiếu kỹ thuật phải trích dẫn chính xác từ hồ sơ FIDIC/raw."
  audit_traceability:
    weight: 25
    description: "Log toàn bộ quy trình làm sạch từ data/raw sang data/processed mà không tự phán lụi."
```

---

## 5. Kết Luận Kiến Trúc
Mô hình Xây dựng DDC chứng minh tính hiệu quả và mở rộng kiệt xuất của **EDAOS v8.2**: Khi con người tổ chức rõ ràng (Blueprints), máy móc nạp đúng Manifest tối giản (`capability.yaml`, `project.yaml`), và chất lượng được giám sát bằng Eval Pipeline (`scorecard.yaml`), bất kỳ doanh nghiệp truyền thống nào cũng có thể hiện thực hóa lộ trình chuyển đổi số thành công theo thời gian thực!
