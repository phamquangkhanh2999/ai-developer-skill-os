# Agent Boundary Interface: Serialization & Schema Generation Rules

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This serialization governance specification is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), immutability rules in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), and evolution guidelines in [abi/versioning.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/versioning.md).

---

## 1. Fundamental Principle: Unidirectional Derivation

To guarantee that serialization encodings (such as JSON, Protobuf, or YAML) never usurp architectural authority or lock the runtime into obsolete transport technologies, all concrete syntax validation schemas MUST be generated strictly through unidirectional derivation:

```
[ Canonical Semantic Model ] + [ Generation Rules ]
                    │
                    ▼  compiles via
           [ Schema Generator ]
                    │
                    ▼  emits read-only target
         [ Generated Schema Artifacts ]
```

### 1.1 Normative Schema Governance Laws
1. **Schema as Build Artifact**:
   ```markdown
   Generated schemas are artifacts.
   Source of truth: Canonical Model + Generation Rules.
   Schemas MUST NOT be edited manually.
   ```
   Any direct manual alteration performed upon a generated validator file within `schemas/generated/` is considered a high-severity boundary compliance violation. Build CI engines MUST verify schema cryptographic hashes against canonical source derivations and reject any pull request presenting manual schema tampering!
2. **Transport Decoupling**: While initial baseline implementations MAY deploy JSON Schema Draft-07 or 2020-12 validators within `schemas/generated/`, the runtime kernel architecture SHALL remain fully prepared to regenerate parallel Protobuf (`.proto`), Avro, or MessagePack definitions from the identical canonical semantic models without altering interface laws.

---

## 2. Normative Mapping Rules: Semantic Domain to Concrete Schema

When a Schema Generator compiles canonical `.md` model specifications into concrete target validators (such as `.schema.json`), it MUST adhere to the structural type conversions and invariant mappings defined below:

| Canonical Semantic Domain Type | Concrete JSON Schema Target Representation | Validation Constraint Inscription Rule |
| :--- | :--- | :--- |
| **Universally Unique Identifier** | `"type": "string", "format": "uuid"` | MUST match strict standard 8-4-4-4-12 string format. |
| **Universal Epoch Time** | `"type": "string", "format": "date-time"` | MUST comply with ISO 8601 UTC chronological string representations. |
| **Finite Enumeration** | `"type": "string", "enum": [...]` | MUST mirror valid semantic enumerations exactly without expansion. |
| **Unsigned Integer / Budget Value** | `"type": "integer", "minimum": 0` | MUST enforce `"minimum": 0` to prevent underflow corruption. |
| **Decimal Fraction (`0.0` to `1.0`)** | `"type": "number", "minimum": 0, "maximum": 1` | MUST clamp numerical evaluations strictly inside `0.0` to `1.0`. |
| **Structured Collection / Matrix** | `"type": "array", "items": { ... }` or `"type": "object"`| MUST specify explicit child schemas and forbid unverified open properties (`"additionalProperties": false` where applicable). |
| **Semantic Version Identifier** | `"type": "string", "pattern": "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$"`| MUST strictly enforce standard `MAJOR.MINOR.PATCH` SemVer regex syntax. |

---

## 3. Mandatory Validator Metadata Injunction

Every generated schema validator emitted into `schemas/generated/` MUST embed an upfront architectural comment or `"description"` tag explicitly bearing the normative warning:
```json
"description": "DO NOT EDIT MANUALLY. Generated strictly from Canonical Semantic Model and Hiến pháp ABI. Any direct edits violate Phase 0 Contract Governance."
```

---

## 4. Conformance Hook Binding

Generated schemas act as the mandatory primary filtration boundary for **Level 1 Schema Conformance**. Whenever a third-party driver or autonomous subsystem submits a payload across the Agent Boundary Interface, the kernel transport gateway MUST immediately subject the byte stream to formal schema validation against `schemas/generated/*.schema.json`. Any failure in validation MUST abort processing before coroutine allocation occurs.
