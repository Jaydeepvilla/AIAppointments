# Documentation Lifecycle

All documentation follows a strict state machine.

## States

1. **Draft**
   - Document is being written. Not visible to end-users.
2. **Review**
   - Draft is complete and undergoing QA and Reviewer validation.
3. **Approved**
   - Validation passed. Awaiting release alignment.
4. **Published**
   - Live in the documentation portal. The current source of truth.
5. **Updated**
   - A published document that has received a modification (cycles back to Review for the delta).
6. **Deprecated**
   - The feature is being phased out. Document remains visible with a prominent warning.
7. **Archived**
   - The feature is removed. Document is removed from search and navigation, preserved only for historical record.