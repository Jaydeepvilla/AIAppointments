import { db } from "../../db";
import { organizations, businessSettings, voiceSettings, callRoutingRules } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const voiceRouting = {
  /**
   * Helper to get local date and time details for a timezone
   */
  getLocalTimeDetails(timezone: string, date = new Date()) {
    try {
      const dayFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "long",
      });
      const dayName = dayFormatter.format(date).toLowerCase(); // e.g. "monday"

      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const timeStr = timeFormatter.format(date); // e.g. "14:30"

      const partsFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const parts = partsFormatter.formatToParts(date);
      const year = parts.find((p) => p.type === "year")?.value;
      const month = parts.find((p) => p.type === "month")?.value;
      const day = parts.find((p) => p.type === "day")?.value;
      const localDateStr = `${year}-${month}-${day}`; // e.g. "2026-06-21"

      return { dayName, timeStr, localDateStr };
    } catch (e) {
      console.error(`[Voice Routing] Error formatting timezone ${timezone}:`, e);
      // Fallback to UTC/system time
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const timeStr = date.toTimeString().slice(0, 5);
      const localDateStr = date.toISOString().slice(0, 10);
      return { dayName, timeStr, localDateStr };
    }
  },

  /**
   * Evaluates if the current time falls within the organization's business hours.
   */
  async isWithinBusinessHours(organizationId: string): Promise<boolean> {
    try {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.id, organizationId),
      });

      const timezone = org?.timezone || "UTC";

      const settings = await db.query.businessSettings.findFirst({
        where: eq(businessSettings.organizationId, organizationId),
      });

      if (!settings) {
        return true; // Default to open if no settings found
      }

      const { dayName, timeStr, localDateStr } = this.getLocalTimeDetails(timezone);

      // Check holidays
      if (settings.holidays && settings.holidays.includes(localDateStr)) {
        return false;
      }

      const hours = settings.businessHours as Record<string, { open: string; close: string; closed: boolean }> | null;
      if (!hours || !hours[dayName]) {
        return true;
      }

      const todayHours = hours[dayName];
      if (todayHours.closed) {
        return false;
      }

      // String comparison works perfectly for "HH:MM"
      return timeStr >= todayHours.open && timeStr <= todayHours.close;
    } catch (e) {
      console.error("[Voice Routing] Error checking business hours:", e);
      return true; // Fallback to open
    }
  },

  /**
   * Resolves routing rules to select an action: 'ai-receptionist' | 'staff-dial' | 'voicemail' | 'queue'
   */
  async getCallRoutingAction(
    organizationId: string,
    triggerTypeOverride?: "business-hours" | "after-hours" | "busy" | "no-answer"
  ): Promise<{
    action: "ai-receptionist" | "staff-dial" | "voicemail" | "queue";
    targetId?: string | null;
    targetNumber?: string | null;
  }> {
    try {
      // 1. Determine trigger type (business hours vs after hours) if not overridden
      let trigger: "business-hours" | "after-hours" | "busy" | "no-answer" = triggerTypeOverride || "business-hours";
      if (!triggerTypeOverride) {
        const isOpen = await this.isWithinBusinessHours(organizationId);
        trigger = isOpen ? "business-hours" : "after-hours";
      }
      // 2. Fetch routing rules sorted by priority
      const rules = await db.query.callRoutingRules.findMany({
        where: and(
          eq(callRoutingRules.organizationId, organizationId),
          eq(callRoutingRules.triggerType, trigger),
          eq(callRoutingRules.isActive, true)
        ),
        orderBy: [desc(callRoutingRules.priority)],
      });

      if (rules.length > 0) {
        const primaryRule = rules[0];
        return {
          action: primaryRule.routingAction as "ai-receptionist" | "staff-dial" | "voicemail" | "queue",
          targetId: primaryRule.targetId,
          targetNumber: primaryRule.routingAction === "staff-dial" ? primaryRule.targetId : undefined,
        };
      }

      // 3. Fallback to voice settings configuration if no rules match
      const voiceConf = await db.query.voiceSettings.findFirst({
        where: eq(voiceSettings.organizationId, organizationId),
      });

      if (!voiceConf) {
        return { action: "ai-receptionist" };
      }

      if (trigger === "after-hours") {
        if (voiceConf.voicemailActive) {
          return { action: "voicemail" };
        }
      }

      // Evaluate businessHoursMode fallback
      switch (voiceConf.businessHoursMode) {
        case "forward":
          if (voiceConf.fallbackNumber) {
            return {
              action: "staff-dial",
              targetNumber: voiceConf.fallbackNumber,
            };
          }
          break;
        case "hybrid":
          // Hybrid might mean dialing first, then going to AI or vice-versa. Default to AI.
          return { action: "ai-receptionist" };
        case "ai-only":
        default:
          return { action: "ai-receptionist" };
      }

      return { action: "ai-receptionist" };
    } catch (e) {
      console.error("[Voice Routing] getCallRoutingAction failed:", e);
      return { action: "ai-receptionist" };
    }
  },
};
