import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/reset-password";

  // Allow only a safe, local destination.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/reset-password";

  if (!tokenHash || type !== "recovery") {
    return NextResponse.redirect(
      new URL("/forgot-password?error=invalid-link", origin),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as EmailOtpType,
  });

  if (error) {
    return NextResponse.json({
      stage: "verifyOtp-failed",
      message: error.message,
    });
  }

  return NextResponse.redirect(new URL(safeNext, origin));
}
