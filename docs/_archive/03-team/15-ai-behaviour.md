# AI Behaviour: Team Management

## Staff Selection Logic
When a customer asks to book a service (e.g., "I need a Swedish Massage"):
1. The AI uses the `getAvailableSlots(serviceId)` tool.
2. The tool inherently filters for `Staff` where `staffServices` contains that `serviceId`.
3. If multiple staff are available, the tool returns a randomized or balanced list.
4. The AI presents the options: *"I have 2:00 PM available with Sarah, or 3:00 PM with Michael. Do you have a preference?"*

## Direct Staff Requests
If a customer asks: *"Can I book with Sarah for tomorrow?"*
1. The AI calls `getAvailableSlots(staffId, date)`.
2. If Sarah is completely blocked via a `staffException`, the tool returns an empty array with a reason.
3. The AI replies: *"Unfortunately, Sarah is out of the office tomorrow. Would you like to book with someone else, or look at Sarah's availability for next week?"*

## Boundary Enforcement
The AI does not hold the Staff Schedules in its prompt context (too much tokens). It relies entirely on the `getAvailableSlots` tool to compute the intersection of Organization Hours, Staff Schedules, Staff Exceptions, and existing Appointments.
