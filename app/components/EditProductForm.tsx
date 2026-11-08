"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Product } from "../lib/types/product";
import {
  productSchema,
  type ProductFormValues,
} from "../lib/schemas/productsSchema";

import { useCategories } from "../lib/hooks/useCategories";
import { useUpdateProduct } from "../lib/hooks/useUpdateProduct";
import { useLanguage } from "../lib/i18n/LanguageProvider";

type EditProductFormProps = {
  product: Product;
  onCancel: () => void;
  onUpdated: () => void;
};

export default function EditProductForm({
  product,
  onCancel,
  onUpdated,
}: EditProductFormProps) {
  const { t, language, direction } = useLanguage();
  const isArabic = language === "ar";

  const {
    data: categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      description: product.description ?? "",
      price: product.price,
      quantity: product.quantity,
      low_stock_threshold: product.low_stock_threshold,
      image_url: product.image_url ?? "",
      category_id: product.category_id,
    },
  });

  function onSubmit(values: ProductFormValues) {
    updateMutation.mutate(
      {
        productId: product.id,
        input: {
          ...values,
          description: values.description.trim() || null,
          image_url: values.image_url.trim() || null,
        },
      },
      {
        onSuccess: onUpdated,

        onError: (error) => {
          if (error.message === "SKU_ALREADY_EXISTS") {
            setError("sku", {
              type: "server",
              message: isArabic
                ? "كود المنتج ده مستخدم بالفعل. اختار كود تاني."
                : "This SKU already exists. Choose another one.",
            });
          }
        },
      },
    );
  }

  const inputClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-start outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

  const labelClassName = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <section
      dir={direction}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {t.products.editProduct}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isArabic
            ? `عدّل بيانات المنتج: ${product.name}`
            : `Update the details of ${product.name}.`}
        </p>
      </div>

      {isCategoriesPending && (
        <p role="status" className="mb-4 text-sm text-slate-500">
          {isArabic ? "جاري تحميل التصنيفات..." : "Loading categories..."}
        </p>
      )}

      {isCategoriesError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {isArabic ? "فشل تحميل التصنيفات. " : "Failed to load categories. "}
          {categoriesError.message}
        </p>
      )}

      {updateMutation.isError &&
        updateMutation.error.message !== "SKU_ALREADY_EXISTS" && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {isArabic
              ? "فشل تحديث المنتج. حاول مرة تانية."
              : "Failed to update product. Please try again."}
          </p>
        )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-5 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="edit-name" className={labelClassName}>
            {t.products.productName}
          </label>

          <input
            id="edit-name"
            {...register("name")}
            aria-invalid={!!errors.name}
            className={inputClassName}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="edit-sku" className={labelClassName}>
            {t.products.sku}
          </label>

          <input
            id="edit-sku"
            dir="ltr"
            {...register("sku", {
              onChange: () => clearErrors("sku"),
            })}
            aria-invalid={!!errors.sku}
            className={inputClassName}
          />

          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="edit-price" className={labelClassName}>
            {t.products.price}
          </label>

          <input
            id="edit-price"
            type="number"
            min="0"
            step="0.01"
            dir="ltr"
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            className={inputClassName}
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="edit-quantity" className={labelClassName}>
            {t.products.quantity}
          </label>

          <input
            id="edit-quantity"
            type="number"
            min="0"
            step="1"
            {...register("quantity", { valueAsNumber: true })}
            aria-invalid={!!errors.quantity}
            className={inputClassName}
          />

          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-threshold" className={labelClassName}>
            {t.products.lowStockThreshold}
          </label>

          <input
            id="edit-threshold"
            type="number"
            min="0"
            step="1"
            {...register("low_stock_threshold", {
              valueAsNumber: true,
            })}
            aria-invalid={!!errors.low_stock_threshold}
            className={inputClassName}
          />

          {errors.low_stock_threshold && (
            <p className="mt-1 text-sm text-red-600">
              {errors.low_stock_threshold.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-category" className={labelClassName}>
            {t.products.category}
          </label>

          <select
            id="edit-category"
            {...register("category_id", { valueAsNumber: true })}
            aria-invalid={!!errors.category_id}
            disabled={isCategoriesPending || !categories?.length}
            className={`${inputClassName} disabled:opacity-60`}
          >
            <option value={0}>
              {isArabic ? "اختر تصنيفًا" : "Choose a category"}
            </option>

            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category_id.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="edit-image" className={labelClassName}>
            {t.products.imageUrl}{" "}
            <span className="font-normal text-slate-500">
              ({isArabic ? "اختياري" : "optional"})
            </span>
          </label>

          <input
            id="edit-image"
            type="url"
            dir="ltr"
            {...register("image_url")}
            aria-invalid={!!errors.image_url}
            className={inputClassName}
          />

          {errors.image_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.image_url.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="edit-description" className={labelClassName}>
            {t.products.description}{" "}
            <span className="font-normal text-slate-500">
              ({isArabic ? "اختياري" : "optional"})
            </span>
          </label>

          <textarea
            id="edit-description"
            rows={3}
            {...register("description")}
            aria-invalid={!!errors.description}
            className={`${inputClassName} resize-y`}
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={updateMutation.isPending}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {t.common.cancel}
          </button>

          <button
            type="submit"
            disabled={
              updateMutation.isPending ||
              isCategoriesPending ||
              isCategoriesError ||
              !categories?.length
            }
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending
              ? isArabic
                ? "جاري الحفظ..."
                : "Saving changes..."
              : t.common.save}
          </button>
        </div>
      </form>
    </section>
  );
}
