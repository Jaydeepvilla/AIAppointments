# Security: Team Management

## Tenant Isolation (IDOR Prevention)
- **Validation**: Any request to `PUT /api/staff/:id/schedule` or `POST /api/staff/:id/exceptions` MUST verify that the `staff.organizationId` matches the authenticated `user.organizationId` making the request. Without this, a Manager from Org A could guess the UUID of a Staff member in Org B and modify their schedule.

## Role Escalation Prevention
- **Validation**: When a Manager uses the Access Tab to invite a User, the backend must strict-check that the `role` payload is NOT `owner` or `admin`. Only Admins/Owners can grant Admin access.

## Personally Identifiable Information (PII)
- Staff member contact details (if added in the future, like personal cell phone numbers) must NEVER be exposed to the public booking API or injected into the AI context. The AI should only know the Staff's Name, Bio, and Avatar.
