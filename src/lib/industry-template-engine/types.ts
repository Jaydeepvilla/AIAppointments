export type IndustryType = 
  | "dental"
  | "medical"
  | "salon"
  | "spa"
  | "gym"
  | "law_firm"
  | "real_estate"
  | "restaurant"
  | "consultant"
  | "veterinary"
  | "beauty_clinic"
  | "chiropractic"
  | "physiotherapy"
  | "general"; // Fallback

export interface IndustryFeature {
  name: string;
  description: string;
  reason: string;
  impact: "High" | "Medium" | "Low";
  difficulty: "Easy" | "Moderate" | "Hard";
  estimatedTimeMinutes: number;
}

export interface IndustryTemplate {
  id: IndustryType;
  name: string;
  description: string;
  
  requiredServices: IndustryFeature[];
  requiredDocuments: IndustryFeature[];
  requiredPolicies: IndustryFeature[];
  recommendedAutomations: IndustryFeature[];
  recommendedIntegrations: IndustryFeature[];
  recommendedAiSettings: IndustryFeature[];
}
