import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { db } from "@/server/db";
import { subscriptions, memberships } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { TrialBanner } from "@/components/shared/trial-banner";
import { DashboardHeaderActions } from "@/components/shared/dashboard-header-actions";
import { SidebarProvider } from "@/components/shared/sidebar-context";
import { DashboardShell } from "@/components/shared/dashboard-shell";

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasOrg, org } = await checkUserOrganization();

  if (!hasOrg || !org) {
    redirect("/onboarding");
  }

  const { userId } = await auth();
  const [subscription, membership] = await Promise.all([
    db.query.subscriptions.findFirst({ where: eq(subscriptions.organizationId, org.id) }),
    userId
      ? db.query.memberships.findFirst({
          where: and(
            eq(memberships.organizationId, org.id),
            eq(memberships.userId, userId)
          ),
        })
      : Promise.resolve(null),
  ]);

  const isAgency =
    subscription?.planId === "agency" ||
    subscription?.planId === "enterprise";

  const memberRole = membership?.role ?? "staff";
  const roleLabel =
    memberRole === "owner"
      ? "Owner"
      : memberRole === "admin"
      ? "Admin"
      : memberRole === "manager"
      ? "Manager"
      : "Staff";

  return (
    <SidebarProvider>
      <DashboardShell
        orgName={org.name}
        orgIndustry={org.industry ?? null}
        roleLabel={roleLabel}
        isAgency={isAgency}
        trialBanner={
          <TrialBanner
            trialEndsAt={subscription?.trialEnd ?? null}
            planId={subscription?.planId ?? "free"}
          />
        }
        headerActions={<DashboardHeaderActions roleLabel={roleLabel} />}
      >
        {children}
      </DashboardShell>
    </SidebarProvider>
  );
}
