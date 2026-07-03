import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { 
  getKnowledgeCategoriesAction, 
  getKnowledgeDocumentsAction, 
  getWebsiteImportsAction, 
  getProcessingJobsAction, 
  getKnowledgeStatsAction 
} from "@/server/actions/knowledge";
import { KnowledgeCenterClient } from "./kb-client";

export default async function KnowledgeBasePage() {
  const { hasOrg, org } = await checkUserOrganization();
  if (!hasOrg || !org) {
    redirect("/onboarding");
  }

  // Load initial datasets from server side
  const [categoriesRes, docsRes, importsRes, jobsRes, statsRes] = await Promise.all([
    getKnowledgeCategoriesAction(),
    getKnowledgeDocumentsAction(false), // non-archived docs
    getWebsiteImportsAction(),
    getProcessingJobsAction(),
    getKnowledgeStatsAction(),
  ]);

  const categories = categoriesRes.success ? categoriesRes.categories || [] : [];
  const documents = docsRes.success ? docsRes.documents || [] : [];
  const imports = importsRes.success ? importsRes.imports || [] : [];
  const jobs = jobsRes.success ? jobsRes.jobs || [] : [];
  const stats = statsRes.success ? statsRes.stats || {
    totalDocuments: 0,
    totalChunks: 0,
    healthScore: 0,
    healthLabel: "Poor",
    storageUsedBytes: 0,
    recentUploads: [],
  } : {
    totalDocuments: 0,
    totalChunks: 0,
    healthScore: 0,
    healthLabel: "Poor",
    storageUsedBytes: 0,
    recentUploads: [],
  };

  return (
    <KnowledgeCenterClient
      initialCategories={categories}
      initialDocuments={documents}
      initialImports={imports}
      initialJobs={jobs}
      stats={stats}
    />
  );
}
