# API Discovery & Evidence Report: [<collection_name>]

> **Status:** DISCOVERY_COMPLETED (Awaiting User Decision)
> **Execution Date:** <ISO_TIMESTAMP>
> **Environment:** <Staging / Production / Offline Logs>

---

## 1. Executive Summary
- **Collection Name:** `<name>`
- **Total Requests Analyzed:** `<total>`
- **Requests Executed (Evidence Collected):** `<executed_count>` (Success: `<success>`, Failed: `<failed>`)
- **Requests Not Executed:** `<skipped_count>` (Do phân loại rủi ro hoặc thiếu thông tin)
- **Average Response Latency:** `<avg_ms> ms` (Min: `<min_ms>`, Max: `<max_ms>`)

---

## 2. Project Context & Detected Architecture
- **Backend Stack:** `<stack hoặc None>`
- **Data Pipeline Stack:** `<dbt / Airflow / Python scripts / Không có>`
- **Existing Storage Zones:** `<Bronze/Silver/Gold folders hiện có>`
- **Relevant Existing Modules:**
  - `<file_link_1>`
  - `<file_link_2>`

---

## 3. API Inventory & Risk Classification
| # | Method | Endpoint Path | Risk Gate | Execution Status | HTTP Status | Response Time | Domain / Module |
|---|---|---|---|---|---|---|---|
| 1 | GET | `/api/v1/users` | AUTO | EXECUTED | 200 OK | 184 ms | User Management |
| 2 | POST | `/api/v1/users` | CONFIRM | NOT_EXECUTED | — | — | User Management |
| 3 | GET | `/api/v1/orders` | AUTO | EXECUTED | 200 OK | 340 ms | Order Processing |

---

## 4. Real API Evidence (Observed Responses)
### Endpoint: `GET /api/v1/users`
- **Execution Status:** EXECUTED
- **HTTP Code:** `200 OK` | **Latency:** `184 ms`
- **Observed Response Body (Raw Snippet):**
```json
{
  "data": [
    { "id": 1024, "name": "Nguyen Van A", "createdAt": "2026-09-15T10:20:00Z" }
  ],
  "pagination": { "page": 1, "pageSize": 20, "total": 128 }
}
```

---

## 5. Schema Discovery & API Data Dictionary
### Entity: `users` (Derived from `GET /api/v1/users`)
| Field Path | Data Type | Nullable | Sample Value | Evidence Confidence |
|---|---|---|---|---|
| `data[].id` | integer | No | `1024` | 100% (Observed) |
| `data[].name` | string | No | `"Nguyen Van A"` | 100% (Observed) |
| `data[].createdAt` | datetime | No | `"2026-09-15T10:20:00Z"` | 100% (Observed) |
| `pagination.total` | integer | No | `128` | 100% (Observed) |

---

## 6. Data Engineering Assessment (Medallion Bronze Layer)
- **Candidate Bronze Sources:**
  - `GET /api/v1/users` → Bảng Bronze: `bronze_raw_users`
  - `GET /api/v1/orders` → Bảng Bronze: `bronze_raw_orders`
- **Khuyến nghị Chiến lược Ingestion:**
  - Lưu trữ dưới dạng `NDJSON` (Newline Delimited JSON) theo từng batch chạy.
  - Bổ sung Ingestion Metadata Header (`ingestion_id`, `ingested_at`, `status_code`, `latency_ms`).
  - Không bóc tách mảng `data[]` ở Bronze; giữ nguyên toàn bộ payload để đảm bảo tính toàn vẹn (Immutability).

---

## 7. Existing Project Alignment
- Codebase hiện đã có cấu trúc: `<liệt kê>`
- **Phương án tích hợp khả thi:**
  - Phương án 1: Tích hợp vào pipeline ingest sẵn có tại `<path>`.
  - Phương án 2: Tạo module API ingestion độc lập tại `<path>`.

---

## 8. Key Findings & Anomalies
- **F-001 (Pagination):** Endpoint `GET /api/v1/orders` dùng phân trang `page` & `pageSize`. Cần vòng lặp loop khi ingest toàn bộ.
- **F-002 (Nested Structures):** Trường `customer.profile` trả về object lồng nhau 3 cấp. Khuyến nghị chuẩn hóa tại tầng Silver.
- **F-003 (Rate Limiting):** API trả về header `X-RateLimit-Remaining: 60`. Cần cơ chế throttle delay 500ms giữa các batch.

---

## 9. Identified Risks
- ⚠️ **R-01 (Token Expiration):** Bearer token hết hạn sau 30 phút. Cần cơ chế refresh token nếu crawl dữ liệu lớn.
- ⚠️ **R-02 (Inconsistent Error Schema):** Endpoint trả về HTTP 404 có format khác với HTTP 500.

---

## 10. Recommended Next Actions & DECISION REQUIRED

> ⛔ **AI ACTION STOPPED HERE — WAITING FOR USER INSTRUCTION**
> AI **CHƯA THỰC HIỆN BẤT KỲ THAY ĐỔI MÃ NGUỒN HOẶC TẠO PIPELINE NÀO**. Xin vui lòng chọn 1 trong các định hướng sau:

- **Option A — Bronze Ingestion Pipeline:**
  Xây dựng pipeline thu thập và sinh file dữ liệu thô `api_responses.ndjson` + `ingestion_manifest.json` sẵn sàng nạp vào hồ dữ liệu.
- **Option B — Postman Collection Standardization:**
  Chuẩn hóa lại toàn bộ collection: gom nhóm folders theo Resource, gắn response mẫu thật, thiết lập biến môi trường và bổ sung bộ test scripts `pm.test`.
- **Option C — Formal Data Contract:**
  Sinh file đặc tả hợp đồng dữ liệu `api_schema.json` + `data_dictionary.md` + file contract YAML làm căn cứ kiểm định cho tầng Silver.
- **Option D — Data Quality & Anomaly Assertions:**
  Thiết lập bộ quy tắc kiểm tra chất lượng dữ liệu (Null checks, Uniqueness, Type assertions) cho các endpoint quan trọng.
- **Option E — Deep Scenario Execution:**
  Tiếp tục chạy thêm các kịch bản biên (Empty Result, Invalid Params, Unauthorized) để hoàn thiện bức tranh hành vi của API.
