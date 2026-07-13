# Error Handling: Business Onboarding

## Validation Errors
- **Scenario**: User submits an invalid email format.
- **Handling**: Client-side (Zod) intercepts before API call. Highlights field red with text: "Please enter a valid email address."
- **Scenario**: Password too weak.
- **Handling**: Client-side prevents submission. UI indicates which rules are failing (e.g., "Missing special character").

## Business Logic Errors
- **Scenario**: Email already exists.
- **Handling**: Server returns `409 Conflict`. UI shows a toast notification: "An account with this email already exists. Please log in."
- **Scenario**: OTP is incorrect or expired.
- **Handling**: Server returns `401 Unauthorized`. UI shakes the OTP input box and shows: "Invalid code. Please try again or request a new one."

## Third-Party Integration Errors
- **Scenario**: Stripe API is down or returns a 500 error during Checkout URL generation.
- **Handling**: Server catches the exception, logs to Sentry, and returns a `502 Bad Gateway` standard response. UI shows an empty state on the plans page: "We're experiencing issues connecting to our payment provider. Please try again in a few minutes."
- **Scenario**: Email provider (Resend/SendGrid) fails to dispatch OTP.
- **Handling**: Server returns a `500`. UI alerts the user: "Failed to send verification email. Please contact support."

## Database Server Errors
- **Scenario**: PostgreSQL connection timeout during Organization creation.
- **Handling**: Global exception filter catches the `500`. The transaction is rolled back. The user remains on the Business Details screen and sees a generic error toast to prevent leaking DB stack traces.
