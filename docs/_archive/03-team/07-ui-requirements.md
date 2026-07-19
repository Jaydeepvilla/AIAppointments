# UI Requirements: Team Management

## Team List Table
- **Columns**: Avatar+Name, Title, Services Count, Role (Badge), Status (Active/Invited).
- **Empty State**: Illustration of a team. Text: "Add your first staff member to start taking bookings."

## Profile Tab
- **Avatar Upload**: Circular dropzone.
- **Services Select**: A multi-select dropdown with checkboxes. Must display tags for selected services.
- **Hide from AI Toggle**: Switch with label and helper text: "If enabled, this staff member will not be offered to customers by the AI, but can still be booked manually."

## Schedule Tab
- Identical component to the Organization Business Hours component, but with an info banner at the top: *"Staff hours cannot exceed the global Organization hours."*

## Exceptions Tab (Time Off)
- **Form**: DatePicker. Toggle for "All Day". If false, shows Start Time and End Time dropdowns. Text input for "Reason (Optional)".
- **List**: Table showing Date, Time (or All Day), and Reason.

## Access Tab
- **Invite State**: Text input for Email, select for Role (Admin, Manager, Staff). Button "Send Invite Link".
- **Active State**: Display User's email. Dropdown to change Role. Danger button to "Revoke Access".
