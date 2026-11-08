import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=invalid-link", origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/forgot-password?error=invalid-link", origin),
    );
  }

  const safeNext = next === "/reset-password" ? next : "/reset-password";

  return NextResponse.redirect(new URL(safeNext, origin));
}
