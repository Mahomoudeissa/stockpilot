"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { translations, type Language } from "./translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  direction: "ltr" | "rtl";
  t: (typeof translations)[Language];
};

const LANGUAGE_STORAGE_KEY = "stockpilot-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  const direction = language === "ar" ? "rtl" : "ltr";

  // Restore the saved language when the app starts.
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (
        savedLanguage &&
        Object.prototype.hasOwnProperty.call(translations, savedLanguage)
      ) {
        setLanguageState(savedLanguage as Language);
      }
    } finally {
      setIsLanguageLoaded(true);
    }
  }, []);

  // Update the document language and direction.
  useEffect(() => {
    if (!isLanguageLoaded) return;

    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction, isLanguageLoaded]);

  function setLanguage(newLanguage: Language) {
    setLanguageState(newLanguage);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch {
      // The language still changes for the current session.
    }
  }

  const value: LanguageContextValue = {
    language,
    setLanguage,
    direction,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
