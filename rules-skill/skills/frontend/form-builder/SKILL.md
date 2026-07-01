---
name: form-builder
description: >-
  Xây dựng Form chuẩn xác với quản lý trạng thái, validate dữ liệu (Zod, Yup) và xử lý hiển thị lỗi.
version: 1.0.0
category: frontend
tags: [form, validation, react-hook-form, zod, yup, formik]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Form Builder

> **Language rule:**
> Use **English** for: field names, validation rules, code, technical concepts.
> Use **the user's language** for: explanations, error message text (unless specified otherwise), and summaries.

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
