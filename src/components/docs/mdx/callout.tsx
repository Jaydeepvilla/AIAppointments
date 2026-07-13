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
          "border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-200": type === "info",
          "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-200": type === "warning",
          "border-red-500/20 bg-red-500/10 text-red-900 dark:text-red-200": type === "danger",
          "border-green-500/20 bg-green-500/10 text-green-900 dark:text-green-200": type === "success",
          "border-[hsl(142_71%_45%/0.2)] bg-[hsl(142_71%_45%/0.1)] text-[hsl(142_71%_30%)] dark:text-[hsl(142_71%_60%)]": type === "tip",
        },
        className
      )}
    >
      <div className={cn("mt-space-1", {
        "text-muted-foreground": type === "default",
        "text-blue-600 dark:text-blue-400": type === "info",
        "text-amber-600 dark:text-amber-400": type === "warning",
        "text-red-600 dark:text-red-400": type === "danger",
        "text-green-600 dark:text-green-400": type === "success",
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
