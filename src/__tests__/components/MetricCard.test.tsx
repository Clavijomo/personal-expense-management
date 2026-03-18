import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/dashboard/MetricCard";

describe("MetricCard", () => {
  it("renders title and value correctly", () => {
    render(<MetricCard title="Total este mes" value="$150.00" />);
    expect(screen.getByText("Total este mes")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();
  });

  it("renders optional description when provided", () => {
    render(<MetricCard title="Transacciones" value="5" description="este mes" />);
    expect(screen.getByText("este mes")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<MetricCard title="Total" value="$0.00" />);
    expect(screen.queryByText("este mes")).not.toBeInTheDocument();
  });
});
