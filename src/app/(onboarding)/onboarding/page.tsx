import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { OnboardingWizard } from "@/components/forms/onboarding-wizard";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default async function OnboardingPage() {
  const { hasOrg } = await checkUserOrganization();
  if (hasOrg) redirect("/dashboard");

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* Subtle background layer */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] rounded-full blur-[120px] opacity-50"
          style={{ background: "hsl(var(--primary) / 0.08)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vh] rounded-full blur-[100px] opacity-40"
          style={{ background: "hsl(290 80% 55% / 0.06)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Logo pinned top-left */}
      <div className="absolute top-8 left-10 z-20">
        <Link href="/" aria-label="Operator home">
          <Logo iconClassName="text-primary h-6 w-6" className="gap-2 text-foreground font-bold text-lg" />
        </Link>
      </div>

      {/* Centered form area */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-space-6 py-space-20">
        <div className="w-full max-w-[520px]">
          <OnboardingWizard />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center gap-space-6 px-space-8 py-space-5 text-caption text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        <span>© 2025 Operator</span>
      </footer>
    </div>
  );
}