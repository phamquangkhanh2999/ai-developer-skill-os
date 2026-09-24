---
name: qk-backend-data
version: 10.1.0
status: stable
subtitle: "API & Database"
description: "Kỹ sư Backend & Cơ sở dữ liệu toàn diện: Thiết kế Zero-Trust API, quản lý Schema Migration an toàn, phân quyền RBAC/ABAC, tối ưu SQL EXPLAIN/ANALYZE và xây dựng Data Pipeline. Dùng khi: viết api, tạo endpoint, sửa database, migration, thêm cột, rbac, abac, phân quyền, auth middleware, tối ưu query, query chậm, slow query, n+1 query, data pipeline, etl, dbt — TUYỆT ĐỐI KHÔNG dùng cho việc code UI/CSS (dùng qk-ui-engineer) hoặc cấu hình hạ tầng k8s/cluster (dùng qk-devops-release)."
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
  - security
workflow: feature-delivery
triggers:
  - "viết api"
  - "tạo endpoint"
  - "thiết kế api"
  - "sửa database"
  - "migration"
  - "thêm cột"
  - "db schema"
  - "rbac"
  - "abac"
  - "phân quyền"
  - "auth middleware"
  - "tối ưu query"
  - "query chậm"
  - "slow query"
  - "n+1 query"
  - "data pipeline"
  - "etl"
  - "dbt"
---

# qk-backend-data — API & Database (Zero-Trust API & Data Architecture Engine)

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** Data integrity and security are non-negotiable. Prefer simple, direct, type-safe queries over multi-layered abstractions. Every schema change must have a safe rollback path.
> **Verification Principle:** PASS is a verified conclusion, never a target. Zero workarounds.

### 🛡️ Anti-Overengineering Rule (CẤM TẠO LAYER RÁC)
- **Không đẻ tầng lớp trung gian vô nghĩa:** Nếu dự án dùng ORM trực tiếp (Prisma, Drizzle, SQLAlchemy) hoặc Active Record, KHÔNG tự ý bọc thêm 3 tầng Interface, DAO, Repository rườm rà nếu codebase hiện tại không theo chuẩn Clean/Hexagonal Architecture. Viết code thẳng thắn, dễ đọc và dễ test.
- **Không lạm dụng Message Broker:** Nếu chỉ là tác vụ xử lý thông thường, ưu tiên DB Transactions hoặc simple background queue thay vì đề xuất cài Kafka, RabbitMQ làm phức tạp hóa hệ thống.

### 🔒 No Unrelated Changes Rule (CẤM SỬA LAN MAN)
- Chỉ sửa đúng endpoints, schemas hoặc pipelines được phân công.
- **CẤM** tiện tay sửa controller khác hoặc reformat toàn bộ schema không liên quan.
- Nếu phát hiện endpoint cũ thiếu bảo mật: **Chỉ ghi nhận vào báo cáo kiểm toán**, không tự ý sửa nếu ngoài scope.

### 🛡️ Anti-Fake-Pass Rule (CẤM ÉP PASS ẢO - R-G-14.5)
- **CẤM** bypass auth middleware hoặc hardcode role Admin chỉ để test case vượt qua.
- **CẤM** tắt các ràng buộc Foreign Key, Unique, NOT NULL chỉ để insert dữ liệu mẫu.
- **CẤM** dùng `as any` để ép kiểu kết quả truy vấn database.
- **CẤM** swallow DB exceptions (`try/catch {}` rỗng nuốt transaction rollback).

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO)
- **Cấm tuyên bố query đã tối ưu nếu chưa chạy EXPLAIN:** Nếu có database test, BẮT BUỘC chạy `EXPLAIN (ANALYZE)` để xem Execution Plan (Index Scan vs Seq Scan).
- **Báo cáo trung thực:** Nếu không có DB live cục bộ để test, ghi rõ: `"Trạng thái: NOT VERIFIED — Đã rà soát cú pháp tĩnh và đặt Index hợp lý. Chưa chạy EXPLAIN ANALYZE thực tế"`.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- **Zero-Trust API:** Mọi endpoint phải kiểm tra Auth & Input validation (Zod/Pydantic) trước khi vào logic nghiệp vụ. Chặn đứng IDOR bằng cách kiểm tra quyền sở hữu tài nguyên (`WHERE id = :id AND user_id = :current_user`).
- **Expand and Contract Migrations:** Thêm cột mới dạng `NULLABLE` trước, migrate dữ liệu, sau đó mới siết ràng buộc NOT NULL. Tuyệt đối KHÔNG xóa/đổi tên cột trong một migration duy nhất.
- **Diệt Trừ N+1 Queries:** Luôn sử dụng `eager loading` hoặc `DataLoader` khi truy vấn dữ liệu quan hệ (1-N).
- **Idempotent Data Pipelines:** Pipeline ETL/dbt phải chạy lại được nhiều lần mà không sinh trùng lặp dữ liệu (sử dụng Upsert / Partition Overwrite).
- **Planning Gate & Exceptions:** Với schema migration hoặc thay đổi model ảnh hưởng ≥ 2 files, BẮT BUỘC lập `implementation_plan.md` với `RequestFeedback: true` và dừng lại chờ phê duyệt. Ngoại lệ: query optimization đơn lẻ trong 1 file không cần qua gate.

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Viết component giao diện, HTML/CSS trên Frontend → Chuyển sang `qk-ui-engineer`.
- Cấu hình hạ tầng Kubernetes cluster hoặc deploy production → Chuyển sang `qk-devops-release`.

