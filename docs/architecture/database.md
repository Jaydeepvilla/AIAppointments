# Database Architecture

Operator uses PostgreSQL as its primary database, accessed via [Drizzle ORM](https://orm.drizzle.team/).

All tables, relations, and enums are defined in a single schema file:
**File:** `src/server/db/schema.ts` (3,232 lines, 40+ tables)

---

## ORM and Connection

We use `postgres.js` as the underlying database driver. The database connection is instantiated as a singleton in `src/server/db/index.ts` to prevent connection exhaustion during hot-reloads in development.

```typescript
// src/server/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema });
```

---

## Core Entities & Relationships

The database is highly relational. Below is a grouping of the major tables by domain.

### 1. Identity & Auth (Custom Session System)
Operator does not use NextAuth or Clerk. It uses a custom session system.
- `users`: Core identity (email, password hash, 2FA secret)
- `sessions`: Active login sessions (session token, expiry, device info)
- `profiles`: User personal info (name, avatar, timezone)
- `login_attempts`: Rate limiting and audit log for security
- `devices`: Fingerprinted devices to detect new logins
- `refresh_tokens`, `verification_tokens`, `password_reset_tokens`

### 2. Multi-tenancy (Organizations)
Everything in Operator belongs to an Organization.
- `organizations`: The business entity (tenant)
- `memberships`: Associates `users` to `organizations` with a `role` (`owner`, `admin`, `manager`, `staff`)

**Crucial Query Rule:** Every query accessing tenant data MUST filter by `organizationId`.

### 3. Business Settings & Calendar
- `business_profiles`: Public-facing info (name, industry, address, description)
- `business_settings`: Configuration (timezone, booking lead time, cancellation policy)
- `staff`: Employees available for booking
- `staffCalendars`: OAuth tokens for Google Calendar, Outlook, etc.
- `services` & `service_categories`: Bookable offerings

### 4. Omnichannel & Conversations
- `channelConnections`: WhatsApp, Instagram, FB Messenger credentials
- `conversations`: A continuous chat thread with a customer
- `conversation_messages`: Individual inbound/outbound messages
- `leads` & `lead_profiles`: Customer records generated from conversations
- `escalations`: Requests for human intervention

### 5. AI Knowledge Base
- `knowledge_documents`: Uploaded files or scraped websites
- `knowledge_chunks`: Text split into ~800 char segments for RAG
- `knowledge_categories` & `knowledge_tags`: Metadata for filtering
- `faq_items`: Specific Q&A pairs injected into the prompt

### 6. Billing & Subscriptions
- `subscriptions`: Active SaaS plans
- `invoices`, `payments`, `payment_methods`
- `billing_events`: Webhook audit trail

---

## Conventions

1. **Table Names:** Database tables use `snake_case` (e.g., `business_profiles`).
2. **Drizzle Table Exports:** Exported Drizzle table objects use `camelCase` (e.g., `businessProfiles`).
3. **Relation Exports:** Drizzle relation exports append `Relations` (e.g., `businessProfilesRelations`).
4. **Enums:** Database enums use the `pgEnum` export (e.g., `roleEnum`).

---

## Example Query Pattern

All database access should happen in the `src/server/repositories/` layer.

```typescript
// Good: Filtering by organizationId
export async function getActiveServices(organizationId: string) {
  return await db
    .select()
    .from(services)
    .where(
      and(
        eq(services.organizationId, organizationId),
        eq(services.isArchived, false)
      )
    );
}
```

## Migrations

Migrations are generated using `drizzle-kit`.

Generate a migration after changing `schema.ts`:
```bash
npx drizzle-kit generate:pg
```

Apply migrations to the database:
```bash
npx drizzle-kit push:pg
```
