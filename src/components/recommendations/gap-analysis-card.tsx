import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { GlobalGapAnalysis } from "@/lib/gap-analysis-engine";

interface GapAnalysisCardProps {
  analysis: GlobalGapAnalysis;
}

export function GapAnalysisCard({ analysis }: GapAnalysisCardProps) {
  return (
    <Card className="col-span-1 shadow-sm border-[hsl(var(--state-warning-border))] bg-gradient-to-br from-[hsl(var(--state-warning-bg))] to-background">
      <CardHeader className="pb-space-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-space-2">
            Business Completeness
          </CardTitle>
          <Badge variant={analysis.overallCompleteness >= 80 ? "default" : "destructive"} className="text-xs">
            {analysis.overallCompleteness}% Ready
          </Badge>
        </div>
        <CardDescription>
          Identify missing information and close gaps in your setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-muted radius-full h-2 mb-space-6 overflow-hidden">
          <div className="bg-primary h-full" style={{ width: `${analysis.overallCompleteness}%` }} />
        </div>
        
        <div className="space-y-space-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Missing Items</span>
            <span className="font-semibold">{analysis.totalMissingItems}</span>
          </div>

          <div className="space-y-space-2 text-sm pt-space-2 border-t">
            <div className="flex justify-between">
              <span>Business Info</span>
              <span className={analysis.breakdown.businessInfo.score < 100 ? "text-orange-500 font-medium" : "text-green-500"}>
                {analysis.breakdown.businessInfo.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Services</span>
              <span className={analysis.breakdown.services.score < 100 ? "text-orange-500 font-medium" : "text-green-500"}>
                {analysis.breakdown.services.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Staff</span>
              <span className={analysis.breakdown.staff.score < 100 ? "text-orange-500 font-medium" : "text-green-500"}>
                {analysis.breakdown.staff.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Documents</span>
              <span className={analysis.breakdown.documents.score < 100 ? "text-orange-500 font-medium" : "text-green-500"}>
                {analysis.breakdown.documents.score}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Integrations</span>
              <span className={analysis.breakdown.integrations.score < 100 ? "text-orange-500 font-medium" : "text-green-500"}>
                {analysis.breakdown.integrations.score}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
