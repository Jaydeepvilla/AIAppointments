# Database Schema: Team Management

## Entity: `staff`
- `id`: UUID (Primary Key)
- `organizationId`: UUID (Foreign Key -> organizations.id)
- `userId`: UUID (Nullable, Foreign Key -> users.id). Unlinked staff are allowed.
- `name`: VARCHAR(100)
- `title`: VARCHAR(50) (Nullable)
- `bio`: TEXT (Nullable)
- `avatarUrl`: VARCHAR(255) (Nullable)
- `bufferTime`: INT (Default 0)
- `isHidden`: BOOLEAN (Default false)
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP
- `deletedAt`: TIMESTAMP (For soft deletes)

## Entity: `staffSchedules`
A 1:1 table linked to `staff`.
- `id`: UUID (Primary Key)
- `staffId`: UUID (Foreign Key -> staff.id)
- `weeklyHours`: JSONB
  ```json
  {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": []
  }
  ```

## Entity: `staffExceptions`
- `id`: UUID (Primary Key)
- `staffId`: UUID (Foreign Key -> staff.id)
- `date`: DATE
- `allDay`: BOOLEAN
- `startTime`: TIME (Nullable)
- `endTime`: TIME (Nullable)
- `reason`: VARCHAR(255) (Nullable)

## Entity: `staffServices` (Junction Table)
- `staffId`: UUID (Foreign Key -> staff.id)
- `serviceId`: UUID (Foreign Key -> services.id)
- Primary Key: `(staffId, serviceId)`
