import { AlertCircle, CheckCircle2, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/components/shared/utils";

interface CalloutProps {
  children: React.ReactNode;
  type?: "default" | "info" | "warning" | "danger" | "success" | "tip";
  title?: string;
  className?: string;
}

export function Callout({
  children,
  type = "default",
  title,
  className,
}: CalloutProps) {
  const iconMap = {
    default: Info,
    info: Info,
    warning: TriangleAlert,
    danger: AlertCircle,
    success: CheckCircle2,
    tip: Lightbulb,
  };

  const Icon = iconMap[type];

  return (
    <div
      className={cn(
        "my-space-6 flex items-start gap-space-4 rounded-xl border p-space-4 shadow-sm",
        {
          "border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.02)] text-foreground": type === "default",
          "border-[hsl(var(--state-info-border))] bg-[hsl(var(--state-info-bg))] text-[hsl(var(--state-info-text))]": type === "info",
          "border-[hsl(var(--state-warning-border))] bg-[hsl(var(--state-warning-bg))] text-[hsl(var(--state-warning-text))]": type === "warning",
          "border-[hsl(var(--state-error-border))] bg-[hsl(var(--state-error-bg))] text-[hsl(var(--state-error-text))]": type === "danger",
          "border-[hsl(var(--state-success-border))] bg-[hsl(var(--state-success-bg))] text-[hsl(var(--state-success-text))]": type === "success",
          "border-[hsl(142_71%_45%/0.2)] bg-[hsl(142_71%_45%/0.1)] text-[hsl(142_71%_45%)]": type === "tip",
        },
        className
      )}
    >
      <div className={cn("mt-space-1", {
        "text-muted-foreground": type === "default",
        "text-[hsl(var(--state-info-text))]": type === "info",
        "text-[hsl(var(--state-warning-text))]": type === "warning",
        "text-[hsl(var(--state-error-text))]": type === "danger",
        "text-[hsl(var(--state-success-text))]": type === "success",
        "text-[hsl(142_71%_45%)]": type === "tip",
      })}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="w-full min-w-0 flex-1">
        {title && <div className="mb-space-1 font-semibold">{title}</div>}
        <div className="text-sm prose-p:my-space-0 prose-ul:my-space-0">{children}</div>
      </div>
    </div>
  );
}
