import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Operator",
  description: "Simple, transparent pricing for Operator. Choose the plan that fits your business needs and start automating your reception.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
