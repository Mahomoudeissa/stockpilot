import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "../logout/action";
import LanguageSwitcher from "../components/LanguageSwitcher";
import DashboardNavigation from "../components/DashboardNavigation";
import LogoutButton from "../components/LogoutButton";
import DashboardLabels from "../components/DashboardLabels";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="border-b border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-e">
        <div className="px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
              SP
            </span>

            <span>
              <span className="block font-bold">StockPilot</span>
              <span className="text-xs text-slate-500">
                <DashboardLabels type="inventory" />
              </span>
            </span>
          </Link>
        </div>

        <DashboardNavigation />

        <div className="hidden border-t border-slate-200 px-5 py-4 text-xs text-slate-500 md:block">
          <DashboardLabels type="inventory" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              <DashboardLabels type="workspace" />
            </p>

            <p className="mt-1 font-semibold">
              <DashboardLabels type="inventory" />
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <LogoutButton />
              </button>
            </form>
          </div>
        </header>

        <div className="min-w-0 flex-1">{children}</div>

        <footer className="flex flex-col gap-1 border-t border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>© 2026 StockPilot</p>

          <p>
            <DashboardLabels type="inventory" />
          </p>
        </footer>
      </div>
    </div>
  );
}
