# Authentication Architecture

Operator implements a fully custom, stateful session-based authentication system. There is no Clerk, NextAuth, or Auth.js dependency. Everything is in `src/lib/auth/`.

---

## Overview

```
User submits credentials
       ↓
Rate limit check (5 failures / 15 min → lockout)
Password verify (argon2 via @node-rs/argon2)
Security checks (reserved emails, disposable domains, common passwords)
       ↓
createSession()
  → session_token  = crypto.randomBytes(32).toString("hex")
  → refresh_token  = crypto.randomBytes(32).toString("hex")
  → Both written as HttpOnly cookies
  → Session + refresh token stored in PostgreSQL
  → Device fingerprint recorded
       ↓
Subsequent requests
  → session_token cookie validated by src/proxy.ts (Next.js middleware)
  → Full session data fetched server-side via getSession()
```

---

## Session tokens

**File:** `src/lib/auth/session.ts`

Sessions are 64-character hex strings generated with `crypto.randomBytes(32)`. They are stored in the `sessions` table (primary key = the token string itself) and set as an HttpOnly cookie named `session_token`.

### Session durations

| Mode | Duration |
|---|---|
| Standard (no remember me) | 2 hours in DB. Cookie has no `expires` — it is a session-lifetime cookie that expires when the browser closes. |
| Remember Me | 30 days. Cookie and DB record both expire in 30 days. |

### Cookie attributes

```
Cookie: session_token
HttpOnly: true
Secure: true (production only)
SameSite: lax
Path: /
```

---

## Refresh tokens

Refresh tokens allow session renewal without re-authentication. Each session is paired with one refresh token.

- **Storage:** `refreshTokens` table (not exposed in the `sessions` table)
- **Duration:** 30 days unconditionally
- **Cookie path:** `/api/auth/refresh` — the refresh token cookie is **only sent** to the refresh endpoint, preventing exposure on other requests
- **SameSite:** `strict`

### Replay attack detection

`refreshSession()` detects token reuse — a signal that the refresh token has been stolen. If a refresh token that was already consumed (marked `isRevoked = true`) is presented again:

1. All active sessions for that user are immediately revoked
2. All refresh tokens for that user are revoked
3. The user is forced to re-authenticate

This is implemented via a DB transaction in `src/lib/auth/session.ts → refreshSession()`.

---

## Session rotation

`rotateSession()` issues a new session token on privilege elevation events (e.g., after 2FA completion) to prevent session fixation attacks. It:

1. Creates a new session record with the same attributes as the old one
2. Updates all refresh tokens to reference the new session ID
3. Deletes the old session record
4. Sets the new `session_token` cookie

All three steps run in a single DB transaction.

---

## Device fingerprinting

When a client provides a `fingerprint` value (computed on the client from browser characteristics), `createSession()` records it in the `devices` table:

- Known device: `lastActive` timestamp is updated
- New device: A new device record is created with a parsed device name (Windows Device, Mac Device, iPhone, Android Device, Unknown Device)

Device type is inferred from the User-Agent header: `/Mobile|Android|iPhone/i` → `mobile`, otherwise `desktop`.

---

## Rate limiting

**File:** `src/lib/auth/rate-limit.ts`

Rate limiting is database-backed. Failed login attempts are logged to the `loginAttempts` table.

**Rule:** 5 failed login attempts (by email OR IP address) within a 15-minute window → lockout for the remainder of that window.

On lockout, `checkLoginRateLimit()` returns `{ isLocked: true, remainingTime: <seconds> }`. The UI displays a countdown timer and shows the `account-locked` page.

---

## Security checks

**File:** `src/lib/auth/security-checks.ts`

Three enforced at sign-up:

### 1. Reserved email prefixes

Email addresses starting with `admin`, `root`, `system`, `billing`, `api`, `operator`, and 16 others are blocked. This prevents impersonation of system-level roles.

### 2. Disposable email domains

Registration from `mailinator.com`, `yopmail.com`, `tempmail.com`, `guerrillamail.com`, and 15 others is blocked.

### 3. Common passwords

