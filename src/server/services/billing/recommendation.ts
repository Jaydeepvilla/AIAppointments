import { db } from "../../db";
import { 
  paymentProviders, 
  paymentProviderRegions, 
  paymentProviderCurrencies, 
  paymentProviderLanguages, 
  paymentProviderCapabilities,
  businessPaymentSettings
} from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { ProviderRegistry } from "./providers/registry";

export interface ProviderCompatInfo {
  providerId: string;
  name: string;
  description: string;
  isRecommended: boolean;
  recommendationReason: string | null;
  supportedCurrencies: string[];
  supportedLanguages: string[];
  capabilities: {
    oneTime: boolean;
    subscriptions: boolean;
    refunds: boolean;
    applePay: boolean;
    googlePay: boolean;
    upi: boolean;
    netbanking: boolean;
    bnpl: boolean;
  };
}

export const PaymentRecommendationEngine = {
  /**
   * Automatically detects and returns only compatible providers for a business profile
   */
  async getCompatibleProviders(options: {
    country: string; // e.g. 'US', 'IN', 'DE'
    currency: string; // e.g. 'USD', 'INR', 'EUR'
    language: string; // e.g. 'en', 'hi', 'de'
  }): Promise<{
    recommended: ProviderCompatInfo[];
    supported: ProviderCompatInfo[];
  }> {
    const { country, currency, language } = options;

    try {
      // 1. Get all active providers from DB
      const providers = await db.query.paymentProviders.findMany({
        where: eq(paymentProviders.isEnabled, true),
      });

      const recommended: ProviderCompatInfo[] = [];
      const supported: ProviderCompatInfo[] = [];

      for (const provider of providers) {
        // Check if supported in this country
        const regionMatch = await db.query.paymentProviderRegions.findFirst({
          where: and(
            eq(paymentProviderRegions.providerId, provider.id),
            eq(paymentProviderRegions.countryCode, country.toUpperCase())
          ),
        });

        // Skip if not supported in the business's country
        if (!regionMatch) continue;

        // Check currency support
        const allCurrencies = await db.query.paymentProviderCurrencies.findMany({
          where: eq(paymentProviderCurrencies.providerId, provider.id),
        });
        const supportedCurrencies = allCurrencies.map((c) => c.currencyCode);
        
        // Skip if provider doesn't support the billing currency
        if (!supportedCurrencies.includes(currency.toUpperCase())) continue;

        // Fetch supported languages & capabilities
        const allLanguages = await db.query.paymentProviderLanguages.findMany({
          where: eq(paymentProviderLanguages.providerId, provider.id),
        });
        const supportedLanguages = allLanguages.map((l) => l.languageCode);

        const caps = await db.query.paymentProviderCapabilities.findFirst({
          where: eq(paymentProviderCapabilities.providerId, provider.id),
        });

        const compatInfo: ProviderCompatInfo = {
          providerId: provider.id,
          name: provider.name,
          description: provider.description || "",
          isRecommended: regionMatch.isRecommended,
          recommendationReason: regionMatch.recommendationReason,
          supportedCurrencies,
          supportedLanguages,
          capabilities: {
            oneTime: caps?.oneTime ?? true,
            subscriptions: caps?.subscriptions ?? false,
            refunds: caps?.refunds ?? false,
            applePay: caps?.applePay ?? false,
            googlePay: caps?.googlePay ?? false,
            upi: caps?.upi ?? false,
            netbanking: caps?.netbanking ?? false,
            bnpl: caps?.bnpl ?? false,
          },
        };

        if (regionMatch.isRecommended) {
          recommended.push(compatInfo);
        } else {
          supported.push(compatInfo);
        }
      }

      return { recommended, supported };
    } catch (e) {
      console.error("[PaymentRecommendationEngine] Error getting compatible providers:", e);
      return { recommended: [], supported: [] };
    }
  },
};
