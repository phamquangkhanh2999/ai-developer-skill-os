---
name: qk-api-data-discovery
version: 10.2.0
status: stable
subtitle: "API & Data Discovery"
description: "Kỹ sư Khám phá API & Hợp đồng Dữ liệu: Phân tích Postman collection, thu thập phản hồi thực tế (Real API Evidence), khám phá Schema & Data Dictionary, đánh giá tầng Bronze Medallion, đối chiếu kiến trúc dự án và xuất báo cáo Checkpoint. Tuân thủ nguyên tắc: Discovery First, Implementation Only on User Direction. Dùng khi: postman, api discovery, api evidence, schema discovery, data contract, data dictionary, bronze ingestion, chuẩn hóa postman, phân tích postman collection."
platforms: [antigravity, claude, opencode]
runtime_version: 1
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
  - security
workflow: context-discovery
triggers:
  - "postman"
  - "chuẩn hóa postman"
  - "phân tích postman"
  - "api discovery"
  - "api evidence"
  - "schema discovery"
  - "data contract"
  - "data dictionary"
  - "bronze ingestion"
  - "postman_collection"
  - "khám phá api"
  - "api to data"
---

# qk-api-data-discovery — API & Data Discovery (API Evidence, Schema Discovery & Data Contract Engine)

> **Language rule:** Code, schema identifiers, file names, JSON keys → English. Explanations, analysis, recommendations → Vietnamese.

---

## Memory Workflow

### 0. Self-Init Protocol (Khởi Tạo Bộ Nhớ Local & Gitignore)
- Trước khi tra cứu hoặc lưu trữ tri thức, BẮT BUỘC kiểm tra sự tồn tại của thư mục `.ai-local/` tại gốc dự án:
  - **Tự động tạo mới:** Nếu `.ai-local/` chưa tồn tại, AI phải tự động tạo cấu trúc thư mục `.ai-local/knowledge/` (và file `index.yaml` nếu cần thiết) cùng `.ai-local/candidates/`. Tuyệt đối không ngưng chạy hay hỏi ý kiến người dùng về thao tác khởi tạo tiêu chuẩn này.
  - **Bảo mật Gitignore:** BẮT BUỘC kiểm tra file `.gitignore` của dự án, nếu chưa có dòng `.ai-local/` thì phải tự động thêm vào để tuyệt đối bảo mật tri thức cá nhân và tránh lộ lọt lên Git.

---

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .ai-local/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## 1. Nguyên Tắc Cốt Lõi & Tôn Chỉ Bất Di Bất Dịch

> 🎯 **Core Identity:** Đây KHÔNG PHẢI là một công cụ định dạng Postman đơn thuần ("Postman Formatter"). Đây là hệ thống **API-to-Data Discovery Engine**: Biến Postman collection từ một tập hợp request thô thành nguồn tri thức có bằng chứng thực tế phục vụ đồng thời Backend, QA, Data Engineer, Data Analyst và AI Agent.

### 🌟 4 Nguyên Tắc Vàng (Golden Principles)
1. **Evidence Over Inference (Bằng chứng trên suy đoán):**
    > *"Never infer an API contract from endpoint names alone. Observe the real API response first, preserve raw evidence, then derive the schema and standardized collection from observed evidence."*
    *(Không bao giờ suy diễn hợp đồng API chỉ từ tên endpoint. Luôn quan sát phản hồi thật trước, bảo toàn bằng chứng thô, rồi mới suy ra schema và bộ collection chuẩn hóa).*
2. **Hypothesis vs Truth (Giả thuyết vs Sự thật):**
    > *"Observed API behavior is evidence; inferred schema is a hypothesis until validated by sufficient executions."*
    *(Hành vi API quan sát được là bằng chứng; schema suy luận chỉ là giả thuyết cho đến khi được kiểm chứng qua đủ số lần chạy).*
3. **Discovery First, Implementation Upon Direction (Khám phá trước, làm sau):**
    > *"DISCOVERY FIRST, IMPLEMENTATION ONLY ON EXPLICIT USER DIRECTION."*
    *(Luôn ưu tiên khám phá, đánh giá và lập báo cáo checkpoint. TUYỆT ĐỐI KHÔNG tự động triển khai code, pipeline hay migration nếu chưa có chỉ đạo tường minh từ người dùng).*
