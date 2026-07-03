import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Operator Receptionist",
  description:
    "Sign in to your Operatordashboard to manage your AI-powered front desk.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
