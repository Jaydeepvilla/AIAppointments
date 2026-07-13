# Demo Data: Business Onboarding

To accurately test and visualize the onboarding flow, use the following logical, realistic personas rather than random strings.

## Persona 1: The Modern Dental Clinic
- **Email**: `dr.smith@smilesstudio.com`
- **Password**: `DentalSecur1ty!2026`
- **Business Name**: Smile Studio Dentistry
- **Industry**: Dental
- **Timezone**: `America/Los_Angeles` (Pacific Time)
- **Plan Selected**: Professional (Monthly)
- **Expected Outcome**: Lands on Dashboard. AI tone internally seeded as professional and compliant.

## Persona 2: The Independent Consultant
- **Email**: `sarah@sarahjconsulting.net`
- **Password**: `Consult1ngR0cks#`
- **Business Name**: Sarah Jenkins Strategy
- **Industry**: Consulting
- **Timezone**: `Europe/London` (GMT)
- **Plan Selected**: Starter (Annual)
- **Expected Outcome**: Lands on Dashboard.

## Persona 3: The High-End Spa (Failed Payment)
- **Email**: `hello@tranquilityspa.com`
- **Password**: `Relaxation123$`
- **Business Name**: Tranquility Wellness Spa
- **Industry**: Spa
- **Timezone**: `America/New_York` (Eastern Time)
- **Plan Selected**: Enterprise (Monthly)
- **Expected Outcome**: Fails at Stripe Checkout due to simulated declined card (use Stripe test card `4000 0000 0000 0300`). User remains on Plan Selection screen. Organization is created, but Subscription is null.

## OTP Bypass (For E2E Testing)
In non-production environments (`NODE_ENV !== 'production'`), entering `000000` as the OTP code should instantly bypass verification for any email address to allow automated Cypress/Playwright scripts to proceed without needing a real mail-catching service.
