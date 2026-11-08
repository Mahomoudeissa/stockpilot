"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Category } from "../lib/api/categories";
import {
  categorySchema,
  type CategoryFormValues,
} from "../lib/schemas/categorySchema";

import { useUpdateCategory } from "../lib/hooks/useUpdateCategory";
import { useLanguage } from "../lib/i18n/LanguageProvider";

type EditCategoryModalProps = {
  category: Category;
  onCancel: () => void;
  onUpdated: () => void;
};

export default function EditCategoryModal({
  category,
  onCancel,
  onUpdated,
}: EditCategoryModalProps) {
  const updateMutation = useUpdateCategory();
  const { t, language, direction } = useLanguage();

  const isArabic = language === "ar";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !updateMutation.isPending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, updateMutation.isPending]);

  function onSubmit(values: CategoryFormValues) {
    updateMutation.mutate(
      {
        categoryId: category.id,
        input: values,
      },
      {
        onSuccess: onUpdated,

        onError: (error) => {
          if (error.message === "CATEGORY_NAME_ALREADY_EXISTS") {
            setError("name", {
              type: "server",
              message: isArabic
                ? "اسم التصنيف ده موجود بالفعل."
                : "This category name already exists.",
            });
          }
        },
      },
    );
  }

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !updateMutation.isPending) {
          onCancel();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-category-title"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-category-title"
              className="text-xl font-semibold text-slate-900"
            >
              {t.categories.editCategory}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isArabic ? "عدّل اسم التصنيف." : "Update the category name."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={updateMutation.isPending}
            aria-label={t.common.close}
            className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {updateMutation.isError &&
          updateMutation.error.message !== "CATEGORY_NAME_ALREADY_EXISTS" && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {isArabic
                ? "حصل خطأ أثناء تحديث التصنيف. حاول مرة تانية."
                : "Something went wrong while updating the category. Please try again."}
            </p>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="edit-category-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {t.categories.categoryName}
            </label>

            <input
              id="edit-category-name"
              {...register("name", {
                onChange: () => clearErrors("name"),
              })}
              aria-invalid={!!errors.name}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-start outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={updateMutation.isPending}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {t.common.cancel}
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {updateMutation.isPending
                ? isArabic
                  ? "جاري الحفظ..."
                  : "Saving..."
                : t.common.save}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
