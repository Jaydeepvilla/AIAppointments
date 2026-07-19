# UI Requirements: Business Onboarding

## Sign Up Screen (`/sign-up`)
- **Email Input**: Required, email format validation.
- **Password Input**: Required, min 8 chars, password strength meter below.
- **Google SSO Button**: Prominent alternative.
- **Loading State**: Button shows spinner and disables upon submit.
- **Error State**: Inline red text below input if validation fails. Toast notification for "Email already in use".

## Email Verification Screen (`/verify-email`)
- **OTP Input**: 6 separate boxes. Auto-advances focus to next box on keystroke. Allows paste (distributes 6 characters across boxes).
- **Resend Code Button**: Disabled for 60 seconds after initial send. Shows countdown timer.
- **Loading State**: Entire 6-box component grays out with a spinner overlay when verifying.
- **Error State**: Input borders turn red. "Invalid code" inline text below.

## Business Details Screen (`/onboarding/business-details`)
- **Business Name Input**: Required text input. Max 100 characters.
- **Industry Dropdown**: Required select input. Options: Dental, Medical, Spa, Salon, Law Firm, Real Estate, Consulting, Gym, Home Services, Other.
- **Timezone Dropdown**: Required select input. Searchable. Must auto-detect and pre-select the user's browser timezone (e.g., `America/New_York`).
- **Submit Button**: Reads "Continue to Plans".
- **Empty State**: N/A (Form fields).

## Plan Selection Screen (`/onboarding/plans`)
- **Billing Toggle**: Switch between "Monthly" and "Annually" (shows % discount badge on Annually).
- **Pricing Cards**: 3 columns (Starter, Professional, Enterprise). Highlight "Professional" as recommended.
- **Action Buttons**: "Select [Plan Name]" at the bottom of each card.
- **Loading State**: Button turns to spinner while generating Stripe URL.

## Dashboard Welcome Modal
- **Trigger**: Appears once when user lands on `/dashboard` with `onboarding=success`.
- **Content**: Congratulatory animation, brief explanation of next steps.
- **Action**: "Let's Go" button closes modal and highlights the setup checklist.
