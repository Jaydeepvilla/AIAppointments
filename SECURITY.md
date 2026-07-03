# ═══════════════════════════════════════════════════════════════════
# Operator— SECURITY & ENVIRONMENT GUIDE
# ═══════════════════════════════════════════════════════════════════

## ⚠️ CRITICAL: Clerk Production Keys on Localhost

You are seeing this error in dev:
  "Clerk: Production Keys are only allowed for domain nexxtechnologies.com"

This is because your `.env` contains PRODUCTION Clerk keys (`pk_live_...`)
but you are running on `localhost`.

### SOLUTION:

1. Go to https://dashboard.clerk.com
2. Select your app → API Keys
3. Switch to your DEVELOPMENT instance (or create one)
4. Copy the DEVELOPMENT keys (`pk_test_...` and `sk_test_...`)
5. Replace the keys in your `.env` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_YOUR_DEV_KEY"
CLERK_SECRET_KEY="sk_test_YOUR_DEV_KEY"
```

The production keys will work correctly when deployed to nexxtechnologies.com.

---

## ⚠️ CRITICAL: Do Not Commit .env to Git

Your `.env` file contains live Clerk API keys and a database URL.
These MUST NOT be committed to any public or private repository.

### Fix immediately:

Verify `.gitignore` contains:
  .env
  .env.local
  .env.production

To check: `git status` — `.env` should not appear.
To fix: `git rm --cached .env` (if already tracked)

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key (pk_test_ for dev, pk_live_ for prod) |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (never expose client-side) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | `/onboarding` |
| `OPENAI_API_KEY` | Optional | For AI response generation |
| `TWILIO_ACCOUNT_SID` | Optional | For voice AI and SMS |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio secret |
| `TWILIO_PHONE_NUMBER` | Optional | Your Twilio phone number |
| `STRIPE_SECRET_KEY` | Optional | For Stripe billing |
| `STRIPE_WEBHOOK_SECRET` | Optional | For Stripe webhooks |

---

## Deployment Checklist

Before deploying to production:
- [ ] Use production Clerk keys only in the deployed environment
- [ ] Set DATABASE_URL to your production database
- [ ] Configure all environment variables in your hosting provider's dashboard (Vercel, Railway, etc.)
- [ ] Never hardcode secrets in source code
- [ ] Rotate any keys that were accidentally committed

---

## Rotating Exposed Keys

If you suspect any key was exposed:
1. Clerk: dashboard.clerk.com → API Keys → Regenerate
2. Database: Change the password in your DB provider
3. Stripe: stripe.com → Developers → API Keys → Roll

Keep this file updated as new services are added.
