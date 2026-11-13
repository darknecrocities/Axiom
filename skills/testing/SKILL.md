# Testing

## Principles
- Test behavior, not implementation.
- Fast unit tests + targeted integration tests.
- Deterministic: no network/time/randomness without control.
- Coverage on changed code; regression tests for bugs.

## Strategy
- Unit: pure logic, utils, services with mocks.
- Integration: API routes, DB interactions (test DB).
- E2E: critical user flows only.

## Workflow
1. Identify risk surface of change.
2. Write failing test (TDD) when fixing bugs.
3. Implement minimal fix.
4. Run full suite; no skipped tests as passed.

## Checklist
- [ ] Tests added/updated
- [ ] No skipped tests without reason
- [ ] Flaky tests quarantined, not deleted
- [ ] Evidence captured (command + exit code)