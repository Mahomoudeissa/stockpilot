import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(120, "Product name is too long"),

  sku: z.string().trim().min(1, "SKU is required").max(64, "SKU is too long"),

  description: z.string().max(1000, "Description is too long"),

  price: z
    .number({ invalid_type_error: "Enter a valid price" })
    .finite()
    .nonnegative("Price cannot be negative"),

  quantity: z
    .number({ invalid_type_error: "Enter a valid quantity" })
    .int("Quantity must be a whole number")
    .nonnegative("Quantity cannot be negative"),

  low_stock_threshold: z
    .number({ invalid_type_error: "Enter a valid threshold" })
    .int("Threshold must be a whole number")
    .nonnegative("Threshold cannot be negative"),

  image_url: z.union([
    z.literal(""),
    z.string().url("Enter a valid image URL"),
  ]),

  category_id: z
    .number({ invalid_type_error: "Choose a category" })
    .int()
    .positive("Choose a valid category"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
