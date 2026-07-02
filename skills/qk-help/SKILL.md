---
name: qk-help
description: Tra cứu danh sách toàn bộ kỹ năng (skills) hiện có và đọc các mẹo (pro-tips) kết hợp kỹ năng.
mode_supported: [quick, standard]
input: [User query]
output: [Skill list, guides]
workflow: [1. Nhận câu hỏi -> 2. Tra cứu -> 3. Phản hồi]
allowed_tools: [read_file, list_dir]
handoff_to: [none]
---

# 🛠️ qk-help - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Tra cứu danh sách toàn bộ kỹ năng (skills) hiện có và đọc các mẹo (pro-tips) kết hợp kỹ năng.

## 🎯 1. Mục Tiêu (Goal)
- Cung cấp danh sách các kỹ năng hệ thống (AI-OS) cho người dùng.
- Hướng dẫn cách kết hợp các kỹ năng để tạo ra chuỗi giá trị (workflow).

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Phân tích câu hỏi của người dùng xem họ đang tìm kiếm gì.
2. **Tra cứu (Plan):** Kiểm tra danh sách các kỹ năng hoặc mẹo sử dụng trong phần Deep Knowledge.
3. **Thực thi (Execute):** Định dạng và trả lời câu hỏi một cách dễ hiểu nhất.
4. **Xác thực (Verify):** Đảm bảo không giới thiệu các skill không tồn tại.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- Chỉ được liệt kê các skill đang có thực trong dự án.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `none`
- Nội dung bàn giao: Trả về kết quả hiển thị cho người dùng.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

# 📚 Cẩm nang AI Developer Skill OS

> **Nhiệm vụ của bạn (AI):** Khi người dùng gọi lệnh `./qk-help`, hãy xuất ra màn hình (bằng tiếng Việt) danh sách các kỹ năng phân theo nhóm và các Mẹo sử dụng (Pro-tips) dưới đây một cách sinh động, dễ đọc (dùng markdown, in đậm, emoji). Không cần phân tích code, chỉ đóng vai trò là "Sách hướng dẫn sử dụng".

---

## 🎯 1. Danh sách Kỹ năng (Skills Directory)

Dưới đây là các kỹ năng chính bạn có thể gọi bằng cách gõ `./qk-[tên-kỹ-năng]`:

### 🎨 Frontend (Giao diện)
- **`qk-ui-builder`**: Xây dựng UI, Layout, Component, Modal phức tạp.
- **`qk-table-crud-generator`**: Chuyên vẽ bảng danh sách (Table), phân trang, lọc và form Thêm/Sửa/Xóa.
- **`qk-form-builder`**: Chuyên làm Form nhập liệu, validate (Zod/Yup).
- **`qk-component-generator`**: Tạo Component độc lập, tái sử dụng (Button, Input, Card).
- **`qk-state-management`**: Xử lý Redux, Zustand, React Query.
- **`qk-frontend-debug`**: Bắt bệnh vỡ layout, infinite re-render, lỗi Hydration.
- **`qk-frontend-performance`**: Tối ưu tốc độ, chống re-render thừa.
- **`qk-frontend-architecture`**: Tư vấn kiến trúc thư mục Frontend.
- **`qk-frontend-testing`**: Viết Unit Test / E2E Test cho Frontend.
- **`qk-accessibility-audit`**: Sửa lỗi a11y, hỗ trợ Screen reader.

### ⚙️ Engineering & Integration (Tích hợp)
- **`qk-api-integration`**: [Cực mạnh] Bóc tách tài liệu API (Curl, Postman) -> Gen Type, Service, Hook -> (Tùy chọn) Ốp thẳng vào UI.
- **`qk-refactor`**: Tối ưu, dọn dẹp mã nguồn sạch sẽ.
- **`qk-bug-fix`**: Chẩn đoán lỗi sâu và sửa an toàn.
- **`qk-project-audit`**: Quét toàn bộ dự án tìm nợ kỹ thuật.
- **`qk-git-engineer`**: Viết Commit / PR chuẩn Conventional.
- **`qk-migration`**: Nâng cấp version framework / thư viện.
- **`qk-agent-orchestrator`**: Kiến trúc sư, lên plan phân rã task lớn.
- **`qk-context-manager`**: Tóm tắt kiến trúc dự án.

### 🗄️ Backend (Máy chủ)
- **`qk-database-engineer`**: Thiết kế Schema, ORM (Prisma/Drizzle), Migration.
- **`qk-backend-architecture`**: Setup kiến trúc Backend (Node/Nest/Python).
- **`qk-auth-security`**: Phân quyền RBAC, JWT, OAuth.
- **`qk-deployment`**: Viết Dockerfile, CI/CD Pipeline.

---

## 💡 2. Mẹo sử dụng Nâng cao (Pro-Tips)

### Mẹo 1: Kết hợp Kỹ năng (Skill Chaining) 🔗
Đừng bắt AI làm từ A-Z bằng 1 câu prompt. Hãy gọi liên hoàn:
> *"Hãy dùng `./qk-api-integration` để bóc tách API này thành hook React Query. Sau đó dùng `./qk-table-crud-generator` vẽ cái Bảng hiển thị danh sách tích hợp hook đó."*

### Mẹo 2: Chế độ "Một phát ăn ngay" (End-to-End) 🚀
Nếu bạn đã có sẵn 1 màn hình UI (chỉ thiếu data), hãy ép `qk-api-integration` làm End-to-End:
> *"./qk-api-integration Dưới đây là API Get Profile. Hãy khai báo Type, viết Hook và TÍCH HỢP THẲNG LUÔN vào file \`Profile.tsx\` đang mở."*

### Mẹo 3: Truyền tham số ép buộc (Arguments) 🎯
Bạn có thể ép AI dùng công nghệ bạn muốn bằng cách thêm \`--tham_số\`:
> *"./qk-ui-builder --fw=react --css=tailwind Hãy vẽ màn hình Đăng nhập."*

### Mẹo 4: Nhờ "Kiến trúc sư" phân việc 🧠
Nếu bạn có một tính năng quá lớn (ví dụ: Làm tính năng Giỏ Hàng), đừng tự chia việc, hãy gọi:
> *"./qk-agent-orchestrator Tôi muốn làm tính năng Giỏ hàng. Hãy phân tích và lên kế hoạch gọi các skill \`qk-\` nào cho phù hợp."*
