import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";
import { SignUpForm } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Create Account | Operator",
  description: "Start your free 14-day trial of Operator — the AI Business Operating System.",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Welcome to Operator 👋"
          subheading="We're glad to have you onboard!"
        />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-space-12">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          }
        >
          <SignUpForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
