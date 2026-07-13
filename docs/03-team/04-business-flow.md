# Business Flow: Team Management

## Happy Path: Onboarding a New Hire
1. Manager navigates to `Settings -> Team`.
2. Clicks "Add Staff Member".
3. Enters "Sarah Jenkins", Title: "Lead Massage Therapist".
4. Toggles "Send Dashboard Invite" and enters `sarah@spa.com` with role `Staff`.
5. Selects Services: "Swedish Massage", "Deep Tissue Massage".
6. Sets Weekly Hours: Mon-Fri, 09:00 - 17:00.
7. Sets specific Buffer Time: 15 minutes.
8. Clicks Save.
9. Sarah receives an email invite. The AI immediately begins offering Sarah's slots for Massage services.

## Alternative Flow: Dummy Resource (Room)
1. Manager wants to restrict bookings based on physical room availability, not just human staff.
2. Manager adds "Staff Member" named "Room A".
3. Does NOT send a dashboard invite (unlinked staff).
4. Assigns Services: "X-Ray".
5. Sets Weekly Hours.
6. The AI now treats "Room A" as the constraint for X-Ray bookings.

## Failure Flow: Out of Bounds Scheduling
1. Organization hours are set to close at 17:00.
2. Manager attempts to set Sarah's schedule to work until 18:00.
3. UI intercepts the save action, highlights the field, and displays: "Staff hours cannot exceed Organization business hours."

## Recovery Flow: Expired Invite
1. Sarah doesn't click the invite email for 7 days (token expires).
2. Sarah clicks the link and gets an "Invalid Link" error.
3. Manager navigates to Sarah's profile in the dashboard and clicks "Resend Invite".
4. A new email with a fresh JWT token is dispatched.
