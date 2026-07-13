# Validation Rules: Team Management

## Staff Profile
- `name`: String, 2-100 characters. Required.
- `title`: String, max 50 characters. Optional.
- `bio`: String, max 500 characters. Optional.
- `bufferTime`: Integer. Must be 0, 5, 10, 15, 20, 30, 45, or 60. Default 0.

## Staff Schedule
- Same validation as Organization Business Hours (Timeblocks must be chronological, no overlaps).
- **Cross-Validation**: During `PUT`, the server must fetch the `businessSettings` for the Organization. Every timeblock in the Staff schedule must fall *completely inside* the timeblocks of the Organization schedule for that day.

## Staff Exceptions
- `date`: Valid ISO 8601 Date.
- `allDay`: Boolean.
- `startTime` / `endTime`: Required if `allDay` is false.
- Validation: Cannot add an exception for a date in the past.

## Access Invite
- `email`: Must be a valid email format.
- `role`: Must be one of `['admin', 'manager', 'staff']`.
- Validation: Cannot invite an email that already belongs to another Organization (Tenant isolation rule).
