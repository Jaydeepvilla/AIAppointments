import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/card";
import { SetupTask, SetupState } from "@/lib/setup-engine/types";

export function DailyGoalsCard({ 
  goals,
  state
}: { 
  goals: SetupTask[];
  state: SetupState;
}) {
  if (goals.length === 0) return null;

  const totalTime = goals.reduce((acc, task) => acc + task.estimatedTimeMinutes, 0);

  return (
    <Card className="border border-border-default bg-card radius-xl overflow-hidden">
      <CardHeader className="p-space-5 pb-space-3 border-b border-border-default/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-2">
            <Target className="h-4.5 w-4.5 text-primary" />
            <CardTitle className="text-body-sm font-semibold text-foreground">Today's Goals</CardTitle>
          </div>
          <span className="text-caption text-muted-foreground font-medium bg-muted/20 px-space-2 py-space-0.5 rounded-full">
            ~{totalTime} min remaining
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-space-0">
        <div className="divide-y divide-border-default/50">
          {goals.map((task) => {
            const isCompleted = task.isCompleted(state);
            return (
              <div key={task.id} className="p-space-4 hover:bg-muted/5 transition-colors">
                <div className="flex items-start gap-space-3">
                  <div className="mt-space-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-space-2">
                      <h4 className={`text-body-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {task.label}
                      </h4>
                      {!isCompleted && (
                        <Link href={task.href} className="shrink-0 text-primary hover:text-primary/80 transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                    {!isCompleted && (
                      <p className="text-caption text-muted-foreground mt-space-0.5 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
