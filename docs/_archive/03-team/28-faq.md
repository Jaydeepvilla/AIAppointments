# FAQ: Team Management

**Q: Why don't we just use the `users` table for Staff?**
A: Because a physical room (e.g., "Laser Room A") can be booked just like a human, but it will never log into the dashboard. Conversely, a third-party accountant might have a User account to view analytics, but will never take an appointment. Separating Identity (`users`) from Capacity (`staff`) is a fundamental enterprise pattern.

**Q: What happens to a Staff member's appointments if they are soft-deleted?**
A: The historical appointments remain untouched. Future appointments remain assigned to them, but the UI should flag them in Red so the manager knows they need to be reassigned. The AI will immediately stop offering the deleted staff member for new bookings.

**Q: Can multiple Staff members be linked to the same User account?**
A: No. The `userId` column on the `staff` table has a `UNIQUE` constraint (within an organization). One human = one login = one schedule.
