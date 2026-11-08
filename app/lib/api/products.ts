import { createClient } from "../supabase/client";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      sku,
      description,
      price,
      quantity,
      low_stock_threshold,
      image_url,
      category_id,
      created_at,
      updated_at,
      category:categories(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as Product[];
}

export type CreateProductInput = {
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  low_stock_threshold: number;
  image_url: string | null;
  category_id: number;
};

export async function createProduct(input: CreateProductInput) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name.trim(),
      sku: input.sku.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      quantity: input.quantity,
      low_stock_threshold: input.low_stock_threshold,
      image_url: input.image_url?.trim() || null,
      category_id: input.category_id,
    })
    .select("id")
    .single();
  if (error) {
    console.error("Supabase createProduct error:", error.code, error.message);

    if (error.code === "23505") {
      throw new Error("SKU_ALREADY_EXISTS");
    }

    throw new Error(error.message);
  }

  return data;
}

export async function deleteProduct(productId: number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateProduct(
  productId: number,
  input: CreateProductInput,
): Promise<{ id: number }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      sku: input.sku.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      quantity: input.quantity,
      low_stock_threshold: input.low_stock_threshold,
      image_url: input.image_url?.trim() || null,
      category_id: input.category_id,
    })
    .eq("id", productId)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("SKU_ALREADY_EXISTS");
    }

    if (error.code === "PGRST116") {
      throw new Error("PRODUCT_NOT_FOUND_OR_PERMISSION_DENIED");
    }

    throw new Error(error.message);
  }

  return data;
}

export type GetProductsPageParams = {
  page: number;
  pageSize: number;
  search: string;
  categoryId: number | null;
};

export type ProductsPageResult = {
  products: Product[];
  totalCount: number;
};

export async function getProductsPage({
  page,
  pageSize,
  search,
  categoryId,
}: GetProductsPageParams): Promise<ProductsPageResult> {
  const supabase = createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("products").select(
    `
        id,
        name,
        sku,
        description,
        price,
        quantity,
        low_stock_threshold,
        image_url,
        category_id,
        created_at,
        updated_at,
        category:categories(name)
      `,
    { count: "exact" },
  );

  const searchTerm = search
    .trim()
    .replace(/[,.()%_*"\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
  }

  if (categoryId !== null) {
    query = query.eq("category_id", categoryId);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    products: (data ?? []) as unknown as Product[],
    totalCount: count ?? 0,
  };
}
