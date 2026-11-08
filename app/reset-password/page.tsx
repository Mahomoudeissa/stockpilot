"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "../lib/hooks/useResetPassword";
import { useLanguage } from "../lib/i18n/LanguageProvider";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../lib/schemas/reset-password-schema";

export default function ResetPasswordPage() {
  const { language, direction } = useLanguage();
  const isArabic = language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useResetPassword();

  function onValidSubmit(values: ResetPasswordFormValues) {
    mutate(values.password);
  }

  return (
    <main dir={direction} className="mx-auto mt-12 max-w-md p-6 sm:mt-20">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {isArabic ? "اختيار كلمة مرور جديدة" : "Choose a new password"}
      </h1>

      {isSuccess ? (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-4 text-sm text-green-700"
        >
          {isArabic
            ? "تم تحديث كلمة المرور بنجاح."
            : "Your password has been updated successfully."}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {isArabic ? "كلمة المرور الجديدة" : "New password"}
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              dir="ltr"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
              className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.password && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {isArabic
                  ? "يرجى التأكد من كلمة المرور حسب شروط التحقق المطلوبة."
                  : errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm new password"}
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              dir="ltr"
              {...register("confirmPassword")}
              aria-invalid={Boolean(errors.confirmPassword)}
              className="w-full rounded-lg border border-slate-300 p-3 text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {errors.confirmPassword && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {isArabic
                  ? "كلمتا المرور غير متطابقتين أو أن التأكيد غير صحيح."
                  : errors.confirmPassword.message}
              </p>
            )}
          </div>

          {isError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {isArabic
                ? "تعذّر تحديث كلمة المرور. حاول مرة أخرى."
                : error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? isArabic
                ? "جارٍ تحديث كلمة المرور..."
                : "Updating password..."
              : isArabic
                ? "تحديث كلمة المرور"
                : "Update password"}
          </button>
        </form>
      )}
    </main>
  );
}
