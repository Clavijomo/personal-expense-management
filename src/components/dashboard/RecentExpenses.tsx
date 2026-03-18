import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recent = expenses
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Últimos gastos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay gastos registrados.</p>
        ) : (
          recent.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="truncate text-sm font-medium">{expense.description}</span>
                <Badge variant="secondary" className="w-fit text-xs mt-2">
                  {expense.category}
                </Badge>
              </div>
              <span className="shrink-0 text-sm font-semibold">
                ${expense.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
