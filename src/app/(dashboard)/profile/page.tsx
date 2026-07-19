import { redirect } from "next/navigation";
import { getBusinessProfileAction } from "@/server/actions/profile";
import { getUserProfileAction } from "@/server/actions/user-profile";
import { BusinessProfileForm } from "@/components/forms/business-profile-form";
import { PersonalSettingsForm } from "@/components/shared/settings-form";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { PageTitle } from "@/components/shared/page-title";
import Link from "next/link";
import { Building, User } from "lucide-react";

export const metadata = {
  title: "Profile & Settings - Operator",
  description: "Manage your business receptionist profile and personal account credentials.",
};

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const { hasOrg } = await checkUserOrganization();
  if (!hasOrg) {
    redirect("/onboarding");
  }

  const { tab } = await searchParams;
  const activeTab = tab === "account" ? "account" : "business";

  // Fetch both datasets in parallel
  const [bizResponse, personalResponse] = await Promise.all([
    getBusinessProfileAction(),
    getUserProfileAction(),
  ]);

  if (!bizResponse.success || !bizResponse.data || !personalResponse.success || !personalResponse.data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center p-space-8 border border-white/5 radius-lg bg-slate-950/20">
        <h3 className="text-body-md text-white font-bold">Couldn’t load profiles</h3>
        <p className="text-caption text-slate-400 mt-space-2">
          Failed to retrieve either your personal account settings or business configurations. Please try refreshing.
        </p>
      </div>
    );
  }

  const { organization, profile } = bizResponse.data;

  return (
    <div className="space-y-space-4 animate-fade-in w-full pb-space-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageTitle
          title={activeTab === "business" ? "Business Profile" : "Account Settings"}
          description={
            activeTab === "business"
              ? "Your business info. This is what your AI tells customers about you."
              : "Manage your personal profile details, preferences, and logged in devices."
          }
        />

        {/* Premium Tab Switcher */}
        <div className="flex bg-[hsl(var(--foreground)/0.04)] border border-[hsl(var(--foreground)/0.06)] p-1 rounded-full shrink-0 shadow-inner self-start sm:self-center">
          <Link
            href="/profile?tab=business"
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeTab === "business"
                ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border border-[hsl(var(--foreground)/0.08)] shadow-sm"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Business Profile</span>
          </Link>
          <Link
            href="/profile?tab=account"
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeTab === "account"
                ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border border-[hsl(var(--foreground)/0.08)] shadow-sm"
                : "text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Account Settings</span>
          </Link>
        </div>
      </div>

      <div className="pt-2">
        {activeTab === "business" ? (
          <BusinessProfileForm organization={organization} profile={profile} />
        ) : (
          <PersonalSettingsForm initialData={personalResponse.data as any} />
        )}
      </div>
    </div>
  );
}
