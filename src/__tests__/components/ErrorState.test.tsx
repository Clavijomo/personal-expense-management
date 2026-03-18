import { render, screen } from "@testing-library/react";
import { ErrorState } from "@/components/shared/ErrorState";

describe("ErrorState", () => {
  it("renders the error message", () => {
    render(<ErrorState message="Error al cargar los datos" />);
    expect(screen.getByText("Error al cargar los datos")).toBeInTheDocument();
  });

  it("renders the reload button", () => {
    render(<ErrorState message="Error" />);
    expect(screen.getByText("Recargar página")).toBeInTheDocument();
  });
});
