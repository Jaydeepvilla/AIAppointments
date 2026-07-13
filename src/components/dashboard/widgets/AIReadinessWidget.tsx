import { GlobalAIReadiness } from "@/lib/ai-readiness-engine";
import { ScoreRing } from "@/components/dashboard/shared/score-ring";
import { MetricBar } from "@/components/dashboard/shared/metric-bar";
import { KPICard } from "@/components/dashboard/shared/kpi-card";
import { Sparkles, AlertTriangle } from "lucide-react";

interface AIReadinessWidgetProps {
  readiness: GlobalAIReadiness;
}

const DOMAINS = [
  { key: "booking", label: "Booking" },
  { key: "policies", label: "Policies" },
  { key: "services", label: "Services" },
  { key: "businessHours", label: "Hours" },
  { key: "contact", label: "Contact" },
] as const;

export function AIReadinessWidget({ readiness }: AIReadinessWidgetProps) {
  const score = readiness.overallScore;
  const statusLabel = ScoreRing.label(score);
  const statusTextClass = "text-primary-600 dark:text-primary-400";

  const missing = readiness.criticalMissingInformation;

  return (
    <KPICard
      title="AI Readiness"
      href="/settings/ai"
      icon={Sparkles}
      score={score}
      statusLabel={statusLabel}
      statusTextClass={statusTextClass}
      color="var(--primary-500)"
      alertCount={missing?.length ?? 0}
      alertText="gap"
      alertIcon={AlertTriangle}
      alertType="warning"
      metaText={`Confidence: ${readiness.overallConfidence}%`}
    >
      <div className="grid grid-cols-2 gap-x-space-4 gap-y-space-2.5">
        {DOMAINS.map(({ key, label }) => {
          const s = readiness.domains[key]?.readinessScore ?? 0;
          return <MetricBar key={key} label={label} value={s} />;
        })}
        {/* Confidence bar uses primary instead of threshold colors */}
        <MetricBar label="Confidence" value={readiness.overallConfidence} colorClass="bg-primary-500" />
      </div>
    </KPICard>
  );
}
