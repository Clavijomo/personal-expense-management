import { render, screen } from "@testing-library/react";
import { RecentExpenses } from "@/components/dashboard/RecentExpenses";
import { Expense } from "@/types/expense";

const mockExpense: Expense = {
  id: "1",
  description: "Almuerzo en restaurante",
  amount: 15.5,
  category: "Comida",
  date: "2026-03-17",
  createdAt: "2026-03-17T12:00:00.000Z",
};

describe("RecentExpenses", () => {
  it("shows empty state when no expenses", () => {
    render(<RecentExpenses expenses={[]} />);
    expect(screen.getByText("No hay gastos registrados.")).toBeInTheDocument();
  });

  it("renders expense description and category", () => {
    render(<RecentExpenses expenses={[mockExpense]} />);
    expect(screen.getByText("Almuerzo en restaurante")).toBeInTheDocument();
    expect(screen.getByText("Comida")).toBeInTheDocument();
  });
});
