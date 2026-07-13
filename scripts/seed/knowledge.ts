import { db } from "../../src/server/db";
import {
  knowledgeCategories,
  knowledgeSources,
  knowledgeDocuments,
  documentProcessingJobs,
  knowledgeChunks
} from "../../src/server/db/schema";
import { ORG_ID } from "./business";

export async function seedKnowledge(): Promise<void> {
  console.log("📚 Seeding knowledge base (categories, documents, chunks, processing jobs)...");

  // 1. Seed Categories
  const catSopId = "aaaaaaaa-1111-1111-1111-111111111111";
  const catPoliciesId = "aaaaaaaa-2222-2222-2222-222222222222";
  const catFaqsId = "aaaaaaaa-3333-3333-3333-333333333333";

  await db.insert(knowledgeCategories).values([
    { 
      id: catSopId, 
      organizationId: ORG_ID, 
      name: "Standard Operating Procedures", 
      slug: "standard-operating-procedures", 
      description: "Operational protocols for staff, treatment room cleaning, and shifts." 
    },
    { 
      id: catPoliciesId, 
      organizationId: ORG_ID, 
      name: "Salon Booking Policies", 
      slug: "salon-booking-policies", 
      description: "Cancellation guidelines, booking limits, and payment rules." 
    },
    { 
      id: catFaqsId, 
      organizationId: ORG_ID, 
      name: "Customer FAQ Resources", 
      slug: "customer-faq-resources", 
      description: "General guides to resolve customer questions about services." 
    }
  ]).onConflictDoNothing();

  // 2. Seed Knowledge Source
  const sourceWebId = "bbbbbbbb-1111-1111-1111-111111111111";
  const sourceUploadId = "bbbbbbbb-2222-2222-2222-222222222222";

  await db.insert(knowledgeSources).values([
    { id: sourceWebId, organizationId: ORG_ID, name: "Website Importer", type: "website", isActive: true, metadata: {} },
    { id: sourceUploadId, organizationId: ORG_ID, name: "Manual Uploads", type: "file", isActive: true, metadata: {} }
  ]).onConflictDoNothing();

  // 3. Seed Documents, Jobs, and Chunks
  const docsData = [
    {
      id: "cccccccc-1001-1111-1111-111111111111",
      categoryId: catSopId,
      sourceId: sourceUploadId,
      name: "Glow & Grace — Staff Welcome Guide.pdf",
      fileType: "pdf",
      status: "queued",
      jobStatus: "queued",
      logs: "Waiting in processing queue for worker resource assignment...",
      chunks: []
    },
    {
      id: "cccccccc-1002-1111-1111-111111111111",
      categoryId: catSopId,
      sourceId: sourceUploadId,
      name: "Salon Inventory & Backbar Audit.xlsx",
      fileType: "docx",
      status: "processing",
      jobStatus: "processing",
      logs: "Starting processing job...\nUploading source document to storage...\nExtracting spreadsheet tables...",
      chunks: []
    },
    {
      id: "cccccccc-1003-1111-1111-111111111111",
      categoryId: catSopId,
      sourceId: sourceUploadId,
      name: "Esthetician Training Manual 2026.docx",
      fileType: "docx",
      status: "processing",
      jobStatus: "processing",
      logs: "Starting processing job...\nSource document uploaded successfully.\nExtracting text content from DOCX file...",
      chunks: []
    },
    {
      id: "cccccccc-1004-1111-1111-111111111111",
      categoryId: catSopId,
      sourceId: sourceUploadId,
      name: "Glow & Grace — Cleanliness Protocols.txt",
      fileType: "txt",
      status: "completed",
      jobStatus: "completed",
      logs: "Indexing completed.\nIngestion pipeline finished successfully!",
      chunks: [
        "Cleanliness Protocols and Hygiene Policies. Pets and non-service dogs are strictly prohibited from entering the salon floor or treatment rooms due to state board sanitary regulations. Certified service animals with proper harness are allowed.",
        "Esthetician hygiene standards: Wipe down all beds and tools with disinfectant wipes after every service. Handwashing is required before and after styling or massage sessions."
      ]
    },
    {
      id: "cccccccc-1005-1111-1111-111111111111",
      categoryId: catPoliciesId,
      sourceId: sourceUploadId,
      name: "Treatment Room Booking Instructions.pdf",
      fileType: "pdf",
      status: "completed",
      jobStatus: "completed",
      logs: "Indexing completed.\nIngestion pipeline finished successfully!",
      chunks: [
        "Treatment Room Booking Guidelines. To reserve a facial treatment room, log into the booking console, select the esthetician room tier, and reserve the slot. Double booking of esthetician blocks is not permitted.",
        "Estheticians must clean and vacate rooms 10 minutes prior to the end of their scheduled block to ensure smooth client transitions."
      ]
    },
    {
      id: "cccccccc-1006-1111-1111-111111111111",
      categoryId: catPoliciesId,
      sourceId: sourceUploadId,
      name: "Glow & Grace — Cancellation & No-Show Fees.pdf",
      fileType: "pdf",
      status: "completed",
      jobStatus: "completed",
      logs: "Indexing completed.\nIngestion pipeline finished successfully!",
      chunks: [
        "Booking and Cancellation Policy. Clients must cancel or reschedule appointments at least 24 hours prior to the scheduled start time.",
        "Cancellations made less than 24 hours in advance are subject to a cancellation fee equal to 50% of the scheduled service price. No-shows will be charged 100% of the service fee."
      ]
    }
  ];

  for (const doc of docsData) {
    await db.insert(knowledgeDocuments).values({
      id: doc.id,
      organizationId: ORG_ID,
      categoryId: doc.categoryId,
      sourceId: doc.sourceId,
      name: doc.name,
      fileType: doc.fileType,
      status: doc.status as any,
      metadata: {},
    }).onConflictDoNothing();

    await db.insert(documentProcessingJobs).values({
      organizationId: ORG_ID,
      documentId: doc.id,
      status: doc.jobStatus as any,
      logs: doc.logs,
    }).onConflictDoNothing();

    for (let chunkIdx = 0; chunkIdx < doc.chunks.length; chunkIdx++) {
      await db.insert(knowledgeChunks).values({
        organizationId: ORG_ID,
        documentId: doc.id,
        content: doc.chunks[chunkIdx],
        chunkIndex: chunkIdx,
        tokenCount: Math.ceil(doc.chunks[chunkIdx].length / 4),
        metadata: { index: chunkIdx },
      }).onConflictDoNothing();
    }
  }

  console.log(`... Seeded ${docsData.length} knowledge documents with processing jobs & chunks`);
}
