import { db } from "@/server/db";
import { auditLogs } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export class AuditService {
  async log(params: {
    organizationId?: string;
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    await db.insert(auditLogs).values({
      organizationId: params.organizationId,
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      metadata: params.metadata || {},
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  async getLogs(organizationId: string, limit = 50, offset = 0) {
    return await db.query.auditLogs.findMany({
      where: eq(auditLogs.organizationId, organizationId),
      orderBy: [desc(auditLogs.createdAt)],
      limit,
      offset,
      with: {
        user: true,
      }
    });
  }
}

export const auditService = new AuditService();
