"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "../lib/hooks/useSignup";
import { useLanguage } from "../lib/i18n/LanguageProvider";
import {
  signupSchema,
  type SignupFormValues,
} from "../lib/schemas/signup-schema";

export default function SignupPage() {
  const { language, direction } = useLanguage();
  const isArabic = language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useSignup();

  function onValidSubmit(values: SignupFormValues) {
    mutate({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
  }

  if (isSuccess && data?.needsEmailConfirmation) {
    return (
      <main
        dir={direction}
        className="mx-auto mt-12 w-full max-w-md px-4 pb-10 sm:mt-16"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isArabic ? "تحقق من بريدك الإلكتروني" : "Check your email"}
          </h1>

          <p role="status" className="mt-4 text-sm leading-7 text-slate-600">
            {isArabic
              ? "إذا تم قبول تسجيلك، فستصلك رسالة بالبريد الإلكتروني تحتوي على الخطوات التالية إلى "
              : "If your registration was accepted, you will receive an email with the next steps at "}
            <strong dir="ltr" className="break-all">
              {data.email}
            </strong>
            {isArabic
              ? ". أكّد بريدك الإلكتروني قبل تسجيل الدخول."
              : ". Confirm your email before signing in."}
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block font-medium text-blue-600 underline"
          >
            {isArabic ? "الانتقال إلى تسجيل الدخول" : "Go to sign in"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={direction}
      className="mx-auto mt-10 w-full max-w-md px-4 pb-10 sm:mt-16"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-500">StockPilot</p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {isArabic ? "إنشاء حساب جديد" : "Create your account"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isArabic
              ? "أنشئ حسابًا للوصول إلى مساحة إدارة المخزون الخاصة بك."
              : "Create an account to access your inventory workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {isArabic ? "الاسم الكامل" : "Full name"}
            </label>

            <input
              id="fullName"
              type="text"
              autoComplete="name"
              dir={direction}
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName")}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {errors.fullName && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {isArabic ? "البريد الإلكتروني" : "Email"}
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
              className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {errors.email && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {isArabic ? "كلمة المرور" : "Password"}
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              dir="ltr"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
              className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {errors.password && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {isArabic ? "تأكيد كلمة المرور" : "Confirm password"}
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              dir="ltr"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
              className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {errors.confirmPassword && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {isError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {isArabic
                ? "تعذّر إنشاء الحساب. " + "تحقق من البيانات وحاول مرة أخرى."
                : error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? isArabic
                ? "جارٍ إنشاء الحساب..."
                : "Creating account..."
              : isArabic
                ? "إنشاء الحساب"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isArabic ? "لديك حساب بالفعل؟ " : "Already have an account? "}

          <Link href="/login" className="font-medium text-blue-600 underline">
            {isArabic ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </p>
      </div>
    </main>
  );
}
