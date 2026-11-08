import { Suspense } from "react";
import Dashboard from "../components/Dashboard";
import DashboardSkeleton from "../components/DashboardSkeleton";

export default function HomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
