# Business Rules

This document outlines the global, non-negotiable operational rules that the system and the AI must enforce across all interactions.

## 1. Booking Rules
- **No Double Booking**: The system must never allow two appointments to occupy the same time slot for a single staff member or constrained resource.
- **Minimum Lead Time**: Appointments cannot be booked closer to the current time than the defined `minLeadTime` (default: 2 hours).
- **Maximum Lookahead**: Appointments cannot be booked further into the future than the defined `maxLookahead` (default: 30 days).
- **Service Mapping**: An appointment must always be associated with a valid, active Service and an eligible, active Staff Member.

## 2. Cancellation Rules
- **Lead Time Constraint**: Customers cannot cancel appointments via the AI/Widget if the current time is within the `cancellationLeadTime` (default: 24 hours) prior to the appointment. They must be instructed to call the business directly.
- **Data Integrity**: Cancelling an appointment does not delete the record; it changes the status to `cancelled` and records the timestamp and actor.

## 3. Reschedule Rules
- **Constraint Inheritance**: Rescheduling must enforce the same rules as Cancellation (cannot reschedule within 24 hours) and Booking (must adhere to buffer times and overlaps).
- **Event Logging**: Every reschedule action must generate a new entry in the `appointmentStatusHistory` table.

## 4. Availability Rules
- **Buffer Times**: The system must inherently pad every appointment with `defaultBufferBefore` and `defaultBufferAfter`, plus any staff-specific `bufferTime`. The slot is only considered available if `Duration + Buffer Before + Buffer After` fits cleanly without overlapping another blocked segment.
- **Source of Truth Hierarchy**: When calculating availability, constraints apply in this order: Organization Holidays > Staff Exception Leaves > Staff Weekly Schedule > Existing DB Appointments > External Calendar Overlaps. If any layer blocks the time, the slot is unavailable.

## 5. Timezone Rules
- **Storage Standard**: All timestamps must be stored in the database in UTC (`Date` objects / ISO strings).
- **Business Normalization**: All schedule generation, availability checks, and operational logic must be executed relative to the organization's configured `timezone` (e.g., `America/New_York`).
- **Customer Context**: The AI must detect or request the customer's timezone context to prevent booking errors across state/country lines.

## 6. Holiday Rules
- **Total Blockade**: If a date exists in the `businessSettings.holidays` array, the entire organization is considered closed for that 24-hour local period. No slots will be generated, regardless of individual staff schedules.

## 7. AI Rules
- **Zero Fabrication**: The AI must never invent services, prices, or policies. If the information is not in the Knowledge Base or Database, the AI must admit ignorance and escalate or prompt the user to call.
- **State Persistence**: The AI must not loop infinitely. If a user fails to provide necessary booking information after 3 attempts, the AI must gracefully exit the booking flow and offer human assistance.
- **Intent Boundary**: The AI must continuously evaluate user intent. If a user switches from "Booking" to "Emergency Questions", the AI must abandon the booking flow and address the immediate query.

## 8. CRM Rules
- **Deduplication**: When a new booking or conversation occurs, the system must attempt to match the Lead Profile using Email or Phone Number. Duplicate profiles must be merged programmatically.
- **Anonymity**: If a user chats without providing contact info, they are tracked via session ID. Once contact info is provided, the entire session history is mapped to the newly created/matched Lead Profile.

## 9. Notification Rules
- **Reminder Proximity**: Reminders must execute strictly at the defined intervals (e.g., 24 hours before, 1 hour before).
- **Opt-Out Compliance**: If a customer opts out of SMS notifications, the system must immediately cease SMS communication and fallback to Email (if allowed).

## 10. Data Ownership Rules
- **Tenant Isolation**: Data belonging to Organization A must never leak, leak context into, or be queryable by Organization B.
- **Right to be Forgotten**: If a customer requests data deletion, their PII must be scrubbed from the `leadProfiles`, but the anonymized appointment slot and financial record may be retained for business accounting purposes.
