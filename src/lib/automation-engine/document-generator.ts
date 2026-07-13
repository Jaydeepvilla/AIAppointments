import { AutomationAction, AutomationEngineState, AutomationPreview } from "./types";

const COMMON_DOCUMENTS = [
  "Cancellation Policy",
  "Refund Policy",
  "Privacy Policy",
  "Terms & Conditions",
  "Payment Policy",
  "Booking Policy",
  "Aftercare Guides",
  "Preparation Guides",
  "Membership Guide",
  "Gift Card Policy",
  "Insurance Guide",
  "Emergency Instructions",
  "Business Overview",
  "Staff Handbook",
];

export function detectMissingDocuments(state: AutomationEngineState): AutomationAction[] {
  const actions: AutomationAction[] = [];
  const existingDocs = state.documents?.map((d) => (d.title || d.name || "").toLowerCase()) || [];

  // For this MVP, let's just pick top 3 most important missing documents to not overwhelm the UI
  const missing = COMMON_DOCUMENTS.filter(
    (doc) => !existingDocs.some((existing) => existing.includes(doc.toLowerCase()))
  ).slice(0, 3);

  for (const doc of missing) {
    actions.push({
      id: `auto_doc_${doc.toLowerCase().replace(/\s+/g, "_")}`,
      title: `Missing Document: ${doc}`,
      description: `Your Knowledge Base is missing a ${doc}. AI can generate a professional version customized for your business.`,
      primaryCtaText: "Generate With AI",
      primaryCtaHref: "#",
      primaryCtaAction: "generate_document",
      automationType: "generate_document",
      targetResourceType: "document",
      targetResourceName: doc,
      estimatedTimeMinutes: 1,
      impact: "High",
      impactReason: `Improves AI ability to answer ${doc} related questions`,
      confidence: 95,
      confidenceReason: "Standard business requirement",
    });
  }

  return actions;
}

export async function generateDocument(docType: string, state: AutomationEngineState): Promise<AutomationPreview> {
  // Simulate network delay for AI generation
  await new Promise(resolve => setTimeout(resolve, 1500));

  const businessName = state.organization?.name || "Our Business";
  const industry = state.organization?.industry || "Business";

  let content = "";

  switch (docType) {
    case "Cancellation Policy":
      content = `# Cancellation Policy for ${businessName}\n\nWe understand that plans change. We ask that you give us at least 24 hours notice if you need to cancel or reschedule your appointment.\n\n## Late Cancellations\nCancellations made within 24 hours of the appointment time may be subject to a fee of 50% of the service cost.\n\n## No Shows\nIf you do not show up for your scheduled appointment without notifying us, you will be charged the full amount of the service.`;
      break;
    case "Refund Policy":
      content = `# Refund Policy for ${businessName}\n\nWe strive for 100% customer satisfaction. If you are not satisfied with your service, please let us know within 48 hours.\n\n## Services\nServices are non-refundable, but we will gladly offer a complimentary correction if you notify us within 48 hours of your appointment.\n\n## Products\nUnopened retail products can be returned within 14 days of purchase for a full refund.`;
      break;
    default:
      content = `# ${docType}\n\nThis is a standard ${docType} customized for a ${industry} business named ${businessName}.\n\n## Overview\nWe prioritize our clients and ensure all interactions align with our core values.\n\n## Details\nPlease contact our support team if you have any questions regarding this policy.`;
      break;
  }

  return {
    id: crypto.randomUUID(),
    title: docType,
    content: content,
  };
}
