import { db } from '@/lib/db'
import { demoNotifications } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

const isDemo = () => process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getNotifications() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .select()
      .from(demoNotifications)
      .where(eq(demoNotifications.userId, userId))
      .orderBy(desc(demoNotifications.createdAt))
  }
  return []
}

export async function createNotification(data: {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .insert(demoNotifications)
      .values({
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        read: false,
      })
      .returning()
  }
  return []
}

export async function markNotificationRead(notificationId: number) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .update(demoNotifications)
      .set({ read: true })
      .where(and(eq(demoNotifications.id, notificationId), eq(demoNotifications.userId, userId)))
  }
  return []
}

export async function deleteNotification(notificationId: number) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .delete(demoNotifications)
      .where(and(eq(demoNotifications.id, notificationId), eq(demoNotifications.userId, userId)))
  }
  return []
}

export async function clearNotifications() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .delete(demoNotifications)
      .where(eq(demoNotifications.userId, userId))
  }
  return []
}
