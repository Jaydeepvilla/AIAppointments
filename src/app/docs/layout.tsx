import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation | Operator",
  description: "Learn how to integrate, configure, and customize your Operator AI receptionist with our comprehensive developer guides.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
