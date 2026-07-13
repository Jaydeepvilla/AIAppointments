# API Contracts: Organization Management

## GET `/api/organization`
Fetches the organization profile and business settings.

**Request:** None (Requires Bearer Token with valid Organization context).

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "org_123",
    "name": "Main Street Dental",
    "timezone": "America/New_York",
    "businessHours": {
      "monday": [{"start": "09:00", "end": "17:00"}]
    },
    "holidays": ["2026-12-25"]
  }
}
```

---

## PUT `/api/organization`
Updates the core profile details.

**Request Body:**
```json
{
  "name": "Main Street Dental Studio",
  "phone": "+15551234567"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "org_123",
    "name": "Main Street Dental Studio"
  }
}
```

---

## PUT `/api/organization/settings/hours`
Updates the business hours. Requires Admin/Manager role.

**Request Body:**
```json
{
  "businessHours": {
    "monday": [{"start": "08:00", "end": "16:00"}],
    "tuesday": []
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success"
}
```

---

## POST `/api/organization/settings/holidays`
Adds a single holiday.

**Request Body:**
```json
{
  "date": "2026-07-04",
  "name": "Independence Day"
}
```

**Response (200 OK):**
```json
{
  "status": "success"
}
```
