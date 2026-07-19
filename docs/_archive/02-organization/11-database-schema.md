# Database Schema: Organization Management

## Entity: `organizations`
- `id`: UUID (Primary Key)
- `name`: VARCHAR(100)
- `industry`: VARCHAR(50)
- `timezone`: VARCHAR(50)
- `logoUrl`: VARCHAR(255) (Nullable)
- `phone`: VARCHAR(20) (Nullable)
- `addressStreet`: VARCHAR(255) (Nullable)
- `addressCity`: VARCHAR(100) (Nullable)
- `addressState`: VARCHAR(50) (Nullable)
- `addressZip`: VARCHAR(20) (Nullable)
- `addressCountry`: VARCHAR(50) (Nullable)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

## Entity: `businessSettings`
A 1:1 table linked to `organizations` holding operational JSON to prevent column bloat on the main tenant table.
- `id`: UUID (Primary Key)
- `organizationId`: UUID (Foreign Key -> organizations.id, Unique)
- `businessHours`: JSONB
  ```json
  {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [], 
    // empty means closed
  }
  ```
- `holidays`: JSONB (Array of string dates)
  ```json
  ["2026-11-26", "2026-12-25"]
  ```
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP
