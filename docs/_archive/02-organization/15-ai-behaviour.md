# AI Behaviour: Organization Management

## Context Injection
The AI Agent is injected with a `System Context Block` at the start of every conversation. This block contains data directly sourced from this module:
- `Business Name`
- `Business Address`
- `Business Phone`
- `Current Timezone`
- `Today's Date and Time (Local to Organization)`

## Answering Temporal Queries
When a customer asks "Are you open right now?", the AI does not perform a database query. It uses the `Current Timezone` to evaluate against the `businessHours` provided in its injected context.

## Handling Holidays
If a customer asks to book on "December 25th", and that date is listed in the `holidays` array within the AI's context, the AI will immediately respond:
*"We are actually closed on December 25th for Christmas. Would you like to look at the day before or the day after?"*
It will NOT attempt to query the `getAvailableSlots` tool for that date, saving API calls and reducing latency.
