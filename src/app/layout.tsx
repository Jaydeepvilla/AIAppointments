import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth/client";
import { currentUser } from "@/lib/auth/server";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ToastProvider } from "@/components/shared/toast";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./globals.css";

import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Operator | 24/7 AI That Books, Qualifies & Answers",
  description:
    "Deploy an AI receptionist that answers calls, books appointments, captures leads, and supports customers 24/7 — for dental clinics, law firms, salons, and any service business.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const initialUser = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name || null,
        avatar: user.avatar || null,
      }
    : null;

  return (
    <AuthProvider initialUser={initialUser}>
      <html
        lang="en"
        className={`${GeistSans.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground antialiased font-sans">
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
