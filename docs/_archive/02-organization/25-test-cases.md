# Test Cases: Organization Management

## Positive Paths
1. **[TC-ORG-01]**: Admin successfully updates the business phone number. The change persists upon page reload.
2. **[TC-ORG-02]**: Manager adds a split shift to Monday (`09:00-12:00` and `13:00-17:00`) and saves successfully.
3. **[TC-ORG-03]**: Manager adds a Holiday for "New Year's Day". The date appears in the UI list.

## Negative Paths
4. **[TC-ORG-04]**: Staff member attempts to save Business Hours. Server rejects with `403 Forbidden`.
5. **[TC-ORG-05]**: Manager attempts to set Friday hours to `17:00 - 15:00`. UI blocks submission.
6. **[TC-ORG-06]**: Admin attempts to upload a 5MB PDF to the logo dropzone. UI rejects the file.

## Boundary & Edge Cases
7. **[TC-ORG-07]**: Admin sets all days of the week to Closed (empty arrays) and saves. System accepts this (useful for temporary seasonal closures).
8. **[TC-ORG-08]**: Admin attempts to add a Holiday that already exists in the list. UI either blocks or silently merges.

## Integration
9. **[TC-ORG-09]**: After adding a Holiday for next Wednesday, a mock query to `getAvailableSlots` for next Wednesday returns exactly zero slots for all staff members.
