import { BillingProvider, InvoiceProvider, PaymentProvider, SubscriptionProvider } from "./types";

export class ProviderRegistry {
  private static paymentProviders: Map<string, PaymentProvider> = new Map();
  private static subscriptionProviders: Map<string, SubscriptionProvider> = new Map();
  private static billingProviders: Map<string, BillingProvider> = new Map();
  private static invoiceProviders: Map<string, InvoiceProvider> = new Map();

  static registerPaymentProvider(name: string, provider: PaymentProvider) {
    this.paymentProviders.set(name.toLowerCase(), provider);
  }

  static registerSubscriptionProvider(name: string, provider: SubscriptionProvider) {
    this.subscriptionProviders.set(name.toLowerCase(), provider);
  }

  static registerBillingProvider(name: string, provider: BillingProvider) {
    this.billingProviders.set(name.toLowerCase(), provider);
  }

  static registerInvoiceProvider(name: string, provider: InvoiceProvider) {
    this.invoiceProviders.set(name.toLowerCase(), provider);
  }

  static getPaymentProvider(name: string): PaymentProvider {
    const provider = this.paymentProviders.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Payment provider not found: ${name}`);
    }
    return provider;
  }

  static getSubscriptionProvider(name: string): SubscriptionProvider {
    const provider = this.subscriptionProviders.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Subscription provider not found: ${name}`);
    }
    return provider;
  }

  static getBillingProvider(name: string): BillingProvider {
    const provider = this.billingProviders.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Billing provider not found: ${name}`);
    }
    return provider;
  }

  static getInvoiceProvider(name: string): InvoiceProvider {
    const provider = this.invoiceProviders.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Invoice provider not found: ${name}`);
    }
    return provider;
  }

  static listProviders(): string[] {
    return Array.from(this.paymentProviders.keys());
  }
}

