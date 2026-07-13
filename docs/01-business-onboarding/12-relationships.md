# Relationships: Business Onboarding

```mermaid
erDiagram
    USERS ||--o{ ORGANIZATION_MEMBERS : "belongs to"
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : "has"
    ORGANIZATIONS ||--o| SUBSCRIPTIONS : "billed via"
    
    USERS {
        uuid id
        string email
        boolean emailVerified
    }
    ORGANIZATIONS {
        uuid id
        string name
        string timezone
    }
    ORGANIZATION_MEMBERS {
        uuid userId
        uuid organizationId
        string role
    }
    SUBSCRIPTIONS {
        uuid id
        uuid organizationId
        string status
    }
```

## Explanation
1. A **User** can theoretically belong to multiple **Organizations** (e.g., a manager handling two different clinics), hence the many-to-many relationship bridged by `organizationMembers`. However, during the initial onboarding flow, it creates a 1:1 relationship as the User creates their first Organization.
2. An **Organization** must have exactly one active **Subscription** to permit access to the dashboard. The subscription record is linked via `organizationId`.
