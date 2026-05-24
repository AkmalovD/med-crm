---
name: frontend-architecture
description: >
  Design and scaffold the folder structure and architectural layers for a new CRM, admin
  dashboard, or business web app using Next.js (App Router), TypeScript, TanStack Query,
  Redux Toolkit, Zod, and shadcn/ui. Use this skill whenever the user says "start a new
  project", "scaffold the architecture", "how should I structure this", "set up the
  folder structure", "create a new CRM", "plan the architecture for X", or is beginning
  a new client project from scratch. Also use when the user wants to add a major new
  domain/module to an existing project and needs to decide where things go. Covers
  Next.js App Router, but principles apply to Vite + React as well.
---

# Frontend Architecture Skill

## Core philosophy

> **One concern, one place.** Every file should have an obvious home. A new developer
> should be able to guess the path of any file from its name alone.

The architecture is **domain-flat** at the top level: shared infrastructure lives in
dedicated folders, domain logic lives in `app/` (pages) and co-located feature folders.
There is no monolithic `features/` folder — each page owns its subcomponents.

---

## Canonical folder structure

```
src/
├── app/                        # Next.js App Router — routes only
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # shared dashboard shell (sidebar, header)
│   │   ├── [module]/           # e.g. applications, contracts, clients
│   │   │   ├── page.tsx        # list page
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx    # detail page (if needed)
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # creation wizard entry
│   │   │   ├── _components/    # components used ONLY by this route
│   │   │   │   ├── columns.tsx
│   │   │   │   ├── [Module]DetailsDrawer.tsx
│   │   │   │   └── new/        # wizard steps (if multi-step)
│   │   │   │       ├── ClientStep.tsx
│   │   │   │       └── CarStep.tsx
│   │   │   └── index.ts
│   └── api/                    # Next.js route handlers (if BFF needed)
│
├── components/
│   ├── ui/                     # shadcn primitives — never edited directly
│   ├── custom-ui/              # your extended primitives
│   │   ├── Input.tsx           # (NumberInput, PhoneInput, DateInput etc.)
│   │   ├── Select.tsx
│   │   ├── DraggableDataTable/
│   │   ├── TableBottomBar/
│   │   └── index.ts            # barrel export
│   ├── layout/                 # PageHeader, Sidebar, DocumentTabs etc.
│   ├── shared/                 # cross-domain display components
│   ├── dialogs/                # global reusable dialogs (Assign, Reject etc.)
│   └── popovers/               # filter popovers etc.
│
├── api/
│   ├── baseClient.ts           # Axios instance, interceptors, token refresh
│   └── requests/
│       ├── v1/                 # one file per resource
│       │   ├── applicationApi.ts
│       │   └── clientApi.ts
│       └── v2/                 # breaking changes go in a new version folder
│
├── hooks/                      # TanStack Query hooks — one file per resource
│   ├── useApplication.ts
│   ├── useClient.ts
│   └── useFilterAndPagination.ts
│
├── redux/
│   ├── store.ts
│   ├── reducers/               # slices — only for wizard/form/UI state
│   ├── selectors/              # memoised selectors
│   └── thunks/                 # async thunks (rare — prefer Query hooks)
│
├── validators/                 # Zod schemas — one file per resource
│   ├── application.ts
│   └── client.ts
│
├── types/                      # TypeScript interfaces/enums — one file per resource
│   ├── application.ts
│   └── client.ts
│
├── constants/                  # Status enums, label maps, magic values
│   └── application-constants.ts
│
├── utils/                      # Pure functions — no React, no side effects
│   ├── format-utils.ts
│   └── helper.ts
│
├── contexts/                   # React contexts (auth, theme etc.)
├── lib/                        # Third-party config (cn, dayjs, i18n setup)
├── assets/                     # Static files
└── router/                     # Route path constants
    └── paths.ts
```

---

## Key rules

### 1. Page vs component boundary
- `app/[module]/page.tsx` — route entry, minimal logic, composes `_components/`
- `app/[module]/_components/` — components used **only** by this route
- `components/shared/` — components used by **2+ routes**
- Never import from another route's `_components/` folder

### 2. API versioning
- `api/requests/v1/` for current stable endpoints
- `api/requests/v2/` when a resource gets a breaking API change
- Never mix v1 and v2 calls in the same hook file

### 3. Hooks are the only data-fetching layer
- Pages and components never call `api/requests/` directly
- All server state lives in `hooks/use<Resource>.ts`
- All client/UI state lives in Redux slices under `redux/reducers/`
- No `useEffect` + `useState` for data fetching — always TanStack Query

### 4. Redux scope
- **Use Redux for:** multi-step wizard state, form data that survives navigation, selected rows/items, modal open state when shared across distant components
- **Do NOT use Redux for:** server data (use Query cache), local toggle state, form state inside a single dialog
- Slices live in `redux/reducers/`, never colocated with components

