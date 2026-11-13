# Backend Engineering

## Principles
- Layered architecture: routes/controllers -> services -> repositories.
- Validate all input at boundaries; never trust client data.
- Idempotent, safe-by-default endpoints.
- Observability: structured logs, metrics, tracing.
- Migrations are reversible; no data loss on rollback.

## Workflow
1. Inspect existing API conventions and data models.
2. Design contract (request/response, errors).
3. Implement with validation and auth checks.
4. Add tests (unit + integration).
5. Verify build, lint, and security scan.

## Checklist
- [ ] Input validation
- [ ] Authz checks
- [ ] Error handling + consistent error shape
- [ ] Tests cover happy + failure paths
- [ ] No secrets in code/logs