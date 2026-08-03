---
# ── Identity ───────────────────────────────────────────────
name: qk-project-memory
version: 9.1.0
status: stable
description: "Quản trị Tri thức và Bộ nhớ dự án V1 (Dual-Mode Shared/Private) — Quản lý như source code: đơn giản, có thể review, cập nhật và luôn có con người phê duyệt."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - context-management
  - knowledge-retrieval
  - project-learning

complexity:
  level: medium
  criteria:
    files_affected: "1-2"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "lưu context"
  - "nhớ lại"
  - "project memory"
  - "lưu vào bộ nhớ"
  - "tìm lại fact"
  - "/learn"

# ── V9: References ─────────────────────────────────────────
workflow: documentation

rules:
  - global
  - coding

tools:
  - filesystem

related_skills:
  - qk-context-loader
  - qk-engineering-standard

knowledge_scope:
  owns:
  - project-facts
  - verified-context
  - patterns
  - hard-bugs
  references:
  - architecture
  - convention
  - pattern
  - hard-bug

# ── V9: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: human-approval

selection:
  priority: high
  confidence_threshold: 1.0

examples: []
learnings: []

# ── Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: edit_files
produces: [knowledge-update]
consumes: [source-code, task-outcome]

token_budget:
  max_files_read: 2
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, DISMISSED, FAILED]
---

# qk-project-memory — Project Knowledge Management V1

> **Kim chỉ nam tối thượng:** *"Knowledge phải được quản lý giống như source code: đơn giản, có thể xem xét (review), có thể cập nhật, có thể loại bỏ và luôn có con người chịu trách nhiệm phê duyệt."*
> 
> **Nguyên tắc định hướng:**
> - **Đơn giản hơn > Thông minh hơn:** Mọi tính năng chỉ phục vụ 2 mục tiêu: giúp AI mở đúng file nhanh hơn, hoặc tránh lặp lại một lỗi đã trả giá đắt.
> - **Navigator, NOT Source of Truth:** Memory chỉ dùng để giảm thời gian tìm kiếm, không thay thế việc đọc mã nguồn hiện tại.
> - **Tài liệu Kỹ Thuật:** `AGENTS.md` và `index.yaml` là tài liệu kỹ thuật của dự án, tuyệt đối KHÔNG phải nhật ký hội thoại của AI ("Hôm nay AI đã...", "User bảo...").
> - **AI Đề xuất -> Con người Phê duyệt:** AI không tự học ngầm, AI tóm tắt và đề xuất để lập trình viên chốt duyệt.

---

## 1. Hai Chế Độ Lưu Trữ (Dual-Mode Design)

Tùy thuộc vào nhu cầu bảo mật hay làm việc nhóm, V1 hỗ trợ 2 chế độ (Mode):

### Mode 1: Private Mode (Mặc định cho cá nhân)
```text
.ai-local/
├── AGENTS.md            ──> Bản đồ dự án (< 100 dòng)
└── knowledge/
      └── index.yaml     ──> Kho tri thức 4 lĩnh vực
```
- **Bảo mật tuyệt đối:** Thư mục `.ai-local/` BẮT BUỘC được định danh trong `.gitignore` của dự án (hoặc Global Git Ignore). Tri thức nằm trọn trên máy lập trình viên dùng Skin, không đẩy lên Git.

### Mode 2: Shared Mode (Dành cho Team & CI/CD)
```text
.agents/
├── AGENTS.md            ──> Bản đồ dự án (< 100 dòng)
└── knowledge/
      └── index.yaml     ──> Kho tri thức 4 lĩnh vực
```
- **Đồng bộ toàn đội:** Thư mục `.agents/` được commit, tạo Pull Request (PR), team review và merge vào codebase như source code. Ai clone dự án về đều nhận trọn vẹn tri thức tái sử dụng.

---

## 2. Tiêu Chuẩn File 1: `AGENTS.md` (Bản Đồ Dự Án)

- **Giới hạn cứng:** Tuyệt đối không vượt quá **100 dòng** (được parse trong < 5 giây).
- **Quy tắc Quick Actions:** KHÔNG ghi đường dẫn file cụ thể nếu chưa ổn định để tránh gãy link khi refactor. Nhỏ gọn trỏ tới từ khóa tra cứu trong `index.yaml`.

### Mẫu Chuẩn `AGENTS.md`:
```markdown
> [!IMPORTANT]
> **MEMORY NAVIGATOR:** Memory chỉ dùng để giảm thời gian tìm kiếm, không thay thế việc đọc mã nguồn hiện tại.

# Architecture (~15 dòng)
- Framework: React + TypeScript + TanStack Router
- State/Data: Axios Instance wrapper tại `src/services/httpClient.ts`
- UI Style: TailwindCSS / Custom Component Library

# Folder Map (~20 dòng)
- `src/routes/`: Cấu hình routing (file-based routing)
- `src/api/`: Các dịch vụ kết nối endpoint backend
- `src/components/`: Component sử dụng lại trong toàn dự án

# Quick Actions (~30 dòng)
- Thêm / Sửa Menu -> Tra cứu Pattern "add-menu" trong `knowledge/index.yaml`
- Xây dựng bảng dữ liệu -> Tra cứu Pattern "data-table" trong `knowledge/index.yaml`
- Quy tắc gọi API -> Tra cứu Convention "api-wrapper" trong `knowledge/index.yaml`

# Agent Rules (~20 dòng)
1. Luôn đọc `AGENTS.md` đầu tiên.
2. Tra cứu `knowledge/index.yaml` trước khi dùng lệnh tìm kiếm mù toàn dự án.
3. Hậu task: Chỉ đề xuất lưu nếu là Architecture, Convention, Pattern, hoặc Hard Bug.
```

---

## 3. Tiêu Chuẩn File 2: `knowledge/index.yaml` (Kho Tri Thức)

### Quy Tắc Lõi:
1. **Chỉ lưu 4 Loại Tri Thức duy nhất:**
   - `Architecture`: Nền tảng cấu trúc lớn.
   - `Convention`: Chuẩn mực viết code bắt buộc.
   - `Pattern`: Quy trình hành động tái sử dụng nhiều bước.
   - `Hard Bug`: Lỗi cực kỳ khó nhằn hoặc tốn nhiều thời gian fix (KHÔNG lưu lỗi typo, CSS lặt vặt, lỗi cú pháp tầm thường).
2. **Chỉ lưu Hành Động:** Đổi thẻ `summary` thành `steps` cho Pattern/Convention. AI nhìn là thực thi ngay.
3. **Hard Bug Tối Giản 3 Trường:** Chỉ giữ `cause`, `fix`, và `refs`.
4. **Lịch Sử An Toàn (Zero-Overwrite):** Khi một tri thức thay đổi hoặc lỗi thời, KHÔNG xóa đè. Chuyển trạng thái (`status`) của cụm cũ từ `Active` sang `Archived`, sau đó chèn cụm mới với trạng thái `Active`.
5. **Đường dẫn chuẩn thương mại:** Mọi `refs` bắt buộc dùng đường dẫn tương đối từ Root (`src/...`) và chỉ định tên Biểu tượng (Symbol/Component/Hook name), cấm dùng đường dẫn ổ đĩa tuyệt đối (`C:/...`, `D:/...`).

### Mẫu Chuẩn `index.yaml`:
```yaml
# ==============================================================================
# KHO TRI THỨC DỰ ÁN V1 (AI SKIN V9 ARCHITECTURE)
# Lifecycle đơn giản: Active (Đang dùng) -> Archived (Lỗi thời/Lịch sử)
# ==============================================================================

knowledge:
  # --- PATTERN: CÔNG DỤNG LẶP LẠI ---------
  - id: add-menu
    type: Pattern
    status: Active
    tags: [menu, navigation, sidebar, router]
    steps:
      - 1. Cập nhật Sidebar hoặc Router config
      - 2. Khai báo quyền (access permissions) cho menu item mới
      - 3. Áp dụng chuẩn API hook tương ứng
    refs:
      - src/routes/_app.tsx#SidebarNavigation
      - src/config/permissions.ts#UserRoles

  # --- HARD BUG: CA BỆNH KHÓ NHẰN ---------
  - id: rerender-infinite-loop
    type: Hard Bug
    status: Active
    tags: [react, use-effect, leak]
    cause: "Fetch data trực tiếp bên trong useEffect mà dependency bị thay đổi tham chiếu liên tục"
    fix: "Sử dụng custom hook có sẵn hoặc bọc hàm bằng useCallback trước khi truyền vào useEffect"
    refs:
      - src/hooks/useAutoFetch.ts

  # --- CONVENTION: QUY BẰNG CẤM HOẶC BẮT BUỘC ---------
  - id: axios-only
    type: Convention
    status: Active
    steps:
      - Cấm tuyệt đối dùng fetch() hay axios mốc rỗng
      - Luôn import httpClient tích hợp sẵn token từ src/services/
    refs:
      - src/services/httpClient.ts
```