### 5. Types vs validators vs constants
- `types/` — shapes returned by the API and used in components (`interface`, `type`, `enum`)
- `validators/` — Zod schemas for form input validation (`z.object`, `.refine`)
- `constants/` — display maps, status label objects, magic strings/numbers
- Never put Zod schemas in `types/`, never put API interfaces in `validators/`

### 6. Component naming
- Pages: `<Module>Page.tsx` (e.g. `ApplicationsPage.tsx`)
- Dialogs: `<Action><Resource>Dialog.tsx` (e.g. `RejectApplicationDialog.tsx`)
- Drawers: `<Resource>DetailsDrawer.tsx`
- Columns: always `columns.tsx`, colocated with its page
- Wizard steps: `<Step>Page.tsx` or `<Step>Step.tsx`

### 7. Barrel exports
- Every folder that is imported from outside has an `index.ts`
- `index.ts` only re-exports — no logic
- `components/custom-ui/index.ts` exports all custom primitives so imports are `@/components/custom-ui` not `@/components/custom-ui/Input/Input`

---

## Next.js App Router specifics

```
app/
├── layout.tsx              # root layout — providers (QueryClient, Redux, i18n)
├── (auth)/                 # route group — no layout segment in URL
│   └── login/page.tsx
├── (dashboard)/
│   ├── layout.tsx          # dashboard shell — auth guard, sidebar, header
│   └── applications/
│       ├── page.tsx        # /applications
│       └── new/
│           └── page.tsx    # /applications/new
```

**Provider setup in root layout:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ReduxProvider>
          <QueryProvider>        {/* TanStack Query */}
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
```

**Route groups for auth separation:**
- `(auth)/` — public routes, no sidebar
- `(dashboard)/` — protected routes, shared shell layout
- Guard lives in `(dashboard)/layout.tsx`, not in individual pages

**Server vs Client components:**
- Pages (`page.tsx`) are Server Components by default — keep them that way
- Add `'use client'` only to components that use hooks, event handlers, or browser APIs
- Data-fetching components that use TanStack Query must be `'use client'`
- Mark the smallest possible subtree as client — not the whole page

---

## New module checklist

When adding a new resource (e.g. `warehouses`):

- [ ] `src/types/warehouse.ts` — interfaces, enums
- [ ] `src/constants/warehouse-constants.ts` — status labels (if needed)
- [ ] `src/api/requests/v1/warehouseApi.ts` — service singleton
- [ ] `src/hooks/useWarehouse.ts` — Query hooks
- [ ] `src/validators/warehouse.ts` — Zod schemas (if forms exist)
- [ ] `src/redux/reducers/warehouse.ts` — slice (only if wizard/multi-step)
- [ ] `src/app/(dashboard)/warehouses/page.tsx` — list page
- [ ] `src/app/(dashboard)/warehouses/_components/columns.tsx`
- [ ] `src/app/(dashboard)/warehouses/_components/WarehouseDetailsDrawer.tsx`
- [ ] `src/router/paths.ts` — add route constant
- [ ] Register reducer in `redux/store.ts` (if slice created)

---

## What goes where — quick reference

| I need to... | Create/edit... |
|---|---|
| Define API response shape | `types/<resource>.ts` |
| Call a backend endpoint | `api/requests/v1/<resource>Api.ts` |
| Fetch/mutate data in a component | `hooks/use<Resource>.ts` |
| Validate a form | `validators/<resource>.ts` |
| Store wizard step data | `redux/reducers/<resource>.ts` |
| Show a list page with table | `app/(dashboard)/<resource>/page.tsx` |
| Add a column definition | `app/(dashboard)/<resource>/_components/columns.tsx` |
| Add a reusable dialog | `components/dialogs/<Action><Resource>Dialog.tsx` |
| Add a route-specific component | `app/(dashboard)/<resource>/_components/` |
| Add a shared display component | `components/shared/` |
| Add a new input primitive | `components/custom-ui/` |
| Add a utility function | `utils/<concern>-utils.ts` |
| Add a status label map | `constants/<resource>-constants.ts` |
| Add a route path constant | `router/paths.ts` |

---

## Anti-patterns to avoid

- ❌ Fetching data with `useEffect + useState` instead of TanStack Query
- ❌ Importing from another page's `_components/` folder
- ❌ Putting business logic in `page.tsx` — extract to `_components/` or hooks
- ❌ Storing server data in Redux — that's the Query cache's job
- ❌ Putting Zod schemas inside component files — always `validators/`
- ❌ One giant `features/` folder — pages own their components
- ❌ `'use client'` on `page.tsx` — push it down to the smallest client subtree
- ❌ Skipping `index.ts` barrel exports on shared folders — breaks import consistency
- ❌ Direct `api/requests/` calls from components — always go through hooks
