import { z } from "zod";

const CATEGORY_VALUES = [
  "Comida",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Compras",
  "Servicios",
  "Otros",
] as const;

export const expenseSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(100, "La descripción no puede superar los 100 caracteres"),
  amount: z
    .number({ error: "El monto debe ser un número" })
    .positive("El monto debe ser mayor a 0")
    .multipleOf(0.01, "El monto no puede tener más de 2 decimales"),
  category: z.enum(CATEGORY_VALUES, {
    error: "Selecciona una categoría válida",
  }),
  date: z
    .string()
    .min(1, "La fecha es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
