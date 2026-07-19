# Error Handling: Organization Management

## Validation Errors
- **Scenario**: Manager sets business hours with `end` time before `start` time (e.g., `17:00 to 09:00`).
- **Handling**: Client-side validation blocks the save button. If bypassed, the API returns `400 Bad Request` with message: "End time must be after start time." UI displays an inline error on the specific day row.

## Business Logic Errors
- **Scenario**: Staff member attempts to update Business Hours via a direct API call (bypassing the hidden UI).
- **Handling**: API returns `403 Forbidden` with message "Insufficient permissions. Requires Manager or Admin role."

## Third-Party Integration Errors
- **Scenario**: User uploads a valid 1MB PNG logo, but AWS S3 is returning a 503 error.
- **Handling**: The server catches the S3 upload exception, logs it, and returns `502 Bad Gateway`. The UI displays a toast: "Failed to upload logo. Please try again later." The rest of the profile settings can still be saved.

## Edge Case Errors
- **Scenario**: User attempts to add a Holiday date that is already in the array.
- **Handling**: The API silently deduplicates the array using a `Set` before saving, returning a `200 OK` rather than throwing an error, providing a seamless user experience.
