import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature not found");
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object;

      if (!invoice.id) {
        throw new Error("Invoice ID not found");
      }

      // Acessar os dados corretos baseado no payload real
      const stripeSubscriptionId = invoice.parent?.subscription_details
        ?.subscription as string;
      const stripeCustomerId = invoice.customer as string;

      // O userId está nos metadados do parent subscription_details
      let userId: string | undefined;

      if (invoice.parent?.type === "subscription_details") {
        userId = invoice.parent.subscription_details?.metadata?.userId;
      }

      // Se não encontrar no parent, buscar nos line items
      if (!userId && invoice.lines?.data?.[0]?.metadata?.userId) {
        userId = invoice.lines.data[0].metadata.userId;
      }

      if (!userId) {
        throw new Error("User ID not found in invoice metadata");
      }

      if (!stripeSubscriptionId) {
        throw new Error("Subscription ID not found");
      }

      if (!stripeCustomerId) {
        throw new Error("Customer ID not found");
      }

      // Atualizar o usuário com os dados da subscription
      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId,
          stripeCustomerId,
          plan: "essential",
        })
        .where(eq(usersTable.id, userId));

      console.log(
        `Successfully updated user ${userId} with subscription ${stripeSubscriptionId}`,
      );
      break;
    }

    case "customer.subscription.deleted": {
      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }

      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      const userId = subscription.metadata.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }

      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          plan: null,
        })
        .where(eq(usersTable.id, userId));

      console.log(`Successfully removed subscription for user ${userId}`);
      break;
    }
  }

  return NextResponse.json({
    received: true,
  });
};
