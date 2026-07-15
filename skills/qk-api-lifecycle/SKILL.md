---
name: qk-api-lifecycle
category: fullstack
version: 7.0.0
description: "Thiết kế, triển khai, và tích hợp các API endpoints với kỷ luật Zero-Trust."
---

# qk-api-lifecycle

## Scope
- API design, endpoints, contracts, and lifecycle management (Plan & Execute)
- Zero-Trust validation of API schemas.

## Verbs
- `[DEFINE]`: Create strict API contracts before implementation.
- `[IMPLEMENT]`: Build endpoints strictly adhering to the defined contract.

## Constraints
```yaml
must:
  - "Define clear request/response contracts (OpenAPI/Swagger) BEFORE coding"
  - "Ensure backward compatibility on existing endpoints"
  - "Validate all incoming data against the strict schema"
must_not:
  - "Introduce breaking changes without versioning"
  - "Bypass authentication or authorization checks"
  - "Hallucinate or guess external API shapes without evidence"
```

## Policies
```yaml
prefer:
  - "RESTful resource naming conventions"
  - "Meaningful HTTP status codes"
  - "Strict type-checking and validation over loose parsing"
```

## Escalation
```yaml
stop:
  - "Required API contracts or models are missing"
  - "Major breaking change detected on production APIs"
```

## Output
- API endpoints, controllers, and strict documentation.
