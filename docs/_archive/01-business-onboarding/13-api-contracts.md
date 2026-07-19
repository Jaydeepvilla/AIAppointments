# API Contracts: Business Onboarding

## POST `/api/auth/register`
Creates a new unverified user and triggers the OTP email.

**Request Body:**
```json
{
  "email": "owner@clinic.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "userId": "usr_123abc",
    "requireVerification": true
  }
}
```

**Errors:**
- `409 Conflict`: "Email already in use."
- `400 Bad Request`: "Password does not meet complexity requirements."

---

## POST `/api/auth/verify`
Validates the OTP and marks the user as verified.

**Request Body:**
```json
{
  "email": "owner@clinic.com",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_string"
  }
}
```

**Errors:**
- `401 Unauthorized`: "Invalid or expired verification code."

---

## POST `/api/onboarding/organization`
Creates the tenant and assigns the Owner role. Requires Bearer Token.

**Request Body:**
```json
{
  "businessName": "Main Street Dental",
  "industry": "dental",
  "timezone": "America/New_York"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "organizationId": "org_789xyz"
  }
}
```

---

## POST `/api/billing/create-checkout`
Generates a Stripe Checkout Session URL. Requires Bearer Token and `X-Organization-Id` header.

**Request Body:**
```json
{
  "planId": "price_professional_monthly"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```
