# Business Rules: Business Onboarding

1. **Unique Email Requirement**: An email address can only be associated with one User account. If a user attempts to sign up with an existing email, they must be routed to login.
2. **Organization Ownership**: The User who creates the Organization during onboarding is permanently assigned the `Owner` role. This role cannot be deleted unless ownership is transferred.
3. **Mandatory Timezone**: A business cannot exist without a defined timezone. AI booking math relies entirely on this anchor.
4. **Subscription Gate**: A user cannot access the internal dashboard routes (except `/onboarding/*`) until they have an active or trial subscription record attached to their Organization.
5. **Default Settings Generation**: Upon Organization creation, the system must generate a default `businessSettings` record, pre-populating standard business hours (e.g., Mon-Fri 9AM-5PM) to prevent system crashes on initial AI queries.
6. **SSO Identity Linking**: If a user signs up via email/password, and later attempts to log in via Google SSO using the same email address, the accounts must be linked securely without creating a duplicate User record.
