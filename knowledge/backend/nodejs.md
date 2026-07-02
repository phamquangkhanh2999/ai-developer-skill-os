---
id: nodejs-knowledge-base
domain: backend
tags: [nodejs, express, api, middleware]
priority: high
---

# Node.js Backend Knowledge Base

## Architecture Patterns
- **Controller Layer:** Handle HTTP requests/responses, input validation, delegate to Service
- **Service Layer:** Business logic, data transformation, transaction management  
- **Repository Layer:** Direct database queries, ORM interactions
- **Middleware:** Auth guards, logging, rate limiting, error handling

## Express Best Practices
```ts
// Controller pattern - thin, delegates to service
export async function createUser(req: Request, res: Response) {
  const result = await userService.create(req.body);
  res.status(201).json(result);
}

// Service pattern - business logic
export async function create(userData: UserDto) {
  // Validation
  const validated = userSchema.parse(userData);
  // Transaction
  return db.user.create({ data: validated });
}

// Middleware pattern - reusable
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};
```

## Error Handling
- Never throw raw Errors. Use custom error classes.
- Always catch async errors in middleware.
- Return consistent error format: `{ error: string, code?: string }`

## Security Checklist
- Use helmet middleware for security headers
- Validate all inputs with Zod/Joi
- Never commit .env files
- Use parameterized queries to prevent SQL injection
- Rate limit public endpoints
- Log security events (failed logins, permission denied)