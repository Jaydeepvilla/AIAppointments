import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { AutomationAction } from "@/lib/automation-engine/types";
import { AutomationDialog } from "./automation-dialog";
import { Sparkles, Clock } from "lucide-react";

interface Props {
  automations: AutomationAction[];
}

export function AutomationOpportunitiesCard({ automations }: Props) {
  if (automations.length === 0) {
    return (
      <Card className="col-span-1 shadow-sm opacity-70">
        <CardHeader>
          <CardTitle className="flex items-center gap-space-2">
            <Sparkles className="w-5 h-5" />
            Automation Opportunities
          </CardTitle>
          <CardDescription>No new automations available right now.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 shadow-sm border-[hsl(var(--primary)/0.2)] bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-background">
      <CardHeader className="pb-space-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-space-2 text-primary">
            <Sparkles className="w-5 h-5" />
            Automation Opportunities
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {automations.length} Detected
          </Badge>
        </div>
        <CardDescription>
          AI-powered one-click setup actions specifically tailored for your business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-space-4">
          {automations.slice(0, 3).map((action) => (
            <div key={action.id} className="p-space-4 rounded-lg border bg-card flex flex-col md:flex-row gap-space-4 items-start md:items-center justify-between">
              <div className="space-y-space-1">
                <h4 className="font-semibold text-sm flex items-center gap-space-2">
                  {action.title}
                  {action.impact === "High" && (
                    <Badge variant="destructive" className="text-caption h-4">High Impact</Badge>
                  )}
                </h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
                <div className="flex items-center gap-space-2 mt-space-2">
                  <span className="text-caption flex items-center gap-space-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    ~{action.estimatedTimeMinutes} min
                  </span>
                  <span className="text-caption flex items-center gap-space-1 text-[hsl(var(--state-success-text))]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--state-success-text))]" />
                    {action.confidence}% Confidence
                  </span>
                </div>
              </div>
              
              <div className="shrink-0 w-full md:w-auto mt-space-2 md:mt-space-0">
                <AutomationDialog action={action} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
