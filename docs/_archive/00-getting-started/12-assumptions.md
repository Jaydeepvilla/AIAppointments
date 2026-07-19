# Architectural Assumptions

This document lists the foundational assumptions driving the current system architecture and design decisions. If any of these assumptions are invalidated, a significant architectural review is required.

## 1. Multi-Tenancy Architecture
- **Assumption**: All organizations share the same database instance and application servers. Data isolation is maintained logically via `organizationId` foreign keys on every table, rather than physically (separate databases per tenant).
- **Implication**: Requires strict Row-Level Security (RLS) or application-level enforcement on every single database query to prevent data leakage.

## 2. Infrastructure Scale
- **Assumption**: The initial growth phase will prioritize horizontal scaling of stateless application servers over complex microservices. 
- **Implication**: The system is structured as a modular monolith (Next.js App Router / Node.js). We assume PostgreSQL can handle the primary operational load for the foreseeable future without sharding.

## 3. Timezone Management
- **Assumption**: A single Organization operates primarily in a single timezone for its schedule.
- **Implication**: The `timezone` string is stored at the `organizations` level, and all internal calendar mathematics derive from this single anchor.

## 4. Calendar Synchronization
- **Assumption**: The platform is not the absolute source of truth for all Staff calendars; many practitioners will continue to use Google Calendar or Outlook for personal events.
- **Implication**: The availability engine must dynamically combine database appointments with real-time (or near real-time cached) external calendar events before offering a slot.

## 5. AI Processing Paradigm
- **Assumption**: Large Language Models (LLMs) are too slow and unpredictable to be used directly for database write operations (like creating an appointment).
- **Implication**: The architecture separates conversational generation (LLM) from operational execution (deterministic code). The LLM determines intent and extracts parameters, but strict backend logic executes the booking.

## 6. Knowledge Base Architecture
- **Assumption**: Most businesses do not have perfectly structured API-ready data. Their knowledge exists in messy websites and PDFs.
- **Implication**: A robust Retrieval-Augmented Generation (RAG) pipeline with vector embeddings is required to feed context to the AI, rather than relying on structured database fields alone.

## 7. User Device Constraints
- **Assumption**: Business owners and managers will heavily utilize mobile devices to check schedules and intervene in conversations.
- **Implication**: The dashboard UI must be built with a responsive, mobile-first design system utilizing Tailwind CSS.

## 8. Financial Transactions
- **Assumption**: The platform acts as a facilitator, not a merchant of record, for appointment deposits.
- **Implication**: Payments will be handled via Stripe Connect or similar payment gateways, offloading PCI compliance and payout logistics.
