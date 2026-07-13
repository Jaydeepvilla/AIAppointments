# Quality Validation Engine Rules

## Fatal Errors (Automatic Rejection)
- **Missing Title**: Frontmatter `title` is empty or missing.
- **Missing Description**: Frontmatter `description` is empty or missing.
- **Broken Links**: Any relative link (`[text](./link)`) does not resolve to a valid file.
- **Duplicate Slugs**: The filename already exists in the same folder.
- **Duplicate Titles**: The exact title is used in another document in the same category.
- **Invalid Markdown**: Unclosed tags, mismatched bold/italic syntax.
- **Invalid Mermaid**: Mermaid diagrams fail to parse.

## Resolution
If a Fatal Error is detected, the draft is returned to the original authoring Agent with the exact line number of the failure.