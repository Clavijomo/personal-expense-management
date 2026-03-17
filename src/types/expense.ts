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
  date: string; // ISO format: "YYYY-MM-DD"
  createdAt: string; // ISO datetime for tie-breaking sort
}

export interface ExpenseFilters {
  category: Category | "all";
  dateFrom: string;
  dateTo: string;
  search: string;
}
