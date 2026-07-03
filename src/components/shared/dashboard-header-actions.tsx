"use client";

import * as React from"react";
import { useTheme } from"next-themes";
import { UserButton } from"@clerk/nextjs";
import { Bell, Sun, Moon } from"lucide-react";
import { Button } from"./button";

interface DashboardHeaderActionsProps {
 roleLabel: string;
}

export function DashboardHeaderActions({ roleLabel }: DashboardHeaderActionsProps) {
 const { resolvedTheme, setTheme } = useTheme();
 const [mounted, setMounted] = React.useState(false);

 React.useEffect(() => {
 setMounted(true);
 }, []);

 const toggleTheme = () => {
 setTheme(resolvedTheme ==="dark"?"light":"dark");
 };

 return (
 <div className="flex items-center gap-space-3">
 {/* Theme Toggle */}
 <Button
 variant="ghost"
 size="icon"
 className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent radius-md transition-colors"
 onClick={toggleTheme}
 aria-label="Toggle theme"
 >
 {mounted && resolvedTheme ==="dark"? (
 <Sun className="h-4 w-4"/>
 ) : (
 <Moon className="h-4 w-4"/>
 )}
 </Button>

 {/* Notifications */}
 <Button
 variant="ghost"
 size="icon"
 className="h-8 w-8 text-muted-foreground hover:text-foreground radius-lg transition-colors"
 aria-label="Notifications"
 id="notifications-btn"
 >
 <Bell className="h-4 w-4"/>
 </Button>

 <div className="h-4 w-px bg-[hsl(var(--foreground)/0.08)] hidden sm:block"/>

 <span className="hidden sm:inline-block text-caption text-muted-foreground/70 select-none">
 {roleLabel}
 </span>

 <div className="h-4 w-px bg-[hsl(var(--foreground)/0.08)]"/>

 {/* Profile Avatar (User Button) */}
 <div className="flex items-center">
 <UserButton
 appearance={{
 elements: {
 avatarBox:"h-8 w-8 ring-1 ring-[hsl(var(--foreground)/0.1)] hover:scale-105 transition-transform duration-200",
 userButtonTrigger:" focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
 },
 }}
 />
 </div>
 </div>
 );
}
