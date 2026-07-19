# Team Management

## Purpose
This module handles the management of Staff Members within the Organization. It allows the business to define who performs services, their individual availability, their buffer times, and their assigned roles in the dashboard.

## Scope
- Staff Profile Management (Name, Avatar, Title).
- Individual Working Hours (Staff schedules).
- Exception & Leave Management (Sick days, vacations).
- Buffer Time Configuration (Time needed between appointments).
- Service Assignment (Which staff can perform which services).
- Role Management (Assigning dashboard access).

## Dependencies
- Database Schema (`staff`, `users`, `organizationMembers`, `staffAvailability`, `staffServices`).

## Related Modules
- [02-organization](../02-organization/README.md): Organization hours act as the absolute boundary for team hours.
- [04-services](../04-services/README.md): Services are mapped to specific staff members.
- [08-appointments](../08-appointments/README.md): Staff availability dictates appointment availability.

## Navigation
- Previous: [02-organization](../02-organization/README.md)
- Next: [04-services](../04-services/README.md)

## Implementation Order
1. Setup `staff` and relationship schemas.
2. Build Staff listing and creation UI.
3. Build Staff scheduling UI (Weekly hours & specific overrides).
4. Build logic to link a `Staff` record to an authenticated `User` record.
