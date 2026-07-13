import { eq, desc, and, isNull } from "drizzle-orm";
import { db } from "../db";
import { smartNotifications } from "../db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type NotificationRecord = InferSelectModel<typeof smartNotifications>;
export type NewNotification = InferInsertModel<typeof smartNotifications>;

export const notificationRepository = {
  async create(data: NewNotification) {
    const [notification] = await db.insert(smartNotifications).values(data).returning();
    return notification;
  },

  async list(organizationId: string, limit = 50) {
    return db
      .select()
      .from(smartNotifications)
      .where(
        and(
          eq(smartNotifications.organizationId, organizationId),
          eq(smartNotifications.isDismissed, false)
        )
      )
      .orderBy(desc(smartNotifications.createdAt))
      .limit(limit);
  },

  async markAsRead(id: string) {
    const [notification] = await db
      .update(smartNotifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(smartNotifications.id, id))
      .returning();
    return notification;
  },

  async dismiss(id: string) {
    const [notification] = await db
      .update(smartNotifications)
      .set({ isDismissed: true, updatedAt: new Date() })
      .where(eq(smartNotifications.id, id))
      .returning();
    return notification;
  },

  async snooze(id: string, until: Date) {
    const [notification] = await db
      .update(smartNotifications)
      .set({ snoozeUntil: until, updatedAt: new Date() })
      .where(eq(smartNotifications.id, id))
      .returning();
    return notification;
  },
};
