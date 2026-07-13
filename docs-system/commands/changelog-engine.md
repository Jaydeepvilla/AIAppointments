# Changelog Engine Specifications

## Categories
All updates must be parsed and bucketed into:
- `Added`: New features or endpoints.
- `Changed`: Modifications to existing functionality.
- `Fixed`: Bug resolutions.
- `Deprecated`: Features slated for removal.
- `Removed`: Features removed in this release.
- `Security`: Vulnerability patches.

## Execution
1. Scan diffs of the documentation branch.
2. Extract human-readable summaries.
3. Append to the `CHANGELOG.md` file under the current unreleased version header.