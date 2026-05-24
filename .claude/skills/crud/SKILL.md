---
name: crud-module
description: >
  Scaffold a complete CRUD module for the Yo'lDosh / AutoGuide CRM frontend following the
  established layered pattern: Service class (singleton) → React Query hooks → Redux slice →
  TypeScript types. Use this skill whenever the user says "add a new module", "create CRUD for X",
  "new API service", "add hooks for Y", or wants to wire up any new backend resource to the React
  frontend. Also use when extending an existing module with new endpoints, mutations, or slice
  actions. The output must match the exact conventions already in the codebase (NestJS REST,
  Axios BaseClient, TanStack Query v5, Redux Toolkit, Sonner toasts, TypeScript strict).
---

# CRUD Module Skill

## Overview

Every resource in the CRM follows a strict four-layer pattern:

```
src/
├── types/<resource>.ts          ← 1. Types & interfaces
├── api/requests/v1/<resource>Api.ts  ← 2. Service class (singleton)
├── hooks/use<Resource>.ts       ← 3. TanStack Query hooks
└── redux/
    ├── reducers/<resource>.ts   ← 4a. Redux slice (form / UI state)
    └── selectors/<resource>.ts  ← 4b. Selectors (optional)
```

Always generate all four layers unless the user explicitly says to skip one.

---

## Layer 1 — Types (`src/types/<resource>.ts`)

```ts
// ─── Params (list query) ───────────────────────────────────────────────────
export interface <Resource>Params extends WithDefaultParams {
  // add filter fields as needed, e.g.:
  status?: <Resource>StatusEnum
  branchId?: string
  createdAfter?: string
  createdBefore?: string
}

// ─── List item (returned by GET /all) ─────────────────────────────────────
export interface <Resource> {
  id: string
  createdAt: string
  updatedAt: string
  // … domain fields
}

// ─── Full details (returned by GET /:id) ──────────────────────────────────
export interface <Resource>Details extends <Resource> {
  // … extra fields only present in single-item response
}

// ─── Request bodies ────────────────────────────────────────────────────────
export interface Create<Resource>Body {
  // required fields for POST
}

export interface Update<Resource>Body {
  // fields for PUT/PATCH
}

// ─── Status enum + display maps (if applicable) ───────────────────────────
export enum <Resource>StatusEnum {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const <Resource>StatusLabels: Record<<Resource>StatusEnum, string> = {
  [<Resource>StatusEnum.ACTIVE]:   'Активный',
  [<Resource>StatusEnum.INACTIVE]: 'Неактивный',
}
```

**Rules:**
- Always extend `WithDefaultParams` for list params (provides `page`, `size`, `sortFields`, `sortDirections`).
- Keep list item lean; put heavy detail fields only on `<Resource>Details`.
- Put status enums and label maps here, NOT in constants files, unless they are already in `@/constants/`.
- Export everything from the index barrel if one exists for `types/`.

---

## Layer 2 — Service (`src/api/requests/v1/<resource>Api.ts`)

```ts
import { baseApiClient, BaseClient } from '@/api/baseClient'
import {
  <Resource>Params,
  <Resource>,
  <Resource>Details,
  Create<Resource>Body,
  Update<Resource>Body,
} from '@/types/<resource>'

export const <RESOURCE>_SERVICE_SLUG = '/<kebab-resource>'

const urls = {
  getAll:   `${<RESOURCE>_SERVICE_SLUG}/all`,
  create:    <RESOURCE>_SERVICE_SLUG,
  getById:  (id: string) => `${<RESOURCE>_SERVICE_SLUG}/${id}`,
  update:   (id: string) => `${<RESOURCE>_SERVICE_SLUG}/${id}`,
  delete:   (id: string) => `${<RESOURCE>_SERVICE_SLUG}/${id}`,
  // add action endpoints as needed:
  // confirm: (id: string) => `${<RESOURCE>_SERVICE_SLUG}/${id}/confirm`,
}

export class <Resource>Service {
  private static instance: <Resource>Service | null = null

  private constructor(private api: BaseClient) {}

  public static getInstance(): <Resource>Service {
    if (!<Resource>Service.instance) {
      <Resource>Service.instance = new <Resource>Service(baseApiClient)
    }
    return <Resource>Service.instance
  }

  getAll = async (params: <Resource>Params) => {
    const res = await this.api.get<
      ServerResponse<ResponseByPagination<<Resource>>>,
      <Resource>Params,
      any
    >(urls.getAll, params)
    return res.data.data
  }

  create = async (body: Create<Resource>Body) => {
    const res = await this.api.post<ServerResponse<WithId>, Create<Resource>Body>(
      urls.create,
      body,
    )
    return res.data.data
  }

  getById = async (id: string) => {
    const res = await this.api.get<ServerResponse<<Resource>Details>, string, any>(
      urls.getById(id),
    )
    return res.data.data
  }

  update = async (id: string, body: Update<Resource>Body) => {
    const res = await this.api.put<
      ServerResponse<<Resource>Details>,
      Update<Resource>Body
    >(urls.update(id), body)
    return res.data.data
  }

  delete = async (id: string) => {
    const res = await this.api.delete<ServerResponse<{ id: string }>>(urls.delete(id))
    return res.data.data
  }

  // ── Action endpoints (uncomment / copy as needed) ──────────────────────
  // confirm = async (id: string) => {
  //   const res = await this.api.put<ServerResponse<{ id: string }>, undefined>(
  //     urls.confirm(id), undefined,
  //   )
  //   return res.data.data
  // }

  // ── Blob export ─────────────────────────────────────────────────────────
  // export = async (id: string) => {
  //   const res = await this.api.get<Blob, any, any>(
  //     `${urls.getById(id)}/export`, undefined,
  //     { responseType: 'blob', withCredentials: true },
  //   )
  //   return res
  // }
}

export default <Resource>Service.getInstance()
```

**Rules:**
- Always singleton via `getInstance()`.
- `getAll` always uses `ResponseByPagination<T>` wrapper and returns `res.data.data`.
- `create` returns `WithId` (the new record's id); use `<Resource>Details` if the full object is returned.
- Use `this.api.put` for state-transition actions (confirm, reject, process, etc.).
- Blob exports use `{ responseType: 'blob', withCredentials: true }`.

---

## Layer 3 — Hooks (`src/hooks/use<Resource>.ts`)

```ts
import { useMutation, useQuery, useQueryClient } from './useQuery'
import useFilterAndPagination from './useFilterAndPagination'
import <resource>API from '@/api/requests/v1/<resource>Api'
import { Create<Resource>Body, Update<Resource>Body } from '@/types/<resource>'
import { toast } from 'sonner'

// ─── Query keys ────────────────────────────────────────────────────────────
export const <RESOURCE>S_QUERY_KEY = '<resource>s'
export const <RESOURCE>_QUERY_KEY  = '<resource>'

// ─── List ──────────────────────────────────────────────────────────────────
export const useGetAll<Resource>s = () => {
  const {
    filters,
    searchParams,
    convertPagination,
    handlePageChange,
    setSearchParams,
    handlePageSizeChange,
  } = useFilterAndPagination()

  const query = useQuery({
    queryKey: [<RESOURCE>S_QUERY_KEY, filters],
    queryFn:  () => <resource>API.getAll(filters),
  })

  return {
    <resource>s:  query.data?.content ?? [],
    pagination:  convertPagination(query.data),
    ...query,
    handlePageChange,
    handlePageSizeChange,
    setSearchParams,
    searchParams,
    filters,
  }
}

// ─── Single ────────────────────────────────────────────────────────────────
export const useGet<Resource>ById = (id: string) => {
  return useQuery({
    queryKey: [<RESOURCE>_QUERY_KEY, id],
    queryFn:  () => <resource>API.getById(id),
    enabled:  !!id,
  })
}

// ─── Create ────────────────────────────────────────────────────────────────
export const useCreate<Resource> = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: Create<Resource>Body) => <resource>API.create(body),
    onSuccess: () => {
      toast.success('<Resource> успешно создан(а)')
      queryClient.invalidateQueries({ queryKey: [<RESOURCE>S_QUERY_KEY] })
    },
    onError: (err) => {
      toast.error('Ошибка при создании', {
        description: err.response?.data?.message,
      })
    },
  })
}

// ─── Update ────────────────────────────────────────────────────────────────
export const useUpdate<Resource> = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Update<Resource>Body }) =>
      <resource>API.update(id, body),
    onSuccess: (_data, { id }) => {
      toast.success('<Resource> успешно обновлён(а)')
      queryClient.invalidateQueries({ queryKey: [<RESOURCE>S_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [<RESOURCE>_QUERY_KEY, id] })
    },
    onError: (err) => {
      toast.error('Ошибка при обновлении', {
        description: err.response?.data?.message,
      })
    },
  })
}

// ─── Delete ────────────────────────────────────────────────────────────────
export const useDelete<Resource> = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => <resource>API.delete(id),
    onSuccess: () => {
      toast.success('<Resource> удалён(а)')
      queryClient.invalidateQueries({ queryKey: [<RESOURCE>S_QUERY_KEY] })
    },
    onError: (err) => {
      toast.error('Ошибка при удалении', {
        description: err.response?.data?.message,
      })
    },
  })
}

// ─── Action mutation template (copy for confirm / reject / process / etc.) ─
// export const useConfirm<Resource> = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: (id: string) => <resource>API.confirm(id),
//     onSuccess: () => {
//       toast.success('<Resource> подтверждён(а)')
//       queryClient.invalidateQueries({ queryKey: [<RESOURCE>S_QUERY_KEY] })
//     },
//     onError: (err) => {
//       toast.error('Ошибка при подтверждении', { description: err.response?.data?.message })
//     },
//   })
// }
```

**Rules:**
- Always export named query-key constants at the top.
- `useGetAll<Resource>s` must use `useFilterAndPagination` and return the full pagination + filter surface.
- `onSuccess` for mutations **always** calls `queryClient.invalidateQueries` with the list key.
- Update mutations invalidate both the list key **and** the single-item key.
- Toast messages in Russian (matching existing CRM locale).
- Never call `dispatch` inside hooks unless the mutation needs to update Redux state (e.g., opening a modal with `dispatch(openModal(...))`).

---

## Layer 4 — Redux Slice (`src/redux/reducers/<resource>.ts`)

Only create a slice when the resource needs **form/wizard state** or **UI state** that must survive
navigation (multi-step creation flow, selected rows, etc.). For read-only or simple detail pages a
slice is usually not needed — TanStack Query cache is enough.

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface <Resource>FormData {
  // fields collected across creation steps
  field1: string
  field2: string
}

interface <Resource>State {
  formData: <Resource>FormData
  // ui state
}

const initialState: <Resource>State = {
  formData: {
    field1: '',
    field2: '',
  },
}

const <resource>Slice = createSlice({
  name: '<resource>',
  initialState,
  reducers: {
    update<Resource>FormData: (
      state,
      action: PayloadAction<Partial<<Resource>State['formData']>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    reset<Resource>FormData: (state) => {
      state.formData = initialState.formData
    },
  },
})

export const { update<Resource>FormData, reset<Resource>FormData } = <resource>Slice.actions
export default <resource>Slice.reducer
```

Register it in the root reducer (`src/redux/store.ts` or `rootReducer.ts`):
```ts
<resource>: <resource>Reducer,
```

---

## Checklist

When generating a new module, confirm every item:

- [ ] Types file with `Params`, list item, `Details`, and all body interfaces
- [ ] Service class — singleton, all CRUD methods, action endpoints if specified
- [ ] Hooks file — query keys exported, list hook with pagination, single hook, all mutation hooks
- [ ] Redux slice — only if multi-step form or persistent UI state is needed
- [ ] Selectors file — only if selectors are non-trivial (derived data, memoised)
- [ ] Toast messages in Russian
- [ ] `invalidateQueries` on every mutation success
- [ ] `enabled: !!id` guard on single-item query

---

## Common Patterns

### State-transition action (e.g. confirm / reject / process)
Add to service:
```ts
confirm = async (id: string) => {
  const res = await this.api.put<ServerResponse<{ id: string }>, undefined>(
    `${<RESOURCE>_SERVICE_SLUG}/${id}/confirm`, undefined,
  )
  return res.data.data
}
```
Add hook following the action mutation template above.

### Blob export
```ts
// service
exportById = async (id: string) => {
  return this.api.get<Blob, any, any>(
    `${<RESOURCE>_SERVICE_SLUG}/${id}/export`, undefined,
    { responseType: 'blob', withCredentials: true },
  )
}

// hook
export const useExport<Resource> = () =>
  useMutation({
    mutationFn: (id: string) => <resource>API.exportById(id),
    onSuccess: (response) => {
      downloadFile(response.data, response?.headers, '<resource>.pdf')
    },
    onError: (err: any) => {
      toast.error('Ошибка при экспорте', { description: err.response?.data?.message })
    },
  })
```

### Assign / delegate (body with agent id)
```ts
// hook — follow useAssignApplication pattern
mutationFn: ({ id, body }: { id: string; body: AssignBody }) =>
  <resource>API.assign(id, body),
```

### Search param mutation (list filter)
```ts
const handleSearch = useCallback((v: string) => {
  const value = v.trim()
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev)
    if (value) next.set('search', value)
    else next.delete('search')
    return next
  }, { replace: true })
}, [setSearchParams])
```
