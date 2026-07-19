# Definition of Ready (DoR)

A feature, user story, or technical task cannot be pulled into active development until every condition in this checklist is satisfied. This ensures engineering time is spent building, not deciphering vague requirements.

## 1. Documentation & Requirements
- [ ] The core problem or goal is clearly articulated.
- [ ] All Business Rules (see `09-business-rules.md`) that apply to this feature are explicitly identified.
- [ ] If the feature interacts with AI, the expected prompt structure and failure fallbacks are documented.
- [ ] Any required changes to the Data Model (DB schema) are outlined.
- [ ] Target user personas and specific use cases are defined.

## 2. Design & UX
- [ ] (If UI is involved) High-fidelity mockups or wireframes are provided.
- [ ] All edge cases (empty states, loading states, error states, and zero-data states) are accounted for in the design.
- [ ] UI components map directly to the established Design Token system. No bespoke styling is required.
- [ ] Copywriting (labels, tooltips, error messages) is finalized. Placeholders like "TBD" are not acceptable.

## 3. Technical Feasibility
- [ ] Architectural impact has been assessed (e.g., impact on database load, third-party API rate limits).
- [ ] Security and permission implications (who can view/edit this) are defined in accordance with the `08-permission-matrix.md`.
- [ ] Necessary external dependencies or API keys (if integrating a new service) are procured and accessible in staging environments.

## 4. Acceptance Criteria
- [ ] Explicit, testable Acceptance Criteria are written (e.g., "Given the user is an Admin, when they click X, then Y happens").
- [ ] Criteria cover happy paths, unhappy paths, and edge cases.

## 5. Estimation
- [ ] The task has been reviewed by the engineering team and sized/estimated.
- [ ] If the task is estimated to take longer than one sprint, it must be broken down into smaller, discrete stories.
