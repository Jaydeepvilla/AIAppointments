# Performance: Business Onboarding

## Caching Strategies
- **Static Assets**: The Marketing/Sign-Up pages and all associated JS/CSS bundles must be aggressively cached at the CDN edge (e.g., Cloudflare/Vercel Edge) to ensure instant initial load times (Time to Interactive < 1s).
- **Timezone List**: The list of valid IANA timezones (which rarely changes) should be statically generated or memoized on the client to prevent a blocking API call when rendering the Business Details screen.

## Database Optimization
- **Transaction Scope**: The creation of the `Organization`, the `User` role mapping, and the default `businessSettings` must occur within a single ACID-compliant database transaction. If one fails, they all roll back. This prevents orphaned records.
- **Indexes**: The `email` column on the `users` table must have a B-Tree index to ensure the `O(log N)` lookup required during the instant "email already in use" check.

## Loading Perceived Performance
- **Optimistic UI**: When transitioning from Business Details to Plan Selection, immediately transition the UI while the database transaction runs in the background. Do not block the screen paint waiting for the DB response unless the next screen explicitly requires the DB ID.

## Limits
- **OTP Expiration**: Enforce a strict 15-minute TTL on OTP codes to prevent database bloat in the temporary verification cache/table. Redis is highly recommended for storing these transient codes rather than the primary PostgreSQL instance.
