# Release Documentation

Documentation releases must synchronize perfectly with product releases.

## Release Notes
- Generated automatically by the Release Manager Agent.
- Must categorize changes into: Added, Changed, Fixed, Deprecated, Removed, Security.
- Must be published exactly when the product deployment completes.

## Feature Flags
- Documentation for features behind a feature flag must be published but explicitly marked with a "Beta" or "Early Access" alert.

## Version Snapshots
- Upon a Major Version release (e.g., v1 to v2), the v1 documentation is snapshotted and frozen, transitioning to LTS status according to the `version-policy.md`.