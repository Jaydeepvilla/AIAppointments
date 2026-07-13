import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { subscriptions, payments, billingEvents, billingAccounts } from "@/server/db/schema";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    const eventType = payload.type || "unknown";

    // 1. Audit log the billing event
    await db.insert(billingEvents).values({
      eventType,
      payload,
    });

    // 2. Handle specific Stripe events
    switch (eventType) {
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subId = payload.data?.object?.id;
        const status = payload.data?.object?.status;
        const currentPeriodEnd = new Date(payload.data?.object?.current_period_end * 1000);
        
        if (subId) {
          const subRecord = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.stripeSubscriptionId, subId),
          });
          
          if (subRecord) {
            await db
              .update(subscriptions)
              .set({
                status: status === "active" ? "active" : "trialing",
                currentPeriodEnd,
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.id, subRecord.id));
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const subId = payload.data?.object?.subscription;
        const amountPaid = (payload.data?.object?.amount_paid / 100).toFixed(2);
        const currency = payload.data?.object?.currency?.toUpperCase() || "USD";
        const chargeId = payload.data?.object?.charge || `ch_mock_${Math.random().toString(36).substring(2, 8)}`;

        if (subId) {
          const subRecord = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.stripeSubscriptionId, subId),
          });
          
          if (subRecord) {
            // Find or seed billing account
            const [acc] = await db.query.billingAccounts.findMany({
              where: eq(billingAccounts.organizationId, subRecord.organizationId),
            });
            
            if (acc) {
              await db.insert(payments).values({
                billingAccountId: acc.id,
                subscriptionId: subRecord.id,
                amount: amountPaid,
                currency,
                status: "succeeded",
                providerPaymentId: chargeId,
              });
            }
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook processing failed:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
