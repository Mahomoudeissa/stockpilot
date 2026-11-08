"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormValues,
} from "../lib/schemas/productsSchema";

import { useCategories } from "../lib/hooks/useCategories";
import { useCreateProduct } from "../lib/hooks/useCreateProduct";
import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function AddProductForm() {
  const { t, direction, language } = useLanguage();

  const {
    data: categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const createProduct = useCreateProduct();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: 0,
      quantity: 0,
      low_stock_threshold: 5,
      image_url: "",
      category_id: 0,
    },
  });

  function onSubmit(values: ProductFormValues) {
    createProduct.mutate(
      {
        ...values,
        description: values.description.trim() || null,
        image_url: values.image_url || null,
      },
      {
        onSuccess: () => {
          reset();
        },

        onError: (error) => {
          console.error("Mutation error:", error.message);

          if (error.message === "SKU_ALREADY_EXISTS") {
            setError("sku", {
              type: "server",
              message: t.products.skuAlreadyExists,
            });
          } else {
            setError("root.server", {
              type: "server",
              message: t.errors.unexpected,
            });
          }
        },
      },
    );
  }

  const inputClassName =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-start outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-60";

  const labelClassName = "mb-1 block text-sm font-medium text-slate-700";

  const errorClassName = "mt-1 text-sm text-red-600";

  return (
    <section
      dir={direction}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {t.products.addProduct}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {language === "ar"
            ? "أدخل بيانات المنتج في الحقول التالية."
            : "Enter the product details below."}
        </p>
      </div>

      {isCategoriesError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {language === "ar"
            ? "فشل تحميل الفئات."
            : "Failed to load categories."}{" "}
          {categoriesError.message}
        </p>
      )}

      {createProduct.isError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {t.errors.unexpected}
        </p>
      )}

      {createProduct.isSuccess && (
        <p role="status" className="mb-4 text-sm text-green-700">
          {t.products.createSuccess}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-5 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="name" className={labelClassName}>
            {t.products.productName}
          </label>

          <input
            id="name"
            {...register("name")}
            aria-invalid={!!errors.name}
            className={inputClassName}
            placeholder={
              language === "ar" ? "مثال: ماوس لاسلكي" : "Wireless Mouse"
            }
          />

          {errors.name && (
            <p className={errorClassName}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="sku" className={labelClassName}>
            {t.products.sku}
          </label>

          <input
            id="sku"
            {...register("sku", {
              onChange: () => clearErrors("sku"),
            })}
            aria-invalid={!!errors.sku}
            className={inputClassName}
            placeholder="ACC-MOUSE-002"
          />

          {errors.sku && <p className={errorClassName}>{errors.sku.message}</p>}
        </div>

        <div>
          <label htmlFor="price" className={labelClassName}>
            {t.products.price}
          </label>

          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            aria-invalid={!!errors.price}
            className={inputClassName}
          />

          {errors.price && (
            <p className={errorClassName}>{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className={labelClassName}>
            {t.products.quantity}
          </label>

          <input
            id="quantity"
            type="number"
            min="0"
            step="1"
            {...register("quantity", { valueAsNumber: true })}
            aria-invalid={!!errors.quantity}
            className={inputClassName}
          />

          {errors.quantity && (
            <p className={errorClassName}>{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="low_stock_threshold" className={labelClassName}>
            {t.products.lowStockThreshold}
          </label>

          <input
            id="low_stock_threshold"
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
            <p className={errorClassName}>
              {errors.low_stock_threshold.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className={labelClassName}>
            {t.products.category}
          </label>

          <select
            id="category_id"
            {...register("category_id", { valueAsNumber: true })}
            aria-invalid={!!errors.category_id}
            disabled={isCategoriesPending || !categories?.length}
            className={inputClassName}
          >
            <option value={0}>
              {language === "ar" ? "اختر فئة" : "Choose a category"}
            </option>

            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.category_id && (
            <p className={errorClassName}>{errors.category_id.message}</p>
          )}

          {!isCategoriesPending &&
            !isCategoriesError &&
            !categories?.length && (
              <p className="mt-1 text-sm text-amber-700">
                {language === "ar"
                  ? "أضف فئة قبل إنشاء منتج."
                  : "Add a category before creating a product."}
              </p>
            )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="image_url" className={labelClassName}>
            {t.products.imageUrl}{" "}
            <span className="font-normal text-slate-500">
              ({language === "ar" ? "اختياري" : "optional"})
            </span>
          </label>

          <input
            id="image_url"
            type="url"
            {...register("image_url")}
            aria-invalid={!!errors.image_url}
            className={inputClassName}
            placeholder="https://example.com/product.jpg"
          />

          {errors.image_url && (
            <p className={errorClassName}>{errors.image_url.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClassName}>
            {t.products.description}{" "}
            <span className="font-normal text-slate-500">
              ({language === "ar" ? "اختياري" : "optional"})
            </span>
          </label>

          <textarea
            id="description"
            rows={3}
            {...register("description")}
            aria-invalid={!!errors.description}
            className={`${inputClassName} resize-y`}
            placeholder={
              language === "ar"
                ? "اكتب وصف المنتج..."
                : "Describe the product..."
            }
          />

          {errors.description && (
            <p className={errorClassName}>{errors.description.message}</p>
          )}
        </div>

        {errors.root?.server && (
          <p role="alert" className="sm:col-span-2 text-sm text-red-600">
            {errors.root.server.message}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={
              createProduct.isPending ||
              isCategoriesPending ||
              isCategoriesError ||
              !categories?.length
            }
            className="w-full rounded-lg bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {createProduct.isPending
              ? language === "ar"
                ? "جارٍ إضافة المنتج..."
                : "Adding product..."
              : t.products.addProduct}
          </button>
        </div>
      </form>
    </section>
  );
}
