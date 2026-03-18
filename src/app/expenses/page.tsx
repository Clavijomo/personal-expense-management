"use client";

import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { ExpenseFormModal } from "@/components/shared/ExpenseFormModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/hooks/useExpenses";
import { useHydration } from "@/hooks/useHydration";
import { Expense, ExpenseFilters as Filters } from "@/types/expense";
import { useState } from "react";

const DEFAULT_FILTERS: Filters = {
  category: "all",
  dateFrom: "",
  dateTo: "",
  search: "",
};

export default function ExpensesPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();

  const { paginated, deleteExpense } = useExpenses(filters);
  const { hydrated, error } = useHydration();

  if (error) return <ErrorState message={error} />;
  if (!hydrated) return <LoadingSpinner />;

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedExpense(undefined);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedExpense(undefined);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Gastos</h1>
        </div>
        <Button onClick={handleAdd}>+ Agregar gasto</Button>
      </div>

      <div className="mb-4">
        <ExpenseFilters filters={filters} onChange={setFilters} />
      </div>

      <ExpenseTable
        expenses={paginated}
        onEdit={handleEdit}
        onDelete={deleteExpense}
      />

      <ExpenseFormModal
        key={modalKey}
        open={modalOpen}
        onClose={handleClose}
        expense={selectedExpense}
      />
    </main>
  );
}
