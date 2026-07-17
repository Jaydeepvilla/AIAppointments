"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";

// ── Animated countdown redirect ─────────────────────────────────────────────
function CountdownRedirect({ to, seconds = 5 }: { to: string; seconds?: number }) {
  const router = useRouter();
  const [remaining, setRemaining] = React.useState(seconds);

  React.useEffect(() => {
    if (remaining <= 0) {
      router.push(to);
      router.refresh();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, router, to]);

  return (
    <p className="text-caption text-foreground/40 text-center">
      Redirecting to your dashboard in{" "}
      <span className="font-semibold text-primary">{remaining}s</span>…
    </p>
  );
}

export default function EmailVerifiedPage() {
  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Email verified."
          subheading="Your account is now active and ready to use."
        />

        <div className="space-y-space-6 animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center radius-full bg-state-success-bg border border-state-success-text/20">
              <CheckCircle className="h-8 w-8 text-state-success-text" aria-hidden="true" />
              {/* Pulse ring */}
              <span
                className="absolute inset-0 rounded-full border border-state-success-text/20 animate-ping opacity-50"
                style={{ animationDuration: "2s" }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Message */}
          <div className="glass-panel radius-xl px-space-5 py-space-4 space-y-space-2 text-center">
            <p className="text-body-sm text-foreground/70 leading-body">
              Welcome to Operator! Your email address has been successfully verified.
              You can now access all features of your workspace.
            </p>
          </div>

          {/* Countdown + manual link */}
          <div className="flex flex-col items-center gap-space-3">
            <CountdownRedirect to="/dashboard" seconds={5} />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-space-1 text-body-sm font-semibold text-primary hover:text-primary-light transition-colors"
            >
              Go to dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
