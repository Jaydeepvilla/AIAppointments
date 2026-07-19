# Permission Rules: Business Onboarding

## Public Routes
The following routes require NO authentication and are accessible to anyone:
- `/sign-up`
- `/login`

## Partially Authenticated Routes
The following routes require a valid session (User exists) but DO NOT require the user to belong to a fully provisioned Organization:
- `/verify-email` (User must be in unverified state)
- `/onboarding/business-details` (User must be verified, but Organization is null)
- `/onboarding/plans` (User must have an Organization, but Subscription is null/inactive)

## Blocked Routes
During onboarding, the user is strictly blocked from accessing:
- `/dashboard/*` (Requires `Organization` AND active `Subscription`)
- Any API route requiring the `OrganizationId` header before the business details step is completed.

## Automatic Role Assignment
- The `Owner` role is a protected system state. It can only be assigned during the initial Organization creation transaction or via a strict ownership transfer protocol. The onboarding module holds the exclusive right to execute the initial `Owner` assignment.
