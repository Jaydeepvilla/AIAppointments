# Demo Data: Team Management

## Staff 1 (Linked, Standard Hours)
- **ID**: `staff_7a1b2c3d`
- **Name**: Sarah Jenkins
- **Title**: Lead Massage Therapist
- **UserId**: `user_9f8e7d6c` (Linked)
- **Services**: [ `srv_swedish`, `srv_deep_tissue` ]
- **Buffer Time**: 15 minutes
- **Schedule**:
  ```json
  {
    "monday": [{"start": "09:00", "end": "17:00"}],
    "tuesday": [{"start": "09:00", "end": "17:00"}],
    "wednesday": [],
    "thursday": [{"start": "09:00", "end": "17:00"}],
    "friday": [{"start": "09:00", "end": "17:00"}],
    "saturday": [],
    "sunday": []
  }
  ```

## Staff 2 (Unlinked, Split Shift)
- **ID**: `staff_1x2y3z4w`
- **Name**: Michael Chang
- **Title**: Acupuncturist
- **UserId**: `null` (Unlinked)
- **Services**: [ `srv_acupuncture` ]
- **Buffer Time**: 0 minutes
- **Schedule**:
  ```json
  {
    "monday": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}],
    "tuesday": [],
    "wednesday": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "18:00"}],
    "thursday": [],
    "friday": [],
    "saturday": [{"start": "10:00", "end": "14:00"}],
    "sunday": []
  }
  ```
- **Exceptions**:
  - `Date: 2026-08-15`, `AllDay: true`, `Reason: "Sick Leave"`
