export type Category =
  | "Comida"
  | "Transporte"
  | "Entretenimiento"
  | "Salud"
  | "Compras"
  | "Servicios"
  | "Otros";

export const CATEGORIES: Category[] = [
  "Comida",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Compras",
  "Servicios",
  "Otros",
];

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  createdAt: string;
}

export interface ExpenseFilters {
  category: Category | "all";
  dateFrom: string;
  dateTo: string;
  search: string;
}
