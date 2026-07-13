import { db } from "../../db";
import { 
  countries, 
  languages, 
  currencies, 
  translations, 
  holidays,
  businessLocalization
} from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const LocalizationEngine = {
  /* ─────────────────────────────────────────────────────────
   * Formatters Sub-Engine
   * ───────────────────────────────────────────────────────── */
  
  formatNumber(value: number, decimalSeparator = ".", thousandSeparator = ","): string {
    const parts = value.toFixed(2).split(".");
    let num = parts[0];
    const dec = parts[1];
    
    // Simple custom thousand grouping
    num = num.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    return `${num}${decimalSeparator}${dec}`;
  },

  formatCurrency(amount: number, currency: {
    code: string;
    symbol: string;
    position: string; // 'prefix' | 'suffix'
    decimalSeparator: string;
    thousandSeparator: string;
  }): string {
    const formattedNum = this.formatNumber(amount, currency.decimalSeparator, currency.thousandSeparator);
    return currency.position === "prefix"
      ? `${currency.symbol}${formattedNum}`
      : `${formattedNum}${currency.symbol}`;
  },

  formatDate(date: Date, pattern: string): string {
    const yyyy = date.getFullYear().toString();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    switch (pattern.toUpperCase()) {
      case "DD/MM/YYYY":
        return `${dd}/${mm}/${yyyy}`;
      case "MM/DD/YYYY":
        return `${mm}/${dd}/${yyyy}`;
      case "YYYY-MM-DD":
      default:
        return `${yyyy}-${mm}-${dd}`;
    }
  },

  formatTime(date: Date, formatPattern: "12h" | "24h"): string {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    if (formatPattern === "12h") {
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  },

  /* ─────────────────────────────────────────────────────────
   * Phone Formatting (E.164 Clean)
   * ───────────────────────────────────────────────────────── */
  formatPhone(phone: string, phoneCode: string): string {
    // Strip non-numeric
    const digits = phone.replace(/\D/g, "");
    const cleanCode = phoneCode.replace(/\D/g, "");

    if (digits.startsWith(cleanCode)) {
      return `+${digits}`;
    }
    return `+${cleanCode}${digits}`;
  },

  /* ─────────────────────────────────────────────────────────
   * Translation Engine with dynamic parameters & database fallback
   * ───────────────────────────────────────────────────────── */
  async translate(options: {
    key: string;
    languageCode: string;
    namespace?: string;
    variables?: Record<string, string>;
  }): Promise<string> {
    const { key, languageCode, namespace = "common", variables = {} } = options;

    try {
      // Find exact translated key in database
      const row = await db.query.translations.findFirst({
        where: and(
          eq(translations.languageCode, languageCode),
          eq(translations.namespace, namespace),
          eq(translations.key, key)
        ),
      });

      let template = row ? row.value : null;

      // Fallback: Check fallback language 'en' if not found
      if (!template && languageCode !== "en") {
        const fallbackRow = await db.query.translations.findFirst({
          where: and(
            eq(translations.languageCode, "en"),
            eq(translations.namespace, namespace),
            eq(translations.key, key)
          ),
        });
        template = fallbackRow ? fallbackRow.value : null;
      }

      // Final default: return the key itself
      if (!template) return key;

      // Replace variables: {name} or {{name}}
      let translated = template;
      for (const [vKey, vVal] of Object.entries(variables)) {
        translated = translated
          .replace(new RegExp(`\\{\\{${vKey}\\}\\}`, "g"), vVal)
          .replace(new RegExp(`\\{${vKey}\\}`, "g"), vVal);
      }

      return translated;
    } catch (err) {
      console.error("[LocalizationEngine] Translate failed:", err);
      return key;
    }
  },

  /* ─────────────────────────────────────────────────────────
   * Tax Engine Calculator
   * ───────────────────────────────────────────────────────── */
  calculateTax(amount: number, taxType: string, customRate?: number): {
    taxAmount: number;
    totalAmount: number;
    rateUsed: number;
  } {
    let rate = 0.0;
    if (customRate !== undefined) {
      rate = customRate;
    } else {
      switch (taxType.toUpperCase()) {
        case "GST":
          rate = 18.0; // 18% standard India GST
          break;
        case "VAT":
          rate = 19.0; // 19% standard EU VAT (Germany default)
          break;
        case "SALESTAX":
          rate = 8.25; // 8.25% average US Sales Tax
          break;
        default:
          rate = 0.0;
      }
    }

    const taxAmount = amount * (rate / 100);
    const totalAmount = amount + taxAmount;

    return {
      taxAmount,
      totalAmount,
      rateUsed: rate,
    };
  },
};
