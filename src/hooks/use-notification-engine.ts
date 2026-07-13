import { useTransition } from "react";
const toast = { success: console.log, error: console.error };
import { dismissNotificationAction, markNotificationAsReadAction } from "@/app/actions/progress";

export function useNotificationEngine() {
  const [isPending, startTransition] = useTransition();

  const dismissNotification = (id: string) => {
    startTransition(async () => {
      const result = await dismissNotificationAction(id);
      if (result.success) {
        toast.success("Notification dismissed");
      } else {
        toast.error("Failed to dismiss notification");
      }
    });
  };

  const markAsRead = (id: string) => {
    startTransition(async () => {
      const result = await markNotificationAsReadAction(id);
      if (!result.success) {
        toast.error("Failed to update notification");
      }
    });
  };

  return {
    isPending,
    dismissNotification,
    markAsRead
  };
}
