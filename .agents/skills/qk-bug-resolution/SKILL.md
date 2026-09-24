---
name: qk-bug-resolution
version: 10.2.0
status: stable
subtitle: "Debug & Fix Bug"
description: "Chẩn đoán nguyên nhân gốc rễ và khắc phục lỗi mã nguồn theo chu trình khép kín 4 bước (Triangulate → Root-Cause → Surgical Fix → Regression Shield). Dùng khi: fix bug, sửa lỗi, crash, error, exception, trace lỗi, điều tra nguyên nhân bug, not working, màn hình trắng, lỗi logic — TUYỆT ĐỐI KHÔNG dùng khi cần tái cấu trúc lớn (dùng qk-code-cleaner) hoặc làm tính năng mới (dùng qk-feature-delivery)."
platforms: [antigravity, claude, opencode]
runtime_version: 1
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
  - safety
workflow: bug-resolution
triggers:
  - "fix bug"
  - "sửa lỗi"
  - "crash"
  - "error"
  - "exception"
  - "trace lỗi"
  - "điều tra nguyên nhân bug"
  - "debug lỗi"
  - "not working"
  - "bị lỗi"
  - "màn hình trắng"
  - "lỗi 500"
---

# qk-bug-resolution — Debug & Fix Bug (Surgical Root-Cause Engine)

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

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
  - 👉 *Domain Focus:* Hard Bug (vd: lỗi memory leak, race condition, lỗi thư viện tương tự từng gặp).

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
  - 👉 *Domain Harvest:* Hard Bug mới có khả năng tái diễn (vd: nguyên nhân sâu xa của crash/leak để phòng ngừa).

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
- 👉 *Domain Ignore:* Lỗi nhỏ chỉ xảy ra một lần (vd: typo, quên import, thiếu ngoặc đơn giản).

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** A bug fix must be surgical, evidence-based, and minimal. Never guess. Never refactor surrounding code during a bug fix.
> **Verification Principle:** PASS is a verified conclusion, never a target. Zero workarounds.

### 🛡️ Anti-Overengineering Rule (CẤM SỬA LAN MAN)
- **Tối thiểu hóa Diff (Minimal Diff):** Chỉ sửa đúng dòng code hoặc biểu thức gây ra lỗi. Tuyệt đối KHÔNG nhân cơ hội sửa bug để "tiện tay" đổi tên biến xung quanh, format lại cả file, hay viết lại cả hàm.
- **Không thay đổi kiến trúc trong bản vá:** Nếu phát hiện kiến trúc cũ xấu, giải quyết dứt điểm bug trước bằng một bản vá an toàn (Surgical Guard), sau đó đề xuất người dùng chạy `qk-code-cleaner` sau. Cấm trộn lẫn việc fix bug và việc refactor vào cùng một lần sửa.

### 🔒 No Unrelated Changes Rule (CẤM CHẠM CODE NGOÀI)
- Tuyệt đối không sửa các file ngoài call-path của bug.
- Tuyệt đối không tự tiện nâng cấp thư viện lân cận.
- Nếu phát hiện code smell hoặc vấn đề ngoài scope: **Chỉ ghi nhận vào báo cáo**, tuyệt đối không tự sửa.

