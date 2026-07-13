import { cn } from "@/components/shared/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-space-2", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={cn("text-primary shrink-0", iconClassName)}
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="6"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 14.5s1 2 3.5 2 3.5-2 3.5-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-base tracking-tight text-foreground font-semibold">
        Operator
      </span>
    </div>
  );
}
