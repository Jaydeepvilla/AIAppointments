import { AdminUserPanel } from "@/components/admin/admin-user-panel";
import { PageTitle } from "@/components/shared/page-title";

export const metadata = {
  title: "User Management - Admin Portal",
  description: "View workspace members, manage access control, suspend users, inspect audits, and reset credentials.",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-space-4 animate-fade-in w-full pb-space-10">
      <PageTitle
        title="User Directory"
        description="View your workspace team members, manage account status, review security audit trails, and reset passwords."
      />
      <AdminUserPanel />
    </div>
  );
}
