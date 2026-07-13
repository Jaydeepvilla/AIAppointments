import { ScoreRing } from "@/components/dashboard/shared/score-ring";
import { MetricBar } from "@/components/dashboard/shared/metric-bar";
import { KPICard } from "@/components/dashboard/shared/kpi-card";
import { BrainCircuit, FileWarning } from "lucide-react";

interface KnowledgeScoreWidgetProps {
  score: {
    overall: number;
    coverage: number;
    missingDocuments: number;
    weakDocuments: number;
    duplicateDocuments: number;
    suggestions: string[];
    aiConfidence: number;
  };
}

export function KnowledgeScoreWidget({ score }: KnowledgeScoreWidgetProps) {
  const statusLabel = ScoreRing.label(score.overall);
  const statusTextClass = "text-info-600 dark:text-info-400";

  const totalIssues = score.missingDocuments + score.weakDocuments + score.duplicateDocuments;

  return (
    <KPICard
      title="Knowledge"
      href="/kb"
      icon={BrainCircuit}
      score={score.overall}
      statusLabel={statusLabel}
      statusTextClass={statusTextClass}
      color="var(--info-500)"
      alertCount={totalIssues}
      alertText="issue"
      alertIcon={FileWarning}
      alertType="warning"
      metaText={`AI Confidence: ${score.aiConfidence}%`}
    >
      <div className="space-y-space-4">
        {/* Sub-metric bars */}
        <div className="grid grid-cols-2 gap-x-space-4 gap-y-space-2.5">
          <MetricBar label="Coverage" value={score.coverage} />
          <MetricBar label="Confidence" value={score.aiConfidence} colorClass="bg-primary-500" />
        </div>

        {/* Compact stat row with inline counters */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-space-3">
          <div className="flex items-center gap-space-1.5">
            <span className="text-caption text-neutral-500">Missing</span>
            <span className={`text-caption font-bold tabular-nums ${score.missingDocuments > 0 ? "text-error-500" : "text-success-500"}`}>
              {score.missingDocuments}
            </span>
          </div>
          <div className="w-px h-space-3 bg-border-subtle" />
          <div className="flex items-center gap-space-1.5">
            <span className="text-caption text-neutral-500">Weak</span>
            <span className={`text-caption font-bold tabular-nums ${score.weakDocuments > 0 ? "text-warning-500" : "text-success-500"}`}>
              {score.weakDocuments}
            </span>
          </div>
          <div className="w-px h-space-3 bg-border-subtle" />
          <div className="flex items-center gap-space-1.5">
            <span className="text-caption text-neutral-500">Duplicate</span>
            <span className="text-caption font-bold tabular-nums text-neutral-400">
              {score.duplicateDocuments}
            </span>
          </div>
        </div>
      </div>
    </KPICard>
  );
}
