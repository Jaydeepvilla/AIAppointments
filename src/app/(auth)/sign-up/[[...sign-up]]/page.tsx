import { SignUp } from"@clerk/nextjs";
import { Bot } from"lucide-react";
import Link from"next/link";

export default function SignUpPage() {
 return (
 <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-space-6 overflow-hidden">
 {/* Background radial effects */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[var(--bg-blob-h)] pointer-events-none opacity-20">
 <div className="absolute -top-[10%] left-[20%] w-full h-full radius-full bg-primary blur-[120px]"/>
 </div>

 <div className="z-10 flex w-full max-w-md flex-col space-y-space-6 py-space-12">
 <div className="flex flex-col items-center space-y-space-2 text-center">
 <Link href="/"className="inline-flex items-center gap-space-2 mb-space-4 group">
 <div className="flex h-10 w-10 items-center justify-center radius-lg bg-primary/10 text-primary transition-all group-hover:scale-105">
 <Bot className="h-6 w-6"/>
 </div>
 <span className="text-title-lg tracking-tight">Operator</span>
 </Link>
 <h1 className="text-heading-lg tracking-tight text-foreground">
 Create your account
 </h1>
 <p className="text-body-sm text-muted-foreground">
 Get started with your free 14-day trial
 </p>
 </div>

 <div className="flex justify-center">
 <SignUp
 appearance={{
 elements: {
 rootBox:"w-full",
 card:"bg-card border border-border radius-xl",
 headerTitle:"text-foreground",
 headerSubtitle:"text-muted-foreground",
 socialButtonsBlockButton:"border border-border text-foreground hover:bg-accent",
 formButtonPrimary:"bg-primary hover:bg-primary/90 text-primary-foreground",
 formFieldLabel:"text-muted-foreground",
 formFieldInput:"bg-background border-border text-foreground",
 footerActionText:"text-muted-foreground",
 footerActionLink:"text-primary hover:underline",
 },
 }}
 />
 </div>
 </div>
 </div>
 );
}
