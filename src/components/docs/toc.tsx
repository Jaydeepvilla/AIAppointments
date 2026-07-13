"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/components/shared/utils";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function DocsToc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    const elements = document.querySelectorAll("h2, h3");
    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <div className="space-y-space-2">
      <h4 className="text-sm font-semibold text-foreground">On this page</h4>
      <ul className="m-space-0 list-none text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            className={cn(
              "mt-space-0 pt-space-2",
              item.level === 3 && "pl-space-4"
            )}
          >
            <Link
              href={`#${item.id}`}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground",
                item.id === activeId
                  ? "font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
