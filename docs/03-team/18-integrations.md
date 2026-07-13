# Integrations: Team Management

## Auth0 / Clerk (Identity Provider)
- **Purpose**: Managing the issuance and validation of the "Invite Link" tokens.
- **Mechanism**: When a Manager invites a staff member, the system calls the IDP's Management API to generate a signup ticket/link, which is then emailed.

## Future Integrations

### Google Calendar / Outlook Sync
- **Purpose**: 2-way sync of exceptions and appointments.
- **Mechanism**: If a staff member blocks an hour in their personal Google Calendar, a webhook pushes an event to our platform, instantly creating a `staffException` record. If an appointment is booked by the AI, it pushes the event to their Google Calendar.
