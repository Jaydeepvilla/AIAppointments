# User Flow: Business Onboarding

## Step 1: Sign Up
- **Screen**: `/sign-up`
- **Actions**:
  - Enter Email Address.
  - Enter Password.
  - Click `Create Account` button.
  - OR Click `Continue with Google` button.
- **Decision**: If native auth, proceed to Step 2. If Google SSO, proceed to Step 3.

## Step 2: Email Verification
- **Screen**: `/verify-email`
- **Actions**:
  - Open external email client.
  - Find 6-digit OTP code.
  - Enter OTP code into 6-box input component.
  - System automatically verifies upon 6th digit entry.
- **Options**: Click `Resend Code` or `Change Email Address`.

## Step 3: Business Details (Organization Provisioning)
- **Screen**: `/onboarding/business-details`
- **Actions**:
  - Enter `Business Name` (Text Input).
  - Select `Industry` (Dropdown: Dental, Spa, Legal, etc.).
  - Select `Timezone` (Searchable Dropdown, defaults to browser timezone).
  - Click `Continue` button.
- **Background Action**: System creates Organization and links User.

## Step 4: Plan Selection
- **Screen**: `/onboarding/plans`
- **Actions**:
  - Toggle between `Monthly` and `Annual` billing.
  - View feature comparisons.
  - Click `Select Plan` on chosen tier.
- **Background Action**: Generates Stripe Checkout URL.

## Step 5: Checkout
- **Screen**: Stripe Hosted Checkout Page
- **Actions**:
  - Enter Credit Card details.
  - Click `Subscribe`.

## Step 6: Dashboard Entry
- **Screen**: `/dashboard`
- **Actions**:
  - View Welcome Modal.
  - Click `Get Started` to begin configuring Services (Module 04).
