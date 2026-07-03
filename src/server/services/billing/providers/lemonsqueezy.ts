import { BillingProvider, InvoiceProvider, PaymentProvider, SubscriptionProvider } from "./types";
import { ProviderRegistry } from "./registry";

export class LemonSqueezyProvider implements PaymentProvider, SubscriptionProvider, BillingProvider, InvoiceProvider {
  async createCustomer(email: string, name?: string): Promise<{ id: string }> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async updateCustomer(customerId: string, email: string, name?: string): Promise<void> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async deleteCustomer(customerId: string): Promise<void> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async getPaymentMethods(customerId: string): Promise<any[]> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async createPaymentIntent(amount: number, currency: string, customerId: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async capturePayment(paymentIntentId: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async createSubscription(customerId: string, priceId: string, trialDays?: number, couponCode?: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async updateSubscription(subscriptionId: string, priceId: string, prorate?: boolean): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async cancelSubscription(subscriptionId: string, immediately?: boolean): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async pauseSubscription(subscriptionId: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async resumeSubscription(subscriptionId: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async createInvoice(customerId: string, items: any[], dueDate?: Date): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async voidInvoice(invoiceId: string): Promise<void> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
  async createCreditNote(invoiceId: string, amount: number, reason?: string): Promise<any> {
    throw new Error("Lemon Squeezy billing is not implemented yet.");
  }
}

const lemonsqueezy = new LemonSqueezyProvider();
ProviderRegistry.registerPaymentProvider("lemonsqueezy", lemonsqueezy);
ProviderRegistry.registerSubscriptionProvider("lemonsqueezy", lemonsqueezy);
ProviderRegistry.registerBillingProvider("lemonsqueezy", lemonsqueezy);
ProviderRegistry.registerInvoiceProvider("lemonsqueezy", lemonsqueezy);
