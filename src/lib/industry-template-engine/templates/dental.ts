import { IndustryTemplate } from "../types";

export const dentalTemplate: IndustryTemplate = {
  id: "dental",
  name: "Dental Clinic",
  description: "Best practices for dental offices and clinics.",
  
  requiredServices: [
    {
      name: "Routine Checkup",
      description: "Standard dental examination and cleaning.",
      reason: "Most common entry-level service for new and returning patients.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    },
    {
      name: "Emergency Consultation",
      description: "Urgent care for dental emergencies.",
      reason: "Patients in pain need immediate booking paths.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    }
  ],
  
  requiredDocuments: [
    {
      name: "Aftercare Guides",
      description: "Instructions for post-extraction or surgery care.",
      reason: "Reduces post-op support calls and improves patient recovery.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 30
    },
    {
      name: "Insurance Information",
      description: "Accepted providers and billing policies.",
      reason: "Prevents payment confusion and reduces billing questions.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 15
    }
  ],
  
  requiredPolicies: [
    {
      name: "Emergency Policy",
      description: "How to handle after-hours or urgent dental issues.",
      reason: "Provides clarity during high-stress situations.",
      impact: "Medium",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    },
    {
      name: "Cancellation Policy",
      description: "Rules for late cancellations or no-shows.",
      reason: "Protects clinic revenue from empty chair time.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    }
  ],
  
  recommendedAutomations: [
    {
      name: "6-Month Recall Campaign",
      description: "Automatically remind patients it is time for their cleaning.",
      reason: "Drives recurring revenue and patient health.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 20
    },
    {
      name: "Review Request",
      description: "Ask for a Google review after a successful appointment.",
      reason: "Builds local SEO and trust for the clinic.",
      impact: "Medium",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    }
  ],
  
  recommendedIntegrations: [
    {
      name: "EHR / Dental Practice Management",
      description: "Sync with Dentrix, OpenDental, or Curve.",
      reason: "Keeps patient records unified.",
      impact: "High",
      difficulty: "Hard",
      estimatedTimeMinutes: 60
    }
  ],
  
  recommendedAiSettings: [
    {
      name: "Triage Prompting",
      description: "Train AI to ask about pain level and duration for emergencies.",
      reason: "Prioritizes urgent cases effectively.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 15
    }
  ]
};
