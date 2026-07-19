# Events: Organization Management

## Emitted Events

### `organization.profile.updated`
- **Trigger**: Fired when `PUT /api/organization` succeeds.
- **Payload**: `{ organizationId, userId, changes: ["name", "phone"] }`
- **Listeners**:
  - `AuditLogger`: Records the change for compliance tracking.
  - `CacheService`: Invalidates the cached organization profile.

### `organization.hours.updated`
- **Trigger**: Fired when business hours are modified.
- **Payload**: `{ organizationId, userId }`
- **Listeners**:
  - `AvailabilityEngine`: Flushes the availability cache for all staff members in this organization, forcing a recalculation on the next booking request.
  - `AuditLogger`: Records the change.

### `organization.holiday.added`
- **Trigger**: Fired when a new holiday is added.
- **Payload**: `{ organizationId, userId, date }`
- **Listeners**:
  - `AvailabilityEngine`: Flushes the cache for the specific week containing the `date`.
  - `AuditLogger`: Records the addition.

### `organization.holiday.removed`
- **Trigger**: Fired when a holiday is deleted.
- **Payload**: `{ organizationId, userId, date }`
- **Listeners**:
  - `AvailabilityEngine`: Flushes the cache for the specific week to reopen the slots.
