import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { services, serviceCategories } from "../db/schema";

export interface NewService {
  organizationId: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  duration: number;
  price: string;
  isActive?: boolean;
}

export const servicesRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(services)
      .where(and(eq(services.organizationId, organizationId), eq(services.isArchived, false)));
  },

  async listAll(organizationId: string) {
    return db
      .select()
      .from(services)
      .where(eq(services.organizationId, organizationId));
  },

  async getById(id: string) {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || null;
  },

  async create(service: NewService) {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  },

  async update(id: string, service: Partial<NewService> & { isArchived?: boolean; isActive?: boolean }) {
    const [updated] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(services).where(eq(services.id, id));
  },

  // Categories
  async listCategories(organizationId: string) {
    return db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.organizationId, organizationId));
  },

  async getCategoryByName(organizationId: string, name: string) {
    const [cat] = await db
      .select()
      .from(serviceCategories)
      .where(and(eq(serviceCategories.organizationId, organizationId), eq(serviceCategories.name, name)));
    return cat || null;
  },

  async createCategory(category: { organizationId: string; name: string; description?: string | null }) {
    const [newCat] = await db.insert(serviceCategories).values(category).returning();
    return newCat;
  },
};
