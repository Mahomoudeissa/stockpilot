"use client";

import Link from "next/link";
import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function DashboardNavigation() {
  const { t } = useLanguage();

  const navigation = [
    { href: "/", label: t.common.dashboard },
    { href: "/products", label: t.common.products },
    { href: "/categories", label: t.common.categories },
  ];

  return (
    <nav
      aria-label={t.common.dashboard}
      className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-1 md:flex-col md:px-3 md:py-4"
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
