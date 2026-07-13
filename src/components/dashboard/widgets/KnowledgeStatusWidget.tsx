"use client";

import { KPICard } from "../shared/kpi-card";
import { MetricBar } from "../shared/metric-bar";
import { Brain, BookOpen } from "lucide-react";

interface KnowledgeStatusWidgetProps {
  knowledgeScore: {
    overall: number;
    coverage: number;
    missingDocuments: number;
    suggestions: string[];
    aiConfidence: number;
  };
}

export function KnowledgeStatusWidget({
  knowledgeScore,
}: KnowledgeStatusWidgetProps) {
  const { overall, coverage, missingDocuments, suggestions, aiConfidence } =
    knowledgeScore;

  // Why low explanation
  const whyLow =
    overall < 70
      ? `${missingDocuments} missing topic${missingDocuments !== 1 ? "s" : ""} reduce AI accuracy`
      : overall < 90
        ? "A few weak areas reduce confidence"
        : undefined;

  return (
    <KPICard
      title="AI Knowledge"
      href="/kb"
      icon={Brain}
      score={overall}
      statusLabel={whyLow ?? `${overall}% coverage`}
      alertCount={missingDocuments}
      alertText="missing topic"
      alertIcon={BookOpen}
      alertType={missingDocuments > 3 ? "error" : missingDocuments > 0 ? "warning" : "success"}
      metaText={`AI confidence: ${aiConfidence}%`}
    >
      <div className="space-y-space-2">
        <MetricBar label="Coverage" value={coverage} showDot />
        <MetricBar label="AI Confidence" value={aiConfidence} showDot />
      </div>
    </KPICard>
  );
}
