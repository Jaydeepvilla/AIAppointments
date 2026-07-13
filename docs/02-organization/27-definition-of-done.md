# Definition of Done: Organization Management

The module is considered complete when:
- [x] A user can successfully upload a logo and see it replace the placeholder instantly.
- [x] Business hours can be updated, supporting multiple shifts per day.
- [x] Holidays can be added and deleted seamlessly.
- [x] The `businessSettings` JSONB column accurately reflects the UI state.
- [x] Redis caching (or equivalent) is implemented and invalidates correctly upon a `PUT` request.
- [x] Changing the timezone displays the warning prompt to the user.
- [x] All 9 test cases in `25-test-cases.md` pass automatically or manually.
