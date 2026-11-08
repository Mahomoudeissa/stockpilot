import { createClient } from "../supabase/client";

export type UserRole = "admin" | "user";

export type UserProfile = {
  id: string;
  full_name: string | null;
  role: UserRole;
};

export async function getCurrentProfile(): Promise<UserProfile> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data.role !== "admin" && data.role !== "user") {
    throw new Error("Invalid user role.");
  }

  return {
    id: data.id,
    full_name: data.full_name,
    role: data.role,
  };
}
