import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { GlobalBenchmarkAnalysis } from "@/lib/industry-benchmark-engine";
import { CheckCircle2, XCircle } from "lucide-react";

interface IndustryReadinessCardProps {
  analysis: GlobalBenchmarkAnalysis;
}

export function IndustryReadinessCard({ analysis }: IndustryReadinessCardProps) {
  if (!analysis.isApplicable) {
    return (
      <Card className="col-span-1 opacity-70">
        <CardHeader>
          <CardTitle>Industry Benchmark</CardTitle>
          <CardDescription>Select your industry in settings to unlock benchmarking.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 shadow-sm border-[hsl(var(--state-info-border))] bg-gradient-to-br from-[hsl(var(--state-info-bg))] to-background">
      <CardHeader className="pb-space-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-space-2">
            Industry Benchmark
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-[hsl(var(--state-info-bg))] text-[hsl(var(--state-info-text))] border-[hsl(var(--state-info-border))]">
            {analysis.industryName}
          </Badge>
        </div>
        <CardDescription>
          Compare your setup against top-performing {analysis.industryName}s.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-space-2 mb-space-2">
          <span className="text-3xl font-bold">{analysis.overallReadiness}%</span>
          <span className="text-muted-foreground text-sm mb-space-1">Industry Ready</span>
        </div>
        <div className="w-full bg-muted radius-full h-2 mb-space-6 overflow-hidden">
          <div className="bg-primary h-full" style={{ width: `${analysis.overallReadiness}%` }} />
        </div>
        
        <div className="space-y-space-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Industry Standards Met</span>
            <span className="font-semibold text-green-600">{analysis.completedFeatures.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Missing Best Practices</span>
            <span className="font-semibold text-orange-600">{analysis.missingFeatures.length}</span>
          </div>

          {analysis.missingFeatures.length > 0 && (
            <div className="mt-space-4 pt-space-4 border-t">
              <p className="text-xs font-semibold mb-space-3 text-muted-foreground uppercase tracking-wider">Top Priorities</p>
              <div className="space-y-space-3">
                {analysis.missingFeatures.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex gap-space-2 text-sm items-start">
                    <XCircle className="w-4 h-4 text-orange-500 mt-space-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{feat.name}</p>
                      <p className="text-xs text-muted-foreground">{feat.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
