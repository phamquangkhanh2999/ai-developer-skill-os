---
name: frontend-testing
description: >-
  Viết Unit, Component và E2E test bằng Jest, Vitest, RTL, Cypress. Tập trung vào hành vi người dùng.
version: 1.0.0
category: frontend
tags: [testing, jest, vitest, react-testing-library, cypress, playwright, tdd]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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
