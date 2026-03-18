import { render, screen, fireEvent } from "@testing-library/react";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { Expense } from "@/types/expense";

const mockExpense: Expense = {
  id: "1",
  description: "Almuerzo en restaurante",
  amount: 15.5,
  category: "Comida",
  date: "2026-03-17",
  createdAt: "2026-03-17T12:00:00.000Z",
};

describe("ExpenseTable", () => {
  it("shows empty state when no expenses", () => {
    render(<ExpenseTable expenses={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("No se encontraron gastos.")).toBeInTheDocument();
  });

  it("renders expense description and category", () => {
    render(
      <ExpenseTable expenses={[mockExpense]} onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(screen.getByText("Almuerzo en restaurante")).toBeInTheDocument();
    expect(screen.getByText("Comida")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();
    render(
      <ExpenseTable expenses={[mockExpense]} onEdit={jest.fn()} onDelete={onDelete} />
    );
    fireEvent.click(screen.getByText("Eliminar"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
