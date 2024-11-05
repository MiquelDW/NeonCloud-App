// server action modules contain server-side logic in RPC functions
"use server";

import { getLoggedInUser } from "@/data/user";
import db from "@/lib/db";
import { createProductFormSchema } from "@/lib/zod-schemas";
import * as z from "zod";

export const saveProduct = async (
  values: z.infer<typeof createProductFormSchema>,
) => {
  // retrieve logged in user that's sending the friend request
  const currentUser = await getLoggedInUser();
  if (!currentUser)
    throw new Error("You need to be logged in to send a friend request!");
  if (
    currentUser.seller !== "approved" &&
    currentUser.email !== process.env.ADMIN_EMAIL
  )
    throw new Error("You need to be a seller to create a new product!");

  // validate the form data again in the backend
  const validatedFields = createProductFormSchema.safeParse(values);
  // throw error if form data is NOT valid
  if (!validatedFields.success) throw new Error("Invalid data!");

  // extract validated fields
  const { name, productDetails, price, category, productFile, productImages } =
    validatedFields.data;
  const priceNumber = Number(price);

  // add product to db
  await db.product.create({
    data: {
      userId: currentUser.id,
      name: name,
      description: productDetails,
      price: priceNumber,
      category: category,
      status: "pending",
      productFile: productFile,
      productImages: productImages,
    },
  });
};
