import { eq, and, lte, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { backgroundJobs } from "@/server/db/schema";

export type JobPayload = Record<string, any>;

export interface JobDefinition<T extends JobPayload> {
  name: string;
  process: (payload: T) => Promise<void>;
}

class BackgroundWorker {
  private handlers = new Map<string, JobDefinition<any>>();

  /**
   * Register a job handler for a specific queue name.
   */
  register<T extends JobPayload>(job: JobDefinition<T>) {
    this.handlers.set(job.name, job);
  }

  /**
   * Enqueue a new job to be processed.
   */
  async enqueue<T extends JobPayload>(queueName: string, payload: T, runAt: Date = new Date()) {
    await db.insert(backgroundJobs).values({
      queueName,
      payload,
      runAt,
      status: "pending",
    });
  }

  /**
   * Process pending jobs. Intended to be called by a cron route.
   */
  async processPendingJobs(limit = 10) {
    const now = new Date();
    
    // Simple locking mechanism: find jobs that are pending and ready to run
    // Update them to processing status and set lockedAt
    
    // Postgres doesn't have a simple UPDATE ... RETURNING with LIMIT in Drizzle easily without raw queries for true concurrency safety,
    // but this suffices for a simple low-concurrency setup.
    const pendingJobs = await db.query.backgroundJobs.findMany({
      where: and(
        eq(backgroundJobs.status, "pending"),
        lte(backgroundJobs.runAt, now),
        isNull(backgroundJobs.lockedAt)
      ),
      limit,
    });

    if (pendingJobs.length === 0) {
      return { processed: 0, failed: 0 };
    }

    // Lock jobs
    const jobIds = pendingJobs.map(j => j.id);
    for (const jobId of jobIds) {
      await db.update(backgroundJobs)
        .set({ status: "processing", lockedAt: now })
        .where(eq(backgroundJobs.id, jobId));
    }

    let processed = 0;
    let failed = 0;

    for (const job of pendingJobs) {
      const handler = this.handlers.get(job.queueName);
      
      if (!handler) {
        await db.update(backgroundJobs)
          .set({ status: "failed", error: `No handler found for queue: ${job.queueName}` })
          .where(eq(backgroundJobs.id, job.id));
        failed++;
        continue;
      }

      try {
        await handler.process(job.payload as any);
        await db.update(backgroundJobs)
          .set({ status: "completed" })
          .where(eq(backgroundJobs.id, job.id));
        processed++;
      } catch (error: any) {
        const newAttempts = job.attempts + 1;
        if (newAttempts >= job.maxAttempts) {
          await db.update(backgroundJobs)
            .set({ status: "failed", error: error.message || "Unknown error", attempts: newAttempts })
            .where(eq(backgroundJobs.id, job.id));
        } else {
          // Retry logic (exponential backoff could be added here)
          const nextRunAt = new Date(Date.now() + 1000 * 60 * Math.pow(2, newAttempts)); // 2, 4, 8 mins
          await db.update(backgroundJobs)
            .set({ status: "pending", error: error.message || "Unknown error", attempts: newAttempts, lockedAt: null, runAt: nextRunAt })
            .where(eq(backgroundJobs.id, job.id));
        }
        failed++;
      }
    }

    return { processed, failed };
  }
}

export const worker = new BackgroundWorker();
