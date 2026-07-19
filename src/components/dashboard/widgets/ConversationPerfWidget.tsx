"use client";

import { m } from "framer-motion";
import { hoverScale } from "@/components/motion/hover";
import { DailyBriefData } from "@/lib/dashboard-engine/daily-brief";
import { KPICard } from "../shared/kpi-card";
import { MetricBar } from "../shared/metric-bar";
import { MessageSquare, AlertCircle } from "lucide-react";

interface ConversationPerfWidgetProps {
  brief: DailyBriefData;
}

export function ConversationPerfWidget({ brief }: ConversationPerfWidgetProps) {
  const { conversationsHandled, escalations, aiSuccessRate } = brief;
  const aiHandled = Math.max(0, conversationsHandled - escalations);

  return (
    <KPICard
      title="Conversations"
      href="/inbox"
      icon={MessageSquare}
      score={aiSuccessRate}
      statusLabel={`${aiSuccessRate}% resolved by AI`}
      alertCount={escalations}
      alertText="escalation"
      alertIcon={AlertCircle}
      alertType={escalations > 3 ? "error" : escalations > 0 ? "warning" : "success"}
      metaText={`${aiHandled} AI-handled · ${conversationsHandled} total today`}
    >
      <div className="space-y-space-2">
        <MetricBar label="AI Resolution" value={aiSuccessRate} showDot />
        <MetricBar
          label="Response Quality"
          value={Math.min(100, aiSuccessRate + 5)}
          showDot
        />
      </div>
    </KPICard>
  );
}
