# Database Schema: Business Onboarding

## Entity: `users`
Represents the authenticated human.
- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) (Unique, Indexed)
- `passwordHash`: VARCHAR(255) (Nullable for SSO users)
- `authProvider`: ENUM ('local', 'google')
- `emailVerified`: BOOLEAN (Default: false)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

## Entity: `organizations`
Represents the tenant.
- `id`: UUID (Primary Key)
- `name`: VARCHAR(100)
- `industry`: VARCHAR(50)
- `timezone`: VARCHAR(50) (e.g., 'America/Los_Angeles')
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

## Entity: `organizationMembers`
Maps Users to Organizations with Roles (M:N, usually 1:1 for onboarding).
- `id`: UUID (Primary Key)
- `organizationId`: UUID (Foreign Key -> organizations.id)
- `userId`: UUID (Foreign Key -> users.id)
- `role`: ENUM ('owner', 'admin', 'manager', 'staff')
- `createdAt`: TIMESTAMP

## Entity: `subscriptions`
Tracks billing status.
- `id`: UUID (Primary Key)
- `organizationId`: UUID (Foreign Key -> organizations.id)
- `stripeCustomerId`: VARCHAR(100)
- `stripeSubscriptionId`: VARCHAR(100)
- `planId`: VARCHAR(50)
- `status`: ENUM ('trialing', 'active', 'past_due', 'canceled')
- `currentPeriodEnd`: TIMESTAMP

## Constraints & Indexes
- **Unique Compound Index**: `(organizationId, userId)` on `organizationMembers` to prevent duplicate assignments.
- **Index**: `stripeCustomerId` on `subscriptions` for fast webhook lookups.
