"use server";

import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getPhoneNumbersAction } from "@/server/actions/voice";
import { PhoneNumbersClient } from "@/components/forms/phone-numbers-client";
import { PageTitle } from "@/components/shared/page-title";

export default async function VoicePage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const response = await getPhoneNumbersAction();
  const initialNumbers = response.success && response.numbers ? response.numbers : [];

  return (
    <div className="space-y-space-8 animate-fade-in">
      <PageTitle
        title="Phone Lines"
        description="Your business phone numbers. Add a number to start receiving AI-handled calls."
      />

      <PhoneNumbersClient initialNumbers={initialNumbers} />
    </div>
  );
}
