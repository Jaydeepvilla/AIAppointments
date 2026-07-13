# Archive Policy

When a feature or version is permanently removed (end-of-life), its documentation is archived.

## 1. State Change
- `status` in frontmatter changed to `archived`.

## 2. Retention
- Archived documentation is retained in the Git history permanently.
- It is removed from the active search index.
- It is removed from the primary navigation sidebar.

## 3. 301 Redirects
- The URL slug of the archived document MUST be configured to 301 Redirect to the closest relevant active document or the category root to prevent 404 errors for external referrers.