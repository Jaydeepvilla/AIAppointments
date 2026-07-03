"use server";

import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getAgencyDomainsAction } from "@/server/actions/agency";
import { AgencyDomainsClient } from "@/components/forms/agency-domains-client";

export default async function AgencyDomainsPage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const response = await getAgencyDomainsAction();
  const initialDomains = response.success && response.domains ? response.domains : [];

  return (
    <div className="space-y-space-8 animate-fade-in">
      <div>
        <h1 className="text-heading-lg  tracking-tight text-foreground sm:text-heading-lg">
          Custom Domain Manager
        </h1>
        <p className="text-body-sm text-muted-foreground mt-space-1">
          Hook up custom CNAME domains for your agency portal, client workspaces, and website widget endpoints.
        </p>
      </div>

      <AgencyDomainsClient initialDomains={initialDomains} />
    </div>
  );
}
