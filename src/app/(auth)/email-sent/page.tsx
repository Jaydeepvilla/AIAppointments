import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Email Sent | Operator",
  description: "Check your inbox for the email we sent.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmailSentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const type = typeof params.type === "string" ? params.type : "reset"; // "reset" | "verify"

  const headings = {
    reset: { title: "Check your inbox.", sub: "We sent you a password reset link." },
    verify: { title: "Verify your email.", sub: "We sent you an email verification link." },
  };
  const { title, sub } = headings[type as keyof typeof headings] ?? headings.reset;

  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader heading={title} subheading={sub} />

        <div className="space-y-space-6 animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
          {/* Animated mail icon */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center radius-full bg-primary/10 border border-primary/20 animate-float">
              <Mail className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
          </div>

          {/* Info box */}
          <div className="glass-panel radius-xl px-space-5 py-space-4 space-y-space-2">
            <p className="text-body-sm text-foreground/70 leading-body">
              {email ? (
                <>
                  We sent an email to{" "}
                  <strong className="text-foreground font-semibold">{email}</strong>.
                </>
              ) : (
                "We sent an email to your inbox."
              )}{" "}
              Click the link inside to continue.
            </p>
            <p className="text-caption text-foreground/40">
              Didn&apos;t receive it? Check your spam folder, or request a new link below.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-space-3">
            <Link
              href={type === "verify" ? `/verify-email${email ? `?email=${encodeURIComponent(email)}` : ""}` : "/forgot-password"}
              className="inline-flex items-center justify-center gap-space-2 w-full text-body-sm font-semibold text-primary hover:text-primary-light transition-colors"
            >
              Resend email <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
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
