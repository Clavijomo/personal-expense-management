import { renderHook } from "@testing-library/react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Expense } from "@/types/expense";

jest.mock("@/store/useExpenseStore");

const NOW = new Date();
const MONTH = `${NOW.getFullYear()}-${String(NOW.getMonth() + 1).padStart(2, "0")}`;

const mockExpenses: Expense[] = [
  { id: "1", description: "Almuerzo", amount: 50, category: "Comida", date: `${MONTH}-10`, createdAt: `${MONTH}-10T12:00:00Z` },
  { id: "2", description: "Cena", amount: 30, category: "Comida", date: `${MONTH}-11`, createdAt: `${MONTH}-11T20:00:00Z` },
  { id: "3", description: "Bus", amount: 5, category: "Transporte", date: `${MONTH}-12`, createdAt: `${MONTH}-12T08:00:00Z` },
];

beforeEach(() => {
  (useExpenseStore as jest.Mock).mockReturnValue({ expenses: mockExpenses });
});

describe("useDashboardMetrics", () => {
  it("calculates total spent for current month", () => {
    const { result } = renderHook(() => useDashboardMetrics());
    expect(result.current.totalSpent).toBe(85);
  });

  it("identifies the top spending category", () => {
    const { result } = renderHook(() => useDashboardMetrics());
    expect(result.current.topCategory).toBe("Comida");
  });
});
