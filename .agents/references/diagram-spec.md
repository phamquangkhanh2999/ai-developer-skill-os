# Editorial Diagram & Schematic Specification

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi trực quan hóa kiến trúc hệ thống, luồng dữ liệu, sequence, quy trình hoặc vẽ biểu đồ xuất bản chất lượng cao bằng Mermaid hoặc Single-file HTML + Inline SVG.

---

## 1. Triết Lý Thiết Kế & Chống "Diagram Slop"

- **Xóa bỏ là bước đi chất lượng cao nhất (Deletion is high-quality):** Sơ đồ hoàn thiện không phải khi không còn gì để nhét thêm, mà khi không còn chi tiết thừa nào để lược bỏ.
- **Mật độ mục tiêu (Target Density: 4/10):** Đủ đầy đủ về mặt kỹ thuật nhưng không cần hướng dẫn giải mã.
- **Ngân sách phức tạp (Complexity Budget):**
  - **Tối đa 9 nodes** và **12 transitions/arrows** trên một khung nhìn.
  - Vượt quá 9 nodes: **Bắt buộc chia tách thành 2 sơ đồ** (Overview cấp hệ thống + Detail cấp subsystem).
- **Quy tắc 1–2 Focal Accent:** Tuyệt đối không tô màu sặc sỡ lên toàn bộ các node. Dùng gam màu trung tính làm chủ đạo và chỉ dành tối đa 1–2 điểm nhấn nổi bật (Accent) cho luồng tiêu điểm, nút thắt cổ chai (bottleneck) hoặc phần tử đang thay đổi.

---

## 2. Hệ Thống Token & Typography (Editorial Palette)

| Semantic Role | Mục đích | Token gợi ý (Light) | Token gợi ý (Dark) |
|---|---|---|---|
| `paper` | Nền trang, fill mặc định của node | `#f5f5f5` (warm paper) | `#2d3142` (slate dark) |
| `ink` | Chữ chính, nét viền chính của node | `#2d3142` (jet ink) | `#f5f5f5` (white smoke) |
| `muted` | Chữ phụ, đường mũi tên nội bộ | `#4f5d75` (slate) | `#bfc0c0` (silver) |
| `rule` | Đường viền mảnh phân chia zone/card | `rgba(45,49,66,0.12)` | `rgba(245,245,245,0.12)` |
| `accent` | Điểm nhấn tiêu điểm (1–2 node max) | `#bf4520` (burnt tangerine) | `#f08a59` |
| `link` | Lời gọi mạng ngoài, HTTPS/gRPC | `#2e5aa8` (cobalt blue) | `#739fdf` |

### Tôn Ti Trật Tự Typography:
- **Tiêu đề & Callout chú thích:** Font Serif (`Instrument Serif` hoặc clean Serif).
- **Tên Node / Thực thể:** Font Sans-serif (`Geist Sans`, `Inter`, `system-ui`, weight 600).
- **Port, Protocol, Route, Type, Schema:** Font Monospace (`Geist Mono`, `ui-monospace`).
- *Cấm:* Lạm dụng font Monospace cho toàn bộ nhãn và tiêu đề của sơ đồ.

---

## 3. 6 Quy Tắc Nối Dây Hình Học (Mandatory Connector Rules)

