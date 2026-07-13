# System Glossary

This glossary defines the standardized terminology used across the platform, documentation, and codebase. Do not invent synonyms for these entities.

## Core Entities
- **Organization**: The top-level tenant entity representing a single business (e.g., "Main Street Dental"). All data is scoped to an Organization.
- **Workspace**: Often used interchangeably with Organization in the UI, but technically refers to the operational boundary where an Organization's users interact.
- **Business**: The real-world entity that holds the Organization account.
- **User / Workspace Member**: An authenticated human (Owner, Admin, Manager, Staff) who logs into the dashboard to manage the Organization.
- **Staff / Practitioner**: A service provider within the Organization who has a calendar and provides Services. A Staff entity may or may not map to a User account (e.g., a dummy calendar for a Room).

## Operations
- **Service**: A specific offering provided by the Business (e.g., "Teeth Cleaning"). It has a duration, price, and category.
- **Appointment**: A scheduled block of time where a Customer receives a Service from a Staff member.
- **Availability**: The computed free time slots for a Staff member, derived from schedules, exceptions, buffers, and external calendar syncs.
- **Exception (Leave)**: A date-specific override to a Staff's normal weekly schedule (e.g., vacation, sick day).

## Communications & CRM
- **Customer / Contact**: The end-user who purchases services from the Business.
- **Lead (Lead Profile)**: A unified profile representing a Customer or potential Customer, encompassing their contact info, conversation history, and appointment history.
- **Conversation**: A continuous or session-based interaction thread between a Lead and the AI Agent or a Workspace Member.
- **AI Agent**: The autonomous conversational engine handling inquiries and bookings on behalf of the Business.
- **Intent**: The computed purpose of a customer's message (e.g., "booking", "cancellation", "pricing_inquiry").
- **Qualification Flow**: A structured set of questions the AI must ask a Lead before allowing them to book a specific service or escalating them.

## Knowledge & AI Context
- **Knowledge Base**: The collection of all documents, URLs, and FAQs that provide context to the AI Agent.
- **Source**: An origin of knowledge (e.g., a website URL, a PDF file).
- **Document**: A processed representation of a Source within the Knowledge Base.
- **Chunk / Embedding**: A small segment of a Document converted into a vector for AI semantic search.

## System & Billing
- **Subscription**: The recurring payment plan associated with an Organization.
- **Tenant**: The isolated data environment belonging to an Organization.
- **Integration**: A connection between the platform and a third-party service (e.g., Google Calendar, Stripe).
