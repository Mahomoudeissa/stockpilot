import { createClient } from "../supabase/client";

export type Category = {
  id: number;
  name: string;
};

export type CreateCategoryInput = {
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name.trim(),
    })
    .select("id, name")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    }

    throw new Error(error.message);
  }

  return data;
}

export async function updateCategory(
  categoryId: number,
  input: CreateCategoryInput,
): Promise<Category> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: input.name.trim(),
    })
    .eq("id", categoryId)
    .select("id, name")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    }

    if (error.code === "PGRST116") {
      throw new Error("CATEGORY_NOT_FOUND_OR_PERMISSION_DENIED");
    }

    throw new Error(error.message);
  }

  return data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23503") {
      throw new Error("CATEGORY_IN_USE");
    }

    if (error.code === "PGRST116") {
      throw new Error("CATEGORY_NOT_FOUND_OR_PERMISSION_DENIED");
    }

    throw new Error(error.message);
  }
}
