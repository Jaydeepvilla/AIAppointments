# Analytics: Business Onboarding

## Tracked Events
Analytics must be dispatched to the product analytics tool (e.g., PostHog, Mixpanel). These events are critical for calculating funnel drop-off.

1. **`onboarding_started`**
   - Trigger: User lands on `/sign-up`.
   - Properties: `referrer`, `utm_campaign`, `utm_source`.
2. **`signup_submitted`**
   - Trigger: User clicks "Create Account".
   - Properties: `auth_method` ('local' or 'google').
3. **`email_verified`**
   - Trigger: User successfully enters OTP.
   - Properties: `time_to_verify_seconds`.
4. **`business_details_submitted`**
   - Trigger: User completes the Business Details form.
   - Properties: `industry`, `timezone_selected`.
5. **`checkout_initiated`**
   - Trigger: User clicks a plan.
   - Properties: `plan_name`, `billing_cycle`.
6. **`onboarding_completed`**
   - Trigger: Stripe webhook confirms payment and user lands on dashboard.
   - Properties: `organization_id`, `total_onboarding_time_seconds`.

## Core KPIs
- **Funnel Conversion Rate**: The percentage of users progressing from `onboarding_started` to `onboarding_completed`.
- **Drop-off Step**: Identifies the specific step with the highest abandonment rate (typically between `business_details_submitted` and `checkout_initiated`).

## Dashboards Required
- **Daily Signups**: A time-series chart showing the raw volume of `onboarding_completed` events.
- **Industry Distribution**: A pie chart breaking down the `industry` property from the `business_details_submitted` event to guide future marketing efforts.
