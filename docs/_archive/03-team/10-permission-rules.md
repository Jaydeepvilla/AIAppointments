# Permission Rules: Team Management

## Read Access
- **Owner, Admin, Manager**: Can view all Staff profiles, schedules, and roles.
- **Staff**: Can view all other Staff profiles and schedules (to foster team coordination).
- **Public / AI Agent**: Can read basic Staff profiles (Name, Title, Bio, Avatar) and their Availability, but cannot read their linked User ID or Roles.

## Write Access (Profile & Schedule)
- **Owner, Admin, Manager**: Can create and edit any Staff profile, schedule, and assign services.
- **Staff**: Can ONLY edit their *own* Profile (Avatar/Bio). They CANNOT edit their own Services or base Weekly Schedule (only a manager can change their shift).

## Write Access (Exceptions / Time Off)
- **Owner, Admin, Manager**: Can add/remove exceptions for anyone.
- **Staff**: Can add exceptions for *themselves* only (e.g., calling in sick). 

## Write Access (Role Management & Invites)
- **Owner, Admin**: Can send invites and change roles for anyone.
- **Manager**: Can send invites and change roles, but CANNOT grant the `Admin` or `Owner` role.
- **Staff**: Prohibited from Role Management.

## Delete Access
- **Owner, Admin, Manager**: Can soft-delete a Staff member (hides them from future bookings, preserves historical appointment records).
- **Staff**: Prohibited.
