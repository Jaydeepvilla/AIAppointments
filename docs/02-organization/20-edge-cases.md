# Edge Cases: Organization Management

## 1. Changing Timezone with Existing Appointments
- **Scenario**: The Owner changes the timezone from `America/New_York` to `America/Chicago` (a 1-hour shift).
- **Resolution**: Existing appointments remain valid because they were booked and saved in UTC. However, an appointment booked at 9:00 AM EST will now display as 8:00 AM CST in the dashboard. The system does not attempt to "shift" appointments, but it must warn the user before they save the new timezone that this display shift will occur.

## 2. Midnight Overlaps in Business Hours
- **Scenario**: A nightclub or late-night clinic sets hours from `20:00` to `02:00`.
- **Resolution**: The schema must support wrapping over the midnight boundary. The UI should display this as `20:00` to `23:59`, and `00:00` to `02:00` the following day, rather than breaking the mathematical logic of `endTime > startTime`. Alternatively, use 48-hour logical time limits (e.g., `20:00` to `26:00`).

## 3. Creating a Holiday on a Past Date
- **Scenario**: The Manager creates a holiday for yesterday to log a retroactive closure.
- **Resolution**: This is allowed for record-keeping purposes. The availability engine ignores past holidays since users cannot book in the past anyway.

## 4. Split Shifts Overlapping
- **Scenario**: Manager attempts to set `09:00 - 13:00` and `12:00 - 17:00` via a concurrent request bypassing the UI.
- **Resolution**: The API must merge overlapping blocks natively before saving. The resulting array would simply be `[{start: "09:00", end: "17:00"}]`.
