# Documentation Lifecycle Pipeline

## Phase 1: Planning
1. **Feature Request**: Captured in PM tool.
2. **Business Analysis**: Business Analyst Agent determines affected modules.
3. **Architecture Review**: AI Architect or Database Architect reviews data changes.

## Phase 2: Generation
4. **Generate Docs**: UX Writer, Technical Writer, or API Writer generates drafts using `templates/`.

## Phase 3: Validation
5. **Validate**: QA Engineer Agent runs `checklists/` against drafts.
6. **Review**: Documentation Reviewer Agent performs final structural/architectural checks.

## Phase 4: Integration
7. **Cross Reference**: Cross Reference Engine updates related articles.
8. **Navigation Update**: Folder structure/sidebar verified.
9. **Search Update**: Search Index triggered (handled by Fumadocs build).

## Phase 5: Release
10. **Version Update**: Release Manager Agent checks `versions.json`.
11. **Changelog**: Changelog Engine generates `changelog.md` snippet.
12. **Release Notes**: Release Notes template generated.
13. **Publish**: Merged to main and deployed.