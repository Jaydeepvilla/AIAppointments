# Notification Rules: Organization Management

## Internal In-App Notifications

### Profile Update Success
- **Recipient**: The user who initiated the action.
- **Type**: UI Toast.
- **Content**: "Organization profile updated successfully."
- **Urgency**: Immediate.

### Security / Audit Alert (Email)
- **Recipient**: The Organization Owner.
- **Trigger**: A User with the `Admin` role changes the `timezone` or updates the primary `phone` number.
- **Subject**: "Security Alert: Core Business Settings Changed"
- **Content**: "Admin [Name] recently updated your core business settings. If this was expected, you can ignore this email."
- **Urgency**: Immediate.
