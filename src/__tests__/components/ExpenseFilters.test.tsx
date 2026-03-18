import { render, screen, fireEvent } from "@testing-library/react";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseFilters as Filters } from "@/types/expense";

const defaultFilters: Filters = {
  category: "all",
  dateFrom: "",
  dateTo: "",
  search: "",
};

describe("ExpenseFilters", () => {
  it("renders the search input", () => {
    render(<ExpenseFilters filters={defaultFilters} onChange={jest.fn()} />);
    expect(
      screen.getByPlaceholderText("Buscar por descripción...")
    ).toBeInTheDocument();
  });

  it("calls onChange with updated search when input changes", () => {
    const onChange = jest.fn();
    render(<ExpenseFilters filters={defaultFilters} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Buscar por descripción...");
    fireEvent.change(input, { target: { value: "almuerzo" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: "almuerzo" })
    );
  });
});
