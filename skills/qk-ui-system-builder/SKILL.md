---
name: qk-ui-system-builder
purpose: Quản lý Design System, Component Library, Consistency.
mode_supported: [standard, enterprise]
input: [UI constraints]
output: [Reusable UI components/Tokens]
workflow: [1. Check Token -> 2. Check Pattern -> 3. Generate Component]
allowed_tools: [write_to_file, read_file]
handoff_to: [none]
---

# 🛠️ qk-ui-system-builder - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Quản lý Design System, Component Library, Consistency.

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
- Đích đến: `none`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Design System Enforcer

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- About to build UI screens or components
- Styling or layout work is required
- User asks to "make it look good" or "match the design"
- Integrating a third-party UI library (Tailwind, MUI, AntD, Shadcn)

---

## Scope

- ✅ Identify the UI library or design system in use
- ✅ Map standard HTML elements to project-specific components (e.g., `<button>` → `<Button>`)
- ✅ Enforce usage of design tokens (colors, spacing, typography) instead of hardcoded values
- ✅ Provide available component variants and props to downstream skills (`ui-builder`)
- ✅ Prevent generation of raw CSS/inline styles if utility classes or styled-components are standard

---

## Non-goals

- ❌ Do NOT create new base components if an equivalent already exists
- ❌ Do NOT introduce a new styling method (e.g., don't add Tailwind if project uses CSS Modules)
- ❌ Do NOT design full pages (delegate to `ui-builder`)

---

## Workflow

### Phase 1 — Detect Design System

Analyze dependencies and project files to identify:
1. **Component Library:** Shadcn UI, MUI, Ant Design, Chakra, Bootstrap, custom internal library?
2. **Styling Method:** Tailwind CSS, CSS Modules, Styled Components, Emotion, SCSS, Vanilla CSS?
3. **Location of Shared Components:** Usually `src/components/ui/`, `src/shared/components/`, or from an npm package.
4. **Design Tokens:** `tailwind.config.js`, `theme.ts`, `variables.scss`.

---

### Phase 2 — Component Mapping

Before `ui-builder` generates code, create a mapping table for required elements:

| Standard Element | Project Component | Source / Import Path |
|------------------|-------------------|----------------------|
| `<button>` | `<Button>` | `@/components/ui/button` |
| `<input type="text">` | `<Input>` | `@/components/ui/input` |
| `<div>` (Card) | `<Card>` | `@/components/ui/card` |
| `<h1>` | `<Typography variant="h1">` | `@mui/material` |

---

### Phase 3 — Token Extraction

Identify available tokens for spacing, colors, and typography to avoid hardcoding:
- *Instead of:* `margin-top: 16px; color: #3b82f6;`
- *Use:* `mt-4 text-blue-500` (Tailwind) or `theme.spacing(2)` (MUI) or `var(--primary-color)`.

---

### Phase 4 — Rule Enforcement

Pass strict instructions to `ui-builder` or `component-generator`:
- "You MUST use `<Button>` instead of `<button>`."
- "You MUST use Tailwind classes for all styling. No inline `style={{}}` allowed."

---

## Decision Tree

```
Does the project use a component library (e.g., Shadcn, MUI)?
  ├── Yes → Is the required component available?
  │           ├── Yes → Require its use
  │           └── No  → Instruct `component-generator` to create it following library style
  └── No  → Check if custom shared components exist
              ├── Yes → Map to custom shared components
              └── No  → Use raw HTML but enforce project's styling method (e.g., Tailwind)

Does the project use utility classes (Tailwind)?
  ├── Yes → Forbid inline styles or custom CSS files
  └── No  → Enforce existing CSS Modules / Styled Components patterns
```

---

## Output Format

```
🎨 Design System Rules
─────────────────────────────────────────────────
Library:        [Shadcn / MUI / Tailwind / Custom / etc.]
Styling Method: [Tailwind / CSS Modules / Styled Components]

Component Mapping for this task:
  ✅ Button  → `<Button>` from `@/components/ui/button`
  ✅ Input   → `<Input>` from `@/components/ui/input`
  ✅ Layout  → Flexbox with Tailwind (`flex flex-col gap-4`)

Styling Rules Enforced:
  • No raw HTML `<button>` allowed
  • No inline styles allowed
  • Use primary color token for CTAs

🔗 Next Steps:
  Passing these rules to `ui-builder` to generate the UI.
```

---

## Validation Checklist

- [ ] Design system and styling method correctly identified
- [ ] Mappings created for all necessary UI elements
- [ ] Design tokens (spacing/colors) prioritized over hardcoded values
- [ ] Strict enforcement rules passed to next skill

---



# UI Builder

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User wants to create a new page, screen, or view
- User provides a mockup, wireframe, or visual description
- User asks to "build a layout", "create a dashboard", "make the profile page"
- Refactoring a large, messy view into a structured layout

---

## Scope

- ✅ Translate requirements into a component hierarchy
- ✅ Build layouts using Grid, Flexbox, and project styling conventions
- ✅ Ensure responsive design (mobile-first or desktop-first based on project)
- ✅ Integrate existing shared components (Buttons, Cards, Inputs) via `design-system` rules
- ✅ Define placeholders for data and logic (to be filled by `api-integration` or `state-management`)

---

## Non-goals

- ❌ Do NOT build backend APIs
- ❌ Do NOT implement complex global state (delegate to `state-management`)
- ❌ Do NOT invent new core UI components if they already exist in the design system
- ❌ Do NOT write raw HTML (`<button>`) if a shared component (`<Button>`) exists

---

## Workflow

### Phase 1 — Requirement Analysis

1. Understand the goal: What screen are we building?
2. Identify major sections: Header, Sidebar, Main Content, Footer, Modals.
3. Identify data requirements: What data will populate this view? (Use mock data initially).

---

### Phase 2 — Component Hierarchy Planning

Break the screen down into smaller components.
**Rule of thumb:** If a section has complex logic or is reusable, it should be a separate component.

*Example:*
```text
UserProfilePage
  ├── ProfileHeader
  │     ├── Avatar
  │     └── UserStats
  ├── UserSettingsForm (delegate to form-builder)
  └── UserActivityList
```

---

### Phase 3 — Design System Integration

*(Relies on output from `design-system` skill)*
Identify which existing components will be used for each part of the hierarchy.

- Buttons → `<Button>`
- Layouts → `<Container>`, `<Grid>`
- Typography → `<Typography variant="h2">` or Tailwind text classes

---

### Phase 4 — Implementation

Write the code.
1. Build the layout skeleton first (Flexbox/Grid).
2. Add static/mock data to visualize the structure.
3. Apply styling for layout, spacing, and typography.
4. Ensure responsive behavior (e.g., stack columns on mobile).

---

### Phase 5 — Validation

- [ ] Does it match the requirements?
- [ ] Is it responsive?
- [ ] Does it strictly use the design system?
- [ ] Is the code clean and well-structured (not one giant file)?

---

## Decision Tree

```
Is a section of the UI highly complex or forms a distinct logical unit?
  ├── Yes → Extract it into its own component file (e.g., `ProfileHeader.tsx`)
  └── No  → Keep it inline in the main layout file for now

Does a required base component (e.g., DatePicker) exist in the project?
  ├── Yes → Import and use it
  └── No  → Use a standard HTML fallback or instruct `component-generator` to build it later

Is the UI data-heavy (like a complex form or table)?
  ├── Yes → Delegate specific sections to `form-builder` or `table-crud-generator`
  └── No  → Build it fully within `ui-builder`
```

---

## Output Format

```
🎨 UI Builder Summary
─────────────────────────────────────────────────
Screen:     [Name of the screen/view built]

Component Hierarchy:
  [Tree showing parent and child components]

📁 Files Created/Modified:
  ✅ [path/to/Page.tsx]
  ✅ [path/to/SubComponent.tsx]

🛠️ Implementation Details:
  - Responsive: [Yes - describe breakpoints used]
  - Mock Data:  [Added placeholders for API integration]

🔗 Next Steps:
  → Need to wire up API? Route to `api-integration`.
  → Need complex state? Route to `state-management`.
```

---

## Examples

See `examples/` folder.

---



# Component Generator

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User says "create a Card component", "make a reusable Button", "extract this into a component"
- A larger skill (`ui-builder`, `form-builder`) requires a new isolated UI piece to be built
- Refactoring a large component by splitting it into smaller, reusable parts

---

## Scope

- ✅ Generate a single, focused component (e.g., `UserCard`, `StatBadge`, `Dropdown`)
- ✅ Define strict, explicit types/interfaces for all props
- ✅ Implement component variants (e.g., `size`, `color`, `variant`) if needed
- ✅ Follow project styling rules (Tailwind, CSS Modules, Styled Components)
- ✅ Ensure accessibility (ARIA attributes, semantic HTML) where applicable

---

## Non-goals

- ❌ Do NOT build full pages or complex screens (delegate to `ui-builder`)
- ❌ Do NOT handle complex business logic or data fetching inside a dumb/presentational component
- ❌ Do NOT overwrite existing components without explicit instruction

---

## Workflow

### Phase 1 — Component Design

Determine:
1. **Name:** PascalCase (e.g., `ProductCard`).
2. **Responsibility:** What exactly does this component do? Keep it single-responsibility.
3. **Props:** What data does it need from its parent? What events does it emit?

---

### Phase 2 — API (Props) Definition

Draft the interface first.
- Make required props explicit.
- Use optional props (`?`) for variants or non-essential data.
- Avoid `any`.

*Example:*
```typescript
interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  onAddToCart: (id: string) => void;
}
```

---

### Phase 3 — Implementation

Write the component code.
1. Use destructuring for props.
2. Apply styling based on `design-system` rules.
3. Handle empty/null states (e.g., if `imageUrl` is missing, show a placeholder).
4. Add basic interactivity (e.g., calling `onAddToCart` when clicked).

---

### Phase 4 — Validation

- [ ] Are all props typed correctly?
- [ ] Is it truly reusable (no hardcoded data)?
- [ ] Does it use project design tokens?
- [ ] Is it exported correctly according to project conventions (default vs. named export)?

---

## Decision Tree

```
Does the component need to manage its own state (e.g., an accordion opening/closing)?
  ├── Yes → Add local state (`useState`). Keep it minimal.
  └── No  → Make it a pure "dumb" component receiving props.

Are there multiple visual styles requested (e.g., primary, secondary, outline)?
  ├── Yes → Add a `variant` prop and map it to style classes.
  └── No  → Implement the single required style.
```

---

## Output Format

```
🧩 Component Generated
─────────────────────────────────────────────────
Name:     [ComponentName]
Path:     [path/to/Component.tsx]

Props Interface:
  [List key props here briefly]

Features:
  • [Feature 1, e.g., "Supports primary/secondary variants"]
  • [Feature 2, e.g., "Fully typed with TypeScript"]

🔗 Next Steps:
  Component is ready to be imported into your layout.
```

---

## Examples

See `examples/` folder.
