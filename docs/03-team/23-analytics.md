# Analytics: Team Management

## Tracked Events

1. **`staff_member_added`**
   - Trigger: User successfully creates a new staff profile.
   - Properties: `with_invite: boolean`, `services_count: integer`.
2. **`staff_schedule_updated`**
   - Trigger: User saves changes to a staff's weekly hours.
   - Properties: `total_working_hours`.
3. **`staff_exception_added`**
   - Trigger: User blocks off time.
   - Properties: `duration_minutes`.
4. **`staff_dashboard_invite_accepted`**
   - Trigger: Invited user successfully authenticates and links.

## Core KPIs
- **Team Size**: Average number of active staff members per organization (Key indicator of account expansion potential).
- **Dashboard Adoption**: What percentage of `Staff` records have a linked `userId`? (Indicates if the platform is being used by the whole team, or just top-down by one manager).
