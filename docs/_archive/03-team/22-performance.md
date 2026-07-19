# Performance: Team Management

## Caching Strategy
- The `staff` list (Name, Avatar, Title) is highly cacheable and should be cached via Redis, invalidating on `staff.created` or `staff.updated`.
- The `staffSchedules` table is pulled heavily during availability calculation. It must be cached similarly to the `businessSettings` table.
- **Data Shape Optimization**: The `weeklyHours` is intentionally structured as a JSONB column on a 1:1 table instead of a normalized `shift` table to avoid massive N+1 queries when loading a team of 50 staff members.

## Scalability Limits
- **Max Staff per Organization**: While the database can handle thousands, the frontend UI and AI context window are optimized for teams of < 100 members. If an organization exceeds 100 staff, we may need to introduce pagination on the `getAvailableSlots` tool to prevent hitting token limits when returning available providers.
