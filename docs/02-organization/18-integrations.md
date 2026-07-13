# Integrations: Organization Management

## Required Integrations
1. **AWS S3 / Cloudflare R2 / Vercel Blob**
   - Used for storing the uploaded Organization Logo.
   - Requires setting up public read access for the specific logo bucket, and strict CORS policies to only allow uploads from the authenticated dashboard domain.

## Future Integrations
- **Google My Business (GMB) Sync**: Allow the organization to click "Sync with Google", which will automatically pull their Business Hours, Address, and Phone Number from their Google listing and overwrite the `businessSettings` table, preventing dual-entry fatigue.
