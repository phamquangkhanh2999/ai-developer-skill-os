# V8 Migration Protocol

Every migrated skill MUST meet the following criteria before being marked as `status: stable`:

- [ ] **Preserve original capability**: Do not alter the core instructions and behavior of the skill unless fixing bugs.
- [ ] **Add V8 frontmatter**: Update the frontmatter strictly according to `_template/SKILL.md`.
- [ ] **Map workflow**: Ensure `workflow` references an existing V8 workflow (e.g. `feature-delivery`, `bug-resolution`, `code-review`).
- [ ] **Define verification**: Include the `verification` block with a valid `strategy`.
- [ ] **Define selection**: Include the `selection` block with `priority` and appropriate `confidence_threshold`.
- [ ] **Generate registry successfully**: Must pass schema validation in `node tooling/validate-skills.js` and `node tooling/generate-registry.js` without warnings.
