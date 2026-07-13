import { BusinessState } from "../../health-engine/types";
import {
  SeasonalEngineResult,
  SeasonalEvent,
  SeasonalRecommendation,
} from "../types";

// ─── Static seasonal calendar ─────────────────────────────────────────────────
// All dates are represented as MM-DD for annual recurrence.
// This is deterministic — no external API calls.

interface CalendarEntry {
  id: string;
  name: string;
  mmdd: string; // MM-DD
  type: SeasonalEvent["type"];
  /** Industries this is relevant for; empty = all industries */
  industries: string[];
  /** Recommended action title */
  actionTitle: string;
  actionDescription: string;
  actionHref: string;
  actionText: string;
}

const SEASONAL_CALENDAR: CalendarEntry[] = [
  {
    id: "new-year",
    name: "New Year's Day",
    mmdd: "01-01",
    type: "holiday",
    industries: [],
    actionTitle: "New Year Special Promotion",
    actionDescription: "Run a 'New Year, New You' promotion to attract customers setting resolutions. Ideal for fitness, wellness, dental and beauty businesses.",
    actionHref: "/automations",
    actionText: "Create Promotion Flow",
  },
  {
    id: "valentines",
    name: "Valentine's Day",
    mmdd: "02-14",
    type: "holiday",
    industries: ["salon", "spa", "beauty_clinic", "restaurant", "gym"],
    actionTitle: "Valentine's Day Campaign",
    actionDescription: "Couples packages, gift cards, and 'treat yourself' promotions perform well across wellness and lifestyle businesses in the lead-up to Valentine's Day.",
    actionHref: "/automations",
    actionText: "Launch Campaign",
  },
  {
    id: "mothers-day",
    name: "Mother's Day",
    mmdd: "05-12",
    type: "holiday",
    industries: ["salon", "spa", "beauty_clinic", "gym", "medical"],
    actionTitle: "Mother's Day Gift Packages",
    actionDescription: "Gift vouchers and curated packages for mothers are among the top performing seasonal offers in wellness and beauty industries.",
    actionHref: "/services",
    actionText: "Add Gift Package",
  },
  {
    id: "summer-start",
    name: "Summer Season",
    mmdd: "06-01",
    type: "season_change",
    industries: [],
    actionTitle: "Update Business Hours for Summer",
    actionDescription: "Customer availability shifts in summer. Consider extending evening hours or weekend slots. Update your AI's knowledge about seasonal hours.",
    actionHref: "/settings",
    actionText: "Update Hours",
  },
  {
    id: "back-to-school",
    name: "Back to School",
    mmdd: "08-15",
    type: "industry_event",
    industries: ["dental", "medical", "gym", "physiotherapy"],
    actionTitle: "Back-to-School Health Checkup Campaign",
    actionDescription: "Health and wellness businesses see a surge in family bookings before the school year starts. Promote checkup packages in August.",
    actionHref: "/automations",
    actionText: "Create Back-to-School Campaign",
  },
  {
    id: "halloween",
    name: "Halloween",
    mmdd: "10-31",
    type: "holiday",
    industries: ["salon", "beauty_clinic", "spa"],
    actionTitle: "Halloween Themed Promotions",
    actionDescription: "Beauty and wellness businesses can run Halloween-themed deals (e.g., 'treat yourself not trick yourself') to drive traffic in late October.",
    actionHref: "/automations",
    actionText: "Create Halloween Offer",
  },
  {
    id: "black-friday",
    name: "Black Friday",
    mmdd: "11-29",
    type: "holiday",
    industries: [],
    actionTitle: "Black Friday Service Bundle",
    actionDescription: "Offer limited-time service bundles or gift vouchers. Black Friday is no longer just for retail — local service businesses consistently see booking spikes.",
    actionHref: "/services",
    actionText: "Create Bundle",
  },
  {
    id: "christmas",
    name: "Christmas",
    mmdd: "12-25",
    type: "holiday",
    industries: [],
    actionTitle: "Holiday Season Preparation",
    actionDescription: "Update your AI with holiday hours, prepare your 'closed' auto-response, and send holiday gift vouchers to your customer list.",
    actionHref: "/settings",
    actionText: "Update Holiday Settings",
  },
  {
    id: "new-year-eve",
    name: "New Year's Eve",
    mmdd: "12-31",
    type: "holiday",
    industries: ["salon", "spa", "beauty_clinic", "gym"],
    actionTitle: "New Year's Eve Preparation Packages",
    actionDescription: "Customers want to look their best for the new year. Run pre-NYE bookings campaigns in early December.",
    actionHref: "/automations",
    actionText: "Run NYE Campaign",
  },
  {
    id: "winter-wellness",
    name: "Winter Wellness Season",
    mmdd: "12-01",
    type: "season_change",
    industries: ["medical", "physiotherapy", "gym", "chiropractic"],
    actionTitle: "Winter Wellness Campaign",
    actionDescription: "Cold and flu season drives demand for health services. Promote immunity, wellness, and preventative care services in winter.",
    actionHref: "/automations",
    actionText: "Create Wellness Campaign",
  },
  {
    id: "spring-refresh",
    name: "Spring",
    mmdd: "03-20",
    type: "season_change",
    industries: [],
    actionTitle: "Spring Refresh Promotion",
    actionDescription: "Spring is the perfect time for 'fresh start' messaging across all industries. Run a spring promotion to attract new customers.",
    actionHref: "/automations",
    actionText: "Create Spring Campaign",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDaysUntil(mmdd: string): number {
  const now = new Date();
  const [month, day] = mmdd.split("-").map(Number);
  let target = new Date(now.getFullYear(), month - 1, day);
  if (target < now) {
    target = new Date(now.getFullYear() + 1, month - 1, day);
  }
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function toISODate(mmdd: string): string {
  const now = new Date();
  const [month, day] = mmdd.split("-").map(Number);
  let year = now.getFullYear();
  const target = new Date(year, month - 1, day);
  if (target < now) year++;
  return new Date(year, month - 1, day).toISOString().split("T")[0];
}

function isIndustryMatch(entry: CalendarEntry, industry: string | undefined): boolean {
  if (entry.industries.length === 0) return true; // universal
  if (!industry) return false;
  const normalized = industry.toLowerCase();
  return entry.industries.some(ind => normalized.includes(ind));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function runSeasonalEngine(state: BusinessState): SeasonalEngineResult {
  const industry = state.organization?.industry;

  // Only show events in the next 90 days
  const upcomingEntries = SEASONAL_CALENDAR
    .filter(entry => isIndustryMatch(entry, industry))
    .map(entry => ({ entry, daysUntil: getDaysUntil(entry.mmdd) }))
    .filter(({ daysUntil }) => daysUntil <= 90)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  const upcomingEvents: SeasonalEvent[] = upcomingEntries.map(({ entry, daysUntil }) => ({
    id: entry.id,
    name: entry.name,
    date: toISODate(entry.mmdd),
    daysUntil,
    type: entry.type,
  }));

  const recommendations: SeasonalRecommendation[] = upcomingEntries.map(({ entry, daysUntil }) => ({
    id: `seasonal-rec-${entry.id}`,
    event: {
      id: entry.id,
      name: entry.name,
      date: toISODate(entry.mmdd),
      daysUntil,
      type: entry.type,
    },
    title: entry.actionTitle,
    description: entry.actionDescription,
    actionText: entry.actionText,
    actionHref: entry.actionHref,
    severity: daysUntil <= 14 ? "warning" : "opportunity",
    businessImpact: `Upcoming in ${daysUntil} day${daysUntil === 1 ? "" : "s"} — act now to capture seasonal demand`,
  }));

  return { upcomingEvents, recommendations };
}
