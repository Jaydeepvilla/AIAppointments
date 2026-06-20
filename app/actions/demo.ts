'use server'

import { auth } from '@clerk/nextjs/server'
import { seedDemoDataForUser } from '@/lib/demo-data/seed'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function resetDemoData() {
  try {
    const userId = await getUserId()
    const result = await seedDemoDataForUser(userId)
    revalidatePath('/dashboard')
    return { success: true, message: 'Demo data reset successfully' }
  } catch (error: any) {
    console.error('Failed to reset demo data:', error)
    return { success: false, error: error.message || 'Failed to reset demo data' }
  }
}

export async function getDemoModeStatus() {
  return {
    isDemoMode: process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  }
}

export async function getAnalytics() {
  const { getDashboardMetrics } = await import('@/lib/demo-data/analytics')
  return getDashboardMetrics()
}

export async function getDemoNotifications() {
  const { getNotifications } = await import('@/lib/demo-data/notifications')
  return getNotifications()
}

export async function markDemoNotificationRead(id: number) {
  const { markNotificationRead } = await import('@/lib/demo-data/notifications')
  const result = await markNotificationRead(id)
  revalidatePath('/dashboard')
  return result
}
