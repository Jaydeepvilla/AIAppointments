import { BillingProvider, InvoiceProvider, PaymentProvider, SubscriptionProvider } from "./types";
import { ProviderRegistry } from "./registry";
import Stripe from "stripe";

// Initialize Stripe Client lazily if the key is available
let stripeClient: Stripe | null = null;
function getStripeClient() {
  if (stripeClient) return stripeClient;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    return null;
  }
  stripeClient = new Stripe(apiKey, {
    apiVersion: "2025-01-27-28827827827" as any, // fallback/latest API version
  });
  return stripeClient;
}

export class StripeProvider implements PaymentProvider, SubscriptionProvider, BillingProvider, InvoiceProvider {

  // --- BillingProvider ---
  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<{ id: string }> {
    const stripe = getStripeClient();
    if (!stripe) {
      console.warn("[Stripe] STRIPE_SECRET_KEY not set. Simulating customer creation.");
      return { id: `cus_stripe_${Math.random().toString(36).substring(2, 10)}` };
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });
    return { id: customer.id };
  }

  async updateCustomer(customerId: string, email: string, name?: string): Promise<void> {
    const stripe = getStripeClient();
    if (!stripe) return;
    await stripe.customers.update(customerId, { email, name });
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const stripe = getStripeClient();
    if (!stripe) return;
    await stripe.customers.del(customerId);
  }

  async getPaymentMethods(customerId: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return [
        {
          id: "pm_stripe_1",
          brand: "Visa",
          last4: "4242",
          expMonth: 12,
          expYear: 2029,
          isDefault: true,
        },
      ];
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    const customer = await stripe.customers.retrieve(customerId);
    const defaultPmId = (customer as Stripe.Customer).invoice_settings?.default_payment_method;

    return paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || "Card",
      last4: pm.card?.last4 || "0000",
      expMonth: pm.card?.exp_month || 12,
      expYear: pm.card?.exp_year || new Date().getFullYear() + 5,
      isDefault: pm.id === defaultPmId,
    }));
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    const stripe = getStripeClient();
    if (!stripe) return;

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  // --- PaymentProvider ---
  async createPaymentIntent(amount: number, currency: string, customerId: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: `pi_stripe_${Math.random().toString(36).substring(2, 10)}`,
        clientSecret: `pi_stripe_secret_${Math.random().toString(36).substring(2, 15)}`,
        status: "requires_payment_method",
      };
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      customer: customerId,
    });

    return {
      id: intent.id,
      clientSecret: intent.client_secret || "",
      status: intent.status,
    };
  }

  async capturePayment(paymentIntentId: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: paymentIntentId,
        status: "succeeded" as const,
        amount: 100,
      };
    }

    const intent = await stripe.paymentIntents.capture(paymentIntentId);
    return {
      id: intent.id,
      status: intent.status === "succeeded" ? ("succeeded" as const) : ("failed" as const),
      amount: intent.amount_received / 100,
    };
  }

  async refundPayment(paymentId: string, amount?: number, reason?: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: `re_stripe_${Math.random().toString(36).substring(2, 10)}`,
        status: "succeeded" as const,
      };
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as any,
    });

    return {
      id: refund.id,
      status: refund.status === "succeeded" ? ("succeeded" as const) : ("failed" as const),
    };
  }

  // --- SubscriptionProvider ---
  async createSubscription(
    customerId: string,
    priceId: string,
    trialDays = 14,
    couponCode?: string
  ) {
    const stripe = getStripeClient();
    if (!stripe) {
      const now = new Date();
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(now.getDate() + 30);
      return {
        id: `sub_stripe_${Math.random().toString(36).substring(2, 10)}`,
        status: "active",
        clientSecret: `sub_stripe_secret_${Math.random().toString(36).substring(2, 15)}`,
        currentPeriodStart: now,
        currentPeriodEnd,
      };
    }

    const subscription = (await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays > 0 ? trialDays : undefined,
      coupon: couponCode,
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    } as any)) as any;

    const latestInvoice = subscription.latest_invoice;
    const paymentIntent = latestInvoice?.payment_intent;

    return {
      id: subscription.id,
      status: subscription.status,
      clientSecret: paymentIntent?.client_secret || undefined,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
  }

  async updateSubscription(subscriptionId: string, priceId: string, prorate = true) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: subscriptionId,
        status: "active",
      };
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      proration_behavior: prorate ? "create_prorations" : "none",
    });

    return {
      id: updated.id,
      status: updated.status,
    };
  }

  async cancelSubscription(subscriptionId: string, immediately = false) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: subscriptionId,
        status: "canceled",
      };
    }

    let sub;
    if (immediately) {
      sub = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      sub = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    return {
      id: sub.id,
      status: sub.status,
    };
  }

  async pauseSubscription(subscriptionId: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: subscriptionId,
        status: "paused",
      };
    }

    const sub = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: "void",
      },
    });

    return {
      id: sub.id,
      status: "paused",
    };
  }

  async resumeSubscription(subscriptionId: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: subscriptionId,
        status: "active",
      };
    }

    const sub = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    });

    return {
      id: sub.id,
      status: sub.status,
    };
  }

  // --- InvoiceProvider ---
  async createInvoice(
    customerId: string,
    items: Array<{ description: string; amount: number; quantity: number }>,
    dueDate?: Date
  ) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: `in_stripe_${Math.random().toString(36).substring(2, 10)}`,
        number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "open",
        pdfUrl: "https://stripe.com/invoice/mock.pdf",
      };
    }

    // Create invoice items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customerId,
        amount: Math.round(item.amount * 100),
        currency: "usd",
        description: item.description,
      });
    }

    // Create final invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      due_date: dueDate ? Math.floor(dueDate.getTime() / 1000) : undefined,
      collection_method: dueDate ? "send_invoice" : "charge_automatically",
    });

    // Finalize invoice so it gets invoice number & PDF URL
    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);

    return {
      id: finalized.id,
      number: finalized.number || `INV-${finalized.id}`,
      status: finalized.status || "draft",
      pdfUrl: finalized.invoice_pdf || undefined,
    };
  }

  async voidInvoice(invoiceId: string): Promise<void> {
    const stripe = getStripeClient();
    if (!stripe) return;
    await stripe.invoices.voidInvoice(invoiceId);
  }

  async createCreditNote(invoiceId: string, amount: number, reason?: string) {
    const stripe = getStripeClient();
    if (!stripe) {
      return {
        id: `cn_stripe_${Math.random().toString(36).substring(2, 10)}`,
      };
    }

    const creditNote = await stripe.creditNotes.create({
      invoice: invoiceId,
      amount: Math.round(amount * 100),
      reason: reason as any,
    });

    return {
      id: creditNote.id,
    };
  }
}

// Automatically register on load
const stripe = new StripeProvider();
ProviderRegistry.registerPaymentProvider("stripe", stripe);
ProviderRegistry.registerSubscriptionProvider("stripe", stripe);
ProviderRegistry.registerBillingProvider("stripe", stripe);
ProviderRegistry.registerInvoiceProvider("stripe", stripe);
