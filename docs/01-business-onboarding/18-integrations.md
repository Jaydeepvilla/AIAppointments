# Integrations: Business Onboarding

## Required Integrations
1. **Authentication Provider (e.g., Clerk / Auth0)**
   - Used for email/password hashing, Google SSO, and JWT token issuance.
   - Core dependency. If this is down, no new users can sign up.

2. **Payment Gateway (Stripe)**
   - Used for Checkout Sessions and Subscription creation.
   - Core dependency. We do not store PANs (Primary Account Numbers) natively; everything is tokenized via Stripe Elements/Checkout.

3. **Transactional Email Service (SendGrid / Resend)**
   - Used to deliver the OTP codes and Welcome receipts.
   - Strict requirement: High deliverability IP pool to ensure OTPs do not land in spam folders.

## Future Integrations
- **Clearbit / ZoomInfo Enrichment**: Automatically pull the company logo, employee count, and exact website URL based on the user's signup email domain (e.g., `@mainstreetdental.com`). This reduces friction on the Business Details screen.
- **Microsoft Entra ID (SSO)**: For enterprise tier clients requiring strict corporate active directory integration during signup.
