import { useMemo } from "react";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Category } from "@/types/expense";

export function useDashboardMetrics() {
  const { expenses } = useExpenseStore();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const monthlyExpenses = expenses.filter((e) =>
      e.date.startsWith(currentMonth)
    );

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    const daysPassed = now.getDate();
    const dailyAverage = daysPassed > 0 ? totalSpent / daysPassed : 0;

    const byCategory = monthlyExpenses.reduce<Record<string, number>>(
      (acc, e) => {
        acc[e.category] = (acc[e.category] ?? 0) + e.amount;
        return acc;
      },
      {}
    );

    const topCategory = (Object.entries(byCategory).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] ?? "—") as Category | "—";

    const transactionCount = monthlyExpenses.length;

    return { totalSpent, dailyAverage, topCategory, transactionCount };
  }, [expenses]);

  return metrics;
}
