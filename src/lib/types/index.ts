import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, organizations, memberships, subscriptionPlans, subscriptions } from "../../server/db/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Organization = InferSelectModel<typeof organizations>;
export type NewOrganization = InferInsertModel<typeof organizations>;

export type Membership = InferSelectModel<typeof memberships>;
export type NewMembership = InferInsertModel<typeof memberships>;

export type SubscriptionPlan = InferSelectModel<typeof subscriptionPlans>;
export type NewSubscriptionPlan = InferInsertModel<typeof subscriptionPlans>;

export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;

export type UserRole = "owner" | "admin" | "manager" | "staff";

export interface UserContext {
  userId: string;
  email: string;
  name?: string;
  avatar?: string;
  orgId?: string;
  role?: UserRole;
}
