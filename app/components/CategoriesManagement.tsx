"use client";

import { useState } from "react";

import AddCategoryForm from "./AddCategoryForm";
import EditCategoryForm from "./EditCategoryForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import { useCategories } from "../lib/hooks/useCategories";
import { useProfile } from "../lib/hooks/useProfile";
import { useDeleteCategory } from "../lib/hooks/useDeleteCategory";
import { useLanguage } from "../lib/i18n/LanguageProvider";

import type { Category } from "../lib/api/categories";

export default function CategoriesManagement() {
  const { t, language, direction } = useLanguage();

  const {
    data: categories,
    isPending,
    isError,
    error,
    refetch,
  } = useCategories();

  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
  } = useProfile();

  const isAdmin = profile?.role === "admin";
  const deleteMutation = useDeleteCategory();

  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  function closeDeleteModal() {
    if (deleteMutation.isPending) return;

    deleteMutation.reset();
    setCategoryToDelete(null);
  }

  const deleteErrorMessage = deleteMutation.isError
    ? deleteMutation.error.message === "CATEGORY_IN_USE"
      ? language === "ar"
        ? "هذه الفئة مرتبطة بمنتجات. أعد تعيين هذه المنتجات إلى فئة أخرى أو احذفها قبل حذف الفئة."
        : "This category is assigned to products. Reassign or remove those products before deleting it."
      : deleteMutation.error.message
    : undefined;

  return (
    <div dir={direction} className="space-y-8">
      {isProfilePending ? (
        <div
          aria-busy="true"
          className="h-24 animate-pulse rounded-xl bg-slate-200"
        />
      ) : isProfileError ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {language === "ar"
            ? "تعذّر التحقق من الصلاحيات. إدارة الفئات متوقفة."
            : "Could not verify permissions. Category management is disabled."}
        </p>
      ) : isAdmin ? (
        <AddCategoryForm />
      ) : null}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {t.categories.title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {categories?.length ?? 0} {language === "ar" ? "فئة" : "categories"}
          </p>
        </div>

        {isPending ? (
          <div aria-busy="true" className="space-y-4 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-5">
            <p role="alert" className="text-sm text-red-700">
              {language === "ar"
                ? "فشل تحميل الفئات."
                : "Failed to load categories."}{" "}
              {error.message}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
            >
              {t.common.retry}
            </button>
          </div>
        ) : !categories?.length ? (
          <p className="p-8 text-center text-sm text-slate-500">
            {language === "ar"
              ? "لا توجد فئات. أنشئ أول فئة من النموذج أعلاه."
              : "No categories found. Create your first category above."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {category.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {language === "ar" ? "رقم الفئة:" : "Category ID:"}{" "}
                    {category.id}
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCategoryToEdit(category)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {t.common.edit}
                    </button>

                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        deleteMutation.reset();
                        setCategoryToDelete({
                          id: category.id,
                          name: category.name,
                        });
                      }}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      {t.common.delete}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {categoryToEdit && (
        <EditCategoryForm
          key={categoryToEdit.id}
          category={categoryToEdit}
          onCancel={() => setCategoryToEdit(null)}
          onUpdated={() => setCategoryToEdit(null)}
        />
      )}

      <ConfirmDeleteModal
        item={categoryToDelete}
        itemType="category"
        isPending={deleteMutation.isPending}
        errorMessage={deleteErrorMessage}
        onCancel={closeDeleteModal}
        onConfirm={() => {
          if (!categoryToDelete) return;

          deleteMutation.mutate(categoryToDelete.id, {
            onSuccess: () => {
              setCategoryToDelete(null);
            },
          });
        }}
      />
    </div>
  );
}