Khi vẽ sơ đồ dạng hình học (SVG / Custom Widget):
1. **Chỉ đi đường vuông góc (Orthogonal only):** Mọi khúc quanh phải bo góc tròn với bán kính $r=8$ (hoặc $r=6$ trong layout chật). Tuyệt đối không vẽ đường chéo xiên xẹo giữa hai node lệch trục.
2. **Khoảng đệm nhãn (Label margin 6–10px):** Mọi nhãn đặt trên đường nối phải nằm trên một tấm che nền (`<rect fill="{paper}">`) và cách dây nối tối thiểu 6–10px; chữ không bao giờ bị nét vẽ đâm xuyên qua.
3. **Chống trùng dây (No overlapping):** Hai dây song song phải cách nhau $\ge 12\text{px}$. Nếu hai dây bắt buộc giao cắt tại một điểm, áp dụng kỹ thuật *Bridge / Hop* (cầu vượt vòng cung) tại điểm giao.
4. **Tản đều chân cắm (Fanned attach points):** Khi $N$ đường nối cùng xuất phát hoặc đến một cạnh dài $L$ của hộp, các điểm cắm phải tản đều theo công thức:
   $$\text{Offset}_k = L \times \frac{k}{N + 1} \quad (k = 1 \dots N)$$
   Khoảng cách giữa hai chân cắm liền kề tối thiểu 12px (8px với hộp nhỏ). Cấm chụm nhiều mũi tên vào cùng một góc hộp.
5. **Không đi ngầm sau hộp trung gian:** Tuyệt đối tránh đi dây xuyên qua lưng của một hộp không liên quan. Nếu địa hình bất khả kháng, dây bắt buộc phải là nét đứt (`stroke-dasharray="4,3"`), nhãn đặt ở đầu hở và không có đầu mũi tên cắm vào hộp trung gian đó.
6. **Thứ tự lớp vẽ (Z-index Paint Order):**
   $$\text{Background} \longrightarrow \text{Zones/Containers} \longrightarrow \text{Arrows} \longrightarrow \text{Labels} \longrightarrow \text{Nodes}$$
   Vẽ đường nối trước hộp để chân dây nằm gọn gàng phía sau viền node.

---

## 4. Định Tuyến: Hành Vi Nghiệp Vụ $\rightarrow$ Bố Cục Trực Quan

Trước khi vẽ, xác định bản chất hành vi trước khi chọn loại layout:

| Hành vi nghiệp vụ (Semantic Pattern) | Bố cục phù hợp nhất (Visual Layout) |
|---|---|
| Nút thắt cổ chai, hàng đợi, giới hạn tải (Fan-in queue / bottleneck) | **Data flow** |
| Vùng tin cậy, luồng ingress an toàn, ranh giới mạng (Trust boundary / Paved road) | **Architecture** |
| Thay đổi kiến trúc Trước / Sau và danh mục cập nhật | **Architecture Delta** (Before $\cdot$ Changes $\cdot$ After) |
| Tiến trình trạng thái, retry, timeout, kết thúc (Lifecycle / State machine) | **State Machine** |
| Phân rã khối chức năng ID-addressable kèm I/O và ràng buộc | **Tree / Block Decomposition** |
| Trao đổi thông điệp tuần tự theo thời gian giữa các Actor | **Sequence Diagram** |
| Tiến trình nhiều vai trò qua các giai đoạn (Multi-actor handoffs) | **Swimlane / Process** |

---

## 5. Mẫu HTML + SVG Độc Lập Xuất Bản Chuẩn

Khi người dùng yêu cầu xuất file sơ đồ `.html` hoặc bản vẽ chất lượng cao, sử dụng khung chuẩn:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architecture Diagram</title>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --color-paper:  #f5f5f5;
      --color-ink:    #2d3142;
      --color-muted:  #4f5d75;
      --color-accent: #bf4520;
      --color-link:   #2e5aa8;
      --font-sans:    'Geist', system-ui, sans-serif;
      --font-serif:   'Instrument Serif', serif;
      --font-mono:    'Geist Mono', ui-monospace, monospace;
    }
    body {
      font-family: var(--font-sans);
      background: var(--color-paper);
      color: var(--color-ink);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .frame { max-width: 1200px; width: 100%; }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-muted);
      margin-bottom: 0.5rem;
    }
    h1 {
      font-family: var(--font-serif);
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
    }
    .diagram-container { width: 100%; overflow-x: auto; }
    svg { width: 100%; min-width: 960px; display: block; }
    @media print {
      .diagram-container { overflow-x: visible; }
      svg { min-width: 0; }
    }
  </style>
