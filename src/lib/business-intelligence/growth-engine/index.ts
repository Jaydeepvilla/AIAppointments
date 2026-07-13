import { BusinessState } from "../../health-engine/types";
import { getIndustryTemplate } from "../../industry-template-engine";
import { GrowthEngineResult, GrowthIdea } from "../types";

// ─── Growth idea generators ───────────────────────────────────────────────────

function getServiceGrowthIdeas(state: BusinessState, industry: string): GrowthIdea[] {
  const ideas: GrowthIdea[] = [];
  const serviceCount = state.services?.length ?? 0;

  if (serviceCount === 0) {
    ideas.push({
      id: "growth-no-services",
      title: "Define Your Service Menu",
      description: "You have no services listed. Customers cannot see what you offer, and the AI cannot discuss pricing or availability.",
      type: "new_service",
      severity: "critical",
      businessImpact: "Unlocks booking inquiries and AI-assisted service discovery",
      estimatedEffort: "quick",
      industryRelevance: "high",
      actionText: "Add Services",
      actionHref: "/services",
      confidence: 95,
    });
  } else if (serviceCount < 3) {
    ideas.push({
      id: "growth-few-services",
      title: "Expand Your Service Offerings",
      description: `You only have ${serviceCount} service${serviceCount === 1 ? "" : "s"}. Businesses with 5+ services see significantly more booking inquiries.`,
      type: "new_service",
      severity: "opportunity",
      businessImpact: "More service options increase inquiry volume and average booking value",
      estimatedEffort: "quick",
      industryRelevance: "high",
      actionText: "Add More Services",
      actionHref: "/services",
      confidence: 85,
    });
  }

  return ideas;
}

function getMembershipIdeas(state: BusinessState): GrowthIdea[] {
  const ideas: GrowthIdea[] = [];

  // Check if there's any mention of membership/package in services
  const hasMembership = (state.services || []).some((s: any) =>
    /member|package|plan|subscri/i.test(s.name || s.description || "")
  );

  if (!hasMembership) {
    ideas.push({
      id: "growth-membership",
      title: "Introduce a Membership or Package Plan",
      description: "Recurring memberships and service packages create predictable revenue and increase customer retention. Common in your industry.",
      type: "membership",
      severity: "opportunity",
      businessImpact: "Builds recurring revenue and improves customer lifetime value",
      estimatedEffort: "medium",
      industryRelevance: "high",
      actionText: "Add a Package Service",
      actionHref: "/services",
      confidence: 75,
    });
  }

  return ideas;
}

function getReferralIdeas(state: BusinessState): GrowthIdea[] {
  // Check flows for any referral mention
  const hasReferralFlow = (state.flows || []).some((f: any) =>
    /referral|refer a friend|share/i.test(f.name || f.description || "")
  );

  if (hasReferralFlow) return [];

  return [
    {
      id: "growth-referral",
      title: "Launch a Customer Referral Program",
      description: "Word-of-mouth is the highest-converting acquisition channel for local businesses. A referral flow in your AI can capture and track referred customers automatically.",
      type: "referral",
      severity: "opportunity",
      businessImpact: "Referred customers convert at 3–5× the rate of cold leads",
      estimatedEffort: "medium",
      industryRelevance: "high",
      actionText: "Create Referral Flow",
      actionHref: "/flows",
      confidence: 70,
    },
  ];
}

function getUpsellIdeas(state: BusinessState): GrowthIdea[] {
  const hasUpsellFlow = (state.flows || []).some((f: any) =>
    /upsell|cross.?sell|add.?on|upgrade/i.test(f.name || f.description || "")
  );

  if (hasUpsellFlow) return [];

  return [
    {
      id: "growth-upsell",
      title: "Add Post-Booking Upsell Flows",
      description: "After a customer books, automatically suggest add-on services. This is the highest-intent moment in the customer journey.",
      type: "upsell",
      severity: "opportunity",
      businessImpact: "Increases average transaction value without additional customer acquisition cost",
      estimatedEffort: "medium",
      industryRelevance: "high",
      actionText: "Create Upsell Flow",
      actionHref: "/flows",
      confidence: 72,
    },
  ];
}

function getRetentionIdeas(state: BusinessState): GrowthIdea[] {
  const hasFollowUp = (state.flows || []).some((f: any) =>
    /follow.?up|re.?engage|return|come back/i.test(f.name || f.description || "")
  );

  if (hasFollowUp) return [];

  return [
    {
      id: "growth-retention",
      title: "Build a Customer Re-engagement Flow",
      description: "Customers who haven't returned in 30+ days need a nudge. An automated re-engagement message keeps your business top of mind.",
      type: "retention",
      severity: "opportunity",
      businessImpact: "Recovering even a small percentage of lapsed customers significantly reduces acquisition cost",
      estimatedEffort: "medium",
      industryRelevance: "medium",
      actionText: "Create Re-engagement Flow",
      actionHref: "/flows",
      confidence: 65,
    },
  ];
}

function getIndustryGrowthIdeas(state: BusinessState): GrowthIdea[] {
  const template = getIndustryTemplate(state.organization?.industry);
  if (!template) return [];

  const ideas: GrowthIdea[] = [];

  // For each required service not yet configured, suggest adding it
  const existingServiceNames = (state.services || []).map((s: any) =>
    (s.name || "").toLowerCase()
  );

  for (const feature of template.requiredServices.slice(0, 3)) {
    const alreadyHas = existingServiceNames.some(n =>
      n.includes(feature.name.toLowerCase())
    );
    if (!alreadyHas) {
      ideas.push({
        id: `growth-industry-svc-${feature.name.replace(/\s+/g, "-").toLowerCase()}`,
        title: `Add Industry-Standard Service: ${feature.name}`,
        description: `${feature.reason} This is a standard offering in the ${template.name} industry.`,
        type: "new_service",
        severity: feature.impact === "High" ? "warning" : "opportunity",
        businessImpact: `Commonly offered by leading ${template.name} businesses`,
        estimatedEffort: feature.estimatedTimeMinutes <= 10 ? "quick" : "medium",
        industryRelevance: "high",
        actionText: "Add Service",
        actionHref: "/services",
        confidence: 80,
      });
    }
  }

  return ideas;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function runGrowthEngine(state: BusinessState): GrowthEngineResult {
  const industry = state.organization?.industry ?? "general";
  const template = getIndustryTemplate(industry);

  const ideas: GrowthIdea[] = [
    ...getServiceGrowthIdeas(state, industry),
    ...getMembershipIdeas(state),
    ...getReferralIdeas(state),
    ...getUpsellIdeas(state),
    ...getRetentionIdeas(state),
    ...getIndustryGrowthIdeas(state),
  ];

  // Sort: critical → opportunity, then by confidence descending
  ideas.sort((a, b) => {
    const sev = { critical: 0, warning: 1, opportunity: 2, info: 3 };
    const sevDiff = sev[a.severity] - sev[b.severity];
    return sevDiff !== 0 ? sevDiff : b.confidence - a.confidence;
  });

  // Growth score: how many growth levers are untapped (more ideas = lower score)
  const growthScore = Math.max(0, 100 - ideas.length * 12);

  return {
    ideas,
    growthScore,
    industryName: template?.name ?? "General Business",
  };
}
