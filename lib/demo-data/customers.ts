import { db } from '@/lib/db'
import { demoCustomers } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

const isDemo = () => process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getCustomers() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .select()
      .from(demoCustomers)
      .where(eq(demoCustomers.userId, userId))
      .orderBy(desc(demoCustomers.createdAt))
  }
  return []
}

export async function createCustomer(data: {
  name: string
  email: string
  phone: string
  notes?: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .insert(demoCustomers)
      .values({
        userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes || '',
      })
      .returning()
  }
  return []
}

export async function updateCustomer(customerId: number, data: {
  name?: string
  email?: string
  phone?: string
  notes?: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .update(demoCustomers)
      .set(data)
      .where(and(eq(demoCustomers.id, customerId), eq(demoCustomers.userId, userId)))
  }
  return []
}

export async function deleteCustomer(customerId: number) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .delete(demoCustomers)
      .where(and(eq(demoCustomers.id, customerId), eq(demoCustomers.userId, userId)))
  }
  return []
}
