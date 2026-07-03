import * as React from"react";
import { Slot } from"@radix-ui/react-slot";
import { cva, type VariantProps } from"class-variance-authority";
import { Loader2 } from"lucide-react";
import { cn } from"./utils";

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-space-2 whitespace-nowrap radius-md text-[13px] font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-1 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
 {
 variants: {
 variant: {
    default:
      "bg-primary text-white border border-border-default hover:bg-primary/90 hover:border-border-hover active:bg-primary/95",
    destructive:
      "bg-error-500 text-white border border-border-default hover:bg-error-600 active:bg-error-700",
    outline:
      "border border-border-default bg-transparent text-foreground hover:bg-black/5 hover:border-border-hover active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10",
    secondary:
      "bg-black/5 text-foreground border border-black/5 hover:bg-black/10 hover:border-black/10 active:bg-black/15 dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 dark:hover:border-white/10 dark:active:bg-white/15",
    ghost:
      "bg-transparent text-muted-foreground hover:text-foreground hover:bg-black/5 active:bg-black/10 dark:hover:bg-white/5 dark:active:bg-white/10 border border-transparent hover:border-border-subtle",
    link:
      "text-primary underline-offset-4 hover:underline p-space-0 h-auto bg-transparent border-none active:opacity-70",
    success:
      "bg-success-500 text-white border border-border-default hover:bg-success-600 active:bg-success-700",
 },
 size: {
 default:"h-9 px-space-4 py-space-2",
 sm:"h-8 px-space-3 py-space-1 text-[12px] [&_svg]:size-3.5",
 lg:"h-10 px-space-6 py-space-2.5 text-[14px]",
 icon:"h-9 w-9 p-space-0",
 },
 },
 defaultVariants: {
 variant:"default",
 size:"default",
 },
 }
);

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {
 asChild?: boolean;
 loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
 const Comp = asChild ? Slot :"button";
 return (
 <Comp
 className={cn(buttonVariants({ variant, size, className }))}
 ref={ref}
 disabled={disabled || loading}
 aria-busy={loading || undefined}
 {...props}
 >
 {asChild ? children : (
 <>
 {loading && <Loader2 className="animate-spin"aria-hidden="true"/>}
 {children}
 </>
 )}
 </Comp>
 );
 }
);
Button.displayName ="Button";

export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps,"variant">>(
 ({ className, ...props }, ref) => {
 return (
 <Button
 ref={ref}
 variant="default"
 className={cn(className,"!text-white [&_svg]:!text-white")}
 {...props}
 />
 );
 }
);
PrimaryButton.displayName ="PrimaryButton";

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps,"variant">>(
 ({ className, ...props }, ref) => {
 return (
 <Button
 ref={ref}
 variant="secondary"
 className={className}
 {...props}
 />
 );
 }
);
SecondaryButton.displayName ="SecondaryButton";

export { Button, buttonVariants };
