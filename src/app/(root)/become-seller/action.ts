// server action modules contains server-side logic RPC functions
"use server";

import * as z from "zod";
import db from "@/lib/db";
import { becomeSellerFormSchema } from "@/lib/zod-schemas";
import { getUserByEmail } from "@/data/user";

export const sendRequest = async (
  values: z.infer<typeof becomeSellerFormSchema>,
): Promise<{ error?: string }> => {
  // validate the form data again in the backend
  const validatedFields = becomeSellerFormSchema.safeParse(values);
  // throw error if form data is NOT valid
  if (!validatedFields.success) throw new Error("Invalid data!");

  // extract validated fields
  const { email, productDetails, category } = validatedFields.data;

  const user = await getUserByEmail(email);
  if (!user) throw new Error("User not found!");
  const existingRequestUser = await db.request.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (existingRequestUser) throw new Error("You cannot send a request again!");

  await db.request.create({
    data: {
      userId: user.id,
      productDescription: productDetails,
      category: category,
    },
  });

  // update user entry whose "id" matches the given 'userId'
  await db.user.update({
    where: { id: user.id },
    data: {
      // for the sake of usability for potential employers, immediately set status to "approved"
      seller: "pending",
    },
  });

  return { error: "" };
};
