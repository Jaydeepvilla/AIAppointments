# User Stories: Organization Management

## US-ORG-01: Update Business Profile
**As an** Owner,
**I want** to upload my logo and update my business address/phone number,
**So that** my chat widget and emails look professional and branded.
**Acceptance Criteria**:
- File upload accepts JPG/PNG under 2MB.
- Address fields are validated.
**Priority**: High

## US-ORG-02: Configure Business Hours
**As a** Manager,
**I want** to set the days of the week and specific hours my business is open,
**So that** the AI does not offer appointments when we are closed.
**Acceptance Criteria**:
- UI allows setting multiple time blocks per day (e.g., 9:00 AM - 12:00 PM AND 1:00 PM - 5:00 PM).
- UI allows marking a day as "Closed".
**Priority**: Critical

## US-ORG-03: Manage Holidays
**As a** Manager,
**I want** to add specific dates (e.g., Dec 25th) to a Holiday list,
**So that** the entire organization is blocked from bookings on those days.
**Acceptance Criteria**:
- User can pick a date from a calendar component and add an optional label ("Christmas").
- Dates in the past can be viewed but not edited.
**Priority**: High

## US-ORG-04: AI Context Sync
**As a** Customer,
**I want** to ask the AI "What is your address?" or "Are you open on Sunday?",
**So that** I get an instant, accurate answer based on the organization settings.
**Acceptance Criteria**:
- The AI correctly parses the structured `businessSettings` and replies naturally.
**Priority**: Critical
