# FAQ: Business Onboarding

**Q: Can a user sign up for multiple organizations with the same email?**
A: Yes, technically the database allows a user to belong to multiple organizations via the `organizationMembers` table. However, the initial onboarding flow strictly provisions one organization. Adding a second organization to an existing account is handled in the `02-organization` module settings.

**Q: What happens if a user selects the wrong timezone during onboarding?**
A: They can change it later in the Organization Settings. However, any appointments booked by the AI *before* the change will remain locked to the absolute UTC time they were created at, which may cause display shifts when the timezone is updated.

**Q: Why don't we ask for the Business Address during onboarding?**
A: To minimize friction and increase the trial conversion rate. The address is only strictly necessary for invoicing or specific local AI queries, which can be configured later in the dashboard.

**Q: Does the Free Trial require a credit card?**
A: This depends on the active business strategy. If yes, the Stripe Checkout session will be configured with a 14-day `free_trial` parameter. If no, the Plan Selection screen will bypass Stripe and directly activate a `trialing` subscription. Current spec assumes credit card is required upfront to filter low-intent leads.
