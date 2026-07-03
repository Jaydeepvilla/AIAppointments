import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo | Operator",
  description: "Try out Operator's AI receptionist live. See how it handles scheduling, answering FAQs, and qualifying leads.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
