import { cn } from "@/components/shared/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("text-primary shrink-0", className)}
    >
      {/* Main gateway loop */}
      <path
        d="M 3 13 L 3 8 A 5 5 0 0 1 8 3 L 16 3 A 5 5 0 0 1 21 8 L 21 16 A 5 5 0 0 1 16 21 L 9 21 A 2 2 0 0 1 9 17 L 15 17 A 2 2 0 0 0 17 15 L 17 9 A 2 2 0 0 0 15 7 L 9 7 A 2 2 0 0 0 7 9 L 7 13 A 2 2 0 0 1 3 13 Z"
        fill="currentColor"
      />
      {/* Bottom-left accent square */}
      <rect x="3" y="17" width="4" height="4" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-space-2", className)}>
      <LogoIcon className={iconClassName} />
      <span className="text-base tracking-tight text-foreground font-bold">
        Operator
      </span>
    </div>
  );
}

