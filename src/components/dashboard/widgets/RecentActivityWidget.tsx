"use client";

import { Card } from "@/components/shared/card";
import {
  Calendar,
  BookOpen,
  Sparkles,
  MessageSquare,
  UserCheck,
  AlertTriangle,
  Activity,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: Date | string;
}

interface RecentActivityWidgetProps {
  activity: ActivityItem[];
}

const ACTIVITY_META: Record<
  string,
  { icon: React.ElementType; iconBg: string; dot: string; label: string }
> = {
  appointment: {
    icon: Calendar,
    iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Booking",
  },
  knowledge: {
    icon: BookOpen,
    iconBg: "bg-primary/10 text-primary",
    dot: "bg-primary",
    label: "Knowledge",
  },
  ai_optimization: {
    icon: Sparkles,
    iconBg: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
    dot: "bg-violet-500",
    label: "AI",
  },
  message: {
    icon: MessageSquare,
    iconBg: "bg-neutral-500/10 text-neutral-500 dark:text-neutral-400",
    dot: "bg-neutral-400",
    label: "Chat",
  },
  escalation: {
    icon: AlertTriangle,
    iconBg: "bg-rose-500/10 text-rose-500 dark:text-rose-400",
    dot: "bg-rose-500",
    label: "Alert",
  },
};

export function RecentActivityWidget({ activity }: RecentActivityWidgetProps) {
  if (activity.length === 0) {
    return (
      <Card className="h-full p-space-5 flex flex-col items-center justify-center text-center gap-space-3">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
          <Activity className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <div>
          <p className="text-body-sm font-semibold text-foreground">No Recent Activity</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1">
            Operational events appear here in real-time.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-space-5 pt-space-5 pb-space-3">
        <div className="flex items-center gap-space-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            Recent Activity
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-space-5 mb-space-1" />

      {/* Feed */}
      <div className="flex-1 px-space-4 py-space-2 space-y-space-1 overflow-auto">
        {activity.map((item, idx) => {
          const meta = ACTIVITY_META[item.type] ?? {
            icon: UserCheck,
            iconBg: "bg-neutral-500/10 text-neutral-500",
            dot: "bg-neutral-400",
            label: "Event",
          };
          const IconComp = meta.icon;

          let formattedTime = "";
          try {
            formattedTime = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
          } catch {
            formattedTime = String(item.createdAt);
          }

          const isLast = idx === activity.length - 1;

          return (
            <div key={item.id} className="flex gap-space-3 group relative">
              {/* Timeline connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.iconBg} transition-transform duration-150 group-hover:scale-110`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 min-h-[10px] bg-border/60 my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-space-2 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] font-medium text-foreground leading-snug">
                    {item.description}
                  </p>
                  <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${meta.iconBg}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/55 mt-0.5">{formattedTime}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-space-5 py-space-3 border-t border-border/50">
        <button className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
          View all activity
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );
}