### 🛡️ Anti-Fake-Pass Rule (CẤM ÉP PASS ẢO - R-G-14.5)
- **CẤM** dùng `as any`, `@ts-ignore`, `@ts-expect-error` để che giấu crash hoặc lỗi type.
- **CẤM** dùng `catch (e) {}` rỗng nuốt exception để code không crash bề mặt.
- **CẤM** sửa expected assertions trong unit test để lừa test runner chuyển từ đỏ sang xanh.

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI TUYÊN BỐ)
- **Cấm tuyên bố đã sửa xong nếu chưa kiểm chứng:** Nếu có test runner hoặc script tái hiện, BẮT BUỘC phải chạy lệnh để chứng minh lỗi đã biến mất.
- **Báo cáo trung thực:** Nếu không thể chạy môi trường (thiếu DB, thiếu API 3rd party), AI phải ghi rõ: `"Trạng thái: NOT VERIFIED — Đã vá theo bằng chứng tĩnh, chưa thể chạy test tự động. Cần user test tay theo kịch bản dưới đây"`.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- Thu thập và phân tích trực tiếp stack trace, logs, và file mã nguồn xung quanh call-stack.
- Tìm ra nguyên nhân gốc (Root Cause) bằng chứng cứ trong code thực tế, không dừng ở triệu chứng bề mặt.
- Phân loại chính xác: Logic Error, State Mutation, Boundary Condition, Type/Schema Mismatch, Race Condition, hoặc Unhandled Exception.
- Viết bản vá phẫu thuật (Surgical Fix) có tính phòng thủ (null-safety, boundary guard).
- Tạo hoặc cập nhật regression test để khóa lỗi vĩnh viễn (nếu repo có test framework).

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Tái cấu trúc cả module vì chê code xấu → Chuyển sang `qk-code-cleaner`.
- Thêm tính năng mới chưa từng có trong spec → Chuyển sang `qk-feature-delivery`.
- Thay đổi cấu trúc cơ sở dữ liệu lớn → Chuyển sang `qk-backend-data`.

---

## 3. Quy Trình Khép Kín 4 Bước (Sequential Procedure)

```
[Bước 1: Triangulate]   ── Đọc log/trace, mở file thực tế quanh điểm crash, khoanh vùng phạm vi
            │
            ▼
[Bước 2: Root-Cause]    ── Trả lời 5 câu hỏi gốc rễ (R-G-14.1). Nếu thiếu chứng cứ ──► BLOCKED
            │
            ▼
[Bước 3: Surgical Fix]  ── Viết bản vá tối thiểu, defensive programming, không chạm code ngoài
            │
            ▼
[Bước 4: Verify & Test] ── Chạy test xác thực thực tế. Nếu FAIL ──► Kích hoạt Failure Path
```

### Chi tiết các bước:
1. **Triangulate (Khoanh vùng):** Mở file chứa dòng lỗi, đọc tối thiểu 30–50 dòng xung quanh để hiểu ngữ cảnh.
2. **Root-Cause Gate (R-G-14.1):** Bắt buộc trả lời 5 câu hỏi trước khi sửa:
   - 1. Vấn đề quan sát được là gì?
   - 2. Lỗi xảy ra ở đâu (file & line)?
   - 3. Luồng code nào dẫn tới lỗi?
   - 4. Nguyên nhân gốc rễ là gì?
   - 5. Vì sao bản vá đề xuất sẽ triệt tiêu nguyên nhân gốc rễ này?
   *(Nếu không xác định được với đầy đủ bằng chứng: Chuyển trạng thái `Status: BLOCKED`)*.
3. **Surgical Fix:** Vá lỗi tại điểm phát sinh hoặc thêm Guard Clause phòng ngự. Đảm bảo optional chaining `?.`, fallback an toàn.
4. **Verification:** Chạy test hoặc kiểm tra call-sites để đảm bảo các nơi khác gọi hàm này không bị ảnh hưởng.

---

## 4. Xử Lý Sự Cố Khi Bản Vá Thất Bại (Failure Path Protocol)

Nếu sau khi áp dụng bản vá mà lỗi vẫn còn hoặc sinh ra lỗi mới (Regression):
1. **Revert ngay bản vá vừa làm:**
   ```bash
   git checkout HEAD -- path/to/failed_fix_file
   ```
2. **Hủy bỏ giả thuyết cũ:** Không cố chấp chắp vá thêm code. Việc test fail chứng tỏ giả thuyết về nguyên nhân gốc đã SAI.
3. **Hình thành giả thuyết mới:** Đọc kỹ thông báo lỗi mới xuất hiện để tìm nguyên nhân thực sự sâu hơn (ví dụ: lỗi không nằm ở controller mà nằm ở transformer dữ liệu trước đó).
4. **Giới hạn 2 lần thử:** Nếu sau 2 lần vá vẫn không hết lỗi, AI BẮT BUỘC dừng lại, giữ nguyên trạng thái ban đầu và báo cáo chi tiết các giả thuyết đã thử để xin thêm log từ người dùng với trạng thái `Status: BLOCKED`.

