# Relationships: Organization Management

```mermaid
erDiagram
    ORGANIZATIONS ||--|| BUSINESS_SETTINGS : "configures"
    ORGANIZATIONS ||--o{ STAFF : "employs"
    ORGANIZATIONS ||--o{ SERVICES : "offers"
    ORGANIZATIONS ||--o{ CUSTOMERS : "serves"
    
    ORGANIZATIONS {
        uuid id
        string name
        string timezone
    }
    BUSINESS_SETTINGS {
        uuid id
        uuid organizationId
        jsonb businessHours
        jsonb holidays
    }
```

## Explanation
- The `businessSettings` table is strictly 1:1 with `organizations`.
- Every major entity in the platform (Staff, Services, Customers) holds an `organizationId` foreign key. The `organizations` table is the absolute root of the multi-tenant architecture. When an organization is deleted, all cascaded data must be purged.
