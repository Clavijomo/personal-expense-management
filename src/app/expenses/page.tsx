"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseFormModal } from "@/components/shared/ExpenseFormModal";
import { useExpenses } from "@/hooks/useExpenses";
import { Expense, ExpenseFilters as Filters } from "@/types/expense";

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
        <h1 className="text-2xl font-semibold">Gastos</h1>
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
