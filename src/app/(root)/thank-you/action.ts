// server action modules contain server-side logic in RPC functions
"use server";

import { getLoggedInUser } from "@/data/user";
import db from "@/lib/db";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  if (!orderId) throw new Error("No order ID given");

  // retrieve logged in user that wants to pay for the configured phone case
  const currentUser = await getLoggedInUser();
  if (!currentUser) throw new Error("You need to be logged in!");

  // retrieve the given paid order from the logged-in user
  // the where clause also prevents from other users to access paid orders that are not their
  const order = await db.order.findUnique({
    where: { id: orderId, userId: currentUser.id },
    // also fetch the related records of the retrieved order entry (SQL join syntax)
    include: {
      billingAddress: true,
      shippingAddress: true,
      User: true,
      OrderProduct: {
        include: {
          product: true, // fetch the products related to this order
        },
      },
    },
  });
  if (!order) throw new Error("This order does not exist");

  // map through the products and convert price to a number
  const orderWithConvertedPrices = {
    ...order,
    OrderProduct: order.OrderProduct.map((orderProduct) => ({
      ...orderProduct,
      product: {
        ...orderProduct.product,
        price: orderProduct.product.price.toNumber(), // convert 'price' of product to a number
      },
    })),
  };

  // return the retrieved order entry with the related records if the retrieved order has been paid by the user
  if (orderWithConvertedPrices.isPaid && order.User.id === currentUser.id) {
    return orderWithConvertedPrices;
  } else {
    return false;
  }
};
