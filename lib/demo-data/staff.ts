import { db } from '@/lib/db'
import { demoStaff } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

const isDemo = () => process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getStaff() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .select()
      .from(demoStaff)
      .where(eq(demoStaff.userId, userId))
      .orderBy(desc(demoStaff.createdAt))
  }
  return []
}

export async function createStaff(data: {
  name: string
  role: string
  email: string
  phone: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .insert(demoStaff)
      .values({
        userId,
        name: data.name,
        role: data.role,
        email: data.email,
        phone: data.phone,
      })
      .returning()
  }
  return []
}

export async function updateStaff(staffId: number, data: {
  name?: string
  role?: string
  email?: string
  phone?: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .update(demoStaff)
      .set(data)
      .where(and(eq(demoStaff.id, staffId), eq(demoStaff.userId, userId)))
  }
  return []
}

export async function deleteStaff(staffId: number) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .delete(demoStaff)
      .where(and(eq(demoStaff.id, staffId), eq(demoStaff.userId, userId)))
  }
  return []
}
