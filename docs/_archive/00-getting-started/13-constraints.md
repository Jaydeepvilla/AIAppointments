# Constraints

## Technical Constraints
- **Framework Ecosystem**: The core platform is bound to the Next.js App Router ecosystem. All server-side logic must be compatible with Next.js API routes and Server Actions.
- **Database Paradigm**: The system relies heavily on PostgreSQL (via Drizzle ORM). Use of NoSQL is restricted to specific caching or transient logging layers to maintain ACID compliance for scheduling.
- **AI Latency**: External LLM API calls (e.g., OpenAI, Anthropic) introduce an unavoidable baseline latency. The system must disguise this latency via optimistic UI updates or typing indicators.
- **Third-Party Rate Limits**: Integrations with Google Calendar, Microsoft Graph, and Stripe are subject to strict API rate limits. The system must implement robust backoff, jitter, and queuing strategies.

## Business Constraints
- **Zero-Friction Onboarding**: The time-to-value must remain under 1 hour. We cannot build features that require businesses to spend days manually structuring their data before the AI works.
- **Pricing Margins**: LLM usage scales linearly with conversation volume. The system must employ caching and prompt optimization to maintain a viable gross margin per tenant.
- **Support Burden**: Complex configuration UI drastically increases support tickets. Features must have sensible defaults.

## Legal Constraints
- **HIPAA Compliance**: For medical clients in the US, the platform must handle Protected Health Information (PHI) according to HIPAA standards. This mandates encryption at rest, encryption in transit, strict audit logging, and Business Associate Agreements (BAAs) with all sub-processors.
- **GDPR / CCPA**: The system must provide mechanisms for data export (Data Portability) and complete anonymization/deletion (Right to be Forgotten) upon request.
- **Consent to AI**: Certain jurisdictions require explicit notification that a user is communicating with an AI. The chat widget must clearly indicate its automated nature.

## AI Constraints
- **Non-Determinism**: LLMs are inherently non-deterministic. We cannot guarantee identical phrasing for identical inputs.
- **Context Window Limits**: RAG (Retrieval-Augmented Generation) must carefully prioritize which knowledge chunks are injected into the prompt, as massive context windows increase latency, cost, and hallucination risk.
- **Action Verification**: The AI cannot be allowed to execute destructive actions (like deleting an appointment) without explicit human confirmation or extremely rigorous deterministic safety checks.
