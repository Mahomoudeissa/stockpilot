import { createClient } from "../supabase/client";

export type SignupResult = {
  email: string;
  needsEmailConfirmation: boolean;
};

export async function signup(values: {
  fullName: string;
  email: string;
  password: string;
}): Promise<SignupResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: values.email.trim(),
    password: values.password,
    options: {
      data: {
        full_name: values.fullName.trim(),
      },
    },
  });

  if (error) {
    console.error("Supabase signup error:", error);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error(
      "Account creation could not be confirmed. Please try again.",
    );
  }

  return {
    email: data.user.email ?? values.email,
    needsEmailConfirmation: !data.session,
  };
}
