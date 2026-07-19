# Organization Management

## Purpose
This module handles the core configuration and management of the business entity (Tenant). It acts as the structural foundation that holds all other data (services, staff, appointments, customers).

## Scope
- Business Profile (Name, Logo, Industry, Contact Info, Address).
- Global Business Hours (when the business is open).
- Holiday & Closure Management.
- Localization (Timezone, Date Formats, Currency).
- Subscription Tier details.

## Dependencies
- Database Schema (`organizations`, `businessSettings`).

## Related Modules
- [01-business-onboarding](../01-business-onboarding/README.md): Creates the initial organization.
- [03-team](../03-team/README.md): Staff members belong to this organization.
- [19-settings](../19-settings/README.md): General settings are scoped to the organization.

## Navigation
- Previous: [01-business-onboarding](../01-business-onboarding/README.md)
- Next: [03-team](../03-team/README.md)

## Implementation Order
1. Setup `organizations` and `businessSettings` schemas.
2. Build API routes to Fetch and Update settings.
3. Build the UI forms (General Info, Business Hours, Holidays).
4. Implement timezone conversion logic for saving business hours.
