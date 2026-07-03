import { eq } from "drizzle-orm";
import { db } from "../db";
import { documentProcessingJobs } from "../db/schema";

export interface NewProcessingJob {
  organizationId: string;
  documentId: string;
  status: string;
  logs?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  duration?: number | null;
}

export const jobsRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(documentProcessingJobs)
      .where(eq(documentProcessingJobs.organizationId, organizationId))
      .orderBy(documentProcessingJobs.createdAt);
  },

  async getById(id: string) {
    const [item] = await db
      .select()
      .from(documentProcessingJobs)
      .where(eq(documentProcessingJobs.id, id));
    return item || null;
  },

  async create(job: NewProcessingJob) {
    const [newJob] = await db.insert(documentProcessingJobs).values(job).returning();
    return newJob;
  },

  async update(id: string, job: Partial<NewProcessingJob>) {
    const [updated] = await db
      .update(documentProcessingJobs)
      .set({ ...job, updatedAt: new Date() })
      .where(eq(documentProcessingJobs.id, id))
      .returning();
    return updated;
  },
};
