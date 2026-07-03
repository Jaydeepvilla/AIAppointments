import { eq } from "drizzle-orm";
import { db } from "../db";
import { organizations } from "../db/schema";
import { NewOrganization, Organization } from "../../lib/types";

export const organizationRepository = {
  async getById(id: string): Promise<Organization | null> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || null;
  },

  async getBySlug(slug: string): Promise<Organization | null> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org || null;
  },

  async create(org: NewOrganization): Promise<Organization> {
    const [newOrg] = await db.insert(organizations).values(org).returning();
    return newOrg;
  },

  async update(id: string, org: Partial<NewOrganization>): Promise<Organization> {
    const [updatedOrg] = await db
      .update(organizations)
      .set({ ...org, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return updatedOrg;
  },

  async delete(id: string): Promise<void> {
    await db.delete(organizations).where(eq(organizations.id, id));
  },
};
