import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, memberships } from "../db/schema";
import { NewUser, User } from "../../lib/types";

export const userRepository = {
  async getById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  },

  async create(user: NewUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  },

  async upsert(user: NewUser): Promise<User> {
    // 1. Check if ID exists
    const existingById = await db.select().from(users).where(eq(users.id, user.id));
    if (existingById.length > 0) {
      const [updatedUser] = await db
        .update(users)
        .set({
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning();
      return updatedUser;
    }

    // 2. Check if Email exists under a different ID
    const existingByEmail = await db.select().from(users).where(eq(users.email, user.email));
    if (existingByEmail.length > 0) {
      const oldId = existingByEmail[0].id;
      const newId = user.id;

      const [updatedUser] = await db.transaction(async (tx) => {
        // Update memberships referencing the old ID to the new ID
        await tx
          .update(memberships)
          .set({ userId: newId })
          .where(eq(memberships.userId, oldId));

        // Update the user record with the new ID
        return tx
          .update(users)
          .set({
            id: newId,
            name: user.name,
            avatar: user.avatar,
            updatedAt: new Date(),
          })
          .where(eq(users.id, oldId))
          .returning();
      });

      return updatedUser;
    }

    // 3. Create a new user record
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  },

  async update(id: string, user: Partial<NewUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  },

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },
};
