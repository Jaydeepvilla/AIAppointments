# Events: Business Onboarding

## Emitted Events

### `user.registered`
- **Trigger**: Fired when `/api/auth/register` succeeds.
- **Payload**: `{ userId, email, timestamp }`
- **Listeners**:
  - `EmailService`: Dispatches the "Verification OTP" email.
  - `AnalyticsService`: Logs the "Sign Up" conversion event.

### `user.verified`
- **Trigger**: Fired when OTP is successfully validated.
- **Payload**: `{ userId, timestamp }`
- **Listeners**:
  - `AnalyticsService`: Logs the "Email Verified" event.

### `organization.created`
- **Trigger**: Fired when the business details form is submitted.
- **Payload**: `{ organizationId, ownerUserId, industry, timezone }`
- **Listeners**:
  - `ProvisioningService`: Creates default `businessSettings` based on the `industry`.
  - `ProvisioningService`: Creates a default `staffMember` linked to the `ownerUserId`.

### `subscription.activated`
- **Trigger**: Fired via Stripe Webhook (`checkout.session.completed`).
- **Payload**: `{ organizationId, planId, customerId }`
- **Listeners**:
  - `EmailService`: Sends the "Welcome to the Platform" receipt email.
  - `OnboardingService`: Updates the organization status to allow dashboard entry.
