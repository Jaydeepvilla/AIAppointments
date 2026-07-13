# Deprecation Policy

When a feature is slated for removal, its documentation must follow this deprecation flow.

## 1. Marking Obsolete
- Add `status: deprecated` to the frontmatter.
- Insert a `> [!WARNING]` alert at the top of the document explaining the deprecation.

## 2. Notification
- The deprecation must be listed in the Release Notes.
- The alert must state the exact version or date when the feature will be fully removed.

## 3. Redirection
- Provide a clear link to the replacement feature or migration guide within the deprecation alert.