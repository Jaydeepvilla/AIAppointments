import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center radius-md px-space-2 py-space-0.5 text-caption font-medium transition-colors duration-150 select-none ring-1 ring-inset",
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--primary)/0.08)] text-primary ring-[hsl(var(--primary)/0.12)]",
        secondary:
          "bg-[hsl(var(--foreground)/0.04)] text-muted-foreground ring-[hsl(var(--foreground)/0.08)]",
        success:
          "bg-[hsl(var(--state-success-bg))] text-[hsl(var(--state-success-text))] ring-[hsl(var(--state-success-text)/0.15)]",
        warning:
          "bg-[hsl(var(--state-warning-bg))] text-[hsl(var(--state-warning-text))] ring-[hsl(var(--state-warning-text)/0.15)]",
        destructive:
          "bg-[hsl(var(--state-error-bg))] text-[hsl(var(--state-error-text))] ring-[hsl(var(--state-error-text)/0.15)]",
        outline:
          "bg-transparent text-foreground ring-[hsl(var(--foreground)/0.12)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-space-1 h-1.5 w-1.5 radius-md shrink-0",
            variant === "success" && "bg-[hsl(var(--state-success-text))]",
            variant === "warning" && "bg-[hsl(var(--state-warning-text))]",
            variant === "destructive" && "bg-[hsl(var(--state-error-text))]",
            variant === "default" && "bg-primary",
            (!variant || variant === "secondary" || variant === "outline") && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
