import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { memberships } from "../db/schema";
import { NewMembership, Membership } from "../../lib/types";

export const membershipRepository = {
  async getById(id: string): Promise<Membership | null> {
    const [membership] = await db.select().from(memberships).where(eq(memberships.id, id));
    return membership || null;
  },

  async getByUserAndOrg(userId: string, organizationId: string): Promise<Membership | null> {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.organizationId, organizationId)));
    return membership || null;
  },

  async getByUser(userId: string): Promise<Membership[]> {
    return db.select().from(memberships).where(eq(memberships.userId, userId));
  },

  async create(membership: NewMembership): Promise<Membership> {
    const [newMembership] = await db.insert(memberships).values(membership).returning();
    return newMembership;
  },

  async listByOrg(organizationId: string): Promise<Membership[]> {
    return db.select().from(memberships).where(eq(memberships.organizationId, organizationId));
  },

  async updateRole(id: string, role: "owner" | "admin" | "manager" | "staff"): Promise<Membership> {
    const [updated] = await db
      .update(memberships)
      .set({ role, updatedAt: new Date() })
      .where(eq(memberships.id, id))
      .returning();
    return updated;
  },

  async delete(id: string): Promise<void> {
    await db.delete(memberships).where(eq(memberships.id, id));
  },
};
