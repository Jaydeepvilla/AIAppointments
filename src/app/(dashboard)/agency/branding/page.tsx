"use server";

import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getAgencyBrandingAction } from "@/server/actions/agency";
import { AgencyBrandingClient } from "@/components/forms/agency-branding-client";

export default async function AgencyBrandingPage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const response = await getAgencyBrandingAction();
  const initialBranding = response.success && response.branding ? response.branding : null;

  return (
    <div className="space-y-space-8 animate-fade-in">
      <div>
        <h1 className="text-heading-lg  tracking-tight text-foreground sm:text-heading-lg">
          White Label Branding Studio
        </h1>
        <p className="text-body-sm text-muted-foreground mt-space-1">
          Completely customize the product logo, typography, primary and secondary palette colors, and whitelabeled login forms.
        </p>
      </div>

      <AgencyBrandingClient initialBranding={initialBranding} />
    </div>
  );
}
