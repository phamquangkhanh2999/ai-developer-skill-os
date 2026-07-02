---
name: qk-orchestrator
purpose: Điều hướng request, phân tích ý đồ và chọn workflow phù hợp nhất.
mode_supported: [standard]
input: [User request]
output: [Workflow được chọn và bàn giao cho skill tương ứng]
workflow: [1. Nhận lệnh -> 2. Phân tích -> 3. Handoff]
allowed_tools: [ask_question, run_command]
handoff_to: [qk-context-loader]
---

# 🛠️ qk-orchestrator - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Điều hướng request, phân tích ý đồ và chọn workflow phù hợp nhất.

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `qk-context-loader`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Agent Orchestrator

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

> ⚠️ **CRITICAL CONSTRAINT: This skill MUST NOT write any code.**
> Its only job is to analyze, plan, and delegate.
> If the orchestrator starts writing implementation code — it is violating its role.
> Immediately stop and delegate to the appropriate skill instead.

---

## Trigger

Activate this skill when:
- User describes a task without knowing where to start
- User request spans multiple concerns (UI + API + state + tests)
- Request is ambiguous and needs decomposition before action
- User says: "help me plan", "what should I do first", "how do I approach this"

---

## Scope

- ✅ Analyze the user's request
- ✅ Identify which skills are needed
- ✅ Define the correct execution order
- ✅ Create a step-by-step plan
- ✅ Delegate each step to the correct skill
- ✅ Track overall progress

---

## Non-goals

- ❌ Do NOT write implementation code
- ❌ Do NOT modify files
- ❌ Do NOT fix bugs directly (delegate to `bug-fix`)
- ❌ Do NOT build UI directly (delegate to `ui-builder`)
- ❌ Do NOT make architectural decisions unilaterally (delegate to `frontend-architecture`)

---

## Workflow

### Phase 1 — Request Analysis

Parse the user's request:

1. **What** is being asked? (feature, fix, refactor, review, deploy?)
2. **Where** does it belong? (frontend, backend, shared, infrastructure?)
3. **What is the scope?** (single component, full feature, entire codebase?)
4. **What is unknown?** List any ambiguities that need clarification.

If critical information is missing → ask before planning.

---

### Phase 2 — Skill Selection

Map the request to skills from the registry:

| Request type | Recommended skill(s) |
|---|---|
| "I don't know what's wrong" | `project-audit` → `bug-fix` |
| "Build a new page" | `frontend-architecture` → `design-system` → `ui-builder` |
| "Add API call" | `context-manager` → `api-integration` |
| "App is slow" | `project-audit` → `frontend-performance` |
| "Upgrade dependencies" | `migration` |
| "Write tests" | `frontend-testing` |

Always check dependencies from `skills.json` — load dependent skills first.

---

### Phase 3 — Execution Plan

Produce a numbered, ordered plan. Each step maps to one skill.

Format:
```
Step 1: [skill-name] — [what it will do]
Step 2: [skill-name] — [what it will do]
Step 3: [skill-name] — [what it will do]
```

Mark dependencies explicitly:
```
Step 2 requires Step 1 to complete first.
```

---

### Phase 4 — Delegation

For each step in the plan:
1. Announce which skill is being activated
2. Pass relevant context to that skill
3. Wait for skill output
4. Confirm completion before moving to next step

---

### Phase 5 — Progress Tracking

After each skill completes:
- Mark step as ✅ done
- Note any output or blockers
- Adjust remaining plan if needed
- Report overall progress to user

---

## Decision Tree

```
Is the request clear enough to plan?
  ├── No  → Ask 1-3 clarifying questions, then plan
  └── Yes → Does it span multiple concerns?
              ├── Yes → Create multi-step plan with skill sequence
              └── No  → Route directly to single skill
```

```
Does a skill dependency exist?
  ├── Yes → Run dependency skill first
  └── No  → Run skill directly
```

---

## Output Format

```
📋 Plan: [Brief description of what we're doing]

Step 1: `[skill-name]` — [Purpose]
Step 2: `[skill-name]` — [Purpose]  ← requires Step 1
Step 3: `[skill-name]` — [Purpose]

⏳ Starting with Step 1...
```

After each step:
```
✅ Step 1 complete: [Brief outcome]
▶️  Moving to Step 2: `[skill-name]`
```

---

## Validation Checklist

Before finishing orchestration:

- [ ] All planned steps completed
- [ ] Each step was handled by the correct skill
- [ ] No code was written by the orchestrator itself
- [ ] User has been informed of final outcome
- [ ] Next recommended actions provided if relevant

---

## Examples

See `examples/` folder.

---



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
