import * as React from "react";
import Link from "next/link";
import { cn } from "@/components/shared/utils";

interface AuthFooterProps {
  className?: string;
}

/**
 * AuthFooter
 *
 * Persistent bottom navigation bar rendered on all auth pages.
 * Contains Privacy, Terms, Security links and copyright notice.
 * Uses design system border and foreground tokens only.
 */
export function AuthFooter({ className }: AuthFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-space-6 gap-y-space-2",
        "border-t border-border-subtle px-space-6 py-space-4",
        className
      )}
    >
      {[
        { href: "/privacy",  label: "Privacy"  },
        { href: "/terms",    label: "Terms"    },
        { href: "/security", label: "Security" },
      ].map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-caption text-foreground/40 transition-colors duration-fast hover:text-foreground/70"
        >
          {label}
        </Link>
      ))}

      <span className="text-caption text-foreground/20" aria-hidden="true">·</span>

      <span className="text-caption text-foreground/30">
        © {year} Operator
      </span>
    </footer>
  );
}
