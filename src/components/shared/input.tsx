import * as React from"react";
import { cn } from"./utils";

export interface InputProps extends React.ComponentProps<"input"> {
 error?: boolean;
 success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, type, error, success, ...props }, ref) => {
 return (
 <input
 type={type}
 className={cn(
 "flex h-9 w-full radius-md border border-border-default bg-transparent px-space-3 py-space-1 text-body-sm transition-all duration-200",
 "file:border-0 file:bg-transparent file:text-body-sm file:text-foreground",
 "placeholder:text-muted-foreground/50",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
 "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-black/5 dark:disabled:bg-white/5",
 "read-only:bg-black/5 dark:read-only:bg-white/5 read-only:focus-visible:ring-0 read-only:focus-visible:border-black/10 dark:read-only:focus-visible:border-white/10",
 error
 ?"border-error-500 focus-visible:ring-error-500/20 focus-visible:border-error-500"
 : success
 ?"border-success-500 focus-visible:ring-success-500/20 focus-visible:border-success-500"
 :"hover:border-border-hover",
 className
 )}
 ref={ref}
 aria-invalid={error || undefined}
 {...props}
 />
 );
 }
);
Input.displayName ="Input";

export { Input };
