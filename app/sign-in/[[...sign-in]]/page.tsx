import { SignIn } from '@clerk/nextjs'
import { Tooth } from '@/components/tooth-icon'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center gap-2.5 hover:opacity-90 transition">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Tooth className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Dental<span className="text-indigo-650 dark:text-indigo-400">AI</span>
          </span>
        </Link>
        <p className="text-xs text-muted-foreground mt-2 font-semibold">Smart appointment booking for modern clinics</p>
      </div>

      {/* Clerk component */}
      <div className="w-full max-w-[440px] z-10 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
        <SignIn />
      </div>

      <div className="mt-8 text-xs text-muted-foreground font-medium">
        &copy; {new Date().getFullYear()} DentalAI. All rights reserved.
      </div>
    </main>
  )
}
