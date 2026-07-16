---
name: qk-table-crud-generator
description: >-
  Tạo các bảng dữ liệu admin với đầy đủ tính năng phân trang, sắp xếp, lọc và thao tác thêm/sửa/xóa (CRUD).
version: 1.0.0
category: frontend
tags: [table, data-grid, crud, admin, pagination, sorting]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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

