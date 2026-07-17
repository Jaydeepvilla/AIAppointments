import type { Metadata } from "next";
import Link from "next/link";
import { ShieldOff, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Account Locked | Operator",
  description: "Your account has been temporarily locked.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AccountLockedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const reason = typeof params.reason === "string" ? params.reason : "too_many_attempts";

  const messages: Record<string, string> = {
    too_many_attempts:
      "Your account has been temporarily locked due to too many failed sign-in attempts. Please try again in 30 minutes or contact support.",
    suspicious_activity:
      "We detected unusual activity on your account and have locked it for your protection. Please contact support to restore access.",
    admin:
      "Your account has been locked by an administrator. Please contact support for assistance.",
  };

  const message = messages[reason] ?? messages.too_many_attempts;

  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Account locked."
          subheading="We've temporarily restricted access to your account."
        />

        <div className="space-y-space-6 animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center radius-full bg-state-error-bg border border-state-error-text/20">
              <ShieldOff className="h-8 w-8 text-state-error-text" aria-hidden="true" />
            </div>
          </div>

          {/* Info box */}
          <div className="glass-panel radius-xl px-space-5 py-space-4">
            <p className="text-body-sm text-foreground/70 leading-body text-center">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-space-3">
            <a
              href="mailto:support@operator.ai"
              className="inline-flex items-center justify-center gap-space-2 w-full px-space-4 py-space-3 radius-xl bg-primary/10 border border-primary/20 text-body-sm font-semibold text-primary hover:bg-primary/15 transition-colors duration-fast"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact support
            </a>
            <Link
              href="/sign-in"
              className="text-center text-caption font-semibold text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
