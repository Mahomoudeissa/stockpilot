"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  categorySchema,
  type CategoryFormValues,
} from "../lib/schemas/categorySchema";

import { useCreateCategory } from "../lib/hooks/useCreateCategory";
import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function AddCategoryForm() {
  const { t, language, direction } = useLanguage();
  const createCategoryMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: CategoryFormValues) {
    createCategoryMutation.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <section
      dir={direction}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          {t.categories.addCategory}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {language === "ar"
            ? "أنشئ فئة لتنظيم منتجاتك."
            : "Create a category to organize your products."}
        </p>
      </div>

      {createCategoryMutation.isError && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {language === "ar"
            ? "فشل إنشاء الفئة."
            : "Failed to create category."}
        </p>
      )}

      {createCategoryMutation.isSuccess && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {t.categories.createSuccess}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <label
            htmlFor="category-name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            {t.categories.categoryName}
          </label>

          <input
            id="category-name"
            {...register("name")}
            aria-invalid={!!errors.name}
            placeholder={
              language === "ar" ? "مثال: الإكسسوارات" : "e.g. Accessories"
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-start outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={createCategoryMutation.isPending}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6"
        >
          {createCategoryMutation.isPending
            ? language === "ar"
              ? "جارٍ الإنشاء..."
              : "Creating..."
            : t.categories.addCategory}
        </button>
      </form>
    </section>
  );
}
