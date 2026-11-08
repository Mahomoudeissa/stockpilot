"use client";

import AddProductForm from "./AddProduct";
import ProductsTable from "./ProductsTable";
import { useProfile } from "../lib/hooks/useProfile";
import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function ProductsManagement() {
  const { data: profile, isPending, isError, error } = useProfile();
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      {isPending ? (
        <p
          role="status"
          className="rounded-lg bg-white p-4 text-sm text-slate-500"
        >
          {t.common.checkingPermissions}
        </p>
      ) : isError ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {t.common.failedToVerifyPermissions}: {error.message}
        </p>
      ) : profile?.role === "admin" ? (
        <AddProductForm />
      ) : null}

      <ProductsTable />
    </div>
  );
}
