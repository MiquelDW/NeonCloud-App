// server action modules contains server-side logic RPC functions
"use server";

import db from "@/lib/db";
import { TQueryValidator } from "@/lib/zod-schemas";
import { Status } from "@prisma/client";

export const getProducts = async (query: TQueryValidator) => {
  // retrieve product entry whose field values matches the given values
  const products = await db.product.findMany({
    where: {
      category: query.category,
      status: "approved",
    },
    take: query.limit || 4,
    orderBy: {
      createdAt: query.sort,
    },
  });

  // convert prop 'price' of each product to type 'number'
  const retrievedProducts = products.map((product) => {
    return { ...product, price: Number(product.price) };
  });

  return retrievedProducts;
};

export const getProductById = async (productId: string, status: Status) => {
  // get product entry whose field values matches the given values
  const product = await db.product.findUnique({
    where: {
      id: productId,
      status: status,
    },
  });

  // convert prop 'price' of each product to type 'number'
  const retrievedProduct = { ...product!, price: Number(product!.price) };

  return retrievedProduct;
};
