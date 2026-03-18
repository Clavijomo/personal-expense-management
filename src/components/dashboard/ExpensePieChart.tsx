"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#1d4ed8", "#b45309", "#15803d", "#7c3aed", "#be123c", "#0e7490", "#a16207", "#9f1239"];
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";

interface ExpensePieChartProps {
  expenses: Expense[];
}

export function ExpensePieChart({ expenses }: ExpensePieChartProps) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  const byCategory = monthlyExpenses.reduce<Record<string, { total: number; count: number }>>(
    (acc, e) => {
      if (!acc[e.category]) acc[e.category] = { total: 0, count: 0 };
      acc[e.category].total += e.amount;
      acc[e.category].count += 1;
      return acc;
    },
    {}
  );

  const innerData = Object.entries(byCategory).map(([name, { total }]) => ({
    name,
    value: Number(total.toFixed(2)),
    unit: "amount",
  }));

  const outerData = Object.entries(byCategory).map(([name, { count }]) => ({
    name,
    value: count,
    unit: "count",
  }));

  if (innerData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribución por categoría</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          Sin datos para este mes.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribución por categoría</CardTitle>
        <p className="text-xs text-muted-foreground">
          Interior: monto total · Exterior: número de transacciones
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={innerData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
            >
              {innerData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Pie
              data={outerData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={110}
              dataKey="value"
            >
              {outerData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} opacity={0.6} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => {
              const unit = (props.payload as { unit?: string })?.unit;
              return unit === "count"
                ? [`${value} transacciones`, name]
                : [`$${Number(value).toFixed(2)}`, name];
            }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
