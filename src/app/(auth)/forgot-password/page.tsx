import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthHeader } from "@/components/shared/auth-forms";
import { ForgotPasswordForm } from "@/components/shared/auth-forms";

export const metadata: Metadata = {
  title: "Reset Password | Operator",
  description: "Reset your Operator account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="space-y-space-8">
        <AuthHeader
          heading="Reset your password."
          subheading="Enter your email and we'll send you a reset link within seconds."
        />
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}
