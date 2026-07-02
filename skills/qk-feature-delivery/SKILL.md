---
name: qk-feature-delivery
description: Phân tích, Code và Test tính năng mới hoàn chỉnh (E2E).
mode_supported: [quick, standard, enterprise]
input: [Feature requirement]
output: [Completed feature code, tests]
workflow: [1. Requirement -> 2. Design -> 3. DB -> 4. API -> 5. UI -> 6. Test]
allowed_tools: [write_to_file, run_command]
handoff_to: [qk-validation-gate]
---

# 🛠️ qk-feature-delivery - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Phân tích, Code và Test tính năng mới hoàn chỉnh (E2E).

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
- Đích đến: `qk-validation-gate`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Form Builder

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User says "create a login form", "add a settings page", "build a contact form"
- User provides a data model and needs a UI to create/edit it
- A form needs complex validation logic added
- Refactoring a messy form into a structured library pattern (e.g., React Hook Form)

---

## Scope

- ✅ Define the form data schema and validation rules
- ✅ Manage form state efficiently (preventing unnecessary re-renders)
- ✅ Map form fields to the project's design system components
- ✅ Handle submission state (loading, success, error)
- ✅ Handle validation errors and display them accessibly
- ✅ Integrate with `api-integration` for submission

---

## Non-goals

- ❌ Do NOT reinvent form state management if a library is present
- ❌ Do NOT use raw HTML inputs if design system components exist
- ❌ Do NOT skip validation (client-side validation is required)

---

## Workflow

### Phase 1 — Schema Design

Define the exact shape of the data the form collects.
Determine validation rules for each field (required, min length, email format, etc.).

If the project uses Zod, Yup, or Joi, define the schema first.
*Example:*
```typescript
const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```

---

### Phase 2 — State Management Selection

Check project dependencies for form libraries:
1. `react-hook-form` (Preferred for React)
2. `formik`
3. Custom Vue/Svelte bindings
4. Standard controlled components (`useState`) if no library exists and form is simple.

---

### Phase 3 — Component Assembly

1. Set up the form wrapper and submission handler.
2. For each field in the schema, render the appropriate UI component (from `design-system`).
3. Connect the UI component to the form state (register / Controller).
4. Render error messages below fields if validation fails.

---

### Phase 4 — Submission & Integration

- Add `isLoading` state to the submit button.
- Disable submit button during submission.
- On success: Show success message or redirect, and optionally reset form.
- On error: Display backend error messages (toast or form-level alert).

---

## Decision Tree

```
Does the project use a validation library (Zod, Yup)?
  ├── Yes → Use it to define schema and pass to form resolver
  └── No  → Implement standard HTML5 validation or simple manual validation logic

Is it a complex multi-step form (wizard)?
  ├── Yes → Break into sub-components, use global or lifted state for form data
  └── No  → Handle state locally within the single form component
```

---

## Output Format

```
📝 Form Built
─────────────────────────────────────────────────
Name:     [FormName]
Schema:   [Zod / Yup / Manual]
Library:  [React Hook Form / Formik / Native]

Fields Implemented:
  ✅ email (string, required, email)
  ✅ password (string, required, min: 8)

Integration:
  - Validation: Client-side wired up
  - Submission: Wired to `[submitFunction]`
  - Loading UI: Handled on submit button

🔗 Next Steps:
  Make sure the API endpoint is ready to accept this payload.
```

---

## Validation Checklist

- [ ] Form uses existing design system components (Inputs, Buttons)
- [ ] Client-side validation is implemented
- [ ] Error messages are displayed properly
- [ ] Loading state disables the submit button
- [ ] Accessibility: Inputs have associated labels and error ARIA attributes

---



# Table & CRUD Generator

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User says "create an admin table", "build a user list", "add data grid"
- User needs a view to manage a list of entities with CRUD capabilities
- A feature requires complex data presentation (sorting, filtering, pagination)

---

## Scope

- ✅ Generate a data table using design system components or libraries (e.g., TanStack Table)
- ✅ Implement client-side or server-side pagination, sorting, and filtering
- ✅ Add UI actions for Create, Edit, and Delete (modals or routing)
- ✅ Integrate with `api-integration` hooks for data fetching and mutations
- ✅ Handle loading, error, and empty states gracefully

---

## Non-goals

- ❌ Do NOT build the backend API for the CRUD operations (assume they exist or delegate)
- ❌ Do NOT use raw `<table>` tags if a powerful data-grid library is already installed

---

## Workflow

### Phase 1 — Data Model & Requirements

1. Understand the entity (e.g., `User`, `Product`).
2. Identify columns to display.
3. Determine operations needed (e.g., just Read/Delete, or full CRUD).
4. Decide on Pagination strategy: Server-side (URL params) or Client-side (in-memory).

---

### Phase 2 — Table Component Setup

1. Check for table libraries (e.g., `@tanstack/react-table`, MUI DataGrid, AntD Table).
2. Define column definitions (headers, accessor keys, cell formatters).
3. Set up the table UI wrapper.

---

### Phase 3 — Data Integration

Connect to the state/API layer (e.g., React Query).
- `useQuery` for fetching the list. Pass pagination/sorting state.
- Handle `isLoading` → show skeleton or spinner.
- Handle empty data → show empty state component.

