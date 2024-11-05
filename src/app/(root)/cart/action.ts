// server action modules contain server-side logic in RPC functions
"use server";

import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export const createCheckoutSession = async (productIds: string[]) => {
  // retrieve logged in user that's creating a order
  const { userId } = auth();

  // re-calc the total price of products whose "id" are inside the given array 'productIds'
  // you don't want to receive the total price from the client, because the user can change and manipulate the total price client-side
  const price = await db.product.aggregate({
    where: {
      id: {
        // use "in" to match any id inside the array 'productIds'
        in: productIds,
      },
    },
    // perform sum aggregation on the field 'amount' of the retrieved product entries
    _sum: {
      price: true,
    },
  });
  // extract the total sum of 'price'
  const totalPrice = price._sum.price || 0;
  const totalPriceWithFee = Number(totalPrice) + 1;

  // create new order in db
  const order = await db.order.create({
    data: {
      isPaid: false,
      userId: userId!,
      // create new "OrderProduct" entries to link the created order with existing products by the id's inside the given 'productIds' array
      OrderProduct: {
        create: productIds.map((productId) => ({
          product: {
            // linking created order to existing product by given product-ID
            connect: { id: productId },
          },
        })),
      },
    },
  });

  // tell stripe what product the user is buying
  const product = await stripe.products.create({
    name: "Digital Product",
    // images: [`${process.env.NEXT_PUBLIC_SERVER_URL}/neoncloud-logo.png`],
    default_price_data: {
      // configure price formatting and data
      currency: "USD",
      // stripe expects the amount in cent
      unit_amount: Math.round(Number(totalPriceWithFee) * 100),
    },
  });

  // create payment session with the product the user is buying
  const stripeSession = await stripe.checkout.sessions.create({
    // redirect user to the specified route if payment was successful
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    // redirect user to the specified route if payment was cancelled
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
    // configure payment methods
    payment_method_types: ["card", "paypal"],
    // configure the type of the checkout session
    mode: "payment",
    // configure allowed countries to ship orders to
    shipping_address_collection: { allowed_countries: ["DE", "US", "NL"] },
    // configure metadata about the payment session that you can receive after a payment was successful to know which user paid and which order needs to be shipped
    metadata: {
      userId: userId,
      orderId: order.id,
    },
    // configure what the customer is purchasing
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  // return an object with an "url" prop containing the url to the checkout page hosted by Stripe
  // if user is navigated to this url, the configured payment session starts
  return { url: stripeSession.url };
};
