# Non-Functional Requirements

## Availability
- The core booking engine, chat widget, and webhooks must achieve 99.99% uptime.
- Maintenance windows must be scheduled during historically low-traffic periods (e.g., Sunday 2:00 AM UTC) and require zero-downtime deployment strategies.

## Reliability
- The system must employ circuit breakers for all third-party API dependencies (LLMs, Calendars, Payments). If an external calendar provider is down, the system should gracefully fallback to local database availability checking with a warning.
- Message processing must guarantee at-least-once delivery for webhooks and internal queue processing.

## Security
- **Authentication**: All user access must be secured via robust authentication (e.g., Clerk), supporting MFA.
- **Authorization**: Every API endpoint and server action must verify the `organizationId` and the user's RBAC permissions.
- **Data Protection**: All sensitive data (PII, credentials, access tokens) must be encrypted at rest using AES-256 and in transit using TLS 1.2 or higher.
- **Vulnerability**: The platform must undergo automated SAST/DAST scanning on every PR and an annual manual penetration test.

## Performance
- **Latency**: 95th percentile (P95) response time for read operations must be under 200ms. P95 for AI generation must be under 1500ms.
- **Rendering**: The Dashboard UI must render visibly in under 1.5 seconds.
- **Concurrency**: The availability engine must compute overlapping schedule matrices for 50+ staff members simultaneously without blocking the Node event loop.

## Scalability
- The architecture must scale horizontally. Application nodes must be stateless.
- Database connections must be managed via connection pooling (e.g., PgBouncer) to prevent exhaustion during traffic spikes.
- Web Socket/SSE connections for real-time inbox updates must support scaling across multiple instances (e.g., via Redis Pub/Sub).

## Accessibility
- The Customer-facing Widget must achieve a 100% Lighthouse Accessibility score.
- The Dashboard UI must adhere strictly to WCAG 2.1 AA standards, ensuring full operability via keyboard and screen readers.

## Logging & Monitoring
- All unhandled exceptions must be captured in a centralized error tracking system (e.g., Sentry) with full stack traces and contextual metadata.
- All critical business logic executions (appointments created, settings changed) must write structured logs to stdout for ingestion by Datadog or similar.
- Uptime monitoring must verify critical paths (e.g., simulating a booking flow) every minute.

## Backups
- The primary PostgreSQL database must execute automated daily full backups and continuous WAL archiving (Point-in-Time Recovery up to 7 days).
- Backups must be geographically isolated from the primary deployment region.

## Privacy & Compliance
- The system must isolate tenant data logically and programmatically.
- Personally Identifiable Information (PII) logging is strictly prohibited (e.g., emails/phone numbers must be masked in raw application logs).
- Provide automated tools for GDPR Right to Access and Right to be Forgotten requests.

## Maintainability
- Code coverage for critical domain logic (booking math, pricing, permissions) must exceed 90%.
- The codebase must enforce strict ESLint and Prettier formatting rules to prevent stylized divergence.
- Dependencies must be audited for security vulnerabilities automatically on a weekly basis.
