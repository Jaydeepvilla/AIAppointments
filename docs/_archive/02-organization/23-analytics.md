# Analytics: Organization Management

## Tracked Events

1. **`org_profile_updated`**
   - Trigger: User saves changes on the General Info tab.
   - Properties: `fields_changed` (e.g., `["logoUrl", "phone"]`).
2. **`org_hours_updated`**
   - Trigger: User saves changes to Business Hours.
   - Properties: `total_open_hours_per_week`.
3. **`org_holiday_added`**
   - Trigger: User adds a holiday.
   - Properties: `days_in_advance` (Calculation between today and the holiday date).

## Core KPIs
- **Adoption Rate**: What percentage of active organizations have customized their business hours vs. leaving the onboarding defaults?
- **Holiday Usage**: What percentage of organizations utilize the holiday feature? (If low, it may indicate poor discoverability).

## Dashboards Required
- Internal product analytics dashboard showing the distribution of timezones across the platform to inform optimal maintenance windows.
