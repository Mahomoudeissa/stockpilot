"use client";

import ProductsManagement from "../../components/ProductsManagement";
import { useLanguage } from "../../lib/i18n/LanguageProvider";

export default function ProductsPage() {
  const { t, language, direction } = useLanguage();

  return (
    <main dir={direction} className="p-4 sm:p-6 lg:p-10">
      <header className="mb-8">
        <p className="text-sm text-slate-500">{t.common.inventoryManagement}</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {t.products.title}
        </h1>

        <p className="mt-2 text-slate-600">
          {language === "ar"
            ? "أدر مخزونك وتابع مستويات المنتجات."
            : "Manage your inventory and monitor stock levels."}
        </p>
      </header>

      <ProductsManagement />
    </main>
  );
}
