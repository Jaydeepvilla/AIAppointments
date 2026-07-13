import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getBusinessSettingsAction } from "@/server/actions/settings";
import { PageTitle } from "@/components/shared/page-title";
import { RulesSettingsClient } from "./rules-settings-client";

export const metadata = {
  title: "Human Handoff Escalation Rules | Settings",
  description: "Define criteria and triggers for when the AI receptionist should escalate calls to human staff.",
};

export default async function EscalationRulesPage() {
  const { hasOrg, org } = await checkUserOrganization();
  if (!hasOrg || !org) {
    redirect("/onboarding");
  }

  const settingsRes = await getBusinessSettingsAction();
  if (!settingsRes.success || !settingsRes.settings) {
    throw new Error(settingsRes.error || "Failed to load business settings");
  }

  // Load human escalation rules from settings, fallback to default template
  const notificationPrefs = (settingsRes.settings.notificationPreferences as Record<string, any>) || {};
  const rawRules = (notificationPrefs.humanEscalationRules as Record<string, any>) || {};
  
  const rules = {
    triggerOnRequest: rawRules.triggerOnRequest ?? true,
    triggerOnEmergency: rawRules.triggerOnEmergency ?? true,
    triggerOnRepeatedFailure: rawRules.triggerOnRepeatedFailure ?? true,
    customTriggers: rawRules.customTriggers || "",
    alertEmail: rawRules.alertEmail || "",
    alertPhone: rawRules.alertPhone || "",
    alertChannel: rawRules.alertChannel || "email",
  };

  return (
    <div className="space-y-space-6 animate-fade-in w-full pb-space-12">
      <PageTitle
        title="Human Handoff Escalation Rules"
        description="Determine when the AI receptionist should automatically flag a conversation for human assistance."
      />

      <RulesSettingsClient initialRules={rules} />
    </div>
  );
}
