# Frontend Engineering

## Principles
- Component-driven, composable, typed.
- Accessibility first (WCAG 2.1 AA).
- Performance: lazy load, code split, minimize bundle.
- State: lift only when needed; prefer server state libraries.
- Styling: design tokens, no magic numbers.

## Workflow
1. Inspect existing component patterns and design system.
2. Plan component API (props, events, slots).
3. Implement with types and tests.
4. Verify a11y, responsiveness, and bundle impact.

## Checklist
- [ ] Typed props/events
- [ ] Keyboard + screen reader support
- [ ] Loading/error/empty states
- [ ] Tests for interactions
- [ ] No dead code / unused imports