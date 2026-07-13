# Test Cases: Team Management

## Positive Paths
1. **[TC-TEAM-01]**: Manager creates a new Staff member with no email invite. The record saves and appears in the list.
2. **[TC-TEAM-02]**: Manager creates a Staff member AND checks the "Send Invite" box with a valid email. The record saves and an invite token is generated.
3. **[TC-TEAM-03]**: Staff member logs in, navigates to their own Exceptions tab, and blocks out next Friday afternoon.
4. **[TC-TEAM-04]**: Manager successfully assigns 3 Services to a Staff member via checkboxes.

## Negative Paths
5. **[TC-TEAM-05]**: Staff member attempts to change their own Weekly Schedule. UI blocks it. Direct API call returns `403 Forbidden`.
6. **[TC-TEAM-06]**: Manager attempts to invite a User with the role `Admin`. API returns `403 Forbidden`.
7. **[TC-TEAM-07]**: Manager sets Staff hours to `09:00 - 18:00`, but Organization hours close at `17:00`. API returns `400 Bad Request` (Out of Bounds).

## Integration
8. **[TC-TEAM-08]**: After assigning `srv_acupuncture` to Michael Chang, the AI correctly identifies Michael as an option when a user asks "Can I get acupuncture?".
9. **[TC-TEAM-09]**: After Sarah adds a sick day for next Monday, a query to `getAvailableSlots` for next Monday returns zero slots for Sarah, but normal slots for Michael.