4. **No Premature Architecture Mutation (Không tự ý biến đổi hệ thống):**
    > *"The discovery agent MUST NOT create production code, Bronze pipelines, database schemas, or modify project architecture merely because those actions appear to be logical next steps."*
    *(Agent cấm tự tiện tạo mã nguồn production, pipeline Bronze, hay sửa schema cơ sở dữ liệu chỉ vì thấy đó là bước tiếp theo hợp lý).*

### 📜 Quy Tắc Bàn Giao Quyền Quyết Định (The Handoff Contract Rule)
```text
DISCOVERY REPORT IS THE HANDOFF CONTRACT.

The report MUST contain enough verified information for the user
or another AI skill to continue the work without repeating discovery.

The discovery skill MUST NOT assume which downstream implementation
the user wants.
```
> **Bản chất:** Kỹ năng này không phải là *"làm API → tự làm Bronze"*.  
> Bản chất của nó là: **"API → Hiểu sâu → Chứng minh thực nghiệm → Phân tích toàn diện → Báo cáo Checkpoint → Bàn giao quyền quyết định cho User."**

---

## 2. Mô Hình Thực Thi 2 Pha (Two-Phase Execution Model)

Hệ thống hoạt động theo mô hình tách bạch nghiêm ngặt: **Pha A (Mặc định: Khám phá & Lập Báo cáo Checkpoint)** kết thúc tại một **Điểm dừng Kiểm soát (Checkpoint STOP)** để người dùng thẩm định và ra quyết định hướng đi tiếp theo.

```text
POSTMAN COLLECTION + PROJECT CONTEXT
   │
   ▼
DISCOVERY (Parse endpoints, variables, auth, query params)
   │
   ▼
REAL API EVIDENCE (Execute safe requests, capture status, latency, headers)
   │
   ▼
SCHEMA DISCOVERY (Derive datatypes, nullability, nested fields, arrays)
   │
   ▼
PROJECT BASE ANALYSIS (Inspect existing pipelines, bronze, schemas, models)
   │
   ▼
DATA ENGINEERING ASSESSMENT (Candidate bronze, pagination, immutability)
   │
   ▼
┌─────────────────────────────────────────────────────────────┐
│ API DISCOVERY REPORT.md (Checkpoint / Decision Handoff)     │
│                                                             │
│ 1. What was observed      (Real status, latency, raw JSON)  │
│ 2. What was verified      (HTTP 200, headers, datatypes)    │
│ 3. What was inferred      (Schema hypothesis, relationships)│
│ 4. Project currently has  (Existing modules, tables, zones) │
│ 5. Problems & risks       (Token expiry, rate limit, 5xx)   │
│ 6. Candidate directions   (Option A / B / C / D / E)        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
                        ⛔ CHECKPOINT STOP
             (User Reviews & Chooses Next Direction)
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
        Option A           Option B           Option C
     [Bronze Ingest]     [Data Contract]    [Standardize]
            │                  │                  │
            ▼                  ▼                  ▼
      Targeted Task      Targeted Task      Targeted Task
```

### Cơ chế chuyển giao Phase B (Targeted Continuation):
- **Chỉ kích hoạt Phase B khi có chỉ đạo rõ ràng từ Người Dùng:** AI không tự chọn bất kỳ Option nào nếu User chưa xác nhận.
- **Ủy quyền & Biên dịch kế hoạch (Delegation & Plan Compilation):**
  - Khi User chọn hướng (ví dụ: *"Làm Option A cho users và orders"*), AI chuyển giao mục tiêu qua `qk-prompt-compiler` để biên dịch thành Compiled Execution Prompt.
  - Sau đó ủy quyền tới skill phù hợp: `qk-backend-data` (xây dựng DDL / Bronze pipeline), `qk-feature-delivery` (tích hợp API client), hoặc tiếp tục xử lý tạo bộ artifact `api-discovery/`.
  - Nếu chưa có downstream skill chuyên biệt phù hợp với stack người dùng chọn, AI tạo `implementation_plan.md` theo chuẩn Interactive Planning Mode và xin phê duyệt trước khi viết code.

---

## 3. Chi Tiết Quy Trình Phase A (7 Bước Khám Phá Cốt Lõi)

