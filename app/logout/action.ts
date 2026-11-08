"use server";

import { createClient } from "../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    throw new Error("Unable to sign out. Please try again.");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
