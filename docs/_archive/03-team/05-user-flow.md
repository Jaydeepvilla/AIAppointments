# User Flow: Team Management

## Screen: Team List (`/dashboard/settings/team`)
- **Actions**:
  - View data table of all staff members.
  - Search by name.
  - Filter by Role (Admin, Manager, Staff).
  - Click "Add Staff" button -> Opens Slide-over panel.
  - Click on a staff row -> Routes to `/dashboard/settings/team/[id]`.

## Screen: Staff Detail - Profile Tab
- **Actions**:
  - Update Avatar, Name, Title, Bio.
  - Set Default Buffer Time (Minutes dropdown: 0, 5, 10, 15, 30).
  - Toggle: "Hide from AI bookings" (Allows staff to exist for internal use only).
  - Select Services (Checkboxes).

## Screen: Staff Detail - Schedule Tab
- **Actions**:
  - Weekly Hours: Identical component to Organization hours.
  - Click "Save Schedule".

## Screen: Staff Detail - Exceptions Tab
- **Actions**:
  - Click "Add Time Off".
  - Select Date.
  - Select "All Day" toggle, OR Start/End times.
  - Click "Add".
  - View list of upcoming time off. Click trash icon to delete.

## Screen: Staff Detail - Access Tab
- **Actions**:
  - View current linked User (if any).
  - If unlinked: Enter Email, select Role, click "Send Invite".
  - If linked: Change Role dropdown, click "Update Role".
  - Click "Revoke Access" (Disconnects User, keeps Staff calendar intact).
