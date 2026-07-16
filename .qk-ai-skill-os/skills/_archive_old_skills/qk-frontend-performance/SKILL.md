---
name: qk-frontend-performance
description: >-
  Tối ưu hóa hiệu năng frontend: giảm kích thước bundle, chặn re-render thừa, lazy load và cải thiện Web Vitals.
version: 1.0.0
category: frontend
tags: [performance, optimization, render, bundle-size, lazy-load, memoization]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Frontend Performance Optimizer

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User reports "app is slow", "loading takes too long", or "UI freezes"
- Core Web Vitals (LCP, FID/INP, CLS) are failing
- React DevTools shows excessive re-renders
- `project-audit` flags a performance issue (P2)
- Need to optimize images, bundle size, or data fetching

---

## Scope

- ✅ **Render Optimization:** Prevent unnecessary re-renders (React `memo`, `useMemo`, `useCallback`).
- ✅ **Bundle Optimization:** Code splitting, lazy loading components/routes (`React.lazy`, Next.js `dynamic`).
- ✅ **Asset Optimization:** Image optimization (WebP, Next/Image, lazy loading `loading="lazy"`).
- ✅ **Data Fetching:** Caching, prefetching, pagination, virtualization for large lists.
- ✅ **Core Web Vitals:** Fix layout shifts (CLS), improve Largest Contentful Paint (LCP).

---

## Non-goals

- ❌ Do NOT blindly wrap everything in `useMemo` or `React.memo` (this can degrade performance).
- ❌ Do NOT optimize prematurely if there is no measured performance issue.
- ❌ Do NOT rewrite business logic unless it is the direct cause of the bottleneck.

---

## Workflow

### Phase 1 — Identify the Bottleneck

Determine what kind of performance issue it is:
1. **Network/Load Time:** Slow initial page load, large bundle size, heavy images.
2. **Render/Runtime:** UI is sluggish, typing lags, animation stutters (too many re-renders).
3. **Data/Memory:** App crashes or slows down over time, large lists lagging.

### Phase 2 — Common Fixes by Category

#### 1. Fixing Unnecessary Re-renders (React)
- Move state down to the smallest possible component.
- Use `React.memo` for heavy pure components that receive the same props.
- Stable references: Use `useMemo` for expensive calculations or object props, and `useCallback` for function props passed to memoized children.
- *Warning:* Measure first! Memoization has an upfront cost.

#### 2. Fixing Bundle Size (Code Splitting)
- Are large libraries (like `lodash`, `moment`, `echarts`) imported entirely? Use named imports or alternative libraries.
- Lazy load routes or heavy components below the fold:
  ```typescript
  const HeavyChart = React.lazy(() => import('./HeavyChart'));
  // Wrap in <Suspense fallback={<Spinner />}>
  ```

#### 3. Asset & UI Optimization
- Add fixed `width` and `height` to images to prevent Cumulative Layout Shift (CLS).
- Virtualize large lists (e.g., `react-window` or `@tanstack/react-virtual`) instead of rendering 1000 DOM nodes.
- Debounce rapid events (typing in search, window resize).

---

### Phase 3 — Implementation

Apply the targeted fix. Document why the fix improves performance.

---

## Decision Tree

```
Is the issue related to initial load time?
  ├── Yes → Focus on Code Splitting (lazy loading), Image Optimization, and bundle size reduction.
  └── No  → Is the UI lagging during interaction?
              ├── Yes → Profile renders. Check for state updates triggering massive re-renders. Use `memo` or state colocation.
              └── No  → Is a specific list or table slow?
                          ├── Yes → Implement virtualization (react-window) or pagination.
```

---

## Output Format

```
⚡ Performance Optimization Report
─────────────────────────────────────────────────
Target:      [Component / Page]
Bottleneck:  [Brief description, e.g., "Expensive list rendering on every keystroke"]

🔧 Fixes Applied:
  ✅ Extracted Search Input state to prevent list re-rendering
  ✅ Wrapped heavy `ChartComponent` in `React.memo`
  ✅ Lazy-loaded below-the-fold content (`Suspense`)

📈 Expected Impact:
  - Reduced re-renders on typing from O(N) to O(1)
  - Initial JS bundle size reduced by ~X KB

⚠️ Notes:
  Please test this on lower-end devices to confirm smooth interactions.
```

---

## Validation Checklist

- [ ] Fix addresses the specific bottleneck
- [ ] No premature memoization applied blindly
- [ ] Layout shift (CLS) prevented (if changing images/layout)
- [ ] Application behavior remains completely unchanged

