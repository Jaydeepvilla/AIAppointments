"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/client";
import { LogOut, User, Settings, Building } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@/components/shared/utils";

interface UserAvatarMenuProps {
  className?: string;
  avatarClass?: string;
}

export function UserAvatarMenu({ className, avatarClass }: UserAvatarMenuProps) {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={cn("h-8 w-8 rounded-full bg-slate-800 animate-pulse shrink-0", className)} />
    );
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="text-body-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const name = user.name || "User";
  const email = user.email;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer active:scale-95 transition-all duration-200 shrink-0",
            className
          )}
          aria-label="User menu"
        >
          <Avatar.Root className={cn("h-8 w-8 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800/40 bg-slate-100 dark:bg-slate-900 select-none flex items-center justify-center font-semibold text-caption text-foreground/80", avatarClass)}>
            {user.avatar ? (
              <Avatar.Image
                src={user.avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : null}
            <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-violet-600/10 text-violet-600 dark:text-violet-400 font-bold uppercase text-[11px]">
              {initials || "U"}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[100] min-w-[240px] overflow-hidden rounded-xl border border-slate-200/40 dark:border-slate-800/40 bg-card p-1 shadow-lg animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {/* Header info */}
          <div className="flex flex-col space-y-0.5 px-3.5 py-3 border-b border-slate-200/20 dark:border-slate-800/20">
            <span className="text-body-sm font-semibold text-foreground truncate">{name}</span>
            <span className="text-caption text-muted-foreground truncate">{email}</span>
          </div>

          <div className="p-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/profile"
                className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-foreground/85 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer select-none outline-none"
              >
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>Business Profile</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                href="/settings/account"
                className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-foreground/85 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer select-none outline-none"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-foreground/85 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer select-none outline-none"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Hours & Booking</span>
              </Link>
            </DropdownMenu.Item>
          </div>

          <div className="h-px bg-slate-200/20 dark:border-slate-800/20 my-1" />

          <div className="p-1">
            <DropdownMenu.Item
              onClick={() => logout()}
              className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer select-none outline-none font-semibold"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
