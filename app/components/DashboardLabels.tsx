"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider";

type DashboardLabelsProps = {
  type: "workspace" | "inventory";
};

export default function DashboardLabels({ type }: DashboardLabelsProps) {
  const { t } = useLanguage();

  if (type === "workspace") {
    return <>{t.common.workspace}</>;
  }

  return <>{t.common.inventoryManagement}</>;
}
