# Edge Cases: Business Onboarding

## 1. Network Drop During Organization Creation
- **Scenario**: User submits Business Details. The server creates the Organization, links the User, but the client disconnects before receiving the `201 Created` response. The user refreshes the page.
- **Resolution**: The `GET /api/users/me` endpoint must return the user's current state. The UI must detect that the User has an `Organization` but no `Subscription`, and automatically route them forward to the Plan Selection screen, preventing them from trying to create a second Organization.

## 2. Shared Email / Aliases
- **Scenario**: User attempts to sign up with `owner+dental@clinic.com` when `owner@clinic.com` already exists.
- **Resolution**: Handled securely by standard RFC 5322 compliance. The system treats these as distinct strings unless the authentication provider is explicitly configured to merge plus-aliases (not recommended for strict isolation).

## 3. Simultaneous Tab Signup
- **Scenario**: User opens the signup page in Tab A and Tab B. They submit Tab A, receive the OTP, but then enter the OTP into Tab B.
- **Resolution**: OTP validation must rely on server-side session matching (via secure HttpOnly cookies) mapped to the email address, rather than local component state. It should succeed regardless of which tab it is entered into, provided the session cookie is present.

## 4. Stripe Checkout Abandonment
- **Scenario**: User reaches the Stripe Checkout hosted page but clicks the browser back button instead of completing payment.
- **Resolution**: Stripe does not redirect back to a failure URL on browser back. When the user lands back on `/onboarding/plans`, the UI must fetch the current subscription status (which will still be null) and allow them to re-initiate checkout without duplicating the Organization.

## 5. Timezone Edge Cases (Browser Obfuscation)
- **Scenario**: User is utilizing a VPN or privacy browser that obfuscates the `Intl.DateTimeFormat().resolvedOptions().timeZone` API, returning an empty or generic UTC string.
- **Resolution**: The UI Timezone dropdown must have a sensible fallback (e.g., empty state requiring manual selection, or defaulting to a major timezone like 'America/New_York' with a prominent warning to verify).
