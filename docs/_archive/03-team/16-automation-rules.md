# Automation Rules: Team Management

## Triggers and Actions

### 1. Orphaned Exception Purge (Data Cleanup)
- **Trigger**: Cron job running weekly on Sunday at 2 AM.
- **Condition**: Find all records in `staffExceptions` where `date` is older than 90 days.
- **Action**: Delete these records to prevent the table from growing infinitely with past sick days that no longer affect future availability.

### 2. Auto-Link on Invite Acceptance
- **Trigger**: A new `User` signs up using an email address that has an active invite token.
- **Action**: The auth webhook fires an event to the backend. The backend updates the `staff` record, setting `userId` to the newly created User UUID, instantly granting them access to their schedule.

### 3. Availability Cache Pre-warming
- **Trigger**: `staff.schedule.updated`
- **Condition**: The staff member has > 5 active services.
- **Action**: Fire a background worker to pre-calculate and cache their availability for the next 14 days, preventing the next customer query from hanging while the graph resolves.
