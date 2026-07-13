import { IndustryType, IndustryTemplate } from "./types";
import { dentalTemplate } from "./templates/dental";
import { salonTemplate } from "./templates/salon";
import { medicalTemplate } from "./templates/medical";
import { gymTemplate } from "./templates/gym";

const templateRegistry: Record<string, IndustryTemplate> = {
  dental: dentalTemplate,
  salon: salonTemplate,
  medical: medicalTemplate,
  gym: gymTemplate,
};

export function getIndustryTemplate(industryStr: string | undefined): IndustryTemplate | null {
  if (!industryStr) return null;
  
  // Normalize string for matching
  const normalized = industryStr.toLowerCase().trim();
  
  // Exact match
  if (templateRegistry[normalized]) {
    return templateRegistry[normalized];
  }
  
  // Fuzzy matching fallback
  if (normalized.includes("dentist") || normalized.includes("teeth")) return dentalTemplate;
  if (normalized.includes("hair") || normalized.includes("beauty") || normalized.includes("spa")) return salonTemplate;
  if (normalized.includes("doctor") || normalized.includes("physician") || normalized.includes("health")) return medicalTemplate;
  if (normalized.includes("fitness") || normalized.includes("crossfit") || normalized.includes("yoga")) return gymTemplate;

  return null;
}

export * from "./types";
