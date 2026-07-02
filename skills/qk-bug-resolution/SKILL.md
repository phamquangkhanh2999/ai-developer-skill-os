---
name: qk-bug-resolution
version: 3.1.4
updated: 2026-07-02
description: Fix bugs and prevent regressions.
category: engineering
behavior: development
intent: fix-bug
priority: high
tags: [bug, debug, regression]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User reports an error or crash.
inputs: [Error log, Bug description, File path]
outputs: [Fixed code, Verification report]
allowed_tools: [run_command, read_file, grep_search]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-bug-resolution - Standard Operating Procedure

> **Goal:** Định vị nguyên nhân, sửa lỗi triệt để, và đảm bảo lỗi không bị lặp lại (Regression Prevention).

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Root Cause Analysis):**
   - Read the provided error log or bug description.
   - Trace the error to the exact file and line of code.
   - Identify if the bug is a syntax error, logic error, state issue, or boundary case.
2. **Plan (Fix Strategy):**
   - Determine the minimal change required to fix the bug.
   - If the bug is UI-related, refer to frontend knowledge (e.g., `knowledge/frontend/react.md`).
3. **Execute (Implement Fix):**
   - Modify the source code exactly where needed.
   - Do NOT rewrite unrelated code blocks.
4. **Verify (Validation):**
   - Provide steps to test the fix.
   - Ensure backward compatibility.

## 🛡️ 3. Constraints & Rules

- **No Guesses:** Do not assume the shape of an API response. Print it or read the type definitions first.
- **Minimal Fix:** Always prefer a 1-line fix over a 100-line refactor, unless the architecture is fundamentally broken.
- **Clean Up:** Remove any `console.log()` or debugger statements introduced during the debugging process.

## 🌳 3. Decision Tree

```text
Is there a Stack Trace?
  ├── YES → Use grep_search to find the exact file and line number.
  └── NO → Ask the user for the file path or use grep_search with keywords from the bug description.

Is the bug related to State/Re-rendering?
  ├── YES → Load `knowledge/frontend/react.md` to check for stale closures or missing dependencies.
  └── NO → Proceed with standard logic debugging.
```

## 🤝 4. Handoff Pipeline

After implementing the fix, map to the pipeline:

1. `engineering-standard`: Ensure the fix follows naming and architecture rules.
2. `validate`: Run linters and tests (via `qk-validation-gate` equivalent).
3. `complete`: Output the final report.

## 📝 5. Output Format

Vui lòng sử dụng template `templates/bug-report.md` (Báo Cáo Xử Lý Lỗi) để phản hồi lại cho người dùng bằng Tiếng Việt. Nội dung bao gồm:

- Summary
- Changes
- Root Cause
- Verification
- Risks
- Next Action
