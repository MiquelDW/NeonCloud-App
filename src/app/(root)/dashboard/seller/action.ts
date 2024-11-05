// server action modules contain server-side logic in RPC functions
"use server";

import * as z from "zod";
import { changeProductNameFormSchema } from "@/lib/zod-schemas";
import db from "@/lib/db";

export const changeProductName = async ({
  values,
  userId,
  productId,
}: {
  values: z.infer<typeof changeProductNameFormSchema>;
  userId: string;
  productId: string;
}) => {
  // validate the form data again in the backend
  const validatedFields = changeProductNameFormSchema.safeParse(values);
  // throw error if form data is NOT valid
  if (!validatedFields.success) throw new Error("Invalid data!");

  // extract validated fields
  const { name } = validatedFields.data;

  // update the productname field of the product entry whose id's matches the given product and user id's
  await db.product.update({
    where: { id: productId, userId: userId },
    data: { name: name },
  });
};
