# User Roles

## Owner
- **Responsibilities**: Ultimate authority over the organization. Responsible for billing, subscription management, and overarching business strategy.
- **Permissions**: Unrestricted access to all modules, settings, and data within their organization.
- **Restrictions**: Cannot view or modify data of other organizations.
- **Relationships**: Can assign any role to any user within their organization. Can transfer ownership.
- **Ownership**: Owns the organization entity, billing profile, and all associated data.

## Admin
- **Responsibilities**: Acts as a proxy for the Owner in managing the technical and operational setup of the platform.
- **Permissions**: Can manage all operational data, AI configurations, integrations, and staff members.
- **Restrictions**: Cannot delete the organization, cannot modify the subscription/billing details, cannot demote or remove the Owner.
- **Relationships**: Manages Managers and Staff.
- **Ownership**: Jointly maintains system configuration alongside the Owner.

## Manager
- **Responsibilities**: Oversees daily operations, scheduling, and customer interactions.
- **Permissions**: Can view all schedules, manage appointments for all staff, interact with all customer profiles, view all AI conversations, and update the knowledge base.
- **Restrictions**: Cannot manage API keys, billing, or organization-level settings. Cannot add new Admins or Managers.
- **Relationships**: Manages Staff schedules and overrides.
- **Ownership**: Owns the day-to-day operational integrity of the schedule and CRM.

## Staff
- **Responsibilities**: Providing the actual services to the customers.
- **Permissions**: Can view their own schedule, block out their own availability (if permitted by global rules), view customer profiles assigned to their appointments, and add notes to appointments.
- **Restrictions**: Cannot view other staff members' schedules, cannot alter global service definitions, cannot access AI configuration or billing. Cannot view top-level financial analytics.
- **Relationships**: Reports to Managers and Admins.
- **Ownership**: Owns their individual calendar and specific appointment outcomes.

## System (AI Agent)
- **Responsibilities**: Autonomous execution of business rules, customer communication, and scheduling.
- **Permissions**: Has programmatic read access to availability, services, and the knowledge base. Has programmatic write access to create appointments, leads, and conversation logs.
- **Restrictions**: Strictly bound by configuration constraints. Cannot alter configurations, bypass business rules, or access billing data.
- **Relationships**: Interacts directly with Customers. Mediated by Managers/Admins via configuration.
- **Ownership**: Owns the execution of the conversational flow.
