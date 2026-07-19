# Validation Rules: Business Onboarding

## Form: User Registration
- `email`: 
  - Required.
  - Must pass standard Regex RFC 5322 validation.
  - Must be strictly lowercased before database insertion.
  - Must not exist in `users` table.
- `password`:
  - Required.
  - Minimum 8 characters.
  - Must contain at least 1 uppercase letter, 1 number, and 1 special character.

## Form: OTP Verification
- `code`:
  - Required.
  - Must be exactly 6 numeric characters.
  - Cannot contain letters or symbols.
  - Must match the code stored in the cache/DB for the specific `email` session.
  - Must not be expired (default TTL: 15 minutes).

## Form: Business Details
- `businessName`:
  - Required.
  - Minimum 2 characters, maximum 100 characters.
  - Sanitized to prevent XSS (no HTML tags).
- `industry`:
  - Required.
  - Must match one of the predefined ENUM values in the schema.
- `timezone`:
  - Required.
  - Must be a valid IANA Time Zone database string (e.g., `Europe/London`). Invalid strings must be rejected.
