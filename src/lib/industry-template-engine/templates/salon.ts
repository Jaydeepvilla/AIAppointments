import { IndustryTemplate } from "../types";

export const salonTemplate: IndustryTemplate = {
  id: "salon",
  name: "Hair & Beauty Salon",
  description: "Best practices for salons and beauty professionals.",
  
  requiredServices: [
    {
      name: "Consultation",
      description: "Initial consultation for new clients.",
      reason: "Establishes client needs before committing to expensive chemical services.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    },
    {
      name: "Haircut & Style",
      description: "Standard cut and styling.",
      reason: "Core service that drives repeat visits.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 10
    }
  ],
  
  requiredDocuments: [
    {
      name: "Price List",
      description: "Clear breakdown of all services and starting prices.",
      reason: "Reduces basic inquiries and manages client expectations.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 20
    },
    {
      name: "Hair Care Guides",
      description: "How to maintain color or extensions at home.",
      reason: "Upsells retail products and improves service longevity.",
      impact: "Medium",
      difficulty: "Moderate",
      estimatedTimeMinutes: 30
    }
  ],
  
  requiredPolicies: [
    {
      name: "Late Arrival Policy",
      description: "Rules for clients who arrive late.",
      reason: "Prevents schedule domino effects for stylists.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    },
    {
      name: "No-Show Policy",
      description: "Fees for missed appointments.",
      reason: "Protects stylist income.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    }
  ],
  
  recommendedAutomations: [
    {
      name: "Reactivation Campaign",
      description: "Message clients who haven't visited in 3+ months.",
      reason: "Wins back lost clients with a targeted offer.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 15
    },
    {
      name: "Appointment Reminder",
      description: "Send SMS 24h before appointment.",
      reason: "Drastically reduces no-shows.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 5
    }
  ],
  
  recommendedIntegrations: [
    {
      name: "Instagram / Social Media",
      description: "Link booking directly from social profiles.",
      reason: "Captures impulse bookings based on visual content.",
      impact: "High",
      difficulty: "Easy",
      estimatedTimeMinutes: 15
    }
  ],
  
  recommendedAiSettings: [
    {
      name: "Stylist Matching",
      description: "Train AI to recommend specific stylists based on requested service (e.g., color specialist).",
      reason: "Ensures clients are booked with the right professional.",
      impact: "High",
      difficulty: "Moderate",
      estimatedTimeMinutes: 15
    }
  ]
};
