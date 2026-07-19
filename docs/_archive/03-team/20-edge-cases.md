# Edge Cases: Team Management

## 1. Zero Linked Services
- **Scenario**: A new staff member is created, but no services are checked in their profile.
- **Resolution**: The `AvailabilityEngine` will never return this staff member in a generic service query. They can only be booked if a customer explicitly asks for them by name, AND the system is configured to allow service-less custom bookings. Otherwise, they remain invisible to the AI.

## 2. Buffer Time Midnight Overlap
- **Scenario**: A clinic closes at 17:00. An appointment ends at 16:45. The staff member has a 30-minute buffer time.
- **Resolution**: The buffer time pushes their "busy" block until 17:15, exceeding the business hours. This is fine. Buffer times do not generate errors if they exceed bounds; they simply prevent back-to-back bookings.

## 3. Revoking Access Mid-Session
- **Scenario**: A manager clicks "Revoke Access" while the targeted staff member is actively logged in and looking at their calendar.
- **Resolution**: The `DELETE /api/staff/:id/access` call severs the `userId` link and issues a forced token invalidation to the Identity Provider. On the staff member's next client-side API fetch (within seconds), they receive a `401 Unauthorized` and are booted to the login screen.

## 4. Deleting a Staff Member
- **Scenario**: Manager deletes a staff member who quit.
- **Resolution**: We perform a **Soft Delete** (`deletedAt = NOW()`). They disappear from the UI and AI availability. However, their historical appointments remain intact for analytics, still referencing their `staff.id`.