### Bước 1: Parse Collection & Kiểm Toán Biến Môi Trường (Discover)
- Đọc file `postman_collection.json` (và file environment đính kèm nếu có).
- Bóc tách toàn bộ cây thư mục (folders), danh sách request, HTTP methods, headers, parameters, authentication type (`bearer`, `basic`, `apiKey`, `oauth2`).
- Rà soát các biến môi trường chưa được gán giá trị (unresolved variables: `{{base_url}}`, `{{token}}`, `{{user_id}}`).

### Bước 2: Phân Loại Rủi Ro & Chọn Cổng Thực Thi (Risk Classification Gate)
Áp dụng cơ chế phân định an toàn bắt buộc trước khi thực hiện bất kỳ lệnh gọi mạng nào:

| Loại Request | Môi trường đích | Mức rủi ro | Chế độ thực thi | Hành động của AI |
|---|---|---|---|---|
| **GET / HEAD / OPTIONS** (Idempotent, Read) | Staging / Dev / Sandbox | Thấp (`R0/R1`) | 🟢 `AUTO` | Chạy an toàn để lấy response thật |
| **GET** (Read) | Production / Live | Trung bình (`R2`) | 🟡 `CONFIRM` | Cần xác nhận trước khi gửi request |
| **POST / PUT / PATCH / DELETE** (Ghi/Xóa dữ liệu) | Staging / Test / Sandbox | Trung bình (`R2`) | 🟡 `CONFIRM` | Dừng lại, liệt kê payload và chờ user duyệt |
| **POST / PUT / PATCH / DELETE** | Production / Live | Rất cao (`R4`) | 🔴 `CONFIRM` Bắt buộc | Mặc định **CẤM TỰ CHẠY**. Chỉ chạy khi user xác nhận 2 lần |
| **Thiếu Auth Token / Base URL / Biến cốt lõi** | Mọi môi trường | — | 🔴 `ASK` | Dừng hỏi user cung cấp. **CẤM BỊA MOCK CREDENTIALS** |

### Bước 3: Thu Thập Bằng Chứng Thực Tế (Real API Evidence)
- **Phương thức thực thi:**
  - *Cách 1 (Khuyến nghị):* Chạy qua Newman CLI hoặc local script nếu môi trường có kết nối mạng tới endpoint.
  - *Cách 2 (Sandbox / No direct network):* Người dùng cung cấp file export log từ Postman Console hoặc response json dump từ server.
- **Dữ liệu bằng chứng (Evidence) bắt buộc lưu lại:**
  - HTTP Status Code (ví dụ: `200 OK`, `401 Unauthorized`, `404 Not Found`).
  - Response Time / Latency (đo bằng milliseconds `ms`).
  - Headers quan trọng (Content-Type, X-RateLimit, Pagination headers).
  - Raw JSON Body nguyên bản.
- **Quy tắc Bằng chứng Thực Tế (Anti-Fake-Pass):**
  - Nếu một endpoint chưa thể chạy (do thiếu auth, network, hay là method ghi chưa được duyệt): **BẮT BUỘC ĐÁNH DẤU `NOT_EXECUTED`** kèm lý do minh bạch.
  - **CẤM TUYỆT ĐỐI** tự chế response mẫu giả định rồi giả vờ đó là "kết quả chạy thật".

### Bước 4: Khám Phá Schema & Lập Data Dictionary (Schema Discovery)
Từ các response JSON thu thập được, phân tích cấu trúc dữ liệu theo chiều sâu:
- **Xác định Kiểu Dữ Liệu:** `integer`, `float`, `string`, `boolean`, `datetime` (ISO-8601), `array`, `object`, `null`.
- **Nhận diện Khả năng Nullable:** Đối chiếu giữa nhiều records hoặc kịch bản để xem trường nào có thể mang giá trị `null` hoặc không xuất hiện (optional).
- **Phát hiện Cấu trúc Mảng & Quan hệ (1-N):** Bóc tách các mảng lồng nhau (`items[]`, `tags[]`, `addresses[]`).
- **Lập Bảng Từ Điển Dữ Liệu (API Data Dictionary):**

