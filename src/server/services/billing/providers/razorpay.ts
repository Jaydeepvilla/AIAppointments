import { BillingProvider, InvoiceProvider, PaymentProvider, SubscriptionProvider } from "./types";
import { ProviderRegistry } from "./registry";

export class RazorpayProvider implements PaymentProvider, SubscriptionProvider, BillingProvider, InvoiceProvider {
  // Simulates Razorpay API calls

  // --- BillingProvider ---
  async createCustomer(email: string, name?: string): Promise<{ id: string }> {
    const id = `cust_razor_${Math.random().toString(36).substring(2, 10)}`;
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
        id: "pay_razor_1",
        brand: "UPI",
        last4: "netbanking",
        expMonth: 0,
        expYear: 0,
        isDefault: true
      }
    ];
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    // Simulated default PM
  }

  // --- PaymentProvider ---
  async createPaymentIntent(amount: number, currency: string, customerId: string) {
    return {
      id: `order_razor_${Math.random().toString(36).substring(2, 10)}`,
      clientSecret: `razor_key_${Math.random().toString(36).substring(2, 15)}`,
      status: "created"
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
      id: `rfnd_razor_${Math.random().toString(36).substring(2, 10)}`,
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
      id: `sub_razor_${Math.random().toString(36).substring(2, 10)}`,
      status: "authenticated",
      clientSecret: `razor_sub_secret_${Math.random().toString(36).substring(2, 15)}`,
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
      status: "cancelled"
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
    return {
      id: `inv_razor_${Math.random().toString(36).substring(2, 10)}`,
      number: `INVR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "issued",
      pdfUrl: "https://razorpay.com/invoice/mock.pdf"
    };
  }

  async voidInvoice(invoiceId: string): Promise<void> {
    // Simulated void
  }

  async createCreditNote(invoiceId: string, amount: number, reason?: string) {
    return {
      id: `cn_razor_${Math.random().toString(36).substring(2, 10)}`
    };
  }
}

// Automatically register on load
const razorpay = new RazorpayProvider();
ProviderRegistry.registerPaymentProvider("razorpay", razorpay);
ProviderRegistry.registerSubscriptionProvider("razorpay", razorpay);
ProviderRegistry.registerBillingProvider("razorpay", razorpay);
ProviderRegistry.registerInvoiceProvider("razorpay", razorpay);
