import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Session Expired | Operator",
  description: "Your session has expired. Please sign in again.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SessionExpiredPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const returnUrl = typeof params.returnUrl === "string" ? params.returnUrl : "/dashboard";

  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Session expired."
          subheading="Your session timed out for security. Please sign in again."
        />

        <div className="space-y-space-6 animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center radius-full bg-state-warning-bg border border-state-warning-text/20 animate-float">
              <Clock className="h-8 w-8 text-state-warning-text" aria-hidden="true" />
            </div>
          </div>

          {/* Info box */}
          <div className="glass-panel radius-xl px-space-5 py-space-4">
            <p className="text-body-sm text-foreground/70 leading-body text-center">
              For your security, we automatically end sessions after a period of inactivity.
              Your data is safe — simply sign in again to continue where you left off.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-space-3">
            <Link
              href={`/sign-in${returnUrl !== "/dashboard" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
              className="inline-flex items-center justify-center gap-space-2 w-full px-space-4 py-space-3 radius-xl bg-primary text-primary-foreground text-body-sm font-semibold hover:bg-primary-light active:scale-[0.99] transition-all duration-fast"
            >
              Sign in again <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className="text-center text-caption font-semibold text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
