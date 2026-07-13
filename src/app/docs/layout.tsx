import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsHeader } from "@/components/docs/header";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Documentation | Operator",
  description: "Enterprise documentation for the next-generation AI scheduling platform.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-sans">
      <DocsHeader />
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-space-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-space-10 mx-auto px-space-4 md:px-space-8 max-w-screen-2xl">
        <aside className="fixed top-space-14 z-30 -ml-space-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-[hsl(var(--foreground)/0.08)]"><ScrollArea className="h-full w-full" horizontal={false}>
                        <div className="h-full py-space-6 pr-space-4 lg:py-space-8">
                          <DocsSidebar />
                        </div>
                      </ScrollArea></aside>
        
        <main className="relative py-space-6 lg:gap-space-10 lg:py-space-8">
          {children}
        </main>
      </div>
    </div>
  );
}
