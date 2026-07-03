import { eq, desc, and } from "drizzle-orm";
import { db } from "../db";
import { leadProfiles, leadAnswers, leadScores } from "../db/schema";

export interface NewLeadProfile {
  organizationId: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string;
  leadScore?: number;
  summary?: string | null;
}

export interface NewLeadAnswer {
  organizationId: string;
  leadProfileId: string;
  questionId?: string | null;
  questionText: string;
  answerValue: string;
}

export interface NewLeadScore {
  organizationId: string;
  leadProfileId: string;
  score: number;
  breakdown: Record<string, any>;
}

export const leadsRepository = {
  async findProfileById(id: string) {
    const [profile] = await db
      .select()
      .from(leadProfiles)
      .where(eq(leadProfiles.id, id));
    return profile || null;
  },

  async listProfiles(organizationId: string) {
    return db
      .select()
      .from(leadProfiles)
      .where(eq(leadProfiles.organizationId, organizationId))
      .orderBy(desc(leadProfiles.createdAt));
  },

  async createProfile(profile: NewLeadProfile) {
    const [newProfile] = await db.insert(leadProfiles).values(profile).returning();
    return newProfile;
  },

  async updateProfile(id: string, updates: Partial<NewLeadProfile>) {
    const [updated] = await db
      .update(leadProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leadProfiles.id, id))
      .returning();
    return updated;
  },

  async deleteProfile(id: string) {
    await db.delete(leadProfiles).where(eq(leadProfiles.id, id));
  },

  // Answers CRUD
  async listAnswers(leadProfileId: string) {
    return db
      .select()
      .from(leadAnswers)
      .where(eq(leadAnswers.leadProfileId, leadProfileId))
      .orderBy(leadAnswers.createdAt);
  },

  async createAnswer(answer: NewLeadAnswer) {
    const [newAnswer] = await db.insert(leadAnswers).values(answer).returning();
    return newAnswer;
  },

  async upsertAnswer(answer: NewLeadAnswer) {
    // Check if answer for the same questionText already exists
    const [existing] = await db
      .select()
      .from(leadAnswers)
      .where(
        and(
          eq(leadAnswers.leadProfileId, answer.leadProfileId),
          eq(leadAnswers.questionText, answer.questionText)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(leadAnswers)
        .set({
          answerValue: answer.answerValue,
          updatedAt: new Date(),
        })
        .where(eq(leadAnswers.id, existing.id))
        .returning();
      return updated;
    } else {
      return this.createAnswer(answer);
    }
  },

  // Scores CRUD
  async listScores(leadProfileId: string) {
    return db
      .select()
      .from(leadScores)
      .where(eq(leadScores.leadProfileId, leadProfileId))
      .orderBy(desc(leadScores.createdAt));
  },

  async createScore(score: NewLeadScore) {
    const [newScore] = await db.insert(leadScores).values(score).returning();
    // Also update overall leadScore in profile
    await this.updateProfile(score.leadProfileId, { leadScore: score.score });
    return newScore;
  },
};
