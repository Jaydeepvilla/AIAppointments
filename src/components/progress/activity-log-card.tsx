"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card";
import { Activity } from "lucide-react";
import { BusinessActivity } from "@/lib/types/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityLogCardProps {
  activities: BusinessActivity[];
}

export function ActivityLogCard({ activities }: ActivityLogCardProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <Card className="col-span-full xl:col-span-1 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      <CardHeader className="pb-space-3 border-b border-zinc-800/50">
        <CardTitle className="text-sm font-semibold flex items-center gap-space-2 text-zinc-300">
          <Activity className="w-4 h-4 text-zinc-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-space-0 max-h-72"><ScrollArea className="h-full w-full" horizontal={false}>
                  <div className="divide-y divide-zinc-800/30">
                    {activities.map((activity) => (
                      <div key={activity.id} className="p-space-3 hover:bg-zinc-800/20 transition-colors flex justify-between items-center">
                        <div>
                          <p className="text-xs font-medium text-zinc-300">{activity.task}</p>
                          <p className="text-caption text-zinc-500 capitalize">{activity.category.replace("_", " ")}</p>
                        </div>
                        <span className="text-caption text-zinc-600 shrink-0 ml-space-4">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea></CardContent>
    </Card>
  );
}
