import { AutomationAction, AutomationEngineState, AutomationPreview } from "./types";

const COMMON_FAQS = [
  { question: "What are your business hours?", answer: "We are open Monday to Friday from 9 AM to 5 PM." },
  { question: "Do you require appointments?", answer: "Appointments are recommended, but we accept walk-ins based on availability." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, debit cards, and cash." },
  { question: "Do you offer refunds or exchanges?", answer: "Please refer to our Refund Policy for detailed information." },
];

export function detectMissingFaqs(state: AutomationEngineState): AutomationAction[] {
  const actions: AutomationAction[] = [];
  
  // Check the state for existing FAQ count
  const hasFaqs = (state.faqs && state.faqs.length > 0);

  if (!hasFaqs) {
    actions.push({
      id: `automation-generate-faq-general`,
      title: `Generate General FAQs`,
      description: `Use AI to instantly generate common frequently asked questions based on your services and the ${state.profile?.industry || 'General'} industry.`,
      primaryCtaText: "Generate With AI",
      primaryCtaHref: "#",
      primaryCtaAction: "generate_faq",
      impact: "High",
      automationType: "generate_faq",
      targetResourceType: "faq",
      targetResourceName: "General FAQs",
      estimatedTimeMinutes: 1,
      impactReason: "FAQs improve answer rate significantly",
      confidence: 95,
      confidenceReason: "No FAQs currently exist",
    });
  }

  return actions;
}

export function generateFaqPreview(state: AutomationEngineState): AutomationPreview {
  const industry = state.profile?.industry || "general";
  const name = state.profile?.name || state.organization?.name || "your business";
  const services = state.services || [];
  
  let content = `Here are some suggested FAQs for ${name}:\n\n`;
  
  if (services.length > 0) {
    content += `**Q: What services do you offer?**\n`;
    content += `A: We offer a variety of services including ${services.map((s: any) => s.name).join(", ")}.\n\n`;
  }

  COMMON_FAQS.forEach(faq => {
    content += `**Q: ${faq.question}**\nA: ${faq.answer}\n\n`;
  });

  return {
    id: crypto.randomUUID(),
    title: "General FAQs",
    content: content,
  };
}
