# Security Auditing

## Scope
- Secrets in code/config/logs
- Dependency vulnerabilities
- Authn/authz flaws
- Injection (SQL, command, XSS, SSRF)
- Insecure defaults, missing validation

## Workflow
1. Scan for secrets and vulnerable deps.
2. Review auth paths and permission boundaries.
3. Check input validation at all boundaries.
4. Verify secure headers, CORS, CSRF where relevant.
5. Report findings with severity and remediation.

## Checklist
- [ ] No hardcoded secrets
- [ ] Deps audited
- [ ] Authz enforced server-side
- [ ] Inputs validated/sanitized
- [ ] Errors don't leak internals