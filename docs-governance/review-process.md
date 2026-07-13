# Review Process

All documentation must pass a multi-stage review before publication.

## Stage 1: Automated Validation
- **Actor**: QA Engineer Agent / CI Pipeline
- **Action**: Checks `quality-standards.md` (broken links, metadata, format).
- **Result**: Pass or automatic Reject.

## Stage 2: Technical Accuracy
- **Actor**: Domain Owner (Human or Agent)
- **Action**: Verifies that the document accurately reflects the system implementation.
- **Result**: Approve or Request Changes.

## Stage 3: Style and Consistency
- **Actor**: Documentation Reviewer Agent
- **Action**: Verifies adherence to the `style-guide.md` and `taxonomy.json`.
- **Result**: Approve or Request Changes.

## Bypass Rules
- Typo fixes or minor grammatical corrections can bypass Stage 2, but Stage 1 and Stage 3 are always mandatory.