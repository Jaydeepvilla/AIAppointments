# Definition of Done: Business Onboarding

The Business Onboarding module is not complete until:

- [x] A user can successfully complete the entire flow from `/sign-up` to `/dashboard` without developer intervention.
- [x] The Stripe webhook correctly activates the subscription in the database within 5 seconds of payment success.
- [x] OTP rate limiting is verified to block brute-force attempts.
- [x] The `Organization` is created with the exact timezone selected in the UI.
- [x] E2E Cypress/Playwright tests successfully run the happy path (using the `000000` OTP bypass in staging).
- [x] No plaintext passwords or PII are visible in the Datadog/Sentry logs.
- [x] The UI is perfectly responsive on mobile devices (specifically the pricing cards and OTP boxes).
