// server action modules contain server-side logic in RPC functions
"use server";

import db from "@/lib/db";
import { Status } from "@prisma/client";

export const changeProductStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: Status;
}) => {
  // update product entry whose 'id' matches the given 'id'
  await db.product.update({
    where: { id: id },
    data: { status: newStatus },
  });
};

export const changeSellerStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: Status;
}) => {
  // update user entry whose 'id' matches the given 'userId'
  await db.user.update({
    where: { id: id },
    data: {
      seller: newStatus,
    },
  });
};

export const deleteProduct = async (productId: string) => {
  // update product entry whose 'id' matches the given 'productId'
  await db.product.update({
    where: { id: productId },
    data: {
      terminated: true,
      // also removes from from product listings
      status: "denied",
    },
  });
};

export const deleteSeller = async (userId: string) => {
  // change seller status to 'denied' of user whose 'id' matches the given 'userId'
  await db.user.update({
    where: { id: userId },
    data: {
      seller: "denied",
    },
  });
};

export const deleteRequest = async ({
  status,
  requestId,
  userId,
}: {
  status: Status;
  requestId: string;
  userId: string;
}) => {
  // update user's seller status to the given status
  await db.user.update({
    where: { id: userId },
    data: {
      seller: status,
    },
  });

  // delete request entry whose 'id' matches the given 'requestId'
  await db.request.delete({
    where: { id: requestId },
  });
};
