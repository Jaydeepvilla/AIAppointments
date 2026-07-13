"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/shared/dialog";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { AutomationAction, AutomationPreview } from "@/lib/automation-engine/types";
import { 
  generateDocumentAction, publishDocumentAction, 
  generateFaqAction, publishFaqAction,
  generateWebsiteAction, publishWebsiteAction,
  generateCategoryAction, publishCategoryAction,
  generateTagAction, publishTagAction,
  generateHoursAction, publishHoursAction
} from "@/server/actions/automations";
import { useToast } from "@/components/shared/toast";
import { Loader2, Sparkles } from "lucide-react";
import { NativeTextarea } from "@/components/shared/native";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  action: AutomationAction;
  trigger?: React.ReactNode;
}

export function AutomationDialog({ action, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [preview, setPreview] = useState<AutomationPreview | null>(null);
  const { success, error } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let result;
      switch (action.automationType) {
        case "generate_faq": result = await generateFaqAction(); break;
        case "import_website": result = await generateWebsiteAction(); break;
        case "suggest_categories": result = await generateCategoryAction(); break;
        case "suggest_tags": result = await generateTagAction(); break;
        case "suggest_hours": result = await generateHoursAction(); break;
        default: result = await generateDocumentAction(action.targetResourceName); break;
      }
      setPreview(result);
    } catch (err) {
      error("Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state on close
      setTimeout(() => setPreview(null), 300);
    }
  };

  const handlePublish = async () => {
    if (!preview) return;
    setIsPublishing(true);
    try {
      const payload = { title: preview.title, content: preview.content };
      switch (action.automationType) {
        case "generate_faq": await publishFaqAction(payload); break;
        case "import_website": await publishWebsiteAction(payload); break;
        case "suggest_categories": await publishCategoryAction(payload); break;
        case "suggest_tags": await publishTagAction(payload); break;
        case "suggest_hours": await publishHoursAction(payload); break;
        default: await publishDocumentAction(payload); break;
      }
      success(`${action.targetResourceName} published successfully.`);
      setIsOpen(false);
    } catch (err) {
      error("Failed to publish content.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(true); } }} onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button className="w-full gap-space-2">
            <Sparkles className="w-4 h-4" />
            {action.primaryCtaText}
          </Button>
        )}
      </div>

      <DialogContent className="sm:max-w-3xl flex flex-col" style={{ maxHeight: `85vh` }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-space-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Automation: {action.title}
          </DialogTitle>
          <DialogDescription>
            {action.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 py-space-4" horizontal={false}>
                        {!preview ? (
                          <div className="flex flex-col items-center justify-center h-64 space-y-space-4 text-center">
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">
                                  Analyzing business data and generating high-quality content...
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-space-2">
                                  <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-medium">Ready to generate</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                  Our AI will analyze your website, services, and industry to generate a customized {action.targetResourceName}.
                                </p>
                                <Button onClick={handleGenerate} size="lg" className="mt-space-4 gap-space-2">
                                  <Sparkles className="w-4 h-4" />
                                  Start Generation
                                </Button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-space-4">
                            <div className="space-y-space-2">
                              <label className="text-sm font-medium">Title</label>
                              <Input 
                                value={preview.title} 
                                onChange={(e: any) => setPreview({ ...preview, title: e.target.value })} 
                              />
                            </div>
                            <div className="space-y-space-2">
                              <label className="text-sm font-medium">Generated Content</label>
                              <NativeTextarea 
                                value={preview.content} 
                                onChange={(e: any) => setPreview({ ...preview, content: e.target.value })}
                                className="min-h-72 font-mono text-sm w-full rounded-md border border-input bg-transparent px-space-3 py-space-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              You can freely edit the generated content above before publishing it to your Knowledge Base.
                            </p>
                          </div>
                        )}
                      </ScrollArea>

        {preview && (
          <DialogFooter className="mt-space-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate} variant="secondary" className="gap-space-2" disabled={isPublishing}>
              <Sparkles className="w-4 h-4" />
              Regenerate
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? <Loader2 className="w-4 h-4 mr-space-2 animate-spin" /> : null}
              Publish to Knowledge Base
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
