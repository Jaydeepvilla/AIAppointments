# Events: Team Management

## Emitted Events

### `staff.created`
- **Trigger**: New staff record inserted.
- **Payload**: `{ staffId, organizationId }`
- **Listeners**:
  - `AuditLogger`: Records the creation.

### `staff.schedule.updated`
- **Trigger**: `PUT /api/staff/:id/schedule` succeeds.
- **Payload**: `{ staffId, organizationId }`
- **Listeners**:
  - `AvailabilityEngine`: Flushes the availability cache for this specific `staffId`, forcing the engine to recalculate slots on the next customer request.

### `staff.exception.added`
- **Trigger**: `POST /api/staff/:id/exceptions` succeeds.
- **Payload**: `{ staffId, date, organizationId }`
- **Listeners**:
  - `AvailabilityEngine`: Flushes the cache for this specific `staffId` and `date`.

### `staff.services.updated`
- **Trigger**: `PUT /api/staff/:id/services` succeeds.
- **Payload**: `{ staffId, added: [serviceId], removed: [] }`
- **Listeners**:
  - `AIContextManager`: Rebuilds the semantic embedding for this staff member so the AI knows they can now perform new services.
