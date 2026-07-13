# Test Cases: Business Onboarding

## Positive Paths
1. **[TC-OB-01]**: User successfully creates an account, verifies OTP, provisions organization, selects a plan, pays, and reaches the dashboard.
2. **[TC-OB-02]**: User successfully authenticates via Google SSO, bypassing OTP, and provisions the organization.

## Negative Paths
3. **[TC-OB-03]**: User attempts to sign up with an existing email. System rejects with appropriate UI error.
4. **[TC-OB-04]**: User enters an incorrect OTP code 3 times. System rejects all attempts and requests they resend code.
5. **[TC-OB-05]**: User submits Business Details with missing Industry. Form validation prevents submission.
6. **[TC-OB-06]**: User card is declined at Stripe Checkout. User is safely returned to Plan Selection.

## Boundary & Edge Cases
7. **[TC-OB-07]**: User enters exactly 100 characters in the Business Name field (allowed).
8. **[TC-OB-08]**: User enters 101 characters in the Business Name field (rejected by frontend validation).
9. **[TC-OB-09]**: User closes the browser at Plan Selection, logs back in 1 hour later, and is forced directly back to Plan Selection (bypassing Auth/Details).

## Security
10. **[TC-OB-10]**: Attacker attempts to bypass `/onboarding/plans` and navigate directly to `/dashboard` via URL manipulation. Middleware successfully intercepts and redirects back to plans.
11. **[TC-OB-11]**: Attacker attempts to brute force OTP endpoint. System implements rate limiting after 5 failed attempts from the same IP.

## Performance
12. **[TC-OB-12]**: The `/api/auth/register` endpoint responds in under 300ms under standard load.

## Accessibility
13. **[TC-OB-13]**: A user utilizing a screen reader can successfully navigate the 6-box OTP input component.
14. **[TC-OB-14]**: All color contrasts on the Plan Selection cards pass WCAG AA standards.
