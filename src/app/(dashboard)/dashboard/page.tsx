import { checkUserOrganization } from "@/server/actions/onboarding";
import { profileRepository } from "@/server/repositories/profile";
import { servicesRepository } from "@/server/repositories/services";
import { faqRepository } from "@/server/repositories/faq";
import { flowsRepository } from "@/server/repositories/flows";
import { settingsRepository } from "@/server/repositories/settings";

import { SetupState } from "@/lib/setup-engine/types";
import { DashboardEngine } from "@/lib/dashboard-engine";
import { DashboardWidgets } from "@/components/dashboard/widget-registry";
import { ScrollRevealObserver } from "@/components/shared/scroll-reveal-observer";

export default async function DashboardPage() {
  const { org } = await checkUserOrganization();
  if (!org) return null;

  const [profile, servicesList, faqs, flows, settings] = await Promise.all([
    profileRepository.getByOrg(org.id),
    servicesRepository.list(org.id),
    faqRepository.list(org.id),
    flowsRepository.list(org.id),
    settingsRepository.getByOrg(org.id),
  ]);

  const setupState: SetupState = {
    profile,
    servicesList,
    faqs,
    flows,
    settings,
    staff: [],
  };

  // Get the outcome-oriented snapshot
  const snapshot = await DashboardEngine.getOutcomeDashboard(org.id, setupState);
  const businessName = org.name || "your business";

  return (
    <div className="w-full pb-space-16 animate-page-enter">
      <ScrollRevealObserver />

      <div className="space-y-space-5 w-full">
        {/* 1. Hero Widget: AI Daily Brief */}
        <div className="reveal" data-delay="0">
          <DashboardWidgets.DailyBrief brief={snapshot.dailyBrief} businessName={businessName} />
        </div>

        {/* 2. Quick Actions — full width, high visibility */}
        <div className="reveal" data-delay="1">
          <DashboardWidgets.QuickActions />
        </div>

        {/* 3. Headline Outcomes Row: Conversations, Bookings, Knowledge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-5 reveal" data-delay="2">
          <DashboardWidgets.ConversationPerf brief={snapshot.dailyBrief} />
          <DashboardWidgets.BookingPerf brief={snapshot.dailyBrief} />
          <DashboardWidgets.KnowledgeStatus knowledgeScore={snapshot.knowledgeScore} />
        </div>

        {/* 4. Outcomes & Gaps Row: AI Recommendations, Missing Requirements, Business Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-5 reveal" data-delay="3">
          <DashboardWidgets.AIRecommendations recommendations={snapshot.topRecommendations} />
          <DashboardWidgets.MissedOpps gapAnalysis={snapshot.gapAnalysis} />
          <DashboardWidgets.BusinessHealth health={snapshot.health} />
        </div>

        {/* 5. Journey & Operations Row: Recent Activity, Setup Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-5 reveal" data-delay="4">
          <DashboardWidgets.RecentActivity activity={snapshot.recentActivity} />
          <DashboardWidgets.SetupProgress progress={snapshot.setupProgress} />
        </div>
      </div>
    </div>
  );
}

