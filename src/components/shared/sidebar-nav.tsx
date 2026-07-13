"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/shared/utils";
import { useSidebar } from "@/components/shared/sidebar-context";
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  LineChart,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  Zap,
  ClipboardList,
  PhoneCall,
  Phone,
  Volume2,
  History,
  Building,
  Briefcase,
  HelpCircle,
  Settings,
  BookOpen,
  Code,
  Radio,
  CreditCard,
  Palette,
  Globe,
  Brain,
} from "lucide-react";

const IconMap = {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  LineChart,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  Zap,
  ClipboardList,
  PhoneCall,
  Phone,
  Volume2,
  History,
  Building,
  Briefcase,
  HelpCircle,
  Settings,
  BookOpen,
  Code,
  Radio,
  CreditCard,
  Palette,
  Globe,
  Brain,
};

interface SidebarLinkProps {
  href: string;
  icon: keyof typeof IconMap;
  label: string;
}

interface SidebarGroupProps {
  title: string;
  links: SidebarLinkProps[];
}

export function SidebarNavGroup({ title, links }: SidebarGroupProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <nav className="space-y-space-0" aria-label={title}>
      {/* Section title — hidden when collapsed, show divider instead */}
      {isCollapsed ? (
        <div className="h-px bg-[hsl(var(--foreground)/0.06)] my-space-2 mx-space-2" />
      ) : (
        <p className="px-space-3 pb-space-1 pt-space-3 text-caption uppercase tracking-widest text-primary font-normal select-none transition-opacity duration-200" aria-hidden="true">
          {title}
        </p>
      )}

      {links.map((link) => {
        const Icon = IconMap[link.icon];
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" &&
           link.href !== "/voice" &&
           pathname.startsWith(link.href + "/"));

        if (!Icon) return null;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            title={isCollapsed ? link.label : undefined}
            className={cn(
              "flex items-center radius-md transition-all duration-150 group relative select-none",
              isCollapsed
                ? "justify-center mx-space-1 px-space-0 py-space-2"
                : "gap-space-2 px-space-3 py-space-2",
              isActive
                ? "bg-black/5 text-foreground font-medium dark:bg-white/10 dark:text-white"
                : "text-muted-foreground hover:bg-black/5 hover:text-foreground active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-inset"
            )}
          >
            <Icon
              className={cn(
                "shrink-0 transition-colors duration-150 size-4",
                isActive
                  ? "text-foreground dark:text-white"
                  : "text-muted-foreground/60 group-hover:text-foreground"
              )}
            />
            {!isCollapsed && (
              <span className={cn("truncate text-body-sm", isActive ? "font-medium" : "font-normal")}>{link.label}</span>
            )}

            {/* Active indicator dot for collapsed mode */}
            {isActive && isCollapsed && (
              <span className="absolute -right-space-0.5 top-space-1/2 -translate-y-space-1/2 h-1.5 w-1.5 radius-md bg-foreground dark:bg-white" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
