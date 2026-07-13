# Demo Data: Organization Management

## Organization: Nexx Dental Group
- **ID**: `org_b7e412a8-1234-4567-8901-abcdef123456`
- **Name**: Nexx Dental Group
- **Phone**: `+12125559876`
- **Address**: 1200 Dental Way, Suite 400, New York, NY 10001
- **Timezone**: `America/New_York`
- **Business Hours**:
  ```json
  {
    "monday": [{"start": "08:00", "end": "12:00"}, {"start": "13:00", "end": "17:00"}],
    "tuesday": [{"start": "08:00", "end": "17:00"}],
    "wednesday": [{"start": "08:00", "end": "17:00"}],
    "thursday": [{"start": "08:00", "end": "17:00"}],
    "friday": [{"start": "08:00", "end": "14:00"}],
    "saturday": [],
    "sunday": []
  }
  ```
- **Holidays**:
  ```json
  [
    {"date": "2026-11-26", "name": "Thanksgiving Day"},
    {"date": "2026-12-25", "name": "Christmas Day"}
  ]
  ```

*This data demonstrates a split shift on Monday (closed for lunch), an early closure on Friday, and standard closed weekends.*
