"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { categoriesRepository } from "../repositories/categories";
import { sourcesRepository } from "../repositories/sources";
import { documentsRepository } from "../repositories/documents";
import { chunksRepository } from "../repositories/chunks";
import { jobsRepository } from "../repositories/jobs";
import { importsRepository } from "../repositories/imports";
import { faqRepository } from "../repositories/faq";
import { servicesRepository } from "../repositories/services";
import { membershipRepository } from "../repositories/membership";
import { chunkingService } from "../services/chunking";
import { db } from "../db";
import { faqItems, services, knowledgeDocuments, knowledgeCategories } from "../db/schema";
import { eq, and, ilike, or } from "drizzle-orm";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

/** IDOR guard: ensures a knowledge document belongs to the caller's org */
async function assertDocumentOwnership(orgId: string, documentId: string) {
  const [doc] = await db
    .select({ id: knowledgeDocuments.id, organizationId: knowledgeDocuments.organizationId })
    .from(knowledgeDocuments)
    .where(and(eq(knowledgeDocuments.id, documentId), eq(knowledgeDocuments.organizationId, orgId)))
    .limit(1);
  if (!doc) throw new Error("Document not found or access denied");
  return doc;
}

/** IDOR guard: ensures a knowledge category belongs to the caller's org */
async function assertCategoryOwnership(orgId: string, categoryId: string) {
  const [cat] = await db
    .select({ id: knowledgeCategories.id, organizationId: knowledgeCategories.organizationId })
    .from(knowledgeCategories)
    .where(and(eq(knowledgeCategories.id, categoryId), eq(knowledgeCategories.organizationId, orgId)))
    .limit(1);
  if (!cat) throw new Error("Category not found or access denied");
  return cat;
}

const ALLOWED_FILE_TYPES = ["pdf", "docx", "txt", "md", "csv", "website"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ==========================================
// 1. KNOWLEDGE CATEGORIES ACTIONS
// ==========================================

export async function getKnowledgeCategoriesAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const categories = await categoriesRepository.list(orgId);
    return { success: true, categories };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load categories" };
  }
}

export async function createKnowledgeCategoryAction(data: { name: string; description?: string }) {
  try {
    const orgId = await getVerifiedOrgId();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    await categoriesRepository.create({
      organizationId: orgId,
      name: data.name,
      slug,
      description: data.description || null,
    });

    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create category" };
  }
}

export async function updateKnowledgeCategoryAction(id: string, data: { name: string; description?: string }) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard
    await assertCategoryOwnership(orgId, id);

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await categoriesRepository.update(id, {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
    });

    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update category" };
  }
}

export async function deleteKnowledgeCategoryAction(id: string) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard
    await assertCategoryOwnership(orgId, id);
    await categoriesRepository.delete(id);
    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete category" };
  }
}

// ==========================================
// 2. KNOWLEDGE DOCUMENTS ACTIONS
// ==========================================

export async function getKnowledgeDocumentsAction(isArchived = false) {
  try {
    const orgId = await getVerifiedOrgId();
    const docs = await documentsRepository.list(orgId, isArchived);
    return { success: true, documents: docs };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load documents" };
  }
}

