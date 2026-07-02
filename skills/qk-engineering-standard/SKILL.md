---
name: qk-engineering-standard
description: Rút trích các bộ luật thép (Folder, Naming, State, Boundary) cần tuân thủ cho task.
mode_supported: [enterprise]
input: [Context]
output: [Validated Context + Rules]
workflow: [1. Đọc rules/frontend.md... -> 2. Gắn luật vào Context -> 3. Handoff]
allowed_tools: [read_file]
handoff_to: [[Target Execution Skill]]
---

# 🛠️ qk-engineering-standard - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Rút trích các bộ luật thép (Folder, Naming, State, Boundary) cần tuân thủ cho task.

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
- Đích đến: `[Target Execution Skill`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# State Management

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User asks to "store this data", "share state between components", or "cache API results"
- Prop drilling becomes excessive (>3 levels deep)
- Integrating complex UI interactions that need memory (e.g., shopping cart, multi-step wizard)
- Managing async server data and loading/error states

---

## Scope

- ✅ Decide which state layer to use based on the data's lifecycle and scope
- ✅ Implement local state (`useState`, `useReducer`, `ref`)
- ✅ Implement global UI state (Zustand, Pinia, Context, Redux)
- ✅ Implement server state (React Query, SWR, Apollo)
- ✅ Ensure state is immutable and updates correctly
- ✅ Prevent race conditions and stale state bugs

---

## Non-goals

- ❌ Do NOT introduce a new state management library if the project already uses one
- ❌ Do NOT put server data (API responses) in a global UI store (like Redux) if React Query is available
- ❌ Do NOT use global state for something that should be local (e.g., a modal's `isOpen` state)

---

## Workflow

### Phase 1 — State Classification

Analyze the data the user wants to manage and classify it:

1. **Local UI State:** Only needed by one component (e.g., toggle button, input value).
2. **Shared UI State:** Needed by multiple components, but not saved to DB (e.g., dark mode, cart items, selected filters).
3. **Server State:** Data fetched from an API. Needs caching, refetching, and loading states.
4. **URL State:** Data that should be shareable or survive refresh (e.g., search query `?q=shoes`, current page).

---

### Phase 2 — Strategy Selection

Based on the classification and project stack (`project-audit`), choose the tool:

| State Type | Recommended Tool |
|------------|------------------|
| Local UI | `useState`, `useReducer` |
| Shared UI | Zustand, Pinia, Redux, Context API |
| Server | React Query, RTK Query, Apollo, SWR |
| URL | React Router `useSearchParams`, Next.js `useRouter` |

**Rule:** Always respect existing project conventions. If they use Redux for everything, use Redux.

---

### Phase 3 — Implementation

Generate the required code.

**Example for Server State (React Query):**
- Create query key factory
- Create custom hook (`useUserList`)
- Handle `isLoading`, `isError`, and `data`

**Example for Global UI State (Zustand):**
- Create store file (`userStore.ts`)
- Define state interface and initial values
- Define update actions (mutations)

---

### Phase 4 — Validation

- [ ] Does it update correctly without mutating state directly?
- [ ] Are unnecessary re-renders avoided?
- [ ] Is server state properly cached and invalidated after mutations?
- [ ] Is it placed in the correct directory (e.g., `src/store/` or `src/hooks/`)?

---

## Decision Tree

```
Is the data fetched from a backend API?
  ├── Yes → Use Server State (React Query / SWR / RTK Query)
  └── No  → Is the data only needed in one component and its direct children?
              ├── Yes → Use Local State (`useState`)
              └── No  → Is the data used across many distinct branches of the app?
                          ├── Yes → Use Global State (Zustand / Redux)
                          └── No  → Use Context API or lift state up
```

---

## Output Format

```
🧠 State Management Plan
─────────────────────────────────────────────────
State Type: [Server / Global UI / Local / URL]
Tool Used:  [React Query / Zustand / useState / etc.]

Implementation:
  ✅ [File 1] — [Store / Hook definition]
  ✅ [File 2] — [Component integration]

⚠️ Considerations:
  • [Note on caching, stale time, or performance]

🔗 Next Steps:
  State is ready. Use the hook in your component.
```

---

## Examples

See `examples/` folder.
