# Automation Rules: Organization Management

## Triggers and Actions

### 1. Holiday Purge (Data Cleanup)
- **Trigger**: Cron job running on the 1st of every month.
- **Condition**: Find all `holidays` in the `businessSettings` JSONB column where the `date` is older than 365 days in the past.
- **Action**: Silently remove these historical dates from the array to prevent the JSON payload from bloating infinitely over the years.
- **Failure**: Log `cron.holiday_purge.failed`.

### 2. Timezone Sync Alert
- **Trigger**: `organization.profile.updated` event where `changes` includes `timezone`.
- **Condition**: The Organization has upcoming appointments scheduled.
- **Action**: Dispatch an internal platform notification to the Owner/Manager: *"You have changed the business timezone. Note that all existing appointments are anchored to absolute time and may appear shifted."*