---

### Phase 4 — CRUD Actions

Implement actions (usually in an "Actions" column or toolbar):
- **Create:** Button opening a Modal (delegate to `form-builder`) or routing to `/new`.
- **Edit:** Button opening an Edit Modal or routing to `/edit/:id`.
- **Delete:** Button opening a confirmation dialog, calling delete mutation on confirm.

---

## Decision Tree

```
Is the dataset large (requires backend pagination)?
  ├── Yes → Implement Server-side pagination (sync state with URL search params)
  └── No  → Implement Client-side pagination (fetch all once, slice in UI)

Does the project use TanStack Table (React Table)?
  ├── Yes → Use `useReactTable` to manage table state and column definitions
  └── No  → Use the project's specific UI library table component
```

---

## Output Format

```
📊 Table & CRUD Generated
─────────────────────────────────────────────────
Entity:     [Entity Name]
Features:   [Pagination (Server), Sorting, CRUD actions]

Components Created:
  ✅ [Entity]Table.tsx
  ✅ [Entity]Columns.tsx
  ✅ DeleteConfirmModal.tsx

Integration:
  - Fetching: Linked to `use[Entity]List` hook
  - Mutations: Linked to Create/Update/Delete hooks

🔗 Next Steps:
  If Create/Edit forms are needed, delegate to `form-builder`.
```

---

## Validation Checklist

- [ ] Columns are defined correctly
- [ ] Loading and empty states are handled
- [ ] Pagination/sorting state is managed properly
- [ ] CRUD actions trigger the correct mutations or navigations
- [ ] Delete actions have a confirmation step

---



# Frontend Testing

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User asks to "write tests for this", "add unit tests", or "test this component"
- Fixing a critical bug where a regression test is required
- Preparing for a major release and increasing test coverage
- Project audit flags missing tests for core business logic

---

## Scope

- ✅ **Unit Tests:** Test pure functions, utilities, and custom hooks.
- ✅ **Component Tests:** Test UI components using React Testing Library (RTL). Focus on user interactions and accessibility roles.
- ✅ **Mocking:** Mock API calls (MSW, Jest mocks), modules, and timers.
- ✅ **E2E Tests:** Write Cypress or Playwright tests for critical user flows.
- ✅ Follow the project's existing testing framework (Jest vs Vitest).

---

## Non-goals

- ❌ Do NOT test implementation details (e.g., checking if a specific state variable changed). Test what the user sees/does.
- ❌ Do NOT write brittle tests (e.g., querying by CSS class names). Use ARIA roles or `data-testid`.
- ❌ Do NOT introduce a new testing framework if one already exists.

---

## Workflow

### Phase 1 — Environment Check

Identify the testing stack:
- Runner: Jest or Vitest?
- DOM: React Testing Library, Vue Test Utils?
- E2E: Cypress, Playwright?
- Mocking: MSW (Mock Service Worker), `jest.mock`, `vi.mock`?

---

### Phase 2 — Strategy & Coverage

Determine what needs testing:
1. **Critical Path:** Can the user complete the primary action?
2. **Edge Cases:** What happens on API failure? Empty state? Invalid input?
3. **Accessibility:** Can elements be found by role?

---

### Phase 3 — Writing the Test (RTL Example)

1. **Setup:** Render the component, wrap with necessary providers (Theme, Store, QueryClient).
2. **Query:** Find elements using `screen.getByRole`, `screen.getByLabelText`, or `screen.getByText`.
3. **Act:** Simulate user events using `userEvent` (preferred over `fireEvent`).
4. **Assert:** Expect elements to be in the document, disabled, or display specific text.

*Example:*
```typescript
it('submits the form when fields are valid', async () => {
  const mockSubmit = vi.fn();
  render(<LoginForm onSubmit={mockSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

---

### Phase 4 — Mocking

If the component makes API calls:
- Prefer MSW (Mock Service Worker) for network-level mocking.
- Fallback: Mock the API service module or custom hook.

---

## Decision Tree

```
Are we testing a pure function or utility?
  ├── Yes → Write a standard Unit Test (Jest/Vitest).
  └── No  → Are we testing a UI component?
              ├── Yes → Use React Testing Library (focus on user behavior).
              └── No  → Are we testing a full page flow?
                          ├── Yes → Write an E2E test (Cypress/Playwright) or integration test.
```

---

## Output Format

```
🧪 Test Suite Generated
─────────────────────────────────────────────────
Target:     [ComponentName or Utility]
Type:       [Unit / Component / E2E]
Framework:  [Vitest + RTL]

Tests Added:
  ✅ renders correctly in default state
  ✅ displays error message on API failure
  ✅ successfully submits user data

Mocking Used:
  - MSW handlers for `/api/users`
  - vi.fn() for onSubmit callback

🔗 Next Steps:
  Run `npm run test` to execute the suite.
```

---

## Validation Checklist

- [ ] Queries use accessible methods (`getByRole`, `getByLabelText`)
- [ ] Events simulated with `userEvent` (if applicable)
- [ ] External dependencies/APIs are properly mocked
- [ ] Tests verify observable behavior, not internal state
