import { BillingProvider, InvoiceProvider, PaymentProvider, SubscriptionProvider } from "./types";
import { ProviderRegistry } from "./registry";

export class StripeProvider implements PaymentProvider, SubscriptionProvider, BillingProvider, InvoiceProvider {
  // Simulates Stripe API calls

  // --- BillingProvider ---
  async createCustomer(email: string, name?: string): Promise<{ id: string }> {
    const id = `cus_stripe_${Math.random().toString(36).substring(2, 10)}`;
    return { id };
  }

  async updateCustomer(customerId: string, email: string, name?: string): Promise<void> {
    // Simulated customer update
  }

  async deleteCustomer(customerId: string): Promise<void> {
    // Simulated customer deletion
  }

  async getPaymentMethods(customerId: string) {
    return [
      {
        id: "pm_stripe_1",
        brand: "Visa",
        last4: "4242",
        expMonth: 12,
        expYear: 2029,
        isDefault: true
      }
    ];
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    // Simulated set default PM
  }

  // --- PaymentProvider ---
  async createPaymentIntent(amount: number, currency: string, customerId: string) {
    return {
      id: `pi_stripe_${Math.random().toString(36).substring(2, 10)}`,
      clientSecret: `pi_stripe_secret_${Math.random().toString(36).substring(2, 15)}`,
      status: "requires_payment_method"
    };
  }

  async capturePayment(paymentIntentId: string) {
    return {
      id: paymentIntentId,
      status: "succeeded" as const,
      amount: 100
    };
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string) {
    return {
      id: `re_stripe_${Math.random().toString(36).substring(2, 10)}`,
      status: "succeeded" as const
    };
  }

  // --- SubscriptionProvider ---
  async createSubscription(
    customerId: string,
    priceId: string,
    trialDays = 14,
    couponCode?: string
  ) {
    const now = new Date();
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(now.getDate() + 30);

    return {
      id: `sub_stripe_${Math.random().toString(36).substring(2, 10)}`,
      status: "active",
      clientSecret: `sub_stripe_secret_${Math.random().toString(36).substring(2, 15)}`,
      currentPeriodStart: now,
      currentPeriodEnd
    };
  }

  async updateSubscription(subscriptionId: string, priceId: string, prorate = true) {
    return {
      id: subscriptionId,
      status: "active"
    };
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    return {
      id: subscriptionId,
      status: "canceled"
    };
  }

  async pauseSubscription(subscriptionId: string) {
    return {
      id: subscriptionId,
      status: "paused"
    };
  }

  async resumeSubscription(subscriptionId: string) {
    return {
      id: subscriptionId,
      status: "active"
    };
  }

  // --- InvoiceProvider ---
  async createInvoice(
    customerId: string,
    items: Array<{ description: string; amount: number; quantity: number }>,
    dueDate?: Date
  ) {
    const total = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);
    return {
      id: `in_stripe_${Math.random().toString(36).substring(2, 10)}`,
      number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "open",
      pdfUrl: "https://stripe.com/invoice/mock.pdf"
    };
  }

  async voidInvoice(invoiceId: string): Promise<void> {
    // Simulated void
  }

  async createCreditNote(invoiceId: string, amount: number, reason?: string) {
    return {
      id: `cn_stripe_${Math.random().toString(36).substring(2, 10)}`
    };
  }
}

// Automatically register on load
const stripe = new StripeProvider();
ProviderRegistry.registerPaymentProvider("stripe", stripe);
ProviderRegistry.registerSubscriptionProvider("stripe", stripe);
ProviderRegistry.registerBillingProvider("stripe", stripe);
ProviderRegistry.registerInvoiceProvider("stripe", stripe);