---

## 5. Ví Dụ Bản Vá Phẫu Thuật Đa Ngôn Ngữ

### TypeScript / JavaScript:
```typescript
// ❌ Trước khi sửa: TypeError: Cannot read properties of undefined (reading 'address')
function getUserCity(user: UserResponse) {
  return user.profile.address.city;
}

// ✅ Bản vá tối thiểu (Surgical Fix) có Null-Safety & Fallback:
function getUserCity(user: UserResponse | null | undefined): string {
  return user?.profile?.address?.city ?? "Unknown";
}
```

### Python:
```python
# ❌ Trước khi sửa: KeyError hoặc NoneType error khi item không có 'price'
def calculate_subtotal(items):
    return sum(item["price"] * item["quantity"] for item in items)

# ✅ Bản vá tối thiểu (Surgical Fix) phòng thủ với dict.get() và type guard:
def calculate_subtotal(items) -> float:
    if not items:
        return 0.0
    return sum(
        float(item.get("price", 0.0)) * int(item.get("quantity", 1))
        for item in items
        if isinstance(item, dict)
    )
```

---

## 6. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi Debug & Fix Bug | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `frontend` | UI lifecycle, re-rendering, event propagation, API response binding | Kiểm tra network mock, hook dependency array, conditional rendering |
| `backend` | Transaction rollback, auth middleware, input validation, SQL exception | Kiểm tra query logging, DB connection pool, Zod validation, error status |
| `fullstack` | Hợp đồng giao tiếp FE-BE, serialization, cookie/session, sync state | Kiểm tra shared types, request payload vs response schema, CORS |
| `data` | Data corruption, schema drift, null trong pipeline, OOM | Kiểm tra partition path, dbt logs, data quality assertion, idempotency |
| `devops` | CrashLoopBackOff, memory leak, missing env secret, port conflict | Kiểm tra container logs, Docker healthcheck, ingress/proxy headers |
| `qa` | Tạo test case tái hiện (Repro step), edge-case boundary verification | Viết automated reproduction script, kiểm tra cross-browser |

---

## 7. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🔧 Bug Resolution Summary                             [Role: <role> | Type: <Dạng lỗi>]
─────────────────────────────────────────────────────────────────────
Trạng thái:          [SUCCESS | BLOCKED | FAILED | PARTIAL]
Triệu chứng ban đầu: [Mô tả ngắn gọn lỗi gặp phải và thông báo lỗi]
Nguyên nhân gốc rễ:  [Cơ chế chính xác gây ra lỗi trong mã nguồn]

Vị trí đã can thiệp phẫu thuật (Laser Focus):
  ✅ [FIX] [TênFile.ts:L42](file:///<workspace-root>/path/to/file.ts#L42-L48): [Mô tả bản vá ngắn gọn]

Kiểm chứng thực tế (Verify Before Claim):
  • Chạy lệnh kiểm thử: [Đã chạy: `npm test path/to/test` | Chưa chạy (Lý do môi trường)]
  • Kết quả kiểm tra:   [Pass | Regression test đã bổ sung | Cần user test tay]
  • Tác động phụ:       ✅ Đã rà soát N call-sites, 0 side-effect

📋 Kịch bản test tay dành cho người dùng:
  1. [Thao tác cụ thể để kích hoạt lại luồng và xác nhận lỗi đã hết]
```

---

## 8. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct evidence available | Proceed |
| MEDIUM | Some assumptions needed | Note assumptions |
| LOW | Insufficient evidence | EXIT: BLOCKED |

---

## 9. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Task completed and verified | All acceptance criteria met |
| PARTIAL | Task done with minor gaps | Some checks skipped |
| BLOCKED | Missing precondition or info | Ask user |
| FAILED | Task failed after max retries | Report error |

---

## 10. Bằng Chứng Định Dạng (Evidence Format)

```
[SEVERITY] path/to/file.ts:LINE
Reason:     [why this matters]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [suggestion]
```

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
