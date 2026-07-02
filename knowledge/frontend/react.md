---
id: react-knowledge-base
domain: frontend
tags: [react, hooks, components, state]
priority: high
---

# React Knowledge Base

## State Management Rules
- Use `useState` for strictly local UI state (e.g., dropdown toggle).
- Use `useContext` or global stores (Zustand/Redux) when prop drilling exceeds 3 levels.
- Never store derived data in state. Compute it on the fly during render.
- Never store API responses in Redux if a Server State tool (React Query/SWR) is available.

## Hooks Best Practices
- **useEffect:** Avoid using `useEffect` for data transformation or syncing state. Only use it for actual side effects (subscriptions, API calls, manual DOM mutations).
- **useMemo / useCallback:** Only use when passing props to heavily memoized child components or when the computation is extremely expensive. Do not use them blindly.
- **Custom Hooks:** Extract complex logic out of UI components into custom hooks. Prefix them with `use` (e.g., `useUserAuth`).

## Component Boundaries
- Follow Single Responsibility Principle. A component should either handle logic (Container) or handle rendering UI (Presentational), ideally not both if it's complex.
- Keep files under 300 lines. If a file is larger, break it down.

## Performance Gotchas
- Stale Closures: Always include all reactive variables in the dependency array of `useEffect` or `useCallback`.
- Keys in Lists: Always use unique IDs for `key` props. Never use array indices unless the list is completely static.
