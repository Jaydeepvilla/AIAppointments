# Documentation Standards

Documentation is a first-class citizen of this project. Code rots, but well-maintained documentation preserves architectural intent.

## Folder Structure
All documentation lives in the `/docs` directory. It is organized numerically to indicate reading order and logical hierarchy.
- `00-getting-started/`: Foundational product rules and definitions.
- `01-xx` through `20-xx`: Feature module specific documentation.
  - Every module directory must contain its own `README.md`.

## Naming Conventions
- Directory names: `kebab-case` with numerical prefix (e.g., `08-appointments`).
- File names: `kebab-case` with numerical prefix (e.g., `01-data-model.md`).
- This ensures predictable alphabetical sorting in IDE file explorers.

## Markdown Conventions
- Use standard GitHub Flavored Markdown (GFM).
- **No HTML** within markdown files unless absolutely necessary for specific rendering (e.g., complex tables spanning columns).
- Avoid emojis. Technical documentation must remain objective and professional.

## Heading Hierarchy
- Ensure strict heading hierarchy.
- Use exactly one H1 (`#`) per file, representing the document title.
- Use H2 (`##`) for major sections.
- Use H3 (`###`) for subsections.
- Never skip a heading level (e.g., jumping from H1 to H3).

## Cross-Referencing
- Do not duplicate information. If you need to reference a business rule, link directly to it: `[Booking Rules](./09-business-rules.md#1-booking-rules)`.
- Use relative paths for all links so they resolve correctly on GitHub and local editors.

## Tables
- Use markdown tables for matrices, structured comparisons, and data dictionaries.
- Ensure columns are aligned in the raw text for readability in the IDE.

## Code Examples
- Always use fenced code blocks with the correct language identifier for syntax highlighting (e.g., ```typescript).
- Code examples in documentation must be illustrative and concise. Do not paste 500-line files. 

## Versioning & Freshness
- Documentation must evolve with the code. 
- A Pull Request that fundamentally alters the system architecture or data model is strictly rejected if it does not include the corresponding documentation updates.

## Review Process
- Documentation changes require the same rigor as code reviews.
- Reviewers must check for clarity, conciseness, spelling, and adherence to these structural rules.
