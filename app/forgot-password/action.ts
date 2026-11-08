"use server";

import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    redirect("/forgot-password?error=invalid-input");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured.");
  }

  let redirectTo: string;

  try {
    const url = new URL(siteUrl);

    if (
      url.protocol !== "https:" &&
      url.hostname !== "localhost" &&
      url.hostname !== "127.0.0.1"
    ) {
      throw new Error("Invalid site URL protocol.");
    }

    redirectTo = new URL("/auth/callback?next=/reset-password", url).toString();
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL is invalid.");
  }

  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });

  // Use the same response whether the account exists or not.
  redirect("/forgot-password?sent=true");
}
