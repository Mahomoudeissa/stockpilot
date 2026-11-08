"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function LanguageDocument() {
  const { language, direction } = useLanguage();

  return (
    <div
      dir={direction}
      lang={language}
      className="hidden"
      aria-hidden="true"
    />
  );
}
