# API Contracts: Team Management

## GET `/api/staff`
Lists all staff for the organization.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "staff_123",
      "name": "Sarah Jenkins",
      "title": "Lead Therapist",
      "avatarUrl": "https://...",
      "userId": "user_456",
      "servicesCount": 3
    }
  ]
}
```

---

## POST `/api/staff`
Creates a new staff member.

**Request Body:**
```json
{
  "name": "Sarah Jenkins",
  "title": "Lead Therapist",
  "bufferTime": 15
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": { "id": "staff_123" }
}
```

---

## PUT `/api/staff/:id/schedule`
Updates the weekly schedule.

**Request Body:**
```json
{
  "weeklyHours": {
    "monday": [{"start": "09:00", "end": "17:00"}]
  }
}
```

---

## POST `/api/staff/:id/exceptions`
Adds time off.

**Request Body:**
```json
{
  "date": "2026-08-15",
  "allDay": false,
  "startTime": "14:00",
  "endTime": "16:00",
  "reason": "Dentist"
}
```
