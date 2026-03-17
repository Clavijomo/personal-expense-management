import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormValues } from "@/schemas/expense.schema";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense } from "@/types/expense";

interface UseExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
}

export function useExpenseForm({ expense, onSuccess }: UseExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenseStore();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      });
    } else {
      form.reset({
        description: "",
        amount: 0,
        category: undefined,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [expense, form]);

  const onSubmit = (data: ExpenseFormValues) => {
    if (expense) {
      updateExpense(expense.id, data);
    } else {
      addExpense(data);
    }
    onSuccess();
  };

  return { form, onSubmit: form.handleSubmit(onSubmit) };
}