</head>
<body>
  <div class="frame">
    <p class="eyebrow">Architecture · Diagram Spec</p>
    <h1>System Architecture Overview</h1>
    <div class="diagram-container">
      <svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#4f5d75"/>
          </marker>
          <marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#bf4520"/>
          </marker>
        </defs>

        <!-- Background -->
        <rect width="100%" height="100%" fill="#f5f5f5"/>

        <!-- Zones / Boundaries -->
        <rect x="260" y="80" width="440" height="380" rx="8"
              fill="rgba(45,49,66,0.02)" stroke="rgba(45,49,66,0.12)" stroke-width="1"/>
        <text x="280" y="104" fill="#4f5d75" font-size="9" font-family="'Geist Mono', monospace" letter-spacing="0.1em">VPC PRIVATE SUBNET</text>

        <!-- Arrows (drawn before boxes) -->
        <path d="M 180,260 H 312" fill="none" stroke="#bf4520" stroke-width="1.4" marker-end="url(#arrow-accent)"/>

        <!-- Arrow Label with Mask Plate -->
        <rect x="220" y="242" width="56" height="14" rx="2" fill="#f5f5f5"/>
        <text x="248" y="252" fill="#bf4520" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">HTTPS SSR</text>

        <!-- Node Box: Client (Exterior) -->
        <rect x="40" y="230" width="140" height="60" rx="6" fill="#f5f5f5" stroke="#5a6580" stroke-width="1"/>
        <text x="110" y="258" fill="#2d3142" font-size="12" font-weight="600" font-family="'Geist', sans-serif" text-anchor="middle">Client App</text>
        <text x="110" y="274" fill="#4f5d75" font-size="9" font-family="'Geist Mono', monospace" text-anchor="middle">Browser / Mobile</text>

        <!-- Node Box: Gateway (Focal Element with Accent) -->
        <rect x="320" y="230" width="150" height="60" rx="6" fill="rgba(191,69,32,0.06)" stroke="#bf4520" stroke-width="1.5"/>
        <text x="395" y="258" fill="#2d3142" font-size="12" font-weight="600" font-family="'Geist', sans-serif" text-anchor="middle">API Gateway</text>
        <text x="395" y="274" fill="#bf4520" font-size="9" font-family="'Geist Mono', monospace" text-anchor="middle">Port: 443 / Envoy</text>
      </svg>
    </div>
  </div>
</body>
</html>
```

---

## 6. Kỷ Luật Khi Dùng Inline Mermaid Trong Markdown

Khi thảo luận nhanh trong chat hoặc tài liệu Markdown mà không cần file HTML riêng, vẫn phải tuân thủ kỷ luật:
1. **Xác định hướng luồng (Flow Direction):** Luôn dùng `flowchart LR` (ngang) cho pipeline dữ liệu hoặc `flowchart TD` (dọc) cho phân cấp cha-con.
2. **Dùng Subgraph phân vùng trách nhiệm:** Nhóm các service theo ranh giới mạng (Public, Private, Third-party) hoặc tầng kiến trúc.
3. **Áp dụng classDef có kiểm soát:**
   ```mermaid
   flowchart LR
       subgraph ClientZone ["Public Ingress"]
           Client["Client Web / Mobile"]
       end
       subgraph VPC ["Private VPC"]
           GW["API Gateway"]:::accent
           SVC["Order Service"]
           DB[("PostgreSQL")]
       end

       Client -->|HTTPS| GW
       GW -->|gRPC| SVC
       SVC -->|TCP| DB

       classDef default fill:#f7fafc,stroke:#4a5568,stroke-width:1px;
       classDef accent fill:#feebc8,stroke:#dd6b20,stroke-width:2px;
   ```
4. **Không quá 9 nodes:** Nếu luồng hệ thống có 20 microservices, chỉ vẽ Gateway $\rightarrow$ 3 Core Services chính và các Store liên quan; phần còn lại ghi chú bằng bảng hoặc vẽ sơ đồ phân rã phụ.
