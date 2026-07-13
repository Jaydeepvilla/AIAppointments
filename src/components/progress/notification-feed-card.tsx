"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Bell, AlertTriangle, Info, Zap, Check, X } from "lucide-react";
import { SmartNotification } from "@/lib/types/notifications";
import { useNotificationEngine } from "@/hooks/use-notification-engine";
import { NativeButton } from "@/components/shared/native";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationFeedCardProps {
  notifications: SmartNotification[];
}

export function NotificationFeedCard({ notifications }: NotificationFeedCardProps) {
  const { dismissNotification, markAsRead, isPending } = useNotificationEngine();

  if (notifications.length === 0) {
    return (
      <Card className="col-span-full xl:col-span-1 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="pb-space-3 border-b border-zinc-800/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-space-2 text-zinc-100">
            <Bell className="w-5 h-5 text-zinc-400" />
            Smart Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-space-12 px-space-4 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-space-3">
            <Check className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-sm font-medium text-zinc-300">No new notifications</p>
          <p className="text-xs text-zinc-500 mt-space-1">You're all caught up on alerts and updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full xl:col-span-1 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex flex-col max-h-128">
      <CardHeader className="pb-space-3 border-b border-zinc-800/50 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-space-2 text-zinc-100">
            <Bell className="w-5 h-5 text-zinc-400" />
            Smart Notifications
          </CardTitle>
          <div className="text-xs font-medium bg-primary/20 text-primary px-space-2 py-space-0.5 rounded-full">
            {notifications.length} New
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-space-0 overflow-x-hidden flex-1"><ScrollArea className="h-full w-full">
                  <div className="divide-y divide-zinc-800/50">
                    {notifications.map((notif) => {
                      const isCritical = notif.severity === "critical";
                      const isWarning = notif.severity === "warning";
                      const isAi = notif.category === "ai_improvement";
                      
                      return (
                        <div 
                          key={notif.id} 
                          className={`p-space-4 transition-colors hover:bg-zinc-800/30 group relative ${!notif.isRead ? 'bg-zinc-800/10' : ''}`}
                        >
                          {!notif.isRead && (
                            <div className="absolute left-space-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
                          )}
                          
                          <div className="flex items-start gap-space-3">
                            <div className={`shrink-0 mt-space-0.5 p-space-1.5 rounded-full ${
                              isCritical ? 'bg-red-500/10 text-red-500' :
                              isWarning ? 'bg-yellow-500/10 text-yellow-500' :
                              isAi ? 'bg-purple-500/10 text-purple-400' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>
                              {isCritical ? <AlertTriangle className="w-4 h-4" /> :
                               isWarning ? <AlertTriangle className="w-4 h-4" /> :
                               isAi ? <Zap className="w-4 h-4" /> :
                               <Info className="w-4 h-4" />}
                            </div>
                            
                            <div className="flex-1 min-w-0 pr-space-6">
                              <div className="flex items-center justify-between gap-space-2">
                                <h4 className={`text-sm font-medium truncate ${!notif.isRead ? 'text-zinc-100' : 'text-zinc-300'}`}>
                                  {notif.title}
                                </h4>
                                <span className="text-caption text-zinc-500 shrink-0">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 mt-space-1 line-clamp-2">
                                {notif.description}
                              </p>
                              
                              {notif.actionUrl && (
                                <div className="mt-space-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:text-white"
                                    onClick={() => {
                                      if (!notif.isRead) markAsRead(notif.id);
                                      window.location.href = notif.actionUrl!;
                                    }}
                                  >
                                    Review Now
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <NativeButton 
                            onClick={() => dismissNotification(notif.id)}
                            disabled={isPending}
                            className="absolute top-space-2 right-space-2 p-space-1 text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </NativeButton>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea></CardContent>
    </Card>
  );
}
