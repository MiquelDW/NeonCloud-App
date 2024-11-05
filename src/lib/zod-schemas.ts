// Zod is a TypeScript-first validation library that allows you to define schemas for your data and then validate that data against those schemas. It is often used to validate form data, API responses, or any kind of input that needs to adhere to a specific structure
import { ProductCategories } from "@prisma/client";
import * as z from "zod";

const categories = z.enum([ProductCategories.ui_kits, ProductCategories.icons]);

export const createProductFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  productDetails: z
    .string()
    .min(1, "Product details are required")
    .max(350, "Product details should not exceed 350 characters"),
  price: z.string().min(1, "Price is required"),
  category: categories,
  productFile: z.string().min(1, "Product file is required"),
  productImages: z
    .array(z.string().min(1, "Image URL is required"))
    .min(1, "At least one image is required")
    .max(3, "You can only provide up to 3 images"),
});

export const becomeSellerFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  productDetails: z
    .string()
    .min(1, "Details about what you would like to sell is required!")
    .max(300, "Product details should not exceed 300 characters"),
  category: categories,
});

export const changeProductNameFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
});

export const QueryValidator = z.object({
  category: categories.optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional(),
});

export type TQueryValidator = z.infer<typeof QueryValidator>;
