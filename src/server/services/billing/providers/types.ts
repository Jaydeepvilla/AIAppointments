export interface PaymentMethodData {
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  token?: string;
}

export interface PaymentProvider {
  createPaymentIntent(amount: number, currency: string, customerId: string): Promise<{
    id: string;
    clientSecret: string;
    status: string;
  }>;
  capturePayment(paymentIntentId: string): Promise<{
    id: string;
    status: "succeeded" | "failed" | "pending";
    amount: number;
  }>;
  refundPayment(paymentId: string, amount?: number, reason?: string): Promise<{
    id: string;
    status: "succeeded" | "failed" | "pending";
  }>;
}

export interface SubscriptionProvider {
  createSubscription(
    customerId: string,
    priceId: string,
    trialDays?: number,
    couponCode?: string
  ): Promise<{
    id: string;
    status: string;
    clientSecret?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }>;
  updateSubscription(
    subscriptionId: string,
    priceId: string,
    prorate?: boolean
  ): Promise<{
    id: string;
    status: string;
  }>;
  cancelSubscription(subscriptionId: string, immediately?: boolean): Promise<{
    id: string;
    status: string;
  }>;
  pauseSubscription(subscriptionId: string): Promise<{
    id: string;
    status: string;
  }>;
  resumeSubscription(subscriptionId: string): Promise<{
    id: string;
    status: string;
  }>;
}

export interface BillingProvider {
  createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<{
    id: string;
  }>;
  updateCustomer(customerId: string, email: string, name?: string): Promise<void>;
  deleteCustomer(customerId: string): Promise<void>;
  getPaymentMethods(customerId: string): Promise<Array<{
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  }>>;
  setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void>;
}

export interface InvoiceProvider {
  createInvoice(
    customerId: string,
    items: Array<{ description: string; amount: number; quantity: number }>,
    dueDate?: Date
  ): Promise<{
    id: string;
    number: string;
    status: string;
    pdfUrl?: string;
  }>;
  voidInvoice(invoiceId: string): Promise<void>;
  createCreditNote(invoiceId: string, amount: number, reason?: string): Promise<{
    id: string;
  }>;
}
