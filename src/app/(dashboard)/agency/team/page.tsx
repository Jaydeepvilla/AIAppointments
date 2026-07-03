"use server";

import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getAgencyTeamAction } from "@/server/actions/agency";
import { AgencyTeamClient } from "@/components/forms/agency-team-client";

export default async function AgencyTeamPage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const response = await getAgencyTeamAction();
  const initialMembers = response.success && response.members ? response.members : [];
  const initialInvitations = response.success && response.invitations ? response.invitations : [];

  return (
    <div className="space-y-space-8 animate-fade-in">
      <div>
        <h1 className="text-heading-lg  tracking-tight text-foreground sm:text-heading-lg">
          Agency Team Management
        </h1>
        <p className="text-body-sm text-muted-foreground mt-space-1">
          Coordinate your platform team staff members, assign roles, and audit access permissions.
        </p>
      </div>

      <AgencyTeamClient initialMembers={initialMembers} initialInvitations={initialInvitations} />
    </div>
  );
}