```markdown
### Observed Schema: `GET /users`

| Field | Type | Nullable | Example Value | Evidence Level |
|---|---|---|---|---|
| `id` | integer | No | `1024` | OBSERVED (200 OK) |
| `name` | string | No | `"Nguyen Van A"` | OBSERVED (200 OK) |
| `email` | string | Yes | `"user@example.com"` | OBSERVED (200 OK) |
| `createdAt` | datetime | No | `"2026-09-15T10:20:00Z"` | OBSERVED (200 OK) |
| `roles[]` | array[string] | No | `["admin", "editor"]` | OBSERVED (200 OK) |
| `profile.bio`| string | Yes | `null` | OBSERVED (200 OK) |
```

### Bước 5: Đánh Giá Kỹ Nghệ Dữ Liệu Tầng Bronze (Data Engineering Assessment)
- **Candidate Bronze Sources:** Chọn lọc các endpoint trả về dữ liệu entity cốt lõi thích hợp để lưu trữ dạng thô trong hồ dữ liệu (Data Lake / Medallion Architecture).
- **Nguyên Tắc Lưu Trữ Tầng Bronze:**
  - **Giữ nguyên trạng thái Raw:** Không vội vàng chuẩn hóa hay làm phẳng (flatten) các trường JSON lồng nhau ở tầng Bronze. Việc flattening và type casting là trách nhiệm của tầng Silver.
  - **Gắn nhãn Ingestion Metadata:** Mỗi record Bronze phải đi kèm metadata truy vết nguồn gốc (lineage).
- **Phân Tích Cơ Chế Phân Trang (Pagination Strategy):**
  - Nhận diện loại phân trang: Page-based (`?page=1&size=20`), Offset/Limit (`?offset=0&limit=50`), hay Cursor-based (`?cursor=eyJ...`).
  - Ghi nhận cách tính tổng số bản ghi (`total`, `totalPages`, `has_more`).

### Bước 6: Đối Chiếu Kiến Trúc Dự Án Hiện Có (Project Base Alignment)
AI quét nhanh cấu trúc thư mục của dự án hiện tại để tìm kiếm sự tương thích:
- Kiểm tra xem dự án đã có các thư mục: `bronze/`, `data/`, `pipelines/`, `schemas/`, `models/`, `services/`, hay file cấu hình API sources không.
- Xác định API này đang thuộc domain nghiệp vụ nào trong codebase (User, Order, Payment, Inventory, Telemetry...).
- Lập bản đồ liên kết: API này có thể mở rộng vào pipeline nào đang có, hoặc tích hợp vào service backend nào.

### Bước 7: Xuất Báo Cáo Checkpoint & DỪNG LẠI (Checkpoint Report & STOP)
Tạo file báo cáo toàn diện tại đường dẫn:
`docs/api-discovery/<collection-name>-analysis.md`

Sau khi ghi file, AI **DỪNG TOÀN BỘ HÀNH ĐỘNG CODE TIẾP THEO**, in bản Tóm tắt Điều hành (Executive Summary) ra cửa sổ chat và chờ người dùng lựa chọn bước đi tiếp theo.

---

## 4. Cấu Trúc 3 Tầng Thông Tin & Mẫu Báo Cáo Checkpoint Chuẩn

Báo cáo phân tích `docs/api-discovery/<collection>-analysis.md` đóng vai trò là **Hợp đồng Bàn giao Quyết định (Decision Handoff Contract)**. Để đảm bảo tính khách quan và khoa học, báo cáo BẮT BUỘC tách biệt rõ ràng 3 tầng thông tin:

### 🏛️ Ba Tầng Thông Tin Tách Bạch (The 3-Tier Information Model)
1. **Tầng 1: FACT — Thực tế quan sát được (What was observed & verified):**
   - Không suy diễn, chỉ ghi nhận dữ liệu thực nghiệm đã chạy thật:
     - Endpoint, HTTP Status (`200 OK`, `401 Unauthorized`).
     - Response Body JSON thô nguyên bản.
     - Response Latency (`ms`), Headers (`Content-Type`, `X-RateLimit`).
     - Cấu trúc phân trang thực tế (`page`, `total`, `cursor`).
