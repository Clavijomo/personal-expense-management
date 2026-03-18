# Skills Demonstrated

A breakdown of the technical skills applied throughout the development of this project.

---

## React & Next.js

- Used **Next.js App Router** with server and client components (`"use client"` only where interactivity or browser APIs were needed).
- Implemented **two pages** with distinct responsibilities: a dashboard (`/`) and a full CRUD expense list (`/expenses`).
- Handled **SSR hydration mismatches** caused by Zustand's `persist` middleware reading from `localStorage`, solved with a custom `useHydration` hook that delays rendering until the client is ready.
- Applied the **`modalKey` pattern**: incrementing a `key` prop on `ExpenseFormModal` to force a full remount on each open, avoiding stale form state between create and edit flows.

## TypeScript

- Defined strict types for the domain model: `Expense`, `Category` (union type), `ExpenseFilters` — all in `src/types/expense.ts`.
- Used `as const` on the `CATEGORIES` array to preserve literal types and feed them directly into the Zod schema without duplication.
- Typed Recharts Tooltip callbacks correctly, handling the `ValueType | undefined` constraint instead of casting to `number`.

## State Management — Zustand

- Single store (`useExpenseStore`) with `addExpense`, `updateExpense`, `deleteExpense` actions.
- Used `persist` middleware to automatically sync state to `localStorage` under the key `"expenses-storage"`.
- Kept global state minimal: only the expense array lives in Zustand. Filters and UI state (modal open/close, selected expense) live in local component state.

## Forms & Validation — react-hook-form + Zod

- Built a reusable `useExpenseForm` hook that handles both create and edit flows via an optional `expense` prop.
- Used `zodResolver` to connect the Zod schema to react-hook-form.
- Solved the `z.coerce.number()` type conflict with react-hook-form by using `z.number()` and `valueAsNumber: true` in the `register` call instead.
- Wrapped the shadcn `Select` with `Controller` from react-hook-form, since it's an uncontrolled component that doesn't expose a native input ref.

## UI — shadcn/ui & Tailwind CSS

- Installed and used shadcn/ui components: `Dialog`, `Input`, `Select`, `Button`, `Badge`, `Card`, `Table`, `Label`.
- Avoided modifying `src/components/ui/` directly (shadcn convention).
- Applied Tailwind utility classes for layout, spacing, typography, and responsive design.
- Fixed an uncontrolled → controlled React warning on `Select` by defaulting `field.value` to `""` instead of `undefined`.

## Data Visualization — Recharts

- Built a **BarChart** (`ExpenseChart`) grouped by category for the current month, with custom tick formatting and tooltip.
- Built a **two-level PieChart** (`ExpensePieChart`): inner ring shows total amount per category, outer ring shows transaction count per category.
- Used `Cell` to assign distinct colors per category across both charts.
- Removed the default hover cursor overlay (`cursor={false}`) that was rendering as a black rectangle over the bars.

## Custom Hooks & Separation of Concerns

- `useExpenses`: filters by category, search term, and date range; sorts by date descending with `createdAt` as tiebreaker; paginates to 20 results. All derived with `useMemo`.
- `useDashboardMetrics`: computes `totalSpent`, `dailyAverage`, `topCategory`, and `transactionCount` for the current month from the Zustand store.
- `useExpenseForm`: integrates react-hook-form + Zod, resets the form via `useEffect` when editing an existing expense.
- `useHydration`: returns `{ hydrated }` using a `useEffect` that sets a flag after the first client render, used to gate localStorage-dependent UI.

## Testing — Jest & React Testing Library

- Configured Jest with `next/jest`, `jest-environment-jsdom`, `@testing-library/jest-dom`, and the `@/*` path alias.
- **Component tests** (5): `MetricCard`, `ErrorState`, `RecentExpenses`, `ExpenseTable`, `ExpenseFilters` — covering empty states, rendered content, and user interactions.
- **Hook tests** (5): `useExpenses` (category filter, search filter, pagination limit) and `useDashboardMetrics` (total spent, top category) — using `jest.Mock` to mock `useExpenseStore`.

## Git Workflow

- Followed a **feature branch** strategy: each feature developed on its own branch (`feature/`, `fix/`, `docs/`), merged into `develop` via Pull Request, and `develop` merged into `main` at release.
- Wrote commits following **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`.
- Kept `.claude/` out of version control by adding it to `.gitignore` and removing it from tracking with `git rm --cached`.

## AI / LLM Concepts

During the development of this project, the following agentic AI concepts were discussed and applied to the README's AI integration section:

- **Chain of Thought**: a prompting technique where the model reasons step by step before answering. Useful for math or logic problems, but not suited for accessing external data.
- **ReAct**: combines reasoning and acting in a loop (Reason → Act → Observe). Oriented toward search and navigation tasks.
- **Tool Use (Function Calling)**: the pattern chosen for this project's AI integration proposal. The LLM is given a set of tools it can invoke to fetch data selectively, deciding which queries to make at each reasoning step — without receiving a full data dump upfront. This is the standard pattern for agents that need access to user-specific data.
