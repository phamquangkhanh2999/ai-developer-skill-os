---
name: state-management
description: >-
  Xác định và triển khai chiến lược quản lý state phù hợp (Zustand, Redux, React Query, Local State).
version: 1.0.0
category: frontend
tags: [state, redux, zustand, react-query, context, pinia, data-flow]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# State Management

> **Language rule:**
> Use **English** for: code, store names, action types, library names.
> Use **the user's language** for: explanations, summaries, and questions.

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
