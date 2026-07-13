# FAQ: Organization Management

**Q: Can a business have different timezones for different staff members?**
A: No, in the current MVP architecture, the Organization has a single overarching timezone. Staff members operating in different locations must mentally translate their hours, or the organization requires a Multi-Location Enterprise setup (Future Scope).

**Q: If I upload a new logo, does it delete the old one from AWS S3?**
A: Yes, to prevent storage bloat, the server-side upload function must invoke a `DeleteObject` command on the previously stored S3 key before linking the new one.

**Q: Why store Business Hours as JSONB instead of normalized relational tables?**
A: Because querying availability is incredibly computationally heavy. Flattening the weekly schedule into a single JSONB column attached 1:1 to the organization allows the Node.js availability engine to pull the entire week's constraints into memory with a single row fetch, rather than doing massive SQL JOINs across 7 day rows and split-shift tables.