---

## 4. Quy Trình Trò Chuyện & Thao Tác (The `/learn` Lifecycle)

Bất kỳ lúc nào người dùng gõ `/learn`, `./qk-project-memory`, hoặc sau khi hoàn tất một task phức tạp có tham số yêu cầu ghi nhớ, Agent PHẢI tuân thủ theo 4 bước khép kín:

### Bước 1: Trả lời Câu Hỏi Lọc (Filtering Question)
AI tự hỏi và đối chiếu: *"Task/Sự kiện vừa rồi có thuộc 1 trong 4 loại (Architecture, Convention, Pattern, Hard Bug) và có giá trị giảm thời gian cho task tương lai không?"*
- Nếu **KHÔNG** (lỗi typo, trang trí CSS, CRUD đơn giản, sửa text): Trả về `DISMISSED: "Không phát hiện tri thức kiến trúc/bug khó giá trị dài hạn. Đã bỏ qua để giữ sạch bộ nhớ."` -> **Dừng lại ngay.**
- Nếu **CÓ**: Sang Bước 2.

### Bước 2: Chuẩn Bị Bản Đề Xuất (Draft Proposal)
AI tóm tắt nội dung tri thức dưới chuẩn đinh dạc của `index.yaml` (với 4 loại và trường `steps` / `cause-fix`).
- Đối chiếu trong `index.yaml` xem có từ khóa/id trùng lặp hay không để chuẩn bị ghi chú `[Mới]` hoặc `[Cập nhật -> Archived cũ]`.

### Bước 3: Phê Duyệt Của Con Người (Human Approval - Bắt Buộc)
Trình bày rõ trước người dùng trên chat:
```markdown
💡 [AI Skin Project Memory]: Phát hiện tri thức mới đáng ghi nhớ cho dự án.
Đề xuất ghi vào `[Mode: .ai-local / .agents]/knowledge/index.yaml`:

... (Nội dung YAML tóm tắt) ...

👉 **Bạn có muốn xác nhận cập nhật tri thức này không? (Đồng ý / Chỉnh sửa / Bỏ qua)**
```

### Bước 4: Thực Thi Cập Nhật (Commit)
- Sau khi được Người dùng xác nhận: Dùng tool (ví dụ `replace_file_content` hoặc `write_to_file`) để chèn thông tin mới vào `index.yaml` (hoặc `AGENTS.md` nếu chỉnh sơ đồ kiến trúc).
- Báo cáo hoàn tất chu trình Ghi nhớ!

---

## 5. Bảng Exit Codes

| Code | Ý Nghĩa | Hành Động Kế Tiếp |
|------|---------|--------------------|
| SUCCESS | Đã lưu hoặc đọc tri thức hợp lệ từ `index.yaml` / `AGENTS.md` | Hoàn thành |
| BLOCKED | Đề xuất tri thức bị Người dùng từ chối (Hoặc thiếu quyền truy xuất file) | Không thay đổi bộ nhớ |
| DISMISSED | Thao tác không thỏa mãn 4 tiêu chí lọc V1 (Chỉ là typo, css vặt) | Bỏ qua ghi nhớ nhằm sạch hệ thống |
| FAILED | File bộ nhớ sai định dạng cú pháp YAML hoặc vi phạm giới hạn 100 dòng | Yêu cầu sửa/reset cấu trúc file |
