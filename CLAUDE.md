# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run Jest tests once
npm run test:watch   # Run Jest in watch mode

# Run a single test file
npx jest src/__tests__/components/MetricCard.test.tsx
```

## Architecture

**Stack**: Next.js (App Router) + TypeScript + Zustand + React Hook Form + Zod + Recharts + shadcn/ui + Tailwind CSS v4

**Pages** (`src/app/`):
- `/` — Dashboard with metrics, charts, and recent expenses
- `/expenses` — Full expense list with filtering, pagination, CRUD

**State**: Single Zustand store (`src/store/useExpenseStore.ts`) with `persist` middleware writing to `localStorage`. All expense CRUD lives here.

**Data flow**:
1. User action → custom hook (in `src/hooks/`) → Zustand store mutation
2. Components read store state via selectors; hooks derive computed values (metrics, filtered lists, pagination)
3. Forms use React Hook Form + Zod schemas from `src/schemas/expense.schema.ts`

**Component layers**:
- `src/components/ui/` — shadcn/ui primitives (do not modify directly)
- `src/components/shared/` — app-wide reusable components (modal, error state, spinner)
- `src/components/dashboard/` and `src/components/expenses/` — feature-specific components

**Key hooks**:
- `useExpenses` — filtering, search, and pagination over store data
- `useDashboardMetrics` — derived metrics computed from store
- `useExpenseForm` — React Hook Form wiring for create/edit
- `useHydration` — guards against Zustand SSR hydration mismatch

**Types & validation**: `src/types/expense.ts` for interfaces; `src/schemas/expense.schema.ts` for Zod schemas. UI text and validation messages are in Spanish.

**Tests** (`src/__tests__/`): Jest + React Testing Library. Tests mirror `src/` under `components/` and `hooks/` subdirectories. Use `jest-environment-jsdom`.

**Path alias**: `@/*` maps to `src/*`.
