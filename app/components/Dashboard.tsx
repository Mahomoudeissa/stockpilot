import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "../lib/supabase/server";
import DashboardContent from "./DashboardContent";

export default async function Dashboard() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const [
    { count: productsCount, error: productsCountError },
    { count: categoriesCount, error: categoriesCountError },
    { data: products, error: productsError },
    { data: profile },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),

    supabase.from("categories").select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("id, name, sku, price, quantity, category_id")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (productsCountError || categoriesCountError || productsError) {
    console.error("Dashboard data error:", {
      productsCountError,
      categoriesCountError,
      productsError,
    });

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">StockPilot</h1>
        <p className="mt-4 text-red-600">
          Failed to load inventory data. Check the server logs.
        </p>
      </main>
    );
  }

  const fullName = profile?.full_name?.trim() ?? "";

  const displayName =
    fullName.split(/\s+/).filter(Boolean).slice(0, 2).join(" ") || null;

  return (
    <DashboardContent
      productsCount={productsCount ?? 0}
      categoriesCount={categoriesCount ?? 0}
      products={products ?? []}
      userEmail={displayName ?? ""}
    />
  );
}
