# Validation Rules: Organization Management

## Profile Settings
- `name`: String, 2-100 characters. Required.
- `phone`: String, must pass E.164 format validation (e.g., `+12345678900`). Optional, but if provided, must be valid.
- `timezone`: String, must exist in standard IANA Time Zone database. Required.

## Business Hours
- Payload structure must be an object keyed by day (`monday`, `tuesday`, etc.).
- Value must be an array of time blocks: `[{ start: '09:00', end: '17:00' }]`.
- `start` and `end` must be strictly formatted as `HH:mm` (24-hour time).
- `end` must be greater than `start`.
- If a day is closed, the array must be empty `[]`.
- Overlapping time blocks on the same day (e.g., `09:00-12:00` and `11:00-14:00`) are not allowed and must be rejected by the server.

## Holidays
- `date`: Must be a valid ISO 8601 date string (`YYYY-MM-DD`). Required.
- `name`: String, 1-50 characters. Required.
- Duplicate dates in the holidays array are not allowed. Only one holiday entry per date is permitted.
