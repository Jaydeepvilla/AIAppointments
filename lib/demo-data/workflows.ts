import { db } from '@/lib/db'
import { demoWorkflows } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

const isDemo = () => process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getWorkflows() {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .select()
      .from(demoWorkflows)
      .where(eq(demoWorkflows.userId, userId))
      .orderBy(desc(demoWorkflows.createdAt))
  }
  return []
}

export async function createWorkflow(data: {
  name: string
  trigger: string
  status?: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .insert(demoWorkflows)
      .values({
        userId,
        name: data.name,
        trigger: data.trigger,
        status: data.status || 'active',
      })
      .returning()
  }
  return []
}

export async function updateWorkflow(workflowId: number, data: {
  name?: string
  trigger?: string
  status?: string
}) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .update(demoWorkflows)
      .set(data)
      .where(and(eq(demoWorkflows.id, workflowId), eq(demoWorkflows.userId, userId)))
  }
  return []
}

export async function deleteWorkflow(workflowId: number) {
  const userId = await getUserId()
  if (isDemo()) {
    return db
      .delete(demoWorkflows)
      .where(and(eq(demoWorkflows.id, workflowId), eq(demoWorkflows.userId, userId)))
  }
  return []
}
