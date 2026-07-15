# DESIGN.md - The Brand Contract

> **CRITICAL RULE:** This file is the Single Source of Truth for all UI/UX in this project. 
> Any AI agent performing frontend work MUST adhere strictly to the rules, tokens, and components defined here. 
> DO NOT invent generic Tailwind colors or default layouts. DO NOT use "slop" AI aesthetics.

## 1. Typography
- **Primary Font:** [Specify Font Family, e.g., Inter, Roboto]
- **Heading Font:** [Specify Font Family if different]
- **Base Size:** [e.g., 16px]
- **Scale:** [e.g., Major Third (1.25) or Perfect Fourth (1.333)]

## 2. Color Palette (Strict Constraints)
- **Primary:** HSL(xxx, xx%, xx%)
- **Secondary:** HSL(xxx, xx%, xx%)
- **Background (Light):** HSL(xxx, xx%, xx%)
- **Background (Dark):** HSL(xxx, xx%, xx%)
- **Text (Light/Dark):** HSL(xxx, xx%, xx%)
- **Forbidden Colors:** [e.g., Default Tailwind `blue-500`, `red-500`. NEVER use default primary colors].

## 3. Spacing & Grid System
- **Base Unit:** [e.g., 4px / 0.25rem]
- **Grid Layout:** [e.g., 12-column grid, max-width: 1280px]
- **Whitespace Rule:** Always favor generous whitespace (whitespace is cheap, clutter is expensive).

## 4. UI Components & Micro-interactions
- **Border Radius:** [e.g., 8px for cards, 4px for buttons, 9999px for pills]
- **Shadows/Elevation:** [Define soft, organic shadows; avoid harsh, generic drop shadows]
- **Animations:** [e.g., 200ms ease-out for hover states, use micro-animations for button presses].

## 5. Anti-Slop Guidelines (Hallmark Rules)
- **NO Default Borders:** Avoid adding a 1px solid border to everything. Use background color shifts or soft shadows instead.
- **NO Cluttered Forms:** Forms must have clear visual hierarchy, grouped inputs, and explicit focus states.
- **NO Floating Elements:** Elements must be anchored visually to a grid.
- **MUST Check Contrast:** All text must meet WCAG AA contrast ratios.

---
*Note to AI Agent: If you are about to emit code that violates these rules, STOP. Redesign it, run an [AUDIT], and apply the correct constraints.*
