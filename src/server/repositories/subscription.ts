import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptions, subscriptionPlans } from "../db/schema";
import { NewSubscription, Subscription, SubscriptionPlan } from "../../lib/types";

export const subscriptionRepository = {
  async getByOrg(organizationId: string): Promise<Subscription | null> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.organizationId, organizationId));
    return sub || null;
  },

  async create(sub: NewSubscription): Promise<Subscription> {
    const [newSub] = await db.insert(subscriptions).values(sub).returning();
    return newSub;
  },

  async update(id: string, sub: Partial<NewSubscription>): Promise<Subscription> {
    const [updated] = await db
      .update(subscriptions)
      .set({ ...sub, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return updated;
  },

  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId));
    return plan || null;
  },

  async listPlans(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans);
  },

  async createPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
    return newPlan;
  }
};
