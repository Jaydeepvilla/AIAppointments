"use client";

import * as React from"react";
import * as SheetPrimitive from"@radix-ui/react-dialog";
import { cva, type VariantProps } from"class-variance-authority";
import { X } from"lucide-react";
import { cn } from"./utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
 React.ElementRef<typeof SheetPrimitive.Overlay>,
 React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
 <SheetPrimitive.Overlay
   className={cn(
     "fixed inset-space-0 z-50 bg-[hsl(var(--overlay))] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
     className
   )}
   {...props}
   ref={ref}
 />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
 "fixed z-50 gap-space-4 bg-background p-space-6 shadow-2xl transition ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-250",
 {
 variants: {
 side: {
 top:"inset-x-space-0 top-space-0 border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
 bottom:
 "inset-x-space-0 bottom-space-0 border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
 left:"inset-y-space-0 left-space-0 h-full w-3/4 border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
 right:
 "inset-y-space-0 right-space-0 h-full w-3/4 border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
 },
 },
 defaultVariants: {
 side:"right",
 },
 }
);

interface SheetContentProps
 extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
 VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
 React.ElementRef<typeof SheetPrimitive.Content>,
 SheetContentProps
>(({ side ="right", className, children, ...props }, ref) => (
 <SheetPortal>
 <SheetOverlay />
 <SheetPrimitive.Content
 ref={ref}
 className={cn(sheetVariants({ side }), className)}
 {...props}
 >
 {children}
 <SheetPrimitive.Close className="absolute right-space-4 top-space-4 radius-md p-space-1 text-muted-foreground/60 transition-all duration-150 hover:text-foreground hover:bg-[hsl(var(--foreground)/0.06)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 disabled:pointer-events-none cursor-pointer active:scale-95">
 <X className="h-4 w-4"/>
 <span className="sr-only">Close</span>
 </SheetPrimitive.Close>
 </SheetPrimitive.Content>
 </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
 <div
 className={cn(
 "flex flex-col space-y-space-2 text-center sm:text-left",
 className
 )}
 {...props}
 />
);
SheetHeader.displayName ="SheetHeader";

const SheetFooter = ({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
 <div
 className={cn(
 "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-space-2",
 className
 )}
 {...props}
 />
);
SheetFooter.displayName ="SheetFooter";

const SheetTitle = React.forwardRef<
 React.ElementRef<typeof SheetPrimitive.Title>,
 React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
 <SheetPrimitive.Title
 ref={ref}
 className={cn("text-title-lg text-foreground", className)}
 {...props}
 />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
 React.ElementRef<typeof SheetPrimitive.Description>,
 React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
 <SheetPrimitive.Description
 ref={ref}
 className={cn("text-body-sm text-muted-foreground", className)}
 {...props}
 />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
 Sheet,
 SheetPortal,
 SheetOverlay,
 SheetTrigger,
 SheetClose,
 SheetContent,
 SheetHeader,
 SheetFooter,
 SheetTitle,
 SheetDescription,
};
