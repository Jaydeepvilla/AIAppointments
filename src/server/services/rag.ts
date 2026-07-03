import { eq, and, like } from "drizzle-orm";
import { db } from "../db";
import {
  businessProfiles,
  services,
  faqItems,
  knowledgeChunks,
  knowledgeDocuments,
} from "../db/schema";

export interface Citation {
  type: "profile" | "service" | "faq" | "document";
  id: string;
  name: string;
  content: string;
}

export interface RAGContext {
  contextText: string;
  citations: Citation[];
}

export const ragService = {
  async retrieveContext(organizationId: string, query: string): Promise<RAGContext> {
    const citations: Citation[] = [];
    const contextParts: string[] = [];

    const lowercaseQuery = query.toLowerCase();

    // 1. Fetch Business Profile
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.organizationId, organizationId));

    if (profile && profile.description) {
      citations.push({
        type: "profile",
        id: profile.id,
        name: "Business Profile",
        content: profile.description,
      });
      contextParts.push(`Business Profile:\n${profile.description}`);
    }

    // 2. Fetch Relevant Services
    const allServices = await db
      .select()
      .from(services)
      .where(
        and(
          eq(services.organizationId, organizationId),
          eq(services.isActive, true),
          eq(services.isArchived, false)
        )
      );

    // Filter services that match the query keyword or if query is general, include top 3
    const matchedServices = allServices.filter(
      (s) =>
        lowercaseQuery.includes(s.name.toLowerCase()) ||
        (s.description && lowercaseQuery.includes(s.description.toLowerCase()))
    );

    const servicesToInclude = matchedServices.length > 0 ? matchedServices : allServices.slice(0, 3);

    if (servicesToInclude.length > 0) {
      const servicesText = servicesToInclude
        .map((s) => `- ${s.name}: ${s.description ?? "No description"}. Duration: ${s.duration} min. Price: $${s.price}`)
        .join("\n");

      servicesToInclude.forEach((s) => {
        citations.push({
          type: "service",
          id: s.id,
          name: s.name,
          content: `${s.name} service costs $${s.price} and takes ${s.duration} minutes.`,
        });
      });

      contextParts.push(`Available Services:\n${servicesText}`);
    }

    // 3. Fetch Relevant FAQ Items
    const allFaqs = await db
      .select()
      .from(faqItems)
      .where(and(eq(faqItems.organizationId, organizationId), eq(faqItems.isActive, true)));

    const matchedFaqs = allFaqs.filter(
      (f) =>
        lowercaseQuery.includes(f.question.toLowerCase()) ||
        lowercaseQuery.includes(f.answer.toLowerCase())
    );

    const faqsToInclude = matchedFaqs.length > 0 ? matchedFaqs : allFaqs.slice(0, 3);

    if (faqsToInclude.length > 0) {
      const faqsText = faqsToInclude.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

      faqsToInclude.forEach((f) => {
        citations.push({
          type: "faq",
          id: f.id,
          name: `FAQ: ${f.question}`,
          content: f.answer,
        });
      });

      contextParts.push(`Frequently Asked Questions (FAQs):\n${faqsText}`);
    }

    // 4. Fetch Knowledge Chunks (Website imports, files documents chunk matches)
    try {
      // Find files that are completed
      const documents = await db
        .select()
        .from(knowledgeDocuments)
        .where(
          and(
            eq(knowledgeDocuments.organizationId, organizationId),
            eq(knowledgeDocuments.status, "completed"),
            eq(knowledgeDocuments.isArchived, false)
          )
        );

      if (documents.length > 0) {
        const docIds = documents.map((d) => d.id);
        
        // Simple text search mock/fallback on chunks: find chunks containing query words
        // We'll split query into words and search if any matches
        const queryWords = lowercaseQuery
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 3);

        let chunks: any[] = [];
        if (queryWords.length > 0) {
          // Find chunks matching the first few words as a simple search
          const conditions = queryWords.slice(0, 2).map((word) => like(knowledgeChunks.content, `%${word}%`));
          
          for (const condition of conditions) {
            const results = await db
              .select({
                id: knowledgeChunks.id,
                content: knowledgeChunks.content,
                documentId: knowledgeChunks.documentId,
                metadata: knowledgeChunks.metadata,
              })
              .from(knowledgeChunks)
              .where(condition)
              .limit(2);

            chunks = [...chunks, ...results];
          }
        }

        // Deduplicate chunks
        const seenChunkIds = new Set<string>();
        const uniqueChunks = chunks.filter((c) => {
          if (seenChunkIds.has(c.id)) return false;
          seenChunkIds.add(c.id);
          return true;
        });

        if (uniqueChunks.length > 0) {
          const chunksText = uniqueChunks
            .map((c, idx) => {
              const doc = documents.find((d) => d.id === c.documentId);
              const docName = doc ? doc.name : "Document";
              
              citations.push({
                type: "document",
                id: c.id,
                name: docName,
                content: c.content,
              });

              return `Source [${docName}]:\n${c.content}`;
            })
            .join("\n\n");

          contextParts.push(`Additional Reference Knowledge:\n${chunksText}`);
        }
      }
    } catch (err) {
      console.error("[RAGService] Error fetching knowledge chunks:", err);
    }

    return {
      contextText: contextParts.join("\n\n---\n\n"),
      citations,
    };
  },
};
