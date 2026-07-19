# Screen Flow: Team Management

```mermaid
graph TD
    A[Settings Sidebar] -->|Click Team| B(Team List View)
    B -->|Click Add Staff| C(Add Staff Slide-over)
    C -->|Submit| D(API POST /staff)
    D -->|Success| E(Staff Detail Layout)
    B -->|Click Row| E
    
    E --> F[Tab: Profile]
    E --> G[Tab: Schedule]
    E --> H[Tab: Exceptions]
    E --> I[Tab: Access]
    
    F -->|Select Services| J(API PUT /staff/:id)
    G -->|Update Hours| K(API PUT /staff/:id/schedule)
    H -->|Add Time Off| L(API POST /staff/:id/exceptions)
    I -->|Send Invite| M(Auth Service Email)
```

## Detailed Transitions
1. **List to Detail**: Uses Next.js dynamic routing (`/settings/team/[staffId]`). The detail view has a sub-navigation component for the 4 tabs.
2. **Access Tab Interactions**:
   - If `userId` is null, show the "Invite" form.
   - If `userId` exists, show the "Role Management" form and the User's last login timestamp.
