import { IndustryTemplate } from "../types";

export const medicalTemplate: IndustryTemplate = {
  id: "medical",
  name: "Medical Clinic",
  description: "Best practices for medical clinics and doctors.",
  
  requiredServices: [
    {
      name: "Initial Consultation",
      description: "First visit for new patients.",
      reason: "Essential for gathering medical history.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    },
    {
      name: "Follow-up Appointment",
      description: "Standard follow-up for existing patients.",
      reason: "High volume recurring service.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    }
  ],
  
  requiredDocuments: [
    {
      name: "HIPAA / Privacy Policy",
      description: "Patient data privacy compliance.",
      reason: "Legal requirement for medical data handling.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 45
    },
    {
      name: "New Patient Intake Forms",
      description: "Forms to complete prior to visit.",
      reason: "Saves time in the waiting room.",
      impact: "High",
      difficulty: "Hard",
      estimatedTimeMinutes: 60
    }
  ],
  
  requiredPolicies: [
    {
      name: "Prescription Refill Policy",
      description: "Rules for requesting medication refills.",
      reason: "Sets expectations for turnaround times.",
      impact: "Medium",
      difficulty: "Easy",
      estimatedTimeMinutes: 15
    },
    {
      name: "No-Show Policy",
      description: "Fees for missed medical appointments.",
      reason: "Protects physician time.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    }
  ],
  
  recommendedAutomations: [
    {
      name: "Annual Checkup Reminder",
      description: "Remind patients to book their yearly physical.",
      reason: "Improves patient health outcomes and clinic revenue.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 20
    }
  ],
  
  recommendedIntegrations: [
    {
      name: "EMR / EHR System",
      description: "Integration with Epic, Cerner, or AthenaHealth.",
      reason: "Critical for patient record keeping.",
      impact: "High",
      difficulty: "Hard",
      estimatedTimeMinutes: 120
    }
  ],
  
  recommendedAiSettings: [
    {
      name: "Triage & Emergency Escalation",
      description: "Train AI to recognize emergency symptoms and direct to 911.",
      reason: "Critical liability protection.",
      impact: "High",
      difficulty: "Hard",
      estimatedTimeMinutes: 45
    }
  ]
};
