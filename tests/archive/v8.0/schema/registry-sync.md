# Schema Test: Registry Sync

## Input
A modified `SKILL.md` (e.g., changed triggers or intent) where `generate-registry.js` was NOT run afterwards.

## Expected Decision Contract
```yaml
decision:
  action: report_drift
  reason: "Registry index is outdated compared to source SKILL.md files"
```

## Pass Criteria
- A validation step (e.g., CI script or pre-commit hook) MUST detect that `registry/skills-index.yml` is out of sync.
- System prompts the user or CI fails instructing to run `node tooling/generate-registry.js`.
