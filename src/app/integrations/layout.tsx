import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations | Operator",
  description: "Connect Operator with your favorite tools. Seamlessly integrate with CRMs, scheduling software, and communication channels.",
};

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
