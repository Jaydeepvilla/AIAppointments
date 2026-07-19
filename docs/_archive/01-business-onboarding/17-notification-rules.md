# Notification Rules: Business Onboarding

## Email Notifications

### 1. Verification OTP
- **Recipient**: The unverified user's email.
- **Subject**: "Verify your account - [Platform Name]"
- **Content**: Clean HTML template containing the 6-digit OTP code and a warning not to share it.
- **Urgency**: Immediate (Highest Priority Queue).

### 2. Welcome / Payment Receipt
- **Recipient**: The newly subscribed Owner's email.
- **Subject**: "Welcome to [Platform Name]! Here's your receipt."
- **Content**: Confirmation of the chosen subscription plan, a link to the dashboard, and a PDF attachment of the initial Stripe invoice.
- **Urgency**: Immediate.

### 3. Abandoned Setup
- **Recipient**: The Owner's email (if they abandon before payment).
- **Subject**: "You're one step away from automating your front desk."
- **Content**: A magic link to return directly to the Plan Selection screen.
- **Urgency**: Scheduled (Batch processing).

## Internal Notifications (Slack / Teams)

### New Tenant Alert
- **Channel**: `#sales-alerts` or `#new-customers`
- **Content**: "New Organization Created: [Business Name] in the [Industry] sector. Plan: [Plan Name]."
- **Purpose**: Provides visibility to the internal Customer Success team to reach out for a high-touch onboarding if necessary.
