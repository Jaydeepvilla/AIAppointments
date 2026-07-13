# Permission Matrix

This matrix defines the specific Access Control List (ACL) mapped to the Role-Based Access Control (RBAC) system.

**Legend**:
- `✓` : Full Access
- `Self`: Can only perform the action on data they own or are assigned to.
- `-` : No Access

| Resource / Action | Role: Owner | Role: Admin | Role: Manager | Role: Staff |
| :--- | :---: | :---: | :---: | :---: |
| **Organization Settings** |
| View Details | ✓ | ✓ | ✓ | ✓ |
| Edit Details | ✓ | ✓ | - | - |
| Delete Organization | ✓ | - | - | - |
| **Billing & Subscription** |
| View Invoices/Plans | ✓ | - | - | - |
| Edit Payment Info | ✓ | - | - | - |
| Upgrade/Downgrade | ✓ | - | - | - |
| **User/Staff Management** |
| View Staff List | ✓ | ✓ | ✓ | ✓ |
| Invite Staff | ✓ | ✓ | - | - |
| Edit Staff Roles | ✓ | ✓ | - | - |
| Edit Staff Schedules | ✓ | ✓ | ✓ | Self |
| Delete/Deactivate Staff | ✓ | ✓ | - | - |
| **Services & Categories** |
| View Services | ✓ | ✓ | ✓ | ✓ |
| Create Services | ✓ | ✓ | ✓ | - |
| Edit Services | ✓ | ✓ | ✓ | - |
| Delete Services | ✓ | ✓ | - | - |
| **Appointments** |
| View Appointments | ✓ | ✓ | ✓ | Self |
| Create Appointments | ✓ | ✓ | ✓ | - |
| Edit/Reschedule | ✓ | ✓ | ✓ | Self |
| Cancel Appointments | ✓ | ✓ | ✓ | Self |
| Export Data | ✓ | ✓ | ✓ | - |
| **Customers / CRM** |
| View Profiles | ✓ | ✓ | ✓ | Self |
| Create Profiles | ✓ | ✓ | ✓ | - |
| Edit Profiles | ✓ | ✓ | ✓ | Self |
| Delete Profiles | ✓ | ✓ | - | - |
| **Inbox / Conversations** |
| View Conversations | ✓ | ✓ | ✓ | - |
| Intervene / Reply | ✓ | ✓ | ✓ | - |
| Delete Logs | ✓ | - | - | - |
| **AI Knowledge Base** |
| View Knowledge | ✓ | ✓ | ✓ | - |
| Upload/Create Docs | ✓ | ✓ | ✓ | - |
| Edit Docs | ✓ | ✓ | ✓ | - |
| Delete Docs | ✓ | ✓ | ✓ | - |
| **System Integrations** |
| View API Keys | ✓ | ✓ | - | - |
| Manage Webhooks | ✓ | ✓ | - | - |
| Manage Calendar Sync | ✓ | ✓ | ✓ | Self |
| **Analytics & Reports** |
| View Financial Dashboards| ✓ | ✓ | - | - |
| View Operational Reports | ✓ | ✓ | ✓ | - |
| Export Reports | ✓ | ✓ | - | - |
