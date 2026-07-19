# Automation Rules: Business Onboarding

## Triggers and Actions

### 1. Welcome Sequence Trigger
- **Trigger**: `subscription.activated` event.
- **Condition**: New organization created within the last 24 hours.
- **Action**: Add the Owner's email to the "Onboarding Drip Campaign" in the external marketing automation tool (e.g., Customer.io).

### 2. Stale Verification Cleanup
- **Trigger**: Cron job running every 24 hours.
- **Condition**: User records where `emailVerified = false` AND `createdAt` is older than 7 days.
- **Action**: Hard delete the User record.
- **Failure**: Log `cleanup.failed` with the specific User IDs.

### 3. Abandoned Cart Recovery
- **Trigger**: Cron job running hourly.
- **Condition**: Organization exists, `Owner` user is verified, but `Subscription` is null OR `status != active` for more than 4 hours.
- **Action**: Dispatch "Complete your setup" email via `EmailService`.
- **Retries**: Send a maximum of 3 emails (at 4 hours, 24 hours, and 72 hours). After 3 attempts, halt.
