import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";
import { ResetPasswordForm } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Create New Password | Operator",
  description: "Set a new secure password for your Operator account.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Create new password."
          subheading="Choose a strong password that you haven't used before."
        />

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          /* Invalid or missing token state */
          <div className="space-y-space-6 text-center animate-scale-in">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center radius-full bg-state-error-bg border border-state-error-text/20">
                <AlertCircle className="h-7 w-7 text-state-error-text" aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-space-2">
              <h2 className="text-title-lg font-semibold text-foreground">Link invalid or expired</h2>
              <p className="text-body-sm text-foreground/50 leading-body">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-space-1 text-body-sm font-semibold text-primary hover:text-primary-light transition-colors"
            >
              Request new reset link →
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
