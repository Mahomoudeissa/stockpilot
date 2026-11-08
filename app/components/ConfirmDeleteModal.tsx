"use client";

import { useEffect } from "react";
import { useLanguage } from "../lib/i18n/LanguageProvider";

type ConfirmDeleteModalProps = {
  item: { id: number; name: string } | null;
  itemType: "product" | "category";
  isPending: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  item,
  itemType,
  isPending,
  errorMessage,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const { language, direction, t } = useLanguage();
  const isArabic = language === "ar";

  useEffect(() => {
    if (!item) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, isPending, onCancel]);

  if (!item) return null;

  const itemLabel = isArabic
    ? itemType === "product"
      ? "المنتج"
      : "الفئة"
    : itemType;

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-slate-200 bg-white p-6 text-start shadow-2xl duration-200"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.86 2.6 17.2A2 2 0 0 0 4.33 20h15.34a2 2 0 0 0 1.73-2.8L13.7 3.86a2 2 0 0 0-3.46 0Z"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="delete-modal-title"
              className="text-lg font-semibold text-slate-900"
            >
              {isArabic ? `هل تريد حذف ${itemLabel}؟` : `Delete ${itemLabel}?`}
            </h2>

            <p
              id="delete-modal-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              {isArabic
                ? `هل أنت متأكد أنك تريد حذف ${itemLabel}: `
                : `Are you sure you want to delete this ${itemType}: `}

              <span className="font-semibold text-slate-900">{item.name}</span>

              {isArabic
                ? "؟ لا يمكن التراجع عن هذا الإجراء."
                : "? This action cannot be undone."}
            </p>
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {t.common.cancel}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {isArabic ? "جارٍ الحذف..." : "Deleting..."}
              </span>
            ) : isArabic ? (
              `حذف ${itemLabel}`
            ) : (
              `Delete ${itemLabel}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
