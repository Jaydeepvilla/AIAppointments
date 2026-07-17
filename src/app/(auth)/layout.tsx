import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Operator — Authentication",
  description:
    "Sign in to your Operator workspace — the AI Business Operating System that books, qualifies, and answers 24/7.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
