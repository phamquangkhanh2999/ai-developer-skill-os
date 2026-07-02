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
- For forms: Use React Hook Form + Zod for validation, NOT useState for each field.

## Hooks Best Practices
- **useEffect:** Avoid using `useEffect` for data transformation or syncing state. Only use it for actual side effects (subscriptions, API calls, manual DOM mutations).
- **useMemo / useCallback:** Only use when passing props to heavily memoized child components or when the computation is extremely expensive. Do not use them blindly.
- **Custom Hooks:** Extract complex logic out of UI components into custom hooks. Prefix them with `use` (e.g., `useUserAuth`).
- **Custom Hook Pattern:**
  ```ts
  // useApi.ts - Generic API hook
  export function useApi<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      fetchData();
    }, [url]);
  }
  ```

## Component Boundaries
- Follow Single Responsibility Principle. A component should either handle logic (Container) or handle rendering UI (Presentational), ideally not both if it's complex.
- Keep files under 300 lines. If a file is larger, break it down.
- **Component Hierarchy:**
  - `components/shared/` - Reusable, no business logic
  - `features/<domain>/components/` - Feature-specific components
  - `layouts/` - Page layouts and wrappers

## Performance Gotchas
- Stale Closures: Always include all reactive variables in the dependency array of `useEffect` or `useCallback`.
- Keys in Lists: Always use unique IDs for `key` props. Never use array indices unless the list is completely static.
- **Re-render Detection:**
  ```ts
  // Use console.log inside component to detect renders
  // Wrap child in React.memo if unnecessary re-renders occur
  export const MemoizedChild = React.memo(ChildComponent);
  ```

## Error Handling Patterns
```ts
// API Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
}

// Hook error handling
const { data, error, isLoading } = useQuery(['key'], fetchFn);
if (error) return <ErrorMessage error={error} />;
if (isLoading) return <LoadingSpinner />;
```

## Testing Patterns
```tsx
// Component test with React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('handles user interaction', async () => {
  render(<LoginForm />);
  const button = screen.getByRole('button', { name: /login/i });
  await userEvent.click(button);
  await waitFor(() => expect(mockSubmit).toHaveBeenCalled());
});
```
