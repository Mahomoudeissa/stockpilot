"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider";

type DashboardProduct = {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category_id: number | null;
};

type DashboardContentProps = {
  productsCount: number;
  categoriesCount: number;
  products: DashboardProduct[];
  userEmail: string;
};

export default function DashboardContent({
  productsCount,
  categoriesCount,
  products,
  userEmail,
}: DashboardContentProps) {
  const { t, language, direction } = useLanguage();

  const isArabic = language === "ar";

  const columns = [
    {
      key: "name",
      label: t.products.productName,
      width: "40%",
    },
    {
      key: "sku",
      label: t.products.sku,
      width: "25%",
    },
    {
      key: "price",
      label: t.products.price,
      width: "17.5%",
    },
    {
      key: "quantity",
      label: t.products.quantity,
      width: "17.5%",
    },
  ] as const;

  return (
    <main dir={direction} className="min-w-0 p-4 md:p-8 lg:p-10">
      <header className="mb-8">
        <p className="text-sm text-slate-500">{t.common.inventoryManagement}</p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          {t.dashboard.title}
        </h1>

        <p className="mt-2 text-slate-600">
          {isArabic ? "أهلًا بعودتك، " : "Welcome back, "}
          {userEmail || (isArabic ? "مستخدم" : "User")}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{t.dashboard.totalProducts}</p>

          <p className="mt-3 text-3xl font-bold">{productsCount}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            {t.dashboard.totalCategories}
          </p>

          <p className="mt-3 text-3xl font-bold">{categoriesCount}</p>
        </div>
      </section>

      <section className="mt-8 min-w-0 overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">
            {t.dashboard.recentProducts}
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="p-5 text-slate-500">{t.products.empty}</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table
              dir={direction} // <-- اجعله ديناميكياً بناءً على اللغة (rtl أو ltr)
              className="w-full min-w-[620px] table-fixed border-collapse text-sm"
            >
              <colgroup>
                {columns.map((column) => (
                  <col key={column.key} style={{ width: column.width }} />
                ))}
              </colgroup>

              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`border-b p-4 font-semibold ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    {/* اسم المنتج (نص عربي/إنجليزي - يتبع اتجاه الصفحة) */}
                    <td
                      className={`p-4 font-medium break-words ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      {product.name}
                    </td>

                    {/* الـ SKU (يفضل دائماً أن يكون LTR حتى لو الصفحة عربي لأنه كود إنجليزي/أرقام) */}
                    <td
                      dir="ltr"
                      className={`p-4 break-words ${isArabic ? "text-right" : "text-left"}`}
                    >
                      {product.sku}
                    </td>

                    {/* السعر (أرقام) */}
                    <td
                      dir="ltr"
                      className={`p-4 tabular-nums ${isArabic ? "text-right" : "text-left"}`}
                    >
                      {product.price}
                    </td>

                    {/* الكمية (أرقام) */}
                    <td
                      dir="ltr"
                      className={`p-4 tabular-nums ${isArabic ? "text-right" : "text-left"}`}
                    >
                      {product.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
