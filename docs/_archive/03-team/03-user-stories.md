# User Stories: Team Management

## US-TM-01: Create Staff Member
**As a** Manager,
**I want** to add a new staff member with their name, title, and avatar,
**So that** they can be booked for appointments by customers.
**Acceptance Criteria**:
- Manager can input Name, Title (e.g., "Senior Stylist"), and Bio.
- Avatar upload supported.
**Priority**: Critical

## US-TM-02: Link Dashboard User
**As a** Manager,
**I want** to invite a staff member via email to access the dashboard,
**So that** they can log in and view their own schedule.
**Acceptance Criteria**:
- Manager enters an email address. System sends an invite link.
- When the staff member clicks the link and signs up, their `User` record is linked to the existing `Staff` calendar record.
**Priority**: High

## US-TM-03: Assign Services
**As a** Manager,
**I want** to select which specific services a staff member can perform,
**So that** the AI doesn't book a Haircut with a Nail Technician.
**Acceptance Criteria**:
- UI provides a multi-select checklist of all Organization services.
- Mapping is saved to the `staffServices` junction table.
**Priority**: Critical

## US-TM-04: Set Weekly Schedule
**As a** Manager,
**I want** to define the recurring weekly working hours for a staff member,
**So that** their baseline availability is established.
**Acceptance Criteria**:
- UI identical to Organization Business Hours.
- Validation ensures staff hours do not exceed Organization hours.
**Priority**: Critical

## US-TM-05: Add Schedule Exception (Leave)
**As a** Staff Member,
**I want** to block off a specific date and time (e.g., next Tuesday 2PM - 4PM),
**So that** I can go to a personal appointment without getting booked.
**Acceptance Criteria**:
- User selects a specific calendar date, start time, and end time.
- Reason field (optional).
- Time slot is instantly removed from AI availability.
**Priority**: High
