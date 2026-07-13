# UI Requirements: Organization Management

## Form Layout
- Two-column layout on desktop (Nav on left, Forms on right). Single column on mobile.
- Forms should be grouped into Cards: "Profile", "Hours of Operation", "Holidays".
- A floating "Save Changes" bar should appear at the bottom of the screen if unsaved changes are detected.

## Business Hours Component
- Each day is a row.
- **Toggle**: A smooth switch (green for Open, gray for Closed).
- **Time Inputs**: Native `<select>` or custom dropdown containing times in 15-minute increments (`00:00` to `23:45`).
- **Split Shift Button**: A ghost button `+ Add Hours` visible only when the day is toggled Open.
- **Validation State**: If `endTime <= startTime`, the dropdown borders turn red.

## Holiday Component
- **Empty State**: An illustration with text "No upcoming holidays scheduled." and an "Add Holiday" button.
- **List State**: A clean table or list showing `Date (MMM DD, YYYY)` and `Name`.
- **Delete Action**: A subtle trash icon on hover.

## Logo Upload Component
- Circular dropzone.
- Shows current logo if exists, or business initials if null.
- Hover state: Overlay with camera icon and "Update Logo".
- Loading state: Spinner overlay while uploading to storage bucket.
