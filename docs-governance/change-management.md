# Change Management

Every modification to the documentation must be traceable.

## Required PR Meta-Information
Every Pull Request modifying documentation MUST include the following:

- **Reason**: Why is this change happening? (Link to feature ticket or bug report).
- **Author**: Who wrote the change? (Agent or Human).
- **Reviewer**: Who approved the change?
- **Impact**: What is the scope of the change? (Minor typo vs Major architectural shift).
- **Affected Modules**: Which system modules does this document relate to?
- **Migration Required**: Does this change document a breaking change requiring user migration?
- **Version**: Which product version does this apply to? (e.g., v1.2.0).

If any of this information is missing, the PR will be automatically blocked.