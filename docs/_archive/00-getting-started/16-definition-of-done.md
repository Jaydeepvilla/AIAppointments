# Definition of Done (DoD)

A feature is not considered complete, and cannot be merged into the production branch, until every item on this checklist is strictly satisfied.

## 1. Code Quality & Architecture
- [ ] Code has been thoroughly reviewed and approved by at least one Senior Engineer.
- [ ] No ESLint warnings or TypeScript type errors are present.
- [ ] Code adheres strictly to the architectural patterns of the project (e.g., using established Repositories, no inline SQL queries).
- [ ] No hardcoded values for business logic; all logic references configuration parameters.

## 2. Testing & Verification
- [ ] Unit tests are written and passing for all critical domain logic (e.g., booking math, pricing calculations).
- [ ] Integration tests are passing for critical API endpoints.
- [ ] Manual verification has been completed in the staging environment by a peer.
- [ ] Edge cases defined in the Acceptance Criteria have been successfully executed.

## 3. UI/UX & Responsive Design
- [ ] Feature functions flawlessly on mobile, tablet, and desktop viewports.
- [ ] Dark mode and Light mode have been verified for contrast and legibility.
- [ ] Loading states (skeletons/spinners) and error states are properly implemented.
- [ ] All animations and transitions are smooth and performant.

## 4. Accessibility (a11y)
- [ ] Feature is fully navigable via keyboard.
- [ ] ARIA labels and roles are correctly applied to all interactive elements.
- [ ] Color contrast ratios meet WCAG 2.1 AA standards.

## 5. Security & Permissions
- [ ] Role-Based Access Control (RBAC) has been rigorously enforced server-side.
- [ ] All user inputs are sanitized to prevent XSS and SQL injection.
- [ ] No sensitive data (PII, tokens) is exposed in client-side payloads unnecessarily.

## 6. Performance
- [ ] Database queries are optimized (using indexes, avoiding N+1 problems).
- [ ] New UI components do not cause unnecessary re-renders.
- [ ] Heavy lifting or external API calls are appropriately cached or moved to background queues.

## 7. AI Validation
- [ ] If AI-facing, prompt changes have been tested against regression suites to ensure no core behavior is degraded.
- [ ] AI fallback mechanisms (escalation to human) have been explicitly verified.

## 8. Observability & Analytics
- [ ] Critical actions emit structured logs (e.g., `[Action] Appointment Created - Org ID: 123`).
- [ ] Feature usage analytics tracking (if applicable) is implemented.
- [ ] Any required Audit Logs are correctly writing to the database.

## 9. Documentation
- [ ] Any changes to the Data Model are reflected in the global documentation.
- [ ] The `10-system-glossary.md` is updated if new terms are introduced.
- [ ] API routes and parameters are documented.
- [ ] Relevant module documentation (`docs/[module]`) is updated to reflect the new functionality.
