export default function DashboardSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading dashboard"
      className="min-h-screen animate-pulse bg-slate-50 p-6 md:p-10"
    >
      <p className="sr-only">Loading dashboard...</p>

      {/* Dashboard Header */}
      <header className="mb-8">
        <div className="h-4 w-36 rounded bg-slate-200" />

        <div className="mt-3 h-9 w-64 max-w-full rounded bg-slate-300" />

        <div className="mt-3 h-4 w-48 max-w-full rounded bg-slate-200" />
      </header>

      {/* Statistics Cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-slate-200" />

            <div className="mt-5 h-9 w-16 rounded bg-slate-300" />
          </div>
        ))}
      </section>

      {/* Products Table */}
      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <div className="h-6 w-40 rounded bg-slate-200" />

          <div className="mt-3 h-4 w-56 max-w-full rounded bg-slate-100" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50">
                {[1, 2, 3, 4, 5].map((item) => (
                  <th key={item} className="p-4">
                    <div className="h-3 w-16 rounded bg-slate-200" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="border-t border-slate-100">
                  {[1, 2, 3, 4, 5].map((column) => (
                    <td key={column} className="p-4">
                      <div
                        className={`h-4 rounded bg-slate-200 ${
                          column === 1 ? "w-28" : "w-16"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
