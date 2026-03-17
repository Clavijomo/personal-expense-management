"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, ExpenseFilters as Filters } from "@/types/expense";

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ExpenseFilters({ filters, onChange }: ExpenseFiltersProps) {
  const update = (partial: Partial<Filters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Buscar por descripción..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        className="sm:max-w-xs"
      />

      <Select
        value={filters.category}
        onValueChange={(value) =>
          update({ category: value as Filters["category"] })
        }
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update({ dateFrom: e.target.value })}
          className="w-auto"
        />
        <span className="text-sm text-muted-foreground">—</span>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => update({ dateTo: e.target.value })}
          className="w-auto"
        />
      </div>
    </div>
  );
}
