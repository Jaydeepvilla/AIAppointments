# User Flow: Organization Management

## Screen: Organization Settings (`/dashboard/settings/organization`)

### Section 1: General Profile
- **Actions**:
  - Drag and drop image into Logo Uploader.
  - Type into Business Name text input.
  - Type into Phone Number input.
  - Type into Address inputs (Street, City, State, Zip, Country).
  - Select Timezone from dropdown.
  - Click "Save Profile".

### Section 2: Business Hours
- **Actions**:
  - For each day of the week (Monday - Sunday):
    - Toggle Switch (Open / Closed).
    - If Open: Select Start Time (Dropdown, 15m increments).
    - Select End Time (Dropdown, 15m increments).
    - Click "+" to add a split shift.
    - Click "Trash" icon to remove a split shift.
  - Click "Save Hours".

### Section 3: Holidays & Exceptions
- **Actions**:
  - Click "Add Holiday" button.
  - Select Date from DatePicker modal.
  - Enter Label (e.g., "Thanksgiving").
  - Click "Confirm".
  - View list of upcoming holidays.
  - Click "X" next to a holiday to delete it.
