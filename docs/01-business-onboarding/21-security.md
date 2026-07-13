# Security: Business Onboarding

## Role-Based Access Control (RBAC)
- The onboarding flow is the **only** place in the application where the `owner` role is programmatically assigned without requiring approval from an existing administrator.
- The `owner` role is strictly bound to the `organizationId` generated in the same transaction. A user cannot hijack the assignment to become an owner of an existing organization.

## PII Handling
- **Passwords**: Never logged. Hashed immediately using Argon2 or bcrypt (via the auth provider) before resting in the database.
- **Emails**: Stored in plain text for login purposes, but must be masked (`o***r@clinic.com`) in any application-level logging (e.g., Datadog, Sentry).

## Encryption
- All onboarding forms must be served over strictly enforced HTTPS (TLS 1.2+). HSTS headers must be present to prevent downgrade attacks.
- Stripe payment data (credit card numbers) never touches our servers. It is tokenized directly from the client browser to Stripe's PCI-compliant vaults.

## Audit Logging
- Even though the user is brand new, the following events must be permanently written to the `audit_logs` table:
  - `USER_REGISTERED`
  - `EMAIL_VERIFIED`
  - `ORGANIZATION_CREATED` (capturing the IP address and User Agent).

## Compliance
- **Rate Limiting**: To prevent brute-force attacks on the OTP endpoint, limit attempts to 5 per 15 minutes per IP/Email combination.
- **Bot Protection**: The initial `/sign-up` POST must evaluate a CAPTCHA or invisible Turnstile token to prevent automated mass-account creation which could exhaust Stripe customer limits or database capacity.
