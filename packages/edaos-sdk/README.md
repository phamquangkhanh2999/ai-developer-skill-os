# edaos-sdk

> Evidence-Driven Autonomous Engineering SDK  
> Governance, policy, and provenance for AI-powered software engineering.

[![npm version](https://img.shields.io/npm/v/edaos-sdk?style=flat-square)](https://www.npmjs.com/package/edaos-sdk)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square)](LICENSE)
[![EDAOS Compatible](https://img.shields.io/badge/EDAOS%20Compatible-L4-brightgreen?style=flat-square)](https://registry.edaos.org)
[![Spec](https://img.shields.io/badge/spec-v11.0.0-purple?style=flat-square)](https://spec.edaos.org)

---

## The core invariant

```
No Evidence  =>  No Decision  =>  No Execution
```

Every action in your system must be backed by verifiable evidence, evaluated against a policy, and recorded in an immutable journal. This SDK enforces that invariant at the type level.

---

## Install

```bash
npm install edaos-sdk
# or
pnpm add edaos-sdk
# or
yarn add edaos-sdk
```

**Requirements**: Node.js ≥ 18, TypeScript ≥ 5.0 (optional but recommended)

---

## Quick Start

```typescript
import { EDAOS } from 'edaos-sdk'

// 1. Create an EDAOS client
const edaos = new EDAOS({ identity: 'my-performance-agent' })

// 2. Observe a metric — converts raw value into a governed Evidence object
const ev = edaos.observe('LCP', 3800, 'ms')

// 3. Act only when evidence shows a violation
if (ev?.fails) {
  const result = await edaos.execute({
    action:   'optimize_lcp_loading',
    evidence: ev,
    fn:       async () => {
      // your optimization logic
      await removeRenderBlockingScripts()
    },
    rollback: async () => {
      // automatically called if fn() throws
      await restoreOriginalHTML()
    },
  })

  console.log(result.status)   // 'COMMITTED' | 'ROLLED_BACK'
  console.log(result.traceId)  // 'TRACE-1001'
}

// 4. Human veto — halts any autonomous action
edaos.veto('delete_legacy_module', 'Pending security review — Tech Lead')
```

---

## API Reference

### `new EDAOS(config)`

| Option | Type | Required | Description |
|---|---|---|---|
| `identity` | `string` | ✅ | Agent identity used in journal and permission checks |
| `certLevel` | `'L1' \| 'L2' \| 'L3' \| 'L4'` | — | Target certification level (default: `'L4'`) |
| `policies` | `Policy[]` | — | Custom policy thresholds (merged with built-ins) |
| `onJournal` | `(entry: JournalEntry) => void` | — | Hook for OpenTelemetry, Kafka, etc. |

---

### `edaos.observe(metricId, value, unit, provider?)`

Converts a raw measurement into a signed `Evidence` object by evaluating it against registered policies.

Returns `null` when no policy matches the `metricId` — this is normal and means no action is needed.

**Built-in policies:**

| metricId | Threshold | Unit | Spec |
|---|---|---|---|
| `LCP` | 2500 | ms | Core Web Vitals |
| `CLS` | 0.1 | score | Core Web Vitals |
| `INP` | 200 | ms | Core Web Vitals |
| `BUNDLE` | 250 | KB | Bundle size |
| `ERRORS` | 0 | count | Production errors |
| `BUILD` | 0 | failures | CI failures |

**Custom policy:**
```typescript
edaos.registerPolicy({
  policyId:    'POL-API-LATENCY-01',
  metricId:    'API_P99',
  threshold:   500,
  unit:        'ms',
  description: 'API P99 latency limit',
})
const ev = edaos.observe('API_P99', 850, 'ms')
```

---

### `edaos.execute(options)`

Execute an action with Saga rollback safety.

```typescript
const result = await edaos.execute({
  action:      'optimize_lcp',    // required
  evidence:    ev,                // required — throws if null
  fn:          async () => { ... }, // required — the mutation
  rollback:    async () => { ... }, // optional — called on fn() error
  alternatives: [                 // optional — rejected alternatives (provenance)
    { action: 'disable_all_cache', rejectedBy: 'security_agent', reason: 'data exposure risk' }
  ]
})
```

`result.status` values:

| Status | Meaning |
|---|---|
| `COMMITTED` | Action executed successfully |
| `ROLLED_BACK` | Action failed, rollback executed |
| `BLOCKED` | CRITICAL risk + insufficient identity role |
| `SKIPPED` | Evidence is PASS — no action needed |
| `VETOED` | Human veto applied |

---

### `edaos.veto(action, reason)`

Constitution Article 4: human veto can never be overridden.

```typescript
edaos.veto('drop_production_table', 'Unauthorized — CTO review required')
// ExecutionResult { status: 'VETOED', ... }
```

---

### Introspection

```typescript
// Journal
edaos.journal()          // readonly JournalEntry[]
edaos.journalSummary()   // { COMMITTED: 5, ROLLED_BACK: 1, ... }

// Provenance
edaos.provenanceTree()   // ASCII tree of last cycle
edaos.provenanceJSON()   // JSON for storage / export
```

---

## Advanced: Sub-path imports (tree-shakeable)

```typescript
import { EvidenceEngine }  from 'edaos-sdk/evidence'
import { PolicyEngine }    from 'edaos-sdk/policy'
import { ProvenanceGraph } from 'edaos-sdk/provenance'
```

---

## Advanced: OpenTelemetry integration

```typescript
import { trace } from '@opentelemetry/api'
import { EDAOS } from 'edaos-sdk'

const tracer = trace.getTracer('my-service')

const edaos = new EDAOS({
  identity: 'my-agent',
  onJournal: (entry) => {
    const span = tracer.startSpan(`edaos.${entry.action}`)
    span.setAttributes({
      'edaos.trace_id':  entry.traceId,
      'edaos.status':    entry.status,
      'edaos.evidence':  entry.evidenceSignature,
    })
    span.end()
  },
})
```

---

## Conformance

This SDK is **EDAOS L4 Compatible**.

To verify your integration:

```bash
npx edaos-sdk conform   # runs L1-L4 conformance suite
```

Or via GitHub Actions:
```yaml
- uses: edaos-foundation/edaos-conformance-action@v11
  with:
    min-level: L4
```

---

## License

Apache-2.0 © [EDAOS Foundation](https://edaos.org)

Specification: [spec.edaos.org](https://spec.edaos.org) — CC BY 4.0  
Registry: [registry.edaos.org](https://registry.edaos.org)
