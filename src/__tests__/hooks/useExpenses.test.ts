import { renderHook } from "@testing-library/react";
import { useExpenses } from "@/hooks/useExpenses";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense } from "@/types/expense";

jest.mock("@/store/useExpenseStore");

const NOW = new Date();
const MONTH = `${NOW.getFullYear()}-${String(NOW.getMonth() + 1).padStart(2, "0")}`;

const mockExpenses: Expense[] = [
  { id: "1", description: "Almuerzo", amount: 50, category: "Comida", date: `${MONTH}-10`, createdAt: `${MONTH}-10T12:00:00Z` },
  { id: "2", description: "Bus", amount: 5, category: "Transporte", date: `${MONTH}-11`, createdAt: `${MONTH}-11T08:00:00Z` },
  { id: "3", description: "Cine", amount: 20, category: "Entretenimiento", date: `${MONTH}-12`, createdAt: `${MONTH}-12T20:00:00Z` },
];

beforeEach(() => {
  (useExpenseStore as jest.Mock).mockReturnValue({
    expenses: mockExpenses,
    addExpense: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
  });
});

describe("useExpenses", () => {
  it("filters expenses by category", () => {
    const { result } = renderHook(() =>
      useExpenses({ category: "Comida", dateFrom: "", dateTo: "", search: "" })
    );
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].description).toBe("Almuerzo");
  });

  it("filters expenses by description search", () => {
    const { result } = renderHook(() =>
      useExpenses({ category: "all", dateFrom: "", dateTo: "", search: "bus" })
    );
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].category).toBe("Transporte");
  });

  it("paginates to a maximum of 20 results", () => {
    const many: Expense[] = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      description: `Gasto ${i}`,
      amount: 10,
      category: "Comida" as const,
      date: `${MONTH}-01`,
      createdAt: `${MONTH}-01T00:00:00Z`,
    }));
    (useExpenseStore as jest.Mock).mockReturnValue({
      expenses: many,
      addExpense: jest.fn(),
      updateExpense: jest.fn(),
      deleteExpense: jest.fn(),
    });
    const { result } = renderHook(() => useExpenses());
    expect(result.current.paginated).toHaveLength(20);
  });
});
