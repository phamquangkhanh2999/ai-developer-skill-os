---
name: qk-api-lifecycle
category: fullstack
version: 6.0.0
---

# qk-api-lifecycle

## Scope
- API design, endpoints, contracts, and lifecycle management (Plan & Execute)

## Constraints
```yaml
must:
  - Define clear request/response contracts (OpenAPI/Swagger)
  - Ensure backward compatibility on existing endpoints
must_not:
  - Introduce breaking changes without versioning
  - Bypass authentication or authorization checks
```

## Policies
```yaml
prefer:
  - RESTful resource naming conventions
  - Meaningful HTTP status codes
```

## Escalation
```yaml
stop:
  - Required API contracts or models are missing
  - Major breaking change detected on production APIs
```

## Output
- API endpoints, controllers, and documentation
```
