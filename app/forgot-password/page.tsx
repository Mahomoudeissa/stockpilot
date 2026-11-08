import { Suspense } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./action";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    sent?: string;
  }>;
};

export default function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  return (
    <main className="mx-auto mt-20 max-w-md p-6">
      <h1 className="mb-3 text-2xl font-bold">Forgot your password?</h1>

      <p className="mb-6 text-sm text-gray-600">
        Enter your email address. If an account matches it, you may receive a
        password reset link.
      </p>

      <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
        <ForgotPasswordContent searchParams={searchParams} />
      </Suspense>

      <p className="mt-5 text-sm">
        <Link href="/login" className="text-blue-600 underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}

async function ForgotPasswordContent({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, sent } = await searchParams;

  if (sent === "true") {
    return (
      <p role="status" className="mb-4 text-green-700">
        If an account matches that email, a password reset link will be sent.
      </p>
    );
  }

  return (
    <form action={requestPasswordReset} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded border p-2"
        />
      </div>

      {error === "invalid-input" && (
        <p role="alert" className="text-red-600">
          Please enter a valid email address.
        </p>
      )}

      {error === "invalid-link" && (
        <p role="alert" className="text-red-600">
          This reset link is invalid or has expired. Please request a new one.
        </p>
      )}

      <button type="submit" className="w-full rounded bg-black p-2 text-white">
        Send reset link
      </button>
    </form>
  );
}
