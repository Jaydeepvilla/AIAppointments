import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { qualificationFlows } from "../db/schema";
import { leadsRepository } from "../repositories/leads";
import { llmRegistry } from "./llm";

export interface QualificationQuestion {
  id: string;
  question: string;
  answerType: "text" | "single_select" | "multi_select" | "number";
  options: string[] | null;
  isRequired: boolean;
  order: number;
}

export const qualificationService = {
  async listQuestions(organizationId: string): Promise<QualificationQuestion[]> {
    const flows = await db
      .select()
      .from(qualificationFlows)
      .where(eq(qualificationFlows.organizationId, organizationId))
      .orderBy(qualificationFlows.order);

    return flows.map((f) => ({
      id: f.id,
      question: f.question,
      answerType: f.answerType,
      options: f.options,
      isRequired: f.isRequired,
      order: f.order,
    }));
  },

  async extractAnswer(questionText: string, userMessage: string, answerType: string): Promise<string> {
    const provider = llmRegistry.getProvider();
    const systemPrompt = `You are a detail extraction assistant. Your task is to extract the answer to a specific business question from the user's chat message.
If the message contains the answer, extract it clearly and return ONLY the extracted value.
If the message does not contain the answer, return "not_provided".
Do not write explanations, just the extracted value.

Question asked: "${questionText}"
Answer type expected: ${answerType}`;

    try {
      const result = await provider.generateCompletion([
        { role: "system", content: systemPrompt },
        { role: "user", content: `User message: "${userMessage}"` },
      ], { temperature: 0.1 });

      const content = result.content.trim();
      return content;
    } catch (err) {
      console.error("[QualificationService] Answer extraction failed, returning raw message:", err);
      return userMessage.trim();
    }
  },

  async advanceFlow(
    organizationId: string,
    leadProfileId: string,
    sessionState: Record<string, any>, // { currentQuestionId: string | null, answersCollected: { [questionId: string]: string }, contactInfo: { name?: string, email?: string, phone?: string } }
    userMessage: string
  ): Promise<{
    nextQuestionText: string | null;
    allFinished: boolean;
    updatedState: Record<string, any>;
  }> {
    const questions = await this.listQuestions(organizationId);
    const updatedState = { ...sessionState };
    updatedState.answersCollected = updatedState.answersCollected || {};
    updatedState.contactInfo = updatedState.contactInfo || {};

    // 1. If we were waiting for an answer to a current question, extract and save it
    if (updatedState.currentQuestionId) {
      const activeQuestion = questions.find((q) => q.id === updatedState.currentQuestionId);
      if (activeQuestion) {
        const extracted = await this.extractAnswer(activeQuestion.question, userMessage, activeQuestion.answerType);
        
        if (extracted !== "not_provided") {
          updatedState.answersCollected[activeQuestion.id] = extracted;
          
          // Save answer to the DB leadAnswers
          await leadsRepository.upsertAnswer({
            organizationId,
            leadProfileId,
            questionId: activeQuestion.id,
            questionText: activeQuestion.question,
            answerValue: extracted,
          });

          // Proactively parse standard details: Name, Email, Phone
          const lowerQ = activeQuestion.question.toLowerCase();
          const lowerAns = extracted.toLowerCase();
          if (lowerQ.includes("name") || lowerQ.includes("who is")) {
            updatedState.contactInfo.name = extracted;
            await leadsRepository.updateProfile(leadProfileId, { name: extracted });
          } else if (lowerQ.includes("email") || lowerQ.includes("e-mail")) {
            updatedState.contactInfo.email = extracted;
            await leadsRepository.updateProfile(leadProfileId, { email: extracted });
          } else if (lowerQ.includes("phone") || lowerQ.includes("number") || lowerQ.includes("cell")) {
            updatedState.contactInfo.phone = extracted;
            await leadsRepository.updateProfile(leadProfileId, { phone: extracted });
          }
        }
      }
    }

    // 2. Select next unanswered question
    const unansweredQuestion = questions.find((q) => !updatedState.answersCollected[q.id]);

    if (unansweredQuestion) {
      updatedState.currentQuestionId = unansweredQuestion.id;
      return {
        nextQuestionText: unansweredQuestion.question,
        allFinished: false,
        updatedState,
      };
    }

    // All questions answered!
    updatedState.currentQuestionId = null;
    return {
      nextQuestionText: null,
      allFinished: true,
      updatedState,
    };
  },
};
