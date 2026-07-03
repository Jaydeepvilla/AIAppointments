"use client";

import * as React from"react";
import * as TabsPrimitive from"@radix-ui/react-tabs";
import { cn } from"./utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
 React.ElementRef<typeof TabsPrimitive.List>,
 React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
 <TabsPrimitive.List
 ref={ref}
 className={cn(
 "inline-flex h-10 items-center gap-space-2 text-muted-foreground flex-wrap",
 className
 )}
 {...props}
 />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
 React.ElementRef<typeof TabsPrimitive.Trigger>,
 React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
 <TabsPrimitive.Trigger
 ref={ref}
 className={cn(
 "inline-flex items-center justify-center whitespace-nowrap radius-full px-space-4 py-space-1.5 text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none",
 "border border-[hsl(var(--foreground)/0.08)] bg-transparent text-muted-foreground",
 "hover:bg-[hsl(var(--foreground)/0.03)] hover:text-foreground",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1",
 "disabled:pointer-events-none disabled:opacity-50",
 "data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary",
 className
 )}
 {...props}
 />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
 React.ElementRef<typeof TabsPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
 <TabsPrimitive.Content
 ref={ref}
 className={cn(
 "mt-space-4 animate-fade-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
 className
 )}
 {...props}
 />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
