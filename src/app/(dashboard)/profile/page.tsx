import { redirect } from "next/navigation";
import { getBusinessProfileAction } from "@/server/actions/profile";
import { BusinessProfileForm } from "@/components/forms/business-profile-form";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { PageTitle } from "@/components/shared/page-title";

export default async function ProfilePage() {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const response = await getBusinessProfileAction();

  if (!response.success || !response.data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center p-space-8 border border-[hsl(var(--foreground)/0.06)] radius-lg bg-[hsl(var(--foreground)/0.02)]">
        <h3 className="text-body-md  text-foreground">Couldn’t load your profile</h3>
        <p className="text-body-sm text-muted-foreground mt-space-2">
          This is usually temporary. Try refreshing the page.
        </p>
      </div>
    );
  }

  const { organization, profile } = response.data;

  return (
    <div className="space-y-space-4 animate-fade-in w-full pb-space-10">
      {/* Page Header */}
      <PageTitle
        title="Business Profile"
        description="Your business info. This is what your AI tells customers about you."
      />

      <BusinessProfileForm organization={organization} profile={profile} />
    </div>
  );
}

