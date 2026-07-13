# Permission Rules: Organization Management

## Read Access
- **Owner, Admin, Manager, Staff**: Can view the Organization profile, business hours, and holidays. (Staff need this context to understand why their own schedules might be overridden).
- **Public / AI Agent**: Can read the Organization Profile, Business Hours, and Holidays via internal unauthenticated function calls to correctly answer customer inquiries.

## Write Access
- **Owner, Admin**: Can update the Business Profile (Name, Address, Logo, Timezone).
- **Manager**: Cannot update the Business Profile (Address/Name). CAN update Business Hours and Holidays (Managers run the floor).
- **Staff**: Cannot update any Organization-level settings.

## Delete Access
- **Owner**: Can initiate Organization deletion (Triggers a destructive confirmation flow).
- **Admin, Manager, Staff**: Strictly prohibited from initiating Organization deletion.
