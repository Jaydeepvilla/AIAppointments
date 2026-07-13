import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Skeleton } from "@/components/shared/skeleton";
import { Card } from "@/components/shared/card";

// Lazy loaded widgets
const DailyBriefWidget = lazy(() => import("./widgets/DailyBriefWidget").then(m => ({ default: m.DailyBriefWidget })));
const ConversationPerfWidget = lazy(() => import("./widgets/ConversationPerfWidget").then(m => ({ default: m.ConversationPerfWidget })));
const BookingPerfWidget = lazy(() => import("./widgets/BookingPerfWidget").then(m => ({ default: m.BookingPerfWidget })));
const KnowledgeStatusWidget = lazy(() => import("./widgets/KnowledgeStatusWidget").then(m => ({ default: m.KnowledgeStatusWidget })));
const BusinessHealthWidget = lazy(() => import("./widgets/BusinessHealthWidget").then(m => ({ default: m.BusinessHealthWidget })));
const MissedOppsWidget = lazy(() => import("./widgets/MissedOppsWidget").then(m => ({ default: m.MissedOppsWidget })));
const AIRecommendationsWidget = lazy(() => import("./widgets/AIRecommendationsWidget").then(m => ({ default: m.AIRecommendationsWidget })));
const SetupProgressWidget = lazy(() => import("./widgets/SetupProgressWidget").then(m => ({ default: m.SetupProgressWidget })));
const RecentActivityWidget = lazy(() => import("./widgets/RecentActivityWidget").then(m => ({ default: m.RecentActivityWidget })));
const QuickActionsWidget = lazy(() => import("./widgets/QuickActionsWidget").then(m => ({ default: m.QuickActionsWidget })));
const SmartNotificationsWidget = lazy(() => import("./widgets/SmartNotificationsWidget").then(m => ({ default: m.SmartNotificationsWidget })));

function WidgetSkeleton() {
  return (
    <Card className="h-full p-space-6 space-y-space-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-space-4 space-y-space-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </Card>
  )
}

function KPIWidgetSkeleton() {
  return (
    <Card className="h-full p-space-6 flex flex-col justify-center space-y-space-4">
      <Skeleton className="h-10 w-20 rounded-md" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-2 w-full mt-space-4" />
    </Card>
  )
}

function TimelineSkeleton() {
  return (
    <Card className="h-full p-space-6 space-y-space-6">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-space-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-space-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-space-2 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function withWidgetWrapper(Component: React.ComponentType<any>, name: string, CustomSkeleton?: React.ComponentType<any>) {
  return function WidgetWrapper(props: any) {
    const Fallback = CustomSkeleton || WidgetSkeleton;
    return (
      <ErrorBoundary context={`widget-${name}`}>
        <Suspense fallback={<Fallback />}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

export const DashboardWidgets = {
  DailyBrief: withWidgetWrapper(DailyBriefWidget, "DailyBrief"),
  ConversationPerf: withWidgetWrapper(ConversationPerfWidget, "ConversationPerf", KPIWidgetSkeleton),
  BookingPerf: withWidgetWrapper(BookingPerfWidget, "BookingPerf", KPIWidgetSkeleton),
  KnowledgeStatus: withWidgetWrapper(KnowledgeStatusWidget, "KnowledgeStatus", KPIWidgetSkeleton),
  BusinessHealth: withWidgetWrapper(BusinessHealthWidget, "BusinessHealth"),
  MissedOpps: withWidgetWrapper(MissedOppsWidget, "MissedOpps"),
  AIRecommendations: withWidgetWrapper(AIRecommendationsWidget, "AIRecommendations"),
  SetupProgress: withWidgetWrapper(SetupProgressWidget, "SetupProgress"),
  RecentActivity: withWidgetWrapper(RecentActivityWidget, "RecentActivity", TimelineSkeleton),
  QuickActions: withWidgetWrapper(QuickActionsWidget, "QuickActions"),
  SmartNotifications: withWidgetWrapper(SmartNotificationsWidget, "SmartNotifications"),
};
