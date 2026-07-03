"use server";

import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getAgencyResellerPlansAction } from "@/server/actions/agency";
import { getCouponsAction } from "@/server/actions/billing";
import { AgencyBillingClient } from "@/components/forms/agency-billing-client";

export default async function AgencyBillingPage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const [plansRes, couponsRes] = await Promise.all([
    getAgencyResellerPlansAction(),
    getCouponsAction()
  ]);

  const initialPlans = plansRes.success && plansRes.plans ? plansRes.plans : [];
  const initialCoupons = couponsRes.success && couponsRes.coupons ? couponsRes.coupons : [];

  return (
    <div className="space-y-space-8 animate-fade-in">
      <div>
        <h1 className="text-heading-lg  tracking-tight text-foreground sm:text-heading-lg">
          Reseller Pricing & Billing
        </h1>
        <p className="text-body-sm text-muted-foreground mt-space-1">
          Configure custom service subscription plans to resell to your client businesses and monitor resource consumption meters.
        </p>
      </div>

      <AgencyBillingClient initialPlans={initialPlans} initialCoupons={initialCoupons} />
    </div>
  );
}
