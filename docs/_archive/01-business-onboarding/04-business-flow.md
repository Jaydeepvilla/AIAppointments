# Business Flow: Business Onboarding

## Happy Path
1. **Acquisition**: User clicks "Start Free Trial" on the marketing site.
2. **Authentication**: User provides Email/Password and clicks "Sign Up".
3. **Verification**: User receives a 6-digit OTP via email, enters it into the UI.
4. **Provisioning**: User enters Business Name, Timezone, and Industry. System creates the `Organization`, links the `User` as `Owner`, and provisions default settings.
5. **Subscription**: User selects the "Professional" plan, enters credit card details via Stripe Checkout, and payment succeeds.
6. **Activation**: User is redirected to the Dashboard with a "Welcome" modal and a checklist for next steps.

## Alternative Flow: SSO (Google)
1. User clicks "Continue with Google".
2. Authentication and Verification happen simultaneously via the OAuth provider.
3. User bypasses the OTP screen and lands directly on the Provisioning screen (Business Name, Timezone).
4. Proceeds to Subscription and Activation.

## Failure Flow: Payment Declined
1. User reaches the Subscription step and enters card details.
2. Stripe declines the card (e.g., insufficient funds).
3. User is returned to the plan selection screen with a clear error message: "Payment declined. Please try a different card."
4. The Organization exists in the database, but access to the dashboard is blocked until a valid subscription is established.

## Recovery Flow: Abandoned Onboarding
1. User completes Authentication and Provisioning but closes the browser before completing the Subscription step.
2. User returns 2 days later and logs in.
3. System detects the missing subscription and immediately routes the user to the Plan Selection screen, bypassing Auth and Provisioning.

## Escalation Flow: Email Not Received
1. User reaches the Verification step but does not receive the OTP email.
2. User clicks "Resend Code" (limited to 3 times per hour).
3. If still not received, user clicks "Contact Support".
4. Support ticket is generated with the user's unverified email for manual intervention.
