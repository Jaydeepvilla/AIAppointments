# Security: Organization Management

## Access Control
- The `organizationId` is the primary tenant boundary. Every API route under `/api/organization/*` must explicitly read the `organizationId` from the authenticated user's session token, never from the request body. This prevents Insecure Direct Object Reference (IDOR) attacks where User A updates User B's business name.

## File Uploads (Logo)
- **MIME Type Sniffing**: Do not trust the file extension provided by the client. The server (or signed upload lambda) must verify the magic bytes of the file to ensure it is actually a PNG/JPEG, preventing malicious SVG or executable payloads.
- **File Size**: Strictly capped at 2MB to prevent Denial of Wallet (DoW) attacks on the storage bucket.
- **Storage Policy**: The S3 bucket policy must disable directory listing.

## Data Sanitization
- `businessName` and `address` fields must be run through a sanitizer (e.g., DOMPurify) on the server to strip any `<script>` or HTML injection attempts, as these fields will be heavily rendered across the application and potentially in emails.
