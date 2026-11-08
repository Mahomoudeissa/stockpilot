"use client";

import { useLanguage } from "../lib/i18n/LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <label htmlFor="language">{t.common.language}</label>

      <select
        id="language"
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "ar")}
      >
        <option value="en">{t.common.english}</option>
        <option value="ar">{t.common.arabic}</option>
      </select>
    </div>
  );
}