2. **Tầng 2: ANALYSIS — AI phân tích chuyên môn (What was inferred & assessed):**
   - Đánh giá kỹ nghệ dữ liệu từ dữ liệu thực nghiệm:
     - Endpoint này có phù hợp làm Candidate Bronze Source không?
     - Cấu trúc JSON có lồng nhau phức tạp (nested objects) cần giữ nguyên ở Bronze hay không?
     - Phân trang có đòi hỏi vòng lặp lặp lại (loop iteration) khi ingest hay không?
     - Có hiện tượng bất thường (anomalies), rate limiting hay schema không đồng nhất không?
3. **Tầng 3: DECISION OPTIONS — Hướng có thể đi tiếp (Candidate next directions):**
   - Các định hướng khả thi cho User lựa chọn:
     - Option A: Bronze Ingestion Pipeline (NDJSON raw records).
     - Option B: Postman Standardization (Collection chuẩn hóa, tests).
     - Option C: Data Contract chính thức (Schema JSON, Data Dictionary, YAML).
     - Option D: Data Quality Assertions (Kiểm tra null, type, unique).
     - Option E: Deep Scenario Execution (Chạy tiếp các kịch bản ngoại lệ biên).
   - ⚠️ **Ranh giới tối thượng:** **AI TUYỆT ĐỐI KHÔNG ĐƯỢC BIẾN TẦNG 3 THÀNH HÀNH ĐỘNG KHI CHƯA CÓ LỆNH RÕ RÀNG TỪ USER.**

---

### Mẫu Báo Cáo 10 Mục Hoàn Chỉnh

→ Xem chi tiết tại `references/discovery-report-template.md`

---

## 5. Đặc Tả Bộ API Discovery Package (Khi User Duyệt Phase B)

Khi người dùng ra lệnh thực thi một trong các Options tiếp theo, hệ thống sẽ sinh ra bộ package hoàn chỉnh trong thư mục `api-discovery/`:

```text
api-discovery/
├── postman/
│   └── standardized_collection.json    # Collection chuẩn: folder resource, real responses, pm.test
├── bronze/
│   ├── api_responses.ndjson            # Raw Bronze data (mỗi dòng 1 request-response record)
│   └── ingestion_manifest.json         # Metadata phiên ingest, batch size, timestamps
├── schema/
│   ├── api_schema.json                 # JSON Schema chính thức
│   └── data_dictionary.md             # Từ điển dữ liệu chi tiết cho Data Analyst / BI
├── quality/
│   └── api_quality_report.md           # Báo cáo đo lường độ phủ, lỗi, độ trễ và bất thường
└── evidence/
    └── execution_report.json           # Log chi tiết kỹ thuật từng lần gọi mạng
```

### Cấu Trúc Raw Bronze & Data Contract

→ Xem chi tiết tại `references/bronze-record-format.md`

→ Xem chi tiết tại `references/data-contract-yaml.md`

---

## 6. Ranh Giới Kỹ Thuật & Cấm Kỵ Tuyệt Đối (Hard Guardrails)

- ❌ **CẤM TỰ Ý CODE HOẶC TẠO PIPELINE TRONG PHASE A:** Hoàn thành báo cáo `docs/api-discovery/<collection>-analysis.md` là PHẢI DỪNG LẠI. Không tự ý viết script ingestion hay tạo migration khi user chưa ra lệnh.
- ❌ **CẤM ÉP PASS ẢO / FAKE MOCK DATA (R-G-14.5):** Không được tự tạo JSON response giả vờ như đã chạy thật. Chưa chạy được thì ghi rõ `NOT_EXECUTED`.
- ❌ **CẤM CHẠY REQUEST PHÁ HỦY TRÊN PRODUCTION:** Mọi request `POST / PUT / PATCH / DELETE` trên môi trường production đều phải qua cổng kiểm soát `CONFIRM` và được người dùng duyệt rõ ràng từng endpoint.
- ❌ **CẤM ĐỂ LỘ SECRET / TOKEN TRONG OUTPUT:** Tất cả API keys, Bearer tokens, Passwords trong file output hoặc báo cáo PHẢI được che giấu (`[REDACTED_SECRET]`).
- ❌ **CẤM FLOOD REQUEST (RATE-LIMITING SAFETY):** Khi chạy runner gọi hàng loạt endpoint thật, phải áp dụng độ trễ (delay tối thiểu 200–500ms) giữa các request để tránh làm sập server thử nghiệm.

