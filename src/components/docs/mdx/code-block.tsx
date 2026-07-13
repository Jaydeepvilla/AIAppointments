"use client";
import { Button } from "@/components/shared/button";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/components/shared/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="group relative my-space-6 overflow-hidden rounded-xl border border-[hsl(var(--foreground)/0.08)] bg-[#0d1117] dark:bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-space-4 py-space-2">
        <div className="flex items-center gap-space-2">
          {language && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {language}
            </span>
          )}
          {filename && (
            <>
              {language && <span className="text-muted-foreground/30">•</span>}
              <span className="text-xs text-muted-foreground font-mono">
                {filename}
              </span>
            </>
          )}
        </div>
        <Button onClick={copyToClipboard} className="flex w-6 items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-white transition-colors" aria-label="Copy code">
          {hasCopied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <ScrollArea className="p-space-4" vertical={false}>
                  <pre className="text-body-sm leading-relaxed text-slate-50 font-mono">
                    <code>{code}</code>
                  </pre>
                </ScrollArea>
    </div>
  );
}
