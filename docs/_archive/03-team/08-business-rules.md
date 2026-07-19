# Business Rules: Team Management

1. **Organizational Boundary Enforced**: A staff member's working hours can never exceed the Organization's open hours. If the clinic closes at 5 PM, a staff member cannot be scheduled until 6 PM.
2. **Resource Abstraction**: A `Staff` entity does not necessarily mean a human. It represents a bookable resource. It could be "Massage Room 1" or "Dr. Smith".
3. **Buffer Times**: The `bufferTime` assigned to a staff member is strictly applied *after* every appointment they perform. If Dr. Smith has a 15m buffer, and performs a 60m service at 9:00 AM, they are completely unavailable until 10:15 AM.
4. **Service Mapping Requirement**: A staff member must have at least ONE service assigned to them. Without a service, the AI cannot book them.
5. **Dashboard Access is Optional**: A staff member can exist on the calendar without ever having a User account to log into the dashboard (e.g., junior staff managed entirely by the owner).
