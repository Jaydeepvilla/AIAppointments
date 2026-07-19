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
            "flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.4)] cursor-pointer active:scale-95 transition-all duration-200 shrink-0",
            className
          )}
          aria-label="User menu"
        >
          <Avatar.Root className={cn("h-8 w-8 rounded-full overflow-hidden border border-[hsl(var(--foreground)/0.12)] bg-[hsl(var(--foreground)/0.05)] select-none flex items-center justify-center font-semibold text-caption text-foreground/80", avatarClass)}>
            {user.avatar ? (
              <Avatar.Image
                src={user.avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : null}
            <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold uppercase text-[11px]">
              {initials || "U"}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[100] min-w-[240px] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {/* Header info */}
          <div className="flex flex-col space-y-0.5 px-3.5 py-3 border-b border-[hsl(var(--foreground)/0.06)]">
            <span className="text-body-sm font-semibold text-foreground truncate">{name}</span>
            <span className="text-caption text-muted-foreground truncate">{email}</span>
          </div>

          <div className="p-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/profile"
                className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-foreground/85 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.05)] transition-colors cursor-pointer select-none outline-none"
              >
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>Business Profile</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                href="/settings/account"
                className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-foreground/85 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.05)] transition-colors cursor-pointer select-none outline-none"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-foreground/85 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.05)] transition-colors cursor-pointer select-none outline-none"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Hours & Booking</span>
              </Link>
            </DropdownMenu.Item>
          </div>

          <div className="h-px bg-[hsl(var(--foreground)/0.06)] my-1" />

          <div className="p-1">
            <DropdownMenu.Item
              onClick={() => logout()}
              className="flex items-center gap-space-2.5 px-3 py-2.5 rounded-lg text-body-sm text-[hsl(var(--state-error-text))] hover:bg-[hsl(var(--state-error-bg))] transition-colors cursor-pointer select-none outline-none font-semibold"
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
