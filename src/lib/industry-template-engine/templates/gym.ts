import { IndustryTemplate } from "../types";

export const gymTemplate: IndustryTemplate = {
  id: "gym",
  name: "Gym & Fitness Center",
  description: "Best practices for gyms, studios, and personal trainers.",
  
  requiredServices: [
    {
      name: "Facility Tour",
      description: "Introductory tour for prospective members.",
      reason: "Primary sales driver for new memberships.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    },
    {
      name: "Personal Training Session",
      description: "1-on-1 coaching session.",
      reason: "High margin add-on service.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    }
  ],
  
  requiredDocuments: [
    {
      name: "Membership Plans",
      description: "Details on pricing, tiers, and access.",
      reason: "Answers the most common prospect question.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 15
    },
    {
      name: "Trainer Profiles",
      description: "Background and specialties of personal trainers.",
      reason: "Builds trust and helps sell PT packages.",
      impact: "Medium",
      difficulty: "Moderate",
      estimatedTimeMinutes: 30
    }
  ],
  
  requiredPolicies: [
    {
      name: "Cancellation Policy",
      description: "How to cancel or freeze a membership.",
      reason: "Legally required and prevents disputes.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 15
    },
    {
      name: "Facility Rules",
      description: "Code of conduct for the gym floor.",
      reason: "Maintains a safe environment.",
      impact: "Medium",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    }
  ],
  
  recommendedAutomations: [
    {
      name: "Lead Follow-up",
      description: "Automated SMS to website inquiries.",
      reason: "Speed to lead is critical for gym sales.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 20
    },
    {
      name: "Membership Renewal",
      description: "Reminders for expiring annual plans.",
      reason: "Reduces churn.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    }
  ],
  
  recommendedIntegrations: [
    {
      name: "Mindbody / ZenPlanner",
      description: "Sync with fitness management software.",
      reason: "Unified member management.",
      impact: "High",
      difficulty: "Hard",
      estimatedTimeMinutes: 60
    }
  ],
  
  recommendedAiSettings: [
    {
      name: "Class Schedule Queries",
      description: "Train AI to answer 'what time is yoga?'",
      reason: "Most common repetitive question.",
      impact: "Medium",
      difficulty: "Moderate",
      estimatedTimeMinutes: 15
    }
  ]
};
