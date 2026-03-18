# Personal Expense Management

A web application for personal expense tracking built as a Frontend technical assessment. It allows users to create, edit, filter, and visualize expenses with persistence via localStorage.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Main framework, routing, SSR/CSR |
| TypeScript | Static typing throughout the app |
| TailwindCSS | Utility-first styling |
| shadcn/ui | Accessible UI components (Dialog, Select, Table, Badge...) |
| Zustand + persist | Global state with localStorage sync |
| react-hook-form + Zod | Schema-based form validation |
| Recharts | Bar and pie charts |
| Jest + React Testing Library | Unit tests for hooks and components |

## Prerequisites

- **Node.js >= 20.9.0** (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm >= 10

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd personal-expense-management

# Use the correct Node version (if you have nvm)
nvm use

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

```bash
# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (font, metadata, language)
│   ├── page.tsx                # Dashboard page
│   └── expenses/
│       └── page.tsx            # Expense list page
│
├── components/
│   ├── dashboard/
│   │   ├── MetricCard.tsx      # Individual metric card
│   │   ├── ExpenseChart.tsx    # Bar chart by category
│   │   ├── ExpensePieChart.tsx # Two-level pie chart
│   │   └── RecentExpenses.tsx  # Last 5 expenses
│   ├── expenses/
│   │   ├── ExpenseFilters.tsx  # Filters: search, category, date range
│   │   └── ExpenseTable.tsx    # Expense table with actions
│   ├── shared/
│   │   ├── ExpenseFormModal.tsx # Create/edit modal
│   │   ├── LoadingSpinner.tsx  # Loading state
│   │   └── ErrorState.tsx      # Error state with reload
│   └── ui/                     # Generated shadcn/ui primitives
│
├── hooks/
│   ├── useExpenses.ts          # Filtering, sorting, and pagination
│   ├── useDashboardMetrics.ts  # Current month derived metrics
│   ├── useExpenseForm.ts       # Form logic (create/edit)
│   └── useHydration.ts         # Store hydration detection
│
├── store/
│   └── useExpenseStore.ts      # Zustand store with persistence
│
├── schemas/
│   └── expense.schema.ts       # Zod validation schema
│
├── types/
│   └── expense.ts              # Types: Expense, Category, ExpenseFilters
│
└── __tests__/
    ├── components/             # UI component tests
    └── hooks/                  # Hook and business logic tests
```

## Architecture Decisions

- **Local vs global state**: expense filters live in local component state (ephemeral), while the expense list lives in Zustand (shared and persisted).
- **`modalKey` pattern**: incrementing a key on modal open forces a full remount of `ExpenseFormModal`, preventing stale form values when switching between create and edit.
- **`useHydration` hook**: prevents the server from rendering localStorage data that isn't yet available, avoiding Next.js hydration mismatches.
- **Custom hooks for business logic**: `useExpenses` and `useDashboardMetrics` use `useMemo` to derive data from the store without side effects, keeping components focused purely on presentation.

---

## AI Integration Potential

In a scenario where AI capabilities are required (e.g. automatic expense categorization, financial assistant, etc.):

### 1. How would you design the AI workflow? What agentic pattern would you implement?

I would implement the **Tool Use** pattern (Function Calling). Instead of dumping all data to the LLM at once, the model is given a set of tools it can invoke to fetch exactly the information it needs at each reasoning step.

This is the most suitable pattern here because the user's data lives on the client (Zustand/localStorage) and the LLM needs selective access to it, not a full data dump. It also lets the model decide which queries to make without the developer having to anticipate all of them upfront.

**Agentic workflow diagram — "Analyze my expenses for the month and suggest optimizations":**

```
User: "Analyze my expenses for the month and suggest optimizations"
         │
         ▼
┌──────────────────────────┐
│   LLM                    │  ← receives message + tool definitions
│                          │
│  Reasons: I need the     │
│  current month expenses  │
└───────────┬──────────────┘
            │ tool_use: get_expenses_by_month({ month: "2026-03" })
            ▼
┌──────────────────────────┐
│   App (Next.js API route)│  ← executes the tool
│                          │
│  Reads Zustand store /   │
│  queries the database    │
└───────────┬──────────────┘
            │ tool_result: [{ category, amount, date }, ...]
            ▼
┌──────────────────────────┐
│   LLM                    │  ← analyzes, decides if it needs more data
│                          │
│  Reasons: I need the     │
│  historical average      │
└───────────┬──────────────┘
            │ tool_use: get_monthly_average({ months: 3 })
            ▼
┌──────────────────────────┐
│   App (Next.js API route)│
│                          │
│  Computes average over   │
│  the last 3 months       │
└───────────┬──────────────┘
            │ tool_result: { Food: 120, Transport: 45, ... }
            ▼
┌──────────────────────────┐
│   LLM                    │  ← has everything it needs
│                          │
│  Generates analysis and  │
│  concrete suggestions    │
└───────────┬──────────────┘
            │
            ▼
"This month you spent $85 on Food, 42% above your $60 average.
 Consider limiting restaurant outings to 2 per week."
```

### 2. How would you integrate this feature into the existing project architecture?

The integration would happen across three layers without breaking what already exists:

- **Next.js API Route** (`src/app/api/ai/analyze/route.ts`): receives the client request, runs the Tool Use loop against the LLM, and returns the final response. Tools are functions that read from the serialized store or a future database.

- **Custom hook** (`src/hooks/useAIAnalysis.ts`): wraps the API route call, handles loading/error state, and exposes the result to the component. Follows the same pattern as `useDashboardMetrics` — logic separated from the UI.

- **UI component** (`src/components/dashboard/AIInsights.tsx`): a button to trigger the analysis and a text area to display the LLM response. Added to the dashboard without modifying existing components.

### 3. What considerations would you have for state management, error handling, and LLM call latency?

**State:**
- The analysis result is stored in local component state (not Zustand), since it's ephemeral and doesn't need to persist across sessions.
- A `status: "idle" | "loading" | "success" | "error"` field controls the UI state machine.

**Errors:**
- Automatic retries with exponential backoff for transient network errors (rate limits, timeouts).
- Differentiated error messages: distinguish network failures, exceeded API quota, and unexpected model responses.
- Never expose raw technical error details to the end user.

**Latency:**
- Show a spinner or skeleton while waiting for the response (LLM calls can take 3–10 seconds).
- Use **streaming** (`stream: true` in the Anthropic API) to display the response token by token, reducing perceived wait time.
- Implement a timeout in the API route to avoid hanging requests indefinitely.
- Cache responses for a short period (e.g. 5 minutes) if the user triggers the analysis multiple times without changing their data.
