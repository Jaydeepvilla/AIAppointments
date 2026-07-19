"use client";

import { m } from "framer-motion";
import { hoverScale } from "@/components/motion/hover";

import { DailyBriefData } from "@/lib/dashboard-engine/daily-brief";
import { KPICard } from "../shared/kpi-card";
import { MetricBar } from "../shared/metric-bar";
import { CalendarCheck, XCircle } from "lucide-react";

interface BookingPerfWidgetProps {
  brief: DailyBriefData;
}

export function BookingPerfWidget({ brief }: BookingPerfWidgetProps) {
  const {
    appointmentsBooked,
    appointmentsCancelled,
    appointmentsNoShow,
    revenueGenerated,
  } = brief;

  const totalAttempts = appointmentsBooked + appointmentsCancelled + appointmentsNoShow;
  const conversionRate =
    totalAttempts > 0 ? Math.round((appointmentsBooked / totalAttempts) * 100) : 100;

  const issues = appointmentsCancelled + appointmentsNoShow;

  const revenueText =
    revenueGenerated > 0
      ? `$${revenueGenerated.toFixed(0)} revenue today`
      : "No revenue recorded today";

  return (
    <KPICard
      title="Bookings"
      href="/appointments"
      icon={CalendarCheck}
      score={conversionRate}
      statusLabel={`${appointmentsBooked} booked today`}
      alertCount={issues}
      alertText="issue"
      alertIcon={XCircle}
      alertType={issues > 2 ? "error" : issues > 0 ? "warning" : "success"}
      metaText={revenueText}
    >
      <div className="space-y-space-2">
        <MetricBar label="Conversion" value={conversionRate} showDot />
        {appointmentsCancelled > 0 && (
          <MetricBar
            label="Cancellations"
            value={Math.round(
              (appointmentsCancelled / Math.max(totalAttempts, 1)) * 100
            )}
            showDot
          />
        )}
      </div>
    </KPICard>
  );
}
