import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";
import { SignInForm } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Sign In | Operator",
  description: "Sign in to your Operator workspace.",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Welcome back 👋"
          subheading="Sign in to your Operator workspace."
        />
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-space-12">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
