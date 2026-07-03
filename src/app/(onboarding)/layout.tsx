import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Your Business | Operator Receptionist",
  description:
    "Configure your business profile to activate your AI-powered receptionist in minutes.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
