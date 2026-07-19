"use client";

import { cn } from "@/components/shared/utils"
import { m } from "framer-motion"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-[hsl(var(--foreground)/0.04)]", className)}
      {...props}
    >
      <m.div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--foreground)/0.08), transparent)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  )
}

export { Skeleton }
