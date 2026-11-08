"use client";

import { useState } from "react";

import { useProductsPage } from "../lib/hooks/useProductsPage";
import { useProfile } from "../lib/hooks/useProfile";
import { useDeleteProduct } from "../lib/hooks/useDeleteProduct";
import { useDebounce } from "../lib/hooks/useDebounce";

import { useLanguage } from "../lib/i18n/LanguageProvider";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditProductForm from "./EditProductForm";

import type { Product } from "../lib/types/product";

const PAGE_SIZE = 10;

const CATEGORIES = [
  { id: 1, key: "electronics" },
  { id: 2, key: "accessories" },
  { id: 3, key: "officeSupplies" },
] as const;

export default function ProductsTable() {
  const { t, direction } = useLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: productsPage,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useProductsPage(page, PAGE_SIZE, debouncedSearchTerm, categoryId);

  const products = productsPage?.products ?? [];
  const totalCount = productsPage?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const {
    data: profile,
    isPending: isProfilePending,
    isError: isProfileError,
  } = useProfile();

  const deleteProductMutation = useDeleteProduct();
  const isAdmin = profile?.role === "admin";

  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  function closeDeleteModal() {
    if (deleteProductMutation.isPending) return;

    deleteProductMutation.reset();
    setProductToDelete(null);
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategoryId(value === "" ? null : Number(value));
    setPage(1);
  }

  if (isPending) {
    return (
      <div
        aria-busy="true"
        aria-label={t.products.loadError}
        className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white p-5"
      >
        <div className="mb-6 h-6 w-40 rounded bg-slate-200" />

        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="flex gap-4 border-t border-slate-100 py-5"
          >
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-4 w-1/4 rounded bg-slate-200" />
            <div className="h-4 w-1/5 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5"
      >
        <h2 className="font-semibold text-red-800">{t.products.loadError}</h2>

        <p className="mt-2 text-sm text-red-700">
          {error instanceof Error ? error.message : t.errors.unexpected}
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          {t.common.retry}
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {t.products.allProducts}
              </h2>

              {isProfilePending ? (
                <span className="text-xs text-slate-500">
                  {t.common.checkingPermissions}
                </span>
              ) : isProfileError ? (
                <span className="text-xs text-red-600">
                  {t.common.couldNotVerifyPermissions}
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  {isAdmin ? t.common.adminAccess : t.common.readOnlyAccess}
                </span>
              )}

              <p className="mt-1 text-sm text-slate-500">
                {totalCount} {t.products.matchingProducts}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={t.common.searchPlaceholder}
                aria-label={t.common.searchPlaceholder}
                className="w-full min-w-0 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:flex-1 lg:w-64"
              />

              <select
                value={categoryId ?? ""}
                onChange={(event) => handleCategoryChange(event.target.value)}
                aria-label={t.products.filterByCategory}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:flex-1 lg:w-52"
              >
                <option value="">
                  {t.common.all} {t.common.categories}
                </option>

                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {t.products[category.key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {deleteProductMutation.isError && (
          <p
            role="alert"
            className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {t.products.deleteError}: {deleteProductMutation.error.message}
          </p>
        )}

        <div className="overflow-x-auto">
          <table
            dir={direction}
            className="w-full min-w-[760px] text-start text-sm"
          >
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 text-start font-medium">
                  {t.products.product}
                </th>
                <th className="px-5 py-4 text-start font-medium">
                  {t.products.sku}
                </th>
                <th className="px-5 py-4 text-start font-medium">
                  {t.products.price}
                </th>
                <th className="px-5 py-4 text-start font-medium">
                  {t.products.quantity}
                </th>
                <th className="px-5 py-4 text-start font-medium">
                  {t.products.stockStatus}
                </th>

                {isAdmin && (
                  <th className="px-5 py-4 text-start font-medium">
                    {t.common.actions}
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    {searchTerm.trim() || categoryId !== null
                      ? t.products.noProductsMatchFilters
                      : t.products.empty}
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLowStock =
                    product.quantity <= product.low_stock_threshold;

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-start font-medium text-slate-900">
                        {product.name}
                      </td>

                      <td className="px-5 py-4 text-start text-slate-600">
                        {product.sku}
                      </td>

                      <td className="px-5 py-4 text-start text-slate-700">
                        {product.price}
                      </td>

                      <td className="px-5 py-4 text-start text-slate-700">
                        {product.quantity}
                      </td>

                      <td className="px-5 py-4 text-start">
                        <span
                          className={
                            isLowStock
                              ? "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                              : "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                          }
                        >
                          {isLowStock
                            ? t.products.lowStockStatus
                            : t.products.inStock}
                        </span>
                      </td>

                      {isAdmin && (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setProductToEdit(product)}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                              {t.common.edit}
                            </button>

                            <button
                              type="button"
                              disabled={deleteProductMutation.isPending}
                              onClick={() => {
                                deleteProductMutation.reset();
                                setProductToDelete({
                                  id: product.id,
                                  name: product.name,
                                });
                              }}
                              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {t.common.delete}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-slate-500">
            {totalCount === 0 ? (
              t.products.empty
            ) : (
              <>
                {t.products.showing} {(page - 1) * PAGE_SIZE + 1}-
                {Math.min(page * PAGE_SIZE, totalCount)} {t.products.of}{" "}
                {totalCount} {t.common.products.toLowerCase()}
              </>
            )}
          </p>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              disabled={page <= 1 || isFetching || isPlaceholderData}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.products.previous}
            </button>

            <span className="whitespace-nowrap text-sm text-slate-600">
              {t.products.page} {page} {t.products.of} {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || isFetching || isPlaceholderData}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.products.next}
            </button>
          </div>
        </div>
      </section>

      {productToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${t.products.editProduct}: ${productToEdit.name}`}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl shadow-2xl"
          >
            <EditProductForm
              key={productToEdit.id}
              product={productToEdit}
              onCancel={() => setProductToEdit(null)}
              onUpdated={() => setProductToEdit(null)}
            />
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        item={productToDelete}
        itemType="product"
        isPending={deleteProductMutation.isPending}
        errorMessage={
          deleteProductMutation.isError
            ? deleteProductMutation.error.message
            : undefined
        }
        onCancel={closeDeleteModal}
        onConfirm={() => {
          if (!productToDelete) return;

          deleteProductMutation.mutate(productToDelete.id, {
            onSuccess: () => setProductToDelete(null),
          });
        }}
      />
    </>
  );
}
