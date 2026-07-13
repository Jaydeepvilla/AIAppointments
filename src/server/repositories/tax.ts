import { eq } from "drizzle-orm";
import { db } from "../db";
import { taxProfiles, taxRates } from "../db/schema";

export const taxRepository = {
  async getTaxProfile(billingAccountId: string) {
    const [profile] = await db
      .select()
      .from(taxProfiles)
      .where(eq(taxProfiles.billingAccountId, billingAccountId));
    return profile || null;
  },

  async getTaxRates() {
    return db.select().from(taxRates).where(eq(taxRates.isActive, true));
  },
};