---

## 7. Định Dạng Báo Cáo Phản Hồi Khi Hoàn Tất Phase A

Sau khi xuất file báo cáo Checkpoint, AI phản hồi vào cửa sổ chat với định dạng Executive Summary ngắn gọn (không xả toàn bộ markdown dài):

```markdown
🔧 API & Data Discovery Summary               [Role: <role> | Stack: <primary stack>]
─────────────────────────────────────────────────────────────────────
Scope:    Khám phá API Postman, thu thập bằng chứng thực tế và đánh giá Data Contract
Report:   [docs/api-discovery/<collection>-analysis.md](file:///<workspace-root>/docs/api-discovery/<collection>-analysis.md)

📊 Kết quả khám phá:
  ✅ Endpoints phân tích: <total_count> endpoints
  ✅ Thực thi an toàn:   <executed_count> requests đã lấy response thật (Avg latency: <avg>ms)
  ⏸️ Chưa thực thi:      <skipped_count> requests (yêu cầu quyền ghi / thiếu credentials)
  📐 Schema phát hiện:    <entity_count> data entities với từ điển kiểu dữ liệu chi tiết
  🧱 Bronze Assessment:   Xác định <candidate_count> candidate sources cho Bronze layer

⛔ CHECKPOINT ĐÃ THIẾT LẬP:
AI đã dừng lại và CHƯA tự ý sinh mã nguồn ingestion hay sửa đổi hệ thống.
Vui lòng xem báo cáo chi tiết và chọn bước đi tiếp theo:
  👉 Option A: Tạo Bronze Ingestion Pipeline & Raw NDJSON data
  👉 Option B: Chuẩn hóa lại file Postman Collection hoàn chỉnh
  👉 Option C: Thiết lập Formal Data Contract & Data Dictionary
  👉 Option D: Cấu hình bộ Quality Assertion Rules
  👉 Option E: Tiếp tục khám phá các kịch bản ngoại lệ sâu hơn
```

---

## 8. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Real API response observed with HTTP status code | Report evidence as FACT |
| MEDIUM | Schema inferred from response structure | Note as HYPOTHESIS requiring validation |
| LOW | No API executed, only Postman collection parsed | Report as NOT_EXECUTED |

---

## 9. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Phase A complete, checkpoint report generated, user reviewing | Report saved at docs/api-discovery/ |
| PARTIAL | Some endpoints could not be executed | NOT_EXECUTED entries in report |
| BLOCKED | Missing Postman collection, credentials, or network access | Cannot proceed with Phase A |
| FAILED | Critical error during discovery or report generation | Abort and report error |

---

## Platform-Specific Instructions

### Antigravity (Google Gemini)
- Uses `.agents/AGENTS.md` as entry point
- Supports Cockpit integration
- Rewrite absolute paths for global mode
- `GEMINI.md` copied for global installs

### Claude Code (Anthropic)
- Reads `.claude/CLAUDE.md` automatically
- Large context window (~200K tokens)
- Can handle full skill files without trimming
- Uses native tool format (Read, Write, Edit, Bash)

### OpenCode (Open Source)
- Reads `.opencode/config.yaml`
- Context window ~128K tokens
- Keep skill files lean when possible
- Supports custom tool format

---

## Evidence Format

Every evidence claim must follow this format:

```
[SEVERITY] discovery-phase: [phase-name]
Reason:     [why this evidence matters]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [suggestion if evidence points to a bug]
```

### Evidence Types

| Type | Example | Severity |
|------|---------|----------|
| API Response | HTTP 200 + JSON body | HIGH |
| Schema Match | Response matches OpenAPI spec | HIGH |
| Error Pattern | Stack trace + error code | MEDIUM |
| Missing Endpoint | 404 on discovered route | MEDIUM |
| Schema Mismatch | Field type differs | HIGH |

---

## Compliance

| Check | Status |
|-------|--------|
| Runtime Standard | 11/11 |
| Frontmatter Complete | ✅ |
| Platforms Field | ✅ |
| References Valid | ✅ |
| Decision Trees | PASS |
| Thresholds Defined | PASS |
| schema_version | 10.2.0 |
| runtime_version | 1 |
| platforms | [antigravity, claude, opencode] |