A hardcoded blocklist of highly common and known-leaked passwords (e.g., `password123`, `qwerty`, `letmein`). Checked before argon2 hashing.

---

## Two-factor authentication (2FA)

2FA is TOTP-based (time-based one-time password). The schema tracks:

```sql
twoFactorSecret text      -- encrypted TOTP secret
twoFactorEnabled boolean  -- whether 2FA is active for this user
```

The 2FA route is `/two-factor`. After primary credential verification, if `twoFactorEnabled = true`, the user is redirected to complete the TOTP challenge before `createSession()` is called.

---

## Google OAuth

**Files:** `src/app/api/auth/login/google/route.ts`, `src/app/api/auth/callback/google/route.ts`

Google OAuth is implemented as a custom OAuth 2.0 flow:

1. `/api/auth/login/google` — generates an OAuth state parameter (stored in a cookie), constructs the Google authorization URL, and redirects the user
2. `/api/auth/callback/google` — receives the callback, exchanges the code for tokens, fetches the Google user profile, finds or creates the local user, then calls `createSession()`

Required environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`  
Redirect URI registered with Google: `${NEXT_PUBLIC_APP_URL}/api/auth/callback/google`

---

## Middleware / route protection

**File:** `src/proxy.ts`

This file serves as the Next.js middleware. It is named `proxy.ts` instead of `middleware.ts` — Next.js resolves it correctly because the file is at `src/proxy.ts` and exports the standard `default` + `config.matcher` pattern.

The middleware does **not** perform a database lookup. It only checks for the presence of the `session_token` cookie:

```typescript
const sessionToken = request.cookies.get("session_token")?.value;
if (!sessionToken) {
  // redirect to /sign-in?redirect=<original-path>
}
```

Full session validation (expiry, user status, organization membership) happens at the server-action or API-route level via `getSession()` from `src/lib/auth/server.ts`.

### Public routes (no session required)

```
/                /pricing         /features       /about
/contact         /demo            /integrations   /security
/docs            /changelog       /privacy        /terms
/sign-in         /sign-up         /forgot-password /reset-password
/verify-email    /api/health      /api/auth/check-email
/api/auth/me     /api/auth/logout /api/webhooks/* (all webhooks)
/api/widget/*                     /_next/*         /*.{ext} (static assets)
```

### Automatic redirect

If a user with a valid `session_token` cookie accesses `/sign-in` or `/sign-up`, they are automatically redirected to `/dashboard`.

---

## Auth email flows

All auth email flows use Nodemailer via `src/server/services/notification.ts`.

| Route | Trigger |
|---|---|
| `/verify-email` | After sign-up — user receives a verification link |
| `/email-sent` | Confirmation page shown after sending verification or password-reset email |
| `/email-verified` | Landing page after successful email verification |
| `/forgot-password` | User requests a password-reset link |
| `/reset-password` | Landing page for the reset link |
| `/account-locked` | Shown when rate limit lockout is triggered |
| `/session-expired` | Shown when a session token is expired or invalid |

---

## Server-side session access

**File:** `src/lib/auth/server.ts`

Use `getSession()` in Server Components and Server Actions to get the current user and session:

```typescript
import { getSession } from "@/lib/auth/server";

const session = await getSession();
if (!session) {
  redirect("/sign-in");
}
// session.userId, session.user, session.organization, session.membership.role
```

---

## Client-side auth context

**File:** `src/lib/auth/client.tsx`

An `AuthProvider` React context wraps the app at the layout level. It fetches the current user from `/api/auth/me` and makes it available via `useAuth()`:

```typescript
import { useAuth } from "@/lib/auth/client";

const { user, organization, role, isLoading } = useAuth();
```

---

## Password hashing

Passwords are hashed with **argon2id** via the `@node-rs/argon2` package (a native Rust binding — significantly faster than the JavaScript `argon2` package).

---

## What is NOT used

| Technology | Status |
|---|---|
| Clerk | Not installed. `.env.example` contains legacy keys — ignore them. |
| NextAuth / Auth.js | Not installed. |
| JWT | Not used. Sessions are opaque random tokens, not JWTs. |
| bcrypt | Not used. argon2id via `@node-rs/argon2`. |
