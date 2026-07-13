import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/shared/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-space-2.5 py-space-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border-emerald-500/20",
        warning:
          "border-transparent bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 border-amber-500/20",
        info:
          "border-transparent bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 border-blue-500/20",
        soft:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
