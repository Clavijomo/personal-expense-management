"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { ExpenseFormModal } from "@/components/shared/ExpenseFormModal";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useHydration } from "@/hooks/useHydration";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { useState } from "react";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const { expenses } = useExpenseStore();
  const { totalSpent, dailyAverage, topCategory, transactionCount } = useDashboardMetrics();
  const { hydrated, error } = useHydration();

  if (error) return <ErrorState message={error} />;
  if (!hydrated) return <LoadingSpinner />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={() => { setModalKey((k) => k + 1); setModalOpen(true); }}>+ Agregar gasto</Button>
      </div>

      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          title="Total este mes"
          value={`$${totalSpent.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
        />
        <MetricCard
          title="Promedio diario"
          value={`$${dailyAverage.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`}
        />
        <MetricCard
          title="Categoría top"
          value={topCategory}
        />
        <MetricCard
          title="Transacciones"
          value={String(transactionCount)}
          description="este mes"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <ExpenseChart expenses={expenses} />
        </div>
        <div>
          <RecentExpenses expenses={expenses} />
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ExpensePieChart expenses={expenses} />
      </section>

      <div className="mt-6 flex justify-end">
        <Link
          href="/expenses"
          className="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
        >
          Ver todos los gastos
        </Link>
      </div>

      <ExpenseFormModal
        key={modalKey}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
