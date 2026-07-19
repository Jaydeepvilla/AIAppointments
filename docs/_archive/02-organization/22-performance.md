# Performance: Organization Management

## Caching Strategy
- The `organizations` and `businessSettings` records are highly read-heavy (queried on nearly every page load to render the sidebar, and queried by the AI on every conversation).
- **Implementation**: These records must be cached in Redis with a TTL of 24 hours.
- **Invalidation**: The cache is evicted explicitly when a `PUT` or `POST` request successfully alters the record (event-driven invalidation).

## Data Normalization
- By separating `businessSettings` from the main `organizations` table, we prevent loading the heavy `businessHours` and massive `holidays` array into memory when only the `organization.name` is needed for a simple list view.

## Pagination / Limits
- The `holidays` array inside the JSONB column can grow infinitely. To maintain query performance, the automated `Holiday Purge` cron job is strictly required to keep the array length manageable (< 365 items).
