"use client";import { Badge } from "@/components/shared/badge";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/components/shared/utils";
import { SIDEBAR } from "@/lib/docs-data";
import { Suspense } from "react";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id") || "quickstart";

  return (
    <div className="w-full">
      {SIDEBAR.map((group, index) =>
      <div key={index} className="pb-space-8">
          <h4 className="mb-space-2 flex items-center gap-space-2 rounded-md px-space-2 py-space-1 text-sm font-semibold text-foreground">
            <group.icon className="h-4 w-4 text-primary" />
            {group.section}
          </h4>
          <div className="grid grid-flow-row auto-rows-max text-sm">
            {group.items.map((item) =>
          <Link
            key={item.id}
            href={`/docs?id=${item.id}`}
            className={cn(
              "flex w-full items-center justify-between rounded-full px-space-4 py-space-2 transition-colors",
              activeId === item.id ?
              "bg-primary text-white font-normal hover:bg-primary/90" :
              "text-muted-foreground hover:bg-[hsl(var(--foreground)/0.04)]"
            )}>
            
                {item.label}
                {(item as any).badge &&
            <Badge>
                    {(item as any).badge}
                  </Badge>
            }
              </Link>
          )}
          </div>
        </div>
      )}
    </div>);

}

export function DocsSidebar() {
  return (
    <Suspense fallback={<div className="w-full h-full animate-pulse bg-muted/20 rounded-md" />}>
      <SidebarContent />
    </Suspense>);

}