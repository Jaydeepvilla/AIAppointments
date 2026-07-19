"use client";

import * as React from "react";
import Link from "next/link";
import { useSmartNotifications } from "@/hooks/use-smart-notifications";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Check, Trash2, AlertTriangle, Info, Zap } from "lucide-react";
import { cn } from "@/components/shared/utils";
import { formatDistanceToNow } from "date-fns";

interface NotificationsDropdownProps {
  initialNotifications: any[];
}

export function NotificationsDropdown({ initialNotifications }: NotificationsDropdownProps) {
  const { notifications, dismiss, markAsRead } = useSmartNotifications(initialNotifications);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const count = unreadNotifications.length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative text-muted-foreground hover:text-foreground h-8 w-8 rounded-md flex items-center justify-center hover:bg-[hsl(var(--foreground)/0.05)] transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.3)]"
          aria-label="Notifications"
          id="notifications-btn"
        >
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--state-error-text))] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--state-error-text))]"></span>
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[100] w-[360px] overflow-hidden rounded-xl border border-border bg-popover shadow-lg animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col max-h-[480px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.01)]">
            <div className="flex items-center gap-2">
              <span className="text-body-sm font-semibold text-foreground">Notifications</span>
              {count > 0 && (
                <span className="text-[10px] font-bold bg-[hsl(var(--state-error-bg))] text-[hsl(var(--state-error-text))] px-2 py-0.5 rounded-full">
                  {count} new
                </span>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[hsl(var(--foreground)/0.05)] custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--foreground)/0.04)] flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-muted-foreground/60" />
                </div>
                <p className="text-body-sm font-semibold text-foreground">All caught up!</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1 max-w-[240px]">
                  You have no active alerts or system notifications.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isCritical = notif.severity === "critical";
                const isWarning = notif.severity === "warning";
                const isAi = notif.category === "ai_improvement";
                
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3.5 transition-colors relative flex items-start gap-3 group hover:bg-[hsl(var(--foreground)/0.02)]",
                      !notif.isRead && "bg-[hsl(var(--foreground)/0.01)]"
                    )}
                  >
                    {/* Status Indicator Bar */}
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "shrink-0 mt-0.5 p-1.5 rounded-lg",
                        isCritical
                          ? "bg-[hsl(var(--state-error-bg))] text-[hsl(var(--state-error-text))]"
                          : isWarning
                          ? "bg-[hsl(var(--state-warning-bg))] text-[hsl(var(--state-warning-text))]"
                          : isAi
                          ? "bg-primary/10 text-primary"
                          : "bg-[hsl(var(--foreground)/0.05)] text-muted-foreground"
                      )}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : isAi ? (
                        <Zap className="w-3.5 h-3.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={cn(
                            "text-body-xs font-semibold truncate",
                            !notif.isRead ? "text-foreground font-bold" : "text-muted-foreground"
                          )}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[9px] text-muted-foreground/60 shrink-0">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5 leading-normal">
                        {notif.description}
                      </p>

                      {/* Action Button */}
                      {notif.actionUrl && (
                        <div className="mt-2 flex items-center gap-2">
                          <Link
                            href={notif.actionUrl}
                            className="inline-flex h-6 items-center justify-center rounded-md bg-primary px-2.5 text-[10px] font-bold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all duration-150"
                          >
                            {notif.metadata?.actionText || "Review"}
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Controls (Mark as read / Dismiss) */}
                    <div className="absolute right-2 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="p-1 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.05)] transition-all cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(notif.id);
                        }}
                        className="p-1 rounded-md text-muted-foreground/70 hover:text-[hsl(var(--state-error-text))] hover:bg-[hsl(var(--state-error-bg))] transition-all cursor-pointer"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
