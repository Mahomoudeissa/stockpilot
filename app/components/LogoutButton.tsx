"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function LogoutButton() {
  const { t } = useLanguage();

  return <span>{t.common.logout}</span>;
}
