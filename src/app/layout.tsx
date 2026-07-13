import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ToastProvider } from "@/components/shared/toast";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./globals.css";

import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Operator| 24/7 AI That Books, Qualifies & Answers",
  description:
    "Deploy an AI receptionist that answers calls, books appointments, captures leads, and supports customers 24/7 — for dental clinics, law firms, salons, and any service business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--card))",
          colorForeground: "hsl(var(--foreground))",
          colorMutedForeground: "hsl(var(--neutral-500))",
          colorBorder: "hsl(var(--border))",
        },
      }}
    >
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
    </ClerkProvider>
  );
}
