import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Expense } from "@/types/expense";
import { ExpenseFormValues } from "@/schemas/expense.schema";

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (data: ExpenseFormValues) => void;
  updateExpense: (id: string, data: ExpenseFormValues) => void;
  deleteExpense: (id: string) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],

      addExpense: (data) => {
        const newExpense: Expense = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },

      updateExpense: (id, data) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...data } : expense
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
    }),
    {
      name: "expenses-storage",
    }
  )
);
