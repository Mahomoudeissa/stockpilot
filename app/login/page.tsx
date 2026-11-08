"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "./action";
import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function LoginPage() {
  const { t, language, direction } = useLanguage();
  const isArabic = language === "ar";

  return (
    <main dir={direction} className="mx-auto mt-12 max-w-md p-6 sm:mt-20">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {isArabic ? "تسجيل الدخول إلى StockPilot" : "Sign in to StockPilot"}
      </h1>

      <form action={login} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            {isArabic ? "البريد الإلكتروني" : "Email"}
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            {isArabic ? "كلمة المرور" : "Password"}
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            dir="ltr"
            className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className={isArabic ? "text-left" : "text-right"}>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 underline"
          >
            {isArabic ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>
        </div>

        <Suspense fallback={null}>
          <LoginMessages isArabic={isArabic} />
        </Suspense>

        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 p-3 font-medium text-white transition hover:bg-slate-700"
        >
          {isArabic ? "تسجيل الدخول" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {isArabic ? "ليس لديك حساب؟ " : "Don't have an account? "}

        <Link href="/signup" className="font-medium text-blue-600 underline">
          {isArabic ? "إنشاء حساب" : "Create account"}
        </Link>
      </p>
    </main>
  );
}

function LoginMessages({ isArabic }: { isArabic: boolean }) {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const passwordReset = searchParams.get("password-reset");

  const errorMessage =
    error === "invalid-input"
      ? isArabic
        ? "يرجى إدخال البريد الإلكتروني وكلمة المرور."
        : "Please enter your email and password."
      : error === "invalid-credentials"
        ? isArabic
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : "Invalid email or password."
        : null;

  return (
    <>
      {passwordReset === "success" && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {isArabic
            ? "تم تغيير كلمة المرور بنجاح. سجّل الدخول باستخدام كلمة المرور الجديدة."
            : "Your password has been reset successfully. Please sign in with your new password."}
        </p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </>
  );
}
