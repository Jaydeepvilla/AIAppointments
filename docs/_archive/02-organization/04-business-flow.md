# Business Flow: Organization Management

## Happy Path: Updating Hours
1. User logs into Dashboard.
2. Navigates to `Settings -> Organization -> Business Hours`.
3. User toggles "Sunday" to Closed.
4. User changes Monday's hours from `09:00 - 17:00` to `08:00 - 16:00`.
5. User clicks "Save Changes".
6. System validates the payload, updates the `businessSettings` JSONB column, and returns a success toast.
7. Any subsequent AI availability check instantly reflects the new bounds.

## Alternative Flow: Split Shifts
1. User wants to close for lunch daily.
2. Under Monday, user clicks "+ Add Hours".
3. Sets Block 1: `09:00 - 12:00`.
4. Sets Block 2: `13:00 - 17:00`.
5. System saves this as a nested array for Monday.

## Failure Flow: Invalid Hours
1. User sets Monday hours to `17:00 - 09:00` (End time before Start time).
2. UI intercepts the error before API submission, highlighting the row red.
3. User corrects to `09:00 - 17:00` and saves.

## Escalation Flow: Exceeding Storage Limits
1. User attempts to upload a 25MB `.bmp` file for their logo.
2. The client-side dropzone rejects the file immediately, displaying "File must be a PNG/JPG under 2MB".
