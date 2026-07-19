# Error Handling: Team Management

## Validation Errors
- **Scenario**: Manager attempts to set a Staff Schedule that extends beyond the Organization Business Hours.
- **Handling**: API returns `400 Bad Request`. `error_code: OUT_OF_BOUNDS`. Message: "Staff hours cannot exceed organization operating hours." UI highlights the specific offending day row.

## Concurrency Errors
- **Scenario**: Two managers attempt to edit Sarah's schedule at the exact same time.
- **Handling**: Last-write-wins is acceptable here, but the UI should use optimistic UI updates. If Manager B's request fails due to a network drop, the UI reverts and displays a toast: "Failed to save schedule. Please check your connection."

## State Errors
- **Scenario**: Manager attempts to delete a Service from a Staff member, but that Staff member already has upcoming appointments booked for that service.
- **Handling**: API returns `409 Conflict`. Message: "Cannot remove this service. Sarah has 3 upcoming appointments for Swedish Massage. Reassign them first."

## Access Errors
- **Scenario**: Staff member attempts to call `PUT /api/staff/:id/schedule` using Postman.
- **Handling**: API checks the JWT role. Returns `403 Forbidden`. Log the unauthorized access attempt to Datadog for security review.