export async function uploadKnowledgeDocumentAction(data: {
  name: string;
  fileType: string;
  fileSize: number;
  content: string;
  categoryId?: string;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    // Validate file type
    const normalizedType = data.fileType.toLowerCase().replace("application/pdf", "pdf").replace("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx").replace("text/plain", "txt").replace("text/markdown", "md").replace("text/csv", "csv");
    if (!ALLOWED_FILE_TYPES.includes(normalizedType)) {
      throw new Error(`File type "${data.fileType}" is not allowed. Supported: PDF, DOCX, TXT, MD, CSV`);
    }

    // Validate file size
    if (data.fileSize > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size exceeds the 10 MB limit`);
    }

    // Validate content is not suspiciously large
    if (data.content.length > 500_000) {
      throw new Error("Document content is too large to process");
    }

    // 1. Get or create a general manual source for user uploads
    let source = await sourcesRepository.getByType(orgId, "manual");
    if (!source) {
      source = await sourcesRepository.create({
        organizationId: orgId,
        name: "Manual Uploads",
        type: "manual",
        isActive: true,
      });
    }

    // 2. Insert Document record
    const document = await documentsRepository.create({
      organizationId: orgId,
      sourceId: source.id,
      categoryId: data.categoryId || null,
      name: data.name,
      fileType: data.fileType.toLowerCase(),
      fileSize: data.fileSize,
      status: "queued",
    });

    // 3. Create document processing job
    const job = await jobsRepository.create({
      organizationId: orgId,
      documentId: document.id,
      status: "queued",
      startedAt: new Date(),
    });

    // 4. Run simulated chunking
    const startTime = Date.now();
    await jobsRepository.update(job.id, { status: "processing", logs: "Starting extraction..." });
    await jobsRepository.update(job.id, { status: "chunking", logs: "Segmenting document text into chunks..." });

    const chunks = chunkingService.splitText(data.content);
    const chunkPayload = chunks.map((chunk) => ({
      organizationId: orgId,
      documentId: document.id,
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      tokenCount: chunk.tokenCount,
    }));

    if (chunkPayload.length > 0) {
      await chunksRepository.createMany(chunkPayload);
    }

    // 5. Complete Job
    const duration = Date.now() - startTime;
    await jobsRepository.update(job.id, {
      status: "completed",
      logs: `Processing completed successfully. Created ${chunks.length} chunks.`,
      completedAt: new Date(),
      duration,
    });

    await documentsRepository.update(document.id, { status: "completed" });

    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to process upload" };
  }
}

export async function renameKnowledgeDocumentAction(id: string, name: string) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard
    await assertDocumentOwnership(orgId, id);
    if (!name?.trim() || name.length > 300) {
      throw new Error("Document name must be between 1 and 300 characters");
    }
    await documentsRepository.update(id, { name: name.trim() });
    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to rename document" };
  }
}

export async function archiveKnowledgeDocumentAction(id: string, isArchived: boolean) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard
    await assertDocumentOwnership(orgId, id);
    await documentsRepository.update(id, { isArchived });
    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to archive document" };
  }
}

export async function deleteKnowledgeDocumentAction(id: string) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard
    await assertDocumentOwnership(orgId, id);
    await documentsRepository.delete(id);
    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete document" };
  }
}

// ==========================================
// 3. WEBSITE IMPORT ACTIONS
// ==========================================

export async function getWebsiteImportsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const list = await importsRepository.list(orgId);
    return { success: true, imports: list };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load website imports" };
  }
}

export async function triggerWebsiteImportAction(url: string) {
  try {
    const orgId = await getVerifiedOrgId();

    // 1. Get or create website source
    let source = await sourcesRepository.getByType(orgId, "website");
    if (!source) {
      source = await sourcesRepository.create({
        organizationId: orgId,
        name: "Website Crawls",
        type: "website",
        isActive: true,
      });
    }

    // 2. Log Website Import run
    const importRun = await importsRepository.create({
      organizationId: orgId,
      sourceId: source.id,
      url,
      status: "scraping",
    });

    // Simulate scraping 3-6 pages in background
    setTimeout(async () => {
      try {
        const pages = [
          { name: "Home Page", path: "/", content: `Home Page details for website: ${url}. We provide top tier services for our clients.` },
          { name: "About Us", path: "/about", content: `About our clinic: Founded in 2018, we offer specialized clinical help with experienced practitioners.` },
          { name: "Pricing & Services", path: "/pricing", content: `Our standard consultations start at $99. Routine follow ups are priced at $49.` }
        ];

        // Create document records for pages
        for (const page of pages) {
          const doc = await documentsRepository.create({
            organizationId: orgId,
            sourceId: source.id,
            name: `${page.name} (${page.path})`,
            fileType: "website",
            status: "completed",
            metadata: { url: `${url}${page.path}` },
          });

          const chunks = chunkingService.splitText(page.content);
          const chunkPayload = chunks.map((chunk) => ({
            organizationId: orgId,
            documentId: doc.id,
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            tokenCount: chunk.tokenCount,
            metadata: { url: `${url}${page.path}` },
          }));

          if (chunkPayload.length > 0) {
            await chunksRepository.createMany(chunkPayload);
          }
        }

        await importsRepository.update(importRun.id, {
          status: "completed",
          pagesFound: pages.length,
          pagesScraped: pages.length,
        });
      } catch (err) {
        await importsRepository.update(importRun.id, {
          status: "failed",
          errorMessage: err instanceof Error ? err.message : "Failed to crawl page content",
        });
      }
    }, 2000);

    revalidatePath("/kb");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to trigger website import" };
  }
}

// ==========================================
// 4. DOCUMENT PROCESSING QUEUE ACTIONS
// ==========================================

export async function getProcessingJobsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const jobs = await jobsRepository.list(orgId);
    
    // Enrich jobs with document names
    const enrichedJobs = await Promise.all(
      jobs.map(async (job) => {
        const doc = await documentsRepository.getById(job.documentId);
        return {
          ...job,
          documentName: doc?.name || "Unknown Document",
        };
      })
    );

    return { success: true, jobs: enrichedJobs };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load processing jobs" };
  }
}

// ==========================================
// 5. INTERNAL FULL-TEXT SEARCH ACTION
// ==========================================

export async function searchKnowledgeAction(query: string) {
  try {
    const orgId = await getVerifiedOrgId();
    if (!query || query.trim().length === 0) {
      return { success: true, results: { documents: [], faqs: [], services: [] } };
    }

    const likeQuery = `%${query.trim()}%`;

    // 1. Search Knowledge Documents
    const docs = await db
      .select()
      .from(knowledgeDocuments)
      .where(
        and(
          eq(knowledgeDocuments.organizationId, orgId),
          eq(knowledgeDocuments.isArchived, false),
          ilike(knowledgeDocuments.name, likeQuery)
        )
      )
      .limit(10);

    // 2. Search FAQs
    const faqs = await db
      .select()
      .from(faqItems)
      .where(
        and(
          eq(faqItems.organizationId, orgId),
          eq(faqItems.isActive, true),
          or(
            ilike(faqItems.question, likeQuery),
            ilike(faqItems.answer, likeQuery),
            ilike(faqItems.category, likeQuery)
          )
        )
      )
      .limit(10);

    // 3. Search Services
    const svcs = await db
      .select()
      .from(services)
      .where(
        and(
          eq(services.organizationId, orgId),
          eq(services.isActive, true),
          eq(services.isArchived, false),
          or(
            ilike(services.name, likeQuery),
            ilike(services.description, likeQuery)
          )
        )
      )
      .limit(10);

    return {
      success: true,
      results: {
        documents: docs,
        faqs,
        services: svcs,
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Search execution failed" };
  }
}

// ==========================================
// 6. HEALTH SCORE & STATISTICS ACTIONS
// ==========================================

export async function getKnowledgeStatsAction() {
  try {
    const orgId = await getVerifiedOrgId();

    // Parallelize all initial fetches
    const [docs, categories, faqsList, servicesList] = await Promise.all([
      documentsRepository.list(orgId, false),
      categoriesRepository.list(orgId),
      faqRepository.list(orgId),
      servicesRepository.list(orgId),
    ]);

    // Count chunks in a single aggregated DB query (not N+1)
    let totalChunks = 0;
    if (docs.length > 0) {
      const { knowledgeChunks } = await import("../db/schema");
      const { sql, inArray } = await import("drizzle-orm");
      const docIds = docs.map((d) => d.id);
      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(knowledgeChunks)
        .where(inArray(knowledgeChunks.documentId, docIds));
      totalChunks = result?.count ?? 0;
    }

    // Health Score calculation (0 to 100)
    let score = 0;
    if (docs.length > 0) score += 25;       // basic documentation upload
    if (faqsList.length > 3) score += 25;    // detailed FAQ list
    if (servicesList.length > 2) score += 25; // structured services
    if (categories.length > 1) score += 25;  // organized taxonomy categories

    let healthLabel: "Poor" | "Average" | "Good" | "Excellent" = "Poor";
    if (score === 100) healthLabel = "Excellent";
    else if (score === 75) healthLabel = "Good";
    else if (score === 50) healthLabel = "Average";

    return {
      success: true,
      stats: {
        totalDocuments: docs.length,
        totalChunks,
        healthScore: score,
        healthLabel,
        storageUsedBytes: docs.reduce((acc, curr) => acc + (curr.fileSize || 0), 0),
        recentUploads: docs.slice(-5),
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load stats" };
  }
}
