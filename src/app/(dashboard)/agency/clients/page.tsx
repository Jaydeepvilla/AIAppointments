"use server";

import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getAgencyClientsAction } from "@/server/actions/agency";
import { AgencyClientsClient } from "@/components/forms/agency-clients-client";

export default async function AgencyClientsPage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const response = await getAgencyClientsAction();
  const initialClients = response.success && response.clients ? response.clients : [];

  return (
    <div className="space-y-space-8 animate-fade-in">
      <div>
        <h1 className="text-heading-lg  tracking-tight text-foreground sm:text-heading-lg">
          Client Workspace Switcher
        </h1>
        <p className="text-body-sm text-muted-foreground mt-space-1">
          Deploy client workspaces, modify active subscriptions, and securely impersonate portals for troubleshooting.
        </p>
      </div>

      <AgencyClientsClient initialClients={initialClients} />
    </div>
  );
}
