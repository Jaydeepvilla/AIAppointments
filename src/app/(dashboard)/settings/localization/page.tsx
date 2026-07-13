import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { getLocalizationMetadataAction } from "@/server/actions/settings";
import { LocalizationSettingsClient } from "@/components/forms/localization-settings-client";
import { PageTitle } from "@/components/shared/page-title";

export default async function LocalizationSettingsPage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const res = await getLocalizationMetadataAction();

  if (!res.success || !res.businessLocalization) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center p-space-8 border border-[hsl(var(--foreground)/0.06)] radius-lg bg-[hsl(var(--foreground)/0.02)]">
        <h3 className="text-body-md text-foreground">Couldn’t load localization settings</h3>
        <p className="text-body-sm text-muted-foreground mt-space-2">
          This is usually temporary. Try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-space-8 animate-fade-in max-w-4xl">
      <PageTitle
        title="Localization & Regional Settings"
        description="Configure your business primary languages, currency conversion rules, date formatting styles, and calendar presets."
      />

      <LocalizationSettingsClient
        countries={res.countries}
        languages={res.languages}
        currencies={res.currencies}
        initialSettings={{
          countryCode: res.businessLocalization.countryCode,
          primaryLanguage: res.businessLocalization.primaryLanguage,
          currencyCode: res.businessLocalization.currencyCode,
          timezone: res.businessLocalization.timezone,
          dateFormat: res.businessLocalization.dateFormat,
          timeFormat: res.businessLocalization.timeFormat,
          weekStart: res.businessLocalization.weekStart,
          measurementUnit: res.businessLocalization.measurementUnit,
        }}
      />
    </div>
  );
}
