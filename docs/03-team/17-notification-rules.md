# Notification Rules: Team Management

## Email Notifications

### Dashboard Invite
- **Recipient**: The invited staff member (via email input).
- **Trigger**: Manager clicks "Send Invite" on the Access tab.
- **Subject**: "You've been invited to join [Organization Name]"
- **Content**: Magic link to create an account and access the dashboard.
- **Urgency**: Immediate.

### Schedule Change Alert
- **Recipient**: The linked Staff Member (`user.email`).
- **Trigger**: A Manager updates the Staff Member's `staffSchedule`.
- **Subject**: "Your weekly schedule has been updated"
- **Content**: "Your manager has modified your working hours. Please log in to review your new schedule."
- **Urgency**: Immediate.

### Time Off Request (Future Scope)
- *Note: In V1, time-off is instantly approved if added by a manager, or added by the staff member themselves (if permissions allow). A formal request/approval flow via email is slated for V2.*
