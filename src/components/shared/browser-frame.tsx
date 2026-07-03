import * as React from"react";
import { cn } from"./utils";

interface BrowserFrameProps extends React.HTMLAttributes<HTMLDivElement> {
 url?: string;
}

/**
 * Premium browser chrome frame for product showcases.
 * Wraps content inside a realistic browser window with traffic lights and URL bar.
 */
export function BrowserFrame({ url ="app.operator.ai", children, className, ...props }: BrowserFrameProps) {
 return (
 <div
 className={cn(
 "radius-xl overflow-hidden border border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--bg-layer-1))]",
 className
 )}
 {...props}
 >
 {/* Browser chrome */}
 <div className="flex items-center gap-space-3 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] px-space-4 py-space-2">
 {/* Traffic lights */}
 <div className="flex items-center gap-space-1 shrink-0">
 <div className="h-2.5 w-2.5 radius-md bg-[#ff5f57]"/>
 <div className="h-2.5 w-2.5 radius-md bg-[#febc2e]"/>
 <div className="h-2.5 w-2.5 radius-md bg-[#28c840]"/>
 </div>

 {/* URL bar */}
 <div className="flex-1 flex justify-center">
 <div className="flex items-center gap-space-2 radius-md bg-[hsl(var(--foreground)/0.04)] px-space-3 py-space-1 max-w-xs w-full">
 <svg className="h-3 w-3 text-muted-foreground/40 shrink-0"viewBox="0 0 16 16"fill="none">
 <path d="M8 1a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V6a5 5 0 0 0-5-5Zm3 7a3 3 0 0 1-6 0V6a3 3 0 0 1 6 0v2Z"fill="currentColor"opacity="0.5"/>
 </svg>
 <span className="text-caption text-muted-foreground/50 truncate select-none">{url}</span>
 </div>
 </div>

 {/* Spacer to balance traffic lights */}
 <div className="w-14 shrink-0"/>
 </div>

 {/* Content area */}
 <div className="relative">
 {children}
 </div>
 </div>
 );
}