---

## 3. Quy Trình Kỹ Nghệ Backend & Dữ Liệu 4 Bước

```
[Bước 1: Contract & Validation] ── Định nghĩa Schemas, Request/Response DTOs & Auth Guards
            │
            ▼
[Bước 2: Safe Data Modeling]    ── Viết Migration theo chuẩn Expand & Contract kèm Script Rollback
            │
            ▼
[Bước 3: Service & Query Opt]   ── Triển khai Service layer, bọc Transaction & tối ưu hóa Query
            │
            ▼
[Bước 4: Verification & Test]  ── Chạy Migration test, Typecheck. Nếu FAIL ──► Rollback ngay
```

---

## 4. Xử Lý Sự Cố Khi Migration / Query Thất Bại (Failure Path)

### 🚨 Khi Migration gặp lỗi hoặc làm crash Database:
1. **Dừng ngay lập tức:** Không cố gắng ép chạy tiếp migration tiếp theo.
2. **Kích hoạt Script Rollback:**
   ```bash
   # Với Prisma:
   npx prisma migrate resolve --rolled-back <migration_name>
   # Hoặc chạy file down.sql tương ứng đã chuẩn bị sẵn
   ```
3. **Phục hồi schema cũ:** Khôi phục file schema về commit an toàn gần nhất.

---

## 5. Mẫu Code Thực Chiến Đa Ngôn Ngữ (Chống IDOR & N+1)

### TypeScript / Prisma:
```typescript
// ❌ Nguy hiểm: Dính IDOR, ai cũng xem được hóa đơn của người khác
export async function getInvoice(invoiceId: string) {
  return prisma.invoice.findUnique({ where: { id: invoiceId } });
}

// ✅ An toàn: Zero-Trust kiểm tra quyền sở hữu tài nguyên + Eager load chống N+1
export async function getInvoice(invoiceId: string, currentUserId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId: currentUserId, // Chặn đứng IDOR
    },
    include: {
      items: true, // Eager loading diệt N+1
    },
  });

  if (!invoice) throw new NotFoundError("Invoice not found or access denied");
  return invoice;
}
```

### Python / SQLAlchemy:
```python
# ✅ An toàn: Eager loading joinedload + Filter theo User ID
from sqlalchemy.orm import joinedload

def get_user_order(db, order_id: str, user_id: str):
    order = db.query(Order).options(
        joinedload(Order.items) # Chống N+1 query
    ).filter(
        Order.id == order_id,
        Order.user_id == user_id # Chống IDOR
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
```

---

## 6. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi xử lý Backend & Data | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `backend` | API architecture, transaction safety, business validation, JWT/OAuth | Viết Service layer, RBAC middleware, transaction manager |
| `data` | Pipeline reliability, incremental processing, dbt models, SLA | Thiết kế Medallion (Bronze/Silver/Gold), partitioned loads, schema assertion |
| `data-analyst` | SQL performance, aggregations, window functions, analytics views | Tối ưu complex queries, tạo materialized views, tính cohort metrics |
| `data-architect` | Enterprise data model, governance, retention, contract compatibility | Thiết kế chuẩn hóa 3NF/Kimball, zero-downtime migration strategy |
| `fullstack` | API schema contract, ORM updates, FE-BE type synchronization | Cập nhật schema, sinh types cho FE, tạo API handler |

---

## 7. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🗄️ Backend & Data Summary                             [Role: <role> | Target: <API / DB / Pipeline>]
─────────────────────────────────────────────────────────────────────
Trạng thái:          [SUCCESS | BLOCKED | FAILED | PARTIAL]
Nghiệp vụ thực hiện: [Endpoint mới / Migration / Tối ưu Query]
Cơ sở dữ liệu / ORM: [PostgreSQL / MySQL / Prisma / SQLAlchemy]

Các thay đổi kỹ thuật (Laser Focus):
  • [API Endpoint]  [orderController.ts](file:///<workspace-root>/path): [Zod validation + Auth guard]
  • [Migration]     [20260915_add_column.sql](file:///<workspace-root>/path): [Nullable, có rollback]

Kiểm chứng thực tế (Verify Before Claim):
  • Zero-Trust:       ✅ Middleware bảo vệ, chặn IDOR
  • Migration Safety: ✅ Cột mới Nullable, có kịch bản Down/Rollback
  • Query Plan:       [Đã diệt trừ N+1 bằng Eager loading | Đã kiểm tra Index tĩnh]
  • Zero Hack:        ✅ Không dùng as any, không tắt ràng buộc DB, không bypass auth
```
