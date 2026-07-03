export interface DefaultService {
  name: string;
  category: string;
  description: string;
  duration: number;
  price: string;
}

export interface DefaultFaq {
  question: string;
  answer: string;
  category: string;
}

export interface DefaultQualificationQuestion {
  question: string;
  answerType: "text" | "single_select" | "multi_select" | "number";
  options?: string[];
  isRequired: boolean;
}

export interface IndustryTemplate {
  industry: string;
  description: string;
  services: DefaultService[];
  faqs: DefaultFaq[];
  qualificationQuestions: DefaultQualificationQuestion[];
  businessHours: Record<string, { open: string; close: string; closed: boolean }>;
}

export const DEFAULT_BUSINESS_HOURS = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "09:00", close: "12:00", closed: true },
  sunday: { open: "09:00", close: "12:00", closed: true },
};

export const INDUSTRY_TEMPLATES: Record<string, IndustryTemplate> = {
  "Dental Clinic": {
    industry: "Dental Clinic",
    description: "Configured for family dental clinics and orthodontic offices.",
    services: [
      { name: "Teeth Cleaning", category: "Preventative", description: "Routine dental cleaning and checkup.", duration: 45, price: "99.00" },
      { name: "Root Canal Therapy", category: "Restorative", description: "Treatment for infected tooth pulp.", duration: 90, price: "750.00" },
      { name: "Teeth Whitening", category: "Cosmetic", description: "Professional in-office teeth whitening.", duration: 60, price: "299.00" },
    ],
    faqs: [
      { question: "Do you accept insurance?", answer: "Yes, we accept major dental PPO insurance plans. We can verify your benefits when you call.", category: "Insurance" },
      { question: "What should I do in case of a dental emergency?", answer: "If you are experiencing severe pain or bleeding, please call us immediately. We keep emergency slots open daily.", category: "Emergency" },
    ],
    qualificationQuestions: [
      { question: "Are you a new or returning patient?", answerType: "single_select", options: ["New Patient", "Returning Patient"], isRequired: true },
      { question: "Is this booking for a routine checkup or an emergency issue?", answerType: "single_select", options: ["Routine checkup", "Active pain/Emergency", "Other consultation"], isRequired: true },
      { question: "Do you have dental insurance coverage?", answerType: "single_select", options: ["Yes", "No"], isRequired: false },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Medical Clinic": {
    industry: "Medical Clinic",
    description: "Configured for general practitioners and health specialists.",
    services: [
      { name: "General Consultation", category: "General", description: "Standard physical exam and consultation.", duration: 30, price: "120.00" },
      { name: "Follow-Up Visit", category: "General", description: "Post-treatment review check.", duration: 15, price: "60.00" },
      { name: "Annual Health Assessment", category: "Assessment", description: "Comprehensive body and blood diagnostics review.", duration: 60, price: "250.00" },
    ],
    faqs: [
      { question: "What should I bring to my first appointment?", answer: "Please bring a valid photo ID, your active health insurance card, and any current prescription bottles.", category: "General" },
      { question: "How do I request a prescription refill?", answer: "Refills can be requested directly by having your pharmacy send a digital request, or by booking a short consultation.", category: "Prescriptions" },
    ],
    qualificationQuestions: [
      { question: "What primary symptoms are you experiencing?", answerType: "text", isRequired: true },
      { question: "Is this booking related to a chronic health condition?", answerType: "single_select", options: ["Yes", "No"], isRequired: false },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Salon": {
    industry: "Salon",
    description: "Configured for hair salons, barber shops, and beauty treatments.",
    services: [
      { name: "Classic Haircut & Blowdry", category: "Hair", description: "Includes shampoo wash, designer cut, and styling.", duration: 45, price: "55.00" },
      { name: "Full Balayage / Highlights", category: "Color", description: "Custom hair coloring and gloss overlay treatment.", duration: 120, price: "180.00" },
      { name: "Keratin Smooth Treatment", category: "Treatment", description: "Frizz-reducing hair smoothing application.", duration: 90, price: "120.00" },
    ],
    faqs: [
      { question: "What is your cancellation policy?", answer: "We require 24 hours notice for cancellations. Late cancellations may incur a 50% charge.", category: "Booking" },
      { question: "Can I request a specific stylist?", answer: "Yes, you can choose your preferred stylist when booking. Prices may vary depending on active seniority levels.", category: "Staff" },
    ],
    qualificationQuestions: [
      { question: "What is your current hair length?", answerType: "single_select", options: ["Short (above shoulder)", "Medium (shoulder length)", "Long (below shoulder)"], isRequired: true },
      { question: "Do you have a preferred stylist in mind?", answerType: "single_select", options: ["First Available", "Senior Stylist", "Master Stylist"], isRequired: false },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Spa": {
    industry: "Spa",
    description: "Configured for massage parlors, skin therapy centers, and wellness spas.",
    services: [
      { name: "Swedish Deep Tissue Massage", category: "Massage", description: "Relaxing muscle tension-release massage.", duration: 60, price: "95.00" },
      { name: "Anti-Aging Facial Cleanse", category: "Skin Care", description: "Organic clay scrub, steam pore cleanse, and serum treatment.", duration: 60, price: "110.00" },
      { name: "Luxury Manicure & Pedicure", category: "Nails", description: "Nail shaping, cuticle therapy, and premium polish.", duration: 75, price: "75.00" },
    ],
    faqs: [
      { question: "Should I arrive early for my massage?", answer: "We suggest arriving 10-15 minutes before your scheduled slot to fill out wellness intake forms and settle in.", category: "Intake" },
      { question: "Do you offer couples massages?", answer: "Yes! Please select our Couples suite option or call us directly to sync double operator rooms.", category: "Suites" },
    ],
    qualificationQuestions: [
      { question: "Do you have any active skin allergies or physical injuries?", answerType: "text", isRequired: false },
      { question: "What is your preferred pressure level for body work?", answerType: "single_select", options: ["Light", "Medium", "Deep Tissue"], isRequired: true },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Law Firm": {
    industry: "Law Firm",
    description: "Configured for legal practitioners, attorneys, and law consultancies.",
    services: [
      { name: "Initial Case Evaluation", category: "Consultation", description: "A confidential review of your case particulars with an attorney.", duration: 45, price: "150.00" },
      { name: "Legal Document Review", category: "Contracts", description: "Analysis and amendment feedback on standard legal agreements.", duration: 60, price: "250.00" },
    ],
    faqs: [
      { question: "Is my initial consultation confidential?", answer: "Yes, all consultations are protected under attorney-client privilege regulations, regardless of final hire.", category: "Confidentiality" },
      { question: "What are your standard retainer fees?", answer: "Hourly retainer details are discussed during your evaluation and structured based on case categories.", category: "Fees" },
    ],
    qualificationQuestions: [
      { question: "What legal practice area does your inquiry relate to?", answerType: "single_select", options: ["Family Law", "Real Estate / Disputes", "Business Contract Law", "Personal Injury", "Criminal Defense", "Other"], isRequired: true },
      { question: "Are there any pending court filing deadlines or active court cases?", answerType: "single_select", options: ["Yes, active court date", "Yes, upcoming filing deadline", "No active deadlines"], isRequired: true },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Consultant": {
    industry: "Consultant",
    description: "Configured for business consultants, accountants, and marketing strategists.",
    services: [
      { name: "Business Discovery Call", category: "Strategy", description: "Initial assessment of business operational gaps.", duration: 30, price: "0.00" },
      { name: "Financial Auditing Consultation", category: "Finance", description: "Detailed review of accounting balances and workflows.", duration: 60, price: "175.00" },
    ],
    faqs: [
      { question: "Do you deliver remote consultations?", answer: "Yes, all regular consultations are conducted via Zoom. In-person slots can be booked via phone requests.", category: "Operations" },
    ],
    qualificationQuestions: [
      { question: "What is your current monthly business revenue or company size?", answerType: "single_select", options: ["1-5 Employees", "5-25 Employees", "25+ Corporate"], isRequired: true },
      { question: "What is your primary goal for this discovery block?", answerType: "text", isRequired: true },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Real Estate": {
    industry: "Real Estate",
    description: "Configured for brokers, property showing coordinators, and agencies.",
    services: [
      { name: "Property Valuation Consultation", category: "Selling", description: "Determine listing valuation potential for your home.", duration: 45, price: "0.00" },
      { name: "Exclusive Property Walkthrough", category: "Buying", description: "Guided tour of active local listing coordinates.", duration: 60, price: "0.00" },
    ],
    faqs: [
      { question: "What details do you need to compile a home evaluation report?", answer: "We require the property address, year built, size, and details of any major renovations.", category: "Selling" },
    ],
    qualificationQuestions: [
      { question: "Are you primarily looking to buy, sell, or rent property?", answerType: "single_select", options: ["Looking to Buy", "Looking to Sell", "Looking to Rent"], isRequired: true },
      { question: "What is your budget limit for this transaction?", answerType: "number", isRequired: true },
      { question: "What are your preferred neighborhood locations?", answerType: "text", isRequired: false },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Gym": {
    industry: "Gym",
    description: "Configured for personal training studios, fitness clubs, and gyms.",
    services: [
      { name: "Gym Membership Tour", category: "Membership", description: "Walkthrough of equipment facilities and membership pricing options.", duration: 30, price: "0.00" },
      { name: "1-on-1 Personal Training Session", category: "Training", description: "Personalized exercise routine and coaching session.", duration: 60, price: "80.00" },
    ],
    faqs: [
      { question: "Do you offer free day trial passes?", answer: "Yes! Local residents can get a free 1-day pass during membership desk hours.", category: "Passes" },
    ],
    qualificationQuestions: [
      { question: "What is your primary fitness aspiration?", answerType: "single_select", options: ["Weight Loss", "Muscle Building", "Cardio Endurance", "Rehab / Flexibility"], isRequired: true },
      { question: "Have you worked with a personal trainer in the past?", answerType: "single_select", options: ["Yes", "No"], isRequired: false },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
  "Other": {
    industry: "Other",
    description: "General setup template with standard defaults.",
    services: [
      { name: "General Discovery Call", category: "Consultation", description: "Standard business review call.", duration: 30, price: "0.00" },
    ],
    faqs: [
      { question: "How do I contact support?", answer: "You can reach our main business desk by emailing us or calling during active office hours.", category: "Support" },
    ],
    qualificationQuestions: [
      { question: "Please describe what service you need help with.", answerType: "text", isRequired: true },
    ],
    businessHours: DEFAULT_BUSINESS_HOURS,
  },
};
