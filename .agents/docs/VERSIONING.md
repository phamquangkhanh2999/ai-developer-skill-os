# Versioning Policy — AI Developer Skill OS

## Current release line

The current package is `12.0.0` and supports Antigravity only. Component skill/rule versions are independent of the package version and change only when that component's contract or behavior changes.

## Semantic versioning

- **MAJOR:** remove a supported platform, change the package contract, or make an incompatible migration.
- **MINOR:** add backward-compatible package capability or a new core skill.
- **PATCH:** focused fixes and compatible documentation/validation updates.

For skill components, use the same SemVer principles at the skill boundary. Keep a version bump coupled to the component change and regenerate registry artifacts after metadata updates.

## Antigravity runtime contract

The package installs Antigravity configuration only. Native skill discovery and rule activation are defined by Antigravity's current documented format; internal tests validate the repository contract but do not prove model routing in the live application. Subagent use remains conditional on the active runtime toolset and permissions.

There is no YAML workflow runtime in the current package. Do not add workflow frontmatter or workflow tooling as a second execution system; express task procedures in skills and reusable policy in rules/references.

## Validation before release

```bash
npm run lint
npm run test:graph
npm test
npm pack --dry-run --json
```

Run installer tests in an isolated temporary workspace. Do not publish unless the package contents, version availability, and release checks have been reviewed.

## Historical release guides

Documents under `releases/` record the behavior of earlier package versions. Their platform lists and workflow terminology are historical and must not be used as current setup instructions.
