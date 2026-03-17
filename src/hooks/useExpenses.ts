import { useMemo } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { ExpenseFilters } from "@/types/expense";

const PAGE_SIZE = 20;

export function useExpenses(filters?: Partial<ExpenseFilters>) {
  const { expenses, addExpense, updateExpense, deleteExpense } =
    useExpenseStore();

  const filtered = useMemo(() => {
    const currentYear = new Date().getFullYear().toString();

    return expenses
      .filter((expense) => {
        const expenseYear = expense.date.slice(0, 4);

        if (filters?.category && filters.category !== "all") {
          if (expense.category !== filters.category) return false;
        }

        if (filters?.dateFrom) {
          if (expense.date < filters.dateFrom) return false;
        }

        if (filters?.dateTo) {
          if (expense.date > filters.dateTo) return false;
        }

        if (filters?.search) {
          const query = filters.search.toLowerCase();
          if (!expense.description.toLowerCase().includes(query)) return false;
        }

        if (!filters?.dateFrom && !filters?.dateTo) {
          if (expenseYear !== currentYear) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (b.date !== a.date) return b.date.localeCompare(a.date);
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [expenses, filters]);

  const paginated = useMemo(() => filtered.slice(0, PAGE_SIZE), [filtered]);

  return {
    expenses,
    filtered,
    paginated,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
