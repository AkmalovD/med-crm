# Vocalis — Rooms Page Implementation Prompt

## Stack Reference (from .cursorrules)
- **Framework**: Next.js App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (new-york) + CVA
- **State**: TanStack React Query (server state) + Zustand (UI state)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## Unique Features on This Page
1. **Room catalog** — create and manage physical therapy rooms
2. **Room capacity** — max clients per session per room
3. **Room type** — individual, group, assessment, waiting area
4. **Amenities / equipment** — list what's available in each room
5. **Room status** — available, occupied, under maintenance
6. **Color coding** — unique color per room for calendar display
7. **Room schedule view** — see what sessions are booked per room today
8. **Utilization stats** — how often the room is booked vs available hours
9. **Maintenance mode** — block a room with a reason and date range
10. **Room availability hours** — set operating hours per room

---

## Route & File Structure

```
src/
└── app/
    └── (dashboard)/
        └── rooms/
            ├── page.tsx                        ← Server Component
            ├── loading.tsx                     ← Skeleton loading
            ├── error.tsx                       ← Error boundary
            └── _components/
                ├── RoomsHeader.tsx
                ├── RoomsFilterBar.tsx
                ├── RoomsGrid.tsx
                ├── RoomsTable.tsx
                ├── RoomCard.tsx
                ├── RoomsViewToggle.tsx
                ├── RoomSchedulePanel.tsx
                ├── RoomUtilizationBar.tsx
                ├── CreateRoomModal.tsx
                ├── EditRoomModal.tsx
                └── MaintenanceModeModal.tsx

src/
├── features/
│   └── rooms/
│       ├── api/
│       │   └── rooms.api.ts
│       ├── hooks/
│       │   ├── useRooms.ts
│       │   ├── useRoom.ts
│       │   ├── useCreateRoom.ts
│       │   ├── useUpdateRoom.ts
│       │   ├── useDeleteRoom.ts
│       │   ├── useToggleRoomStatus.ts
│       │   ├── useSetMaintenance.ts
│       │   └── useRoomSchedule.ts
│       ├── types/
│       │   └── rooms.types.ts
│       └── validators/
│           ├── createRoom.schema.ts
│           └── maintenance.schema.ts
└── store/
    └── useRoomStore.ts           ← Zustand: view mode, selected room, modals
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Read filters + view from searchParams
// Fetch initial rooms server-side for fast first paint
export default async function RoomsPage({ searchParams }) {
  const filters = parseRoomFilters(searchParams)
  const initialRooms = await fetchRooms(filters)

  return (
    <RoomsClientShell
      initialRooms={initialRooms}
      initialFilters={filters}
    />
  )
}
```

### Component Rendering Order
```
PageHeader (title + "Add Room" button)
  └── RoomUtilizationBar (today's quick stats)
      └── RoomsFilterBar (search + type + status)
          └── RoomsViewToggle (Grid | List)
              ├── RoomsGrid → RoomCard[]
              └── RoomsTable (TanStack Table)
          └── RoomSchedulePanel (collapsible right panel)
```

---

## State Management

### Zustand Store — `useRoomStore.ts`
```ts
interface RoomStore {
  // View
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void

  // Schedule panel
  isSchedulePanelOpen: boolean
  selectedRoomId: string | null
  toggleSchedulePanel: (roomId: string) => void
  closeSchedulePanel: () => void

  // Modals
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  isMaintenanceModalOpen: boolean
  activeRoomId: string | null

  openCreateModal: () => void
  closeCreateModal: () => void
  openEditModal: (id: string) => void
  closeEditModal: () => void
  openMaintenanceModal: (id: string) => void
  closeMaintenanceModal: () => void
}
```

### React Query Hooks
```ts
useRooms(filters: RoomFilters)
useRoom(id: string)
useRoomSchedule(roomId: string, date: string)

// Mutations
useCreateRoom()
useUpdateRoom()
useDeleteRoom()
useToggleRoomStatus()
useSetMaintenance()
useClearMaintenance()

// Query key constants
export const ROOM_KEYS = {
  all: ['rooms'],
  list: (filters) => ['rooms', 'list', filters],
  detail: (id) => ['rooms', 'detail', id],
  schedule: (id, date) => ['rooms', 'schedule', id, date],
}
```

### URL Search Params
```
?search=room&type=individual&status=available&view=grid
// All filters + view mode in URL — fully bookmarkable
```

---

## Types — `rooms.types.ts`

```ts
export type RoomStatus = 'available' | 'occupied' | 'maintenance'

export type RoomType =
  | 'individual'
  | 'group'
  | 'assessment'
  | 'waiting'
  | 'other'

export type RoomAmenity =
  | 'projector'
  | 'whiteboard'
  | 'mirror'
  | 'computer'
  | 'therapy_equipment'
  | 'audio_system'
  | 'natural_light'
  | 'wheelchair_accessible'
  | 'sink'
  | 'storage'

export interface Room {
  id: string
  name: string                    // e.g. "Room A", "Therapy Room 1"
  description: string | null
  type: RoomType
  capacity: number                // max clients at once
  floor: string | null            // e.g. "1st Floor", "Basement"
  color: string                   // hex color for calendar display
  amenities: RoomAmenity[]
  // Operating hours
  openTime: string                // "08:00"
  closeTime: string               // "20:00"
  // Status
  status: RoomStatus
  // Maintenance fields
  maintenanceFrom: string | null
  maintenanceUntil: string | null
  maintenanceNote: string | null
  // Stats (computed)
  todaySessionCount: number
  utilizationRate: number         // 0-100 percentage this week
  // Meta
  createdAt: string
  updatedAt: string
}

export interface RoomScheduleSlot {
  id: string                      // appointment id
  startTime: string               // "09:00"
  endTime: string                 // "09:50"
  clientName: string
  therapistName: string
  serviceName: string
  status: AppointmentStatus
}

export interface RoomFilters {
  search?: string
  type?: RoomType
  status?: RoomStatus
  page: number
  perPage: number
  sortBy?: 'name' | 'capacity' | 'utilizationRate'
  sortDir?: 'asc' | 'desc'
}
```

---

## Validators

### `createRoom.schema.ts`
```ts
export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(60),
  description: z.string().max(300).optional(),
  type: z.enum(['individual', 'group', 'assessment', 'waiting', 'other']),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(50),
  floor: z.string().max(40).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color').default('#4acf7f'),
  amenities: z.array(
    z.enum([
      'projector', 'whiteboard', 'mirror', 'computer',
      'therapy_equipment', 'audio_system', 'natural_light',
      'wheelchair_accessible', 'sink', 'storage',
    ])
  ).default([]),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time').default('08:00'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time').default('20:00'),
})
.refine((d) => d.openTime < d.closeTime, {
  message: 'Close time must be after open time',
  path: ['closeTime'],
})

export const updateRoomSchema = createRoomSchema.partial()

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>
```

### `maintenance.schema.ts`
```ts
export const maintenanceSchema = z.object({
  maintenanceFrom: z.string().min(1, 'Start date is required'),
  maintenanceUntil: z.string().min(1, 'End date is required'),
  maintenanceNote: z.string().max(300).optional(),
})
.refine(
  (d) => new Date(d.maintenanceFrom) <= new Date(d.maintenanceUntil),
  { message: 'End date must be after start date', path: ['maintenanceUntil'] }
)

export type MaintenanceInput = z.infer<typeof maintenanceSchema>
```

---

## Section 1 — Page Header

### `RoomsHeader.tsx`
```tsx
<PageHeader
  title="Rooms"
  rightContent={
    <div className="flex items-center gap-2">
      <Badge variant="secondary">{totalCount} rooms</Badge>
      <Button className="bg-[#4acf7f] text-white" onClick={openCreateModal}>
        <Plus className="mr-2 h-4 w-4" />
        Add Room
      </Button>
    </div>
  }
/>
```

---

## Section 2 — Utilization Stats Bar

### `RoomUtilizationBar.tsx` — `'use client'`
Four inline stat chips showing today's snapshot across all rooms:

| Stat | Color |
|---|---|
| Total Rooms | neutral |
| Available Now | `#4acf7f` green |
| Occupied Now | `#f59e0b` yellow |
| Under Maintenance | `#ef4444` red |

```tsx
<div className="grid grid-cols-4 gap-4 mb-6">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="bg-white rounded-xl p-4 border flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
        <p className="text-2xl font-bold mt-1">{stat.value}</p>
      </div>
      <div className={cn('rounded-full p-2', stat.bgColor)}>
        <stat.icon className={cn('h-5 w-5', stat.iconColor)} />
      </div>
    </div>
  ))}
</div>
```

- Data derived client-side from `useRooms()` — no extra API call
- Skeleton: 4 skeleton stat cards during loading

---

## Section 3 — Filter Bar

### `RoomsFilterBar.tsx` — `'use client'`
All filters sync to URL search params on change.

```tsx
<div className="flex flex-wrap items-center gap-3">

  <Input
    placeholder="Search rooms..."
    className="w-56"
    // debounced 300ms → ?search= param
  />

  <Select
    placeholder="All Types"
    options={[
      { label: 'Individual', value: 'individual' },
      { label: 'Group', value: 'group' },
      { label: 'Assessment', value: 'assessment' },
      { label: 'Waiting Area', value: 'waiting' },
      { label: 'Other', value: 'other' },
    ]}
    // maps to ?type= param
  />

  <Select
    placeholder="All Statuses"
    options={[
      { label: 'Available', value: 'available' },
      { label: 'Occupied', value: 'occupied' },
      { label: 'Maintenance', value: 'maintenance' },
    ]}
    // maps to ?status= param
  />

  <Button variant="ghost" onClick={clearFilters}>
    <X className="mr-2 h-4 w-4" />
    Clear
  </Button>

</div>
```

---

## Section 4 — View Toggle

### `RoomsViewToggle.tsx` — `'use client'`
```tsx
<div className="flex border rounded-lg overflow-hidden">
  <button
    className={cn('p-2', viewMode === 'grid' ? 'bg-[#4acf7f] text-white' : 'text-muted-foreground')}
    onClick={() => setViewMode('grid')}
  >
    <LayoutGrid className="h-4 w-4" />
  </button>
  <button
    className={cn('p-2', viewMode === 'list' ? 'bg-[#4acf7f] text-white' : 'text-muted-foreground')}
    onClick={() => setViewMode('list')}
  >
    <List className="h-4 w-4" />
  </button>
</div>
```

---

## Section 5 — Rooms Grid View

### `RoomsGrid.tsx` — `'use client'`
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {rooms.map((room) => (
    <RoomCard key={room.id} room={room} />
  ))}
</div>
```

### `RoomCard.tsx` — CVA variant card
**Card layout:**
```
┌───────────────────────────────┐
│ ████ (color bar top, 4px)     │
│                               │
│ [RoomType badge] [Status ●]   │
│                               │
│ Room Name (bold, lg)          │
│ 1st Floor · Capacity: 4       │
│                               │
│ ── Amenities ────────────────│
│ 🖥 Projector  📋 Whiteboard   │
│ ♿ Accessible  🪟 Natural Light│
│                               │
│ ── Today ───────────────────│
│ 6 sessions booked             │
│ [████████░░] 73% utilization  │
│                               │
│ Operating: 08:00 – 20:00      │
│                               │
│ [Schedule] [Edit] [···]       │
└───────────────────────────────┘
```

**Color bar:** 4px top border in `room.color`

**Status badge — CVA:**
```ts
const statusVariants = cva('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    status: {
      available: 'bg-green-100 text-green-700',
      occupied: 'bg-yellow-100 text-yellow-700',
      maintenance: 'bg-red-100 text-red-700',
    }
  }
})
```

**Utilization bar:**
```tsx
<div className="mt-3">
  <div className="flex justify-between text-xs text-muted-foreground mb-1">
    <span>Utilization this week</span>
    <span className="font-medium">{room.utilizationRate}%</span>
  </div>
  <Progress
    value={room.utilizationRate}
    className={cn(
      'h-1.5',
      room.utilizationRate >= 90 && '[&>div]:bg-red-500',
      room.utilizationRate >= 70 && room.utilizationRate < 90 && '[&>div]:bg-amber-500',
      room.utilizationRate < 70 && '[&>div]:bg-[#4acf7f]',
    )}
  />
</div>
```

**Amenities display:**
```tsx
// Show icons for each amenity, max 4 visible + "+N more" tooltip
const amenityIcons: Record<RoomAmenity, { icon: LucideIcon; label: string }> = {
  projector: { icon: Monitor, label: 'Projector' },
  whiteboard: { icon: ClipboardList, label: 'Whiteboard' },
  mirror: { icon: Sparkles, label: 'Mirror' },
  computer: { icon: Laptop, label: 'Computer' },
  therapy_equipment: { icon: Activity, label: 'Therapy Equipment' },
  audio_system: { icon: Volume2, label: 'Audio System' },
  natural_light: { icon: Sun, label: 'Natural Light' },
  wheelchair_accessible: { icon: Accessibility, label: 'Wheelchair Accessible' },
  sink: { icon: Droplets, label: 'Sink' },
  storage: { icon: Archive, label: 'Storage' },
}
```

**Card actions (bottom row):**
- **Schedule** eye icon → `toggleSchedulePanel(room.id)` — opens right panel
- **Edit** pencil icon → `openEditModal(room.id)`
- **More** `<DropdownMenu>`:
  - Set Maintenance → `openMaintenanceModal(room.id)`
  - Clear Maintenance → `useClearMaintenance(room.id)` (shown only if in maintenance)
  - Delete → `<AlertDialog>` — blocked if has upcoming bookings

**Maintenance overlay:**
```tsx
// If room.status === 'maintenance' — show banner inside card
{room.status === 'maintenance' && (
  <div className="absolute inset-0 bg-red-50/80 rounded-xl flex flex-col items-center justify-center gap-2">
    <WrenchIcon className="h-8 w-8 text-red-500" />
    <p className="text-sm font-medium text-red-700">Under Maintenance</p>
    {room.maintenanceUntil && (
      <p className="text-xs text-red-600">
        Until {formatDate(room.maintenanceUntil)}
      </p>
    )}
    <Button
      size="sm"
      variant="outline"
      className="mt-1 border-red-300 text-red-700"
      onClick={() => useClearMaintenance(room.id)}
    >
      Clear Maintenance
    </Button>
  </div>
)}
```

---

## Section 6 — Rooms List View

### `RoomsTable.tsx` — `'use client'`
TanStack Table + shadcn `<Table>` + `DataTable<Room>`

**Column definitions (colocated):**
| Column | Render |
|---|---|
| Room | color dot + name + floor muted below |
| Type | `<Badge>` Individual / Group / Assessment / Waiting |
| Capacity | `X clients` |
| Amenities | icon chips, max 3 + `+N` tooltip |
| Operating Hours | `08:00 – 20:00` |
| Today's Sessions | count number |
| Utilization | mini `<Progress>` bar + percentage |
| Status | `<RoomStatusBadge>` |
| Actions | Schedule / Edit / `<DropdownMenu>` |

**Features:**
- Sortable columns: name, capacity, utilizationRate
- Alternating rows: `even:bg-muted/30`
- Row hover: `hover:bg-[#f0fdf4]`
- Click "Schedule" icon → opens `RoomSchedulePanel`
- Skeleton: 6 rows during loading
- Empty state: illustration + "No rooms yet" + "Add your first room" button

---

## Section 7 — Room Schedule Panel

### `RoomSchedulePanel.tsx` — `'use client'`
Collapsible right slide-in panel (`w-80`) showing today's bookings for selected room.

**Header:**
```tsx
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex items-center gap-2">
    <div
      className="h-3 w-3 rounded-full"
      style={{ backgroundColor: selectedRoom.color }}
    />
    <p className="font-semibold">{selectedRoom.name}</p>
  </div>
  <Button variant="ghost" size="icon" onClick={closeSchedulePanel}>
    <X className="h-4 w-4" />
  </Button>
</div>
```

**Date navigation:**
```tsx
// Simple prev/next day navigation
<div className="flex items-center justify-between px-4 py-2 border-b">
  <Button variant="ghost" size="icon" onClick={prevDay}>
    <ChevronLeft className="h-4 w-4" />
  </Button>
  <span className="text-sm font-medium">{formattedDate}</span>
  <Button variant="ghost" size="icon" onClick={nextDay}>
    <ChevronRight className="h-4 w-4" />
  </Button>
</div>
```

**Schedule timeline:**
```tsx
// Vertical timeline from openTime to closeTime
// Each hour slot shown
// Booked slots filled with appointment card
{scheduleSlots.map((slot) => (
  <div
    key={slot.id}
    className="mx-4 mb-2 rounded-lg p-3 text-sm"
    style={{ backgroundColor: `${selectedRoom.color}20`, borderLeft: `3px solid ${selectedRoom.color}` }}
  >
    <p className="font-medium">{slot.startTime} – {slot.endTime}</p>
    <p className="text-muted-foreground truncate">{slot.clientName}</p>
    <p className="text-xs text-muted-foreground">{slot.therapistName}</p>
    <AppointmentStatusBadge status={slot.status} />
  </div>
))}

// Empty hour slots shown as light gray
{emptySlots.map((hour) => (
  <div key={hour} className="mx-4 mb-1 h-10 rounded-lg bg-muted/30 flex items-center px-3">
    <span className="text-xs text-muted-foreground">{hour}:00</span>
  </div>
))}
```

**Footer summary:**
```tsx
<div className="p-4 border-t mt-auto">
  <p className="text-sm text-muted-foreground">
    {bookedSlots.length} sessions today · {freeSlots.length} slots free
  </p>
</div>
```

- Data fetched via `useRoomSchedule(selectedRoomId, selectedDate)`
- Skeleton: timeline placeholder while loading

---

## Section 8 — Create / Edit Room Modal

### `CreateRoomModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useRoomStore`
- React Hook Form + `createRoomSchema`

**Form layout:**
```
Room Name *          ← text input, e.g. "Therapy Room A"
Description          ← textarea (optional, max 300 chars)

Room Type *          ← Select:
                       Individual / Group / Assessment / Waiting / Other

Capacity *           ← number input (min 1, max 50)
                       Helper: "Maximum number of clients at once"

Floor / Location     ← text input (optional)
                       e.g. "1st Floor", "Building B"

Operating Hours *
  Open Time          ← time select (30-min slots, 06:00 – 12:00)
  Close Time         ← time select (30-min slots, 12:00 – 23:00)
  Inline error if closeTime ≤ openTime

Color                ← color swatch picker + hex input
                       Used in calendar to identify room

── Amenities ─────────────────────────────
(multi-select checkbox grid, 2 columns)
  ☑ Projector          ☐ Whiteboard
  ☐ Mirror             ☑ Computer
  ☑ Therapy Equipment  ☐ Audio System
  ☑ Natural Light      ☑ Wheelchair Accessible
  ☐ Sink               ☐ Storage
```

**Submit behavior:**
- `useCreateRoom()` mutation
- Success: `toast.success('Room created')` + invalidate `ROOM_KEYS.list` + close modal
- Error: `toast.error(message)`

### `EditRoomModal.tsx` — `'use client'`
- Same form pre-filled with existing room data
- Uses `useUpdateRoom()` mutation + `updateRoomSchema`
- Shows warning if room has upcoming bookings and capacity is being reduced:
  ```tsx
  {hasUpcomingBookings && capacityReduced && (
    <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
      <AlertTriangle className="inline mr-1 h-4 w-4" />
      This room has upcoming bookings. Reducing capacity may conflict with group sessions.
    </p>
  )}
  ```

---

## Section 9 — Maintenance Mode Modal

### `MaintenanceModeModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useRoomStore`
- React Hook Form + `maintenanceSchema`

**Form fields:**
```
Room Name (read-only, shown at top)

Maintenance From *   ← date picker
Maintenance Until *  ← date picker
                       Inline error if until < from

Note                 ← textarea (optional, max 300 chars)
                       e.g. "Deep cleaning", "Equipment repair"
```

**Conflict warning:**
```tsx
// If selected date range overlaps existing bookings — show warning
{conflictCount > 0 && (
  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
    <p className="text-sm font-medium text-amber-700">
      <AlertTriangle className="inline mr-1 h-4 w-4" />
      {conflictCount} session{conflictCount > 1 ? 's' : ''} already booked in this period
    </p>
    <p className="text-xs text-amber-600 mt-1">
      These sessions will need to be rescheduled manually.
    </p>
  </div>
)}
```

**Submit behavior:**
- `useSetMaintenance({ id, maintenanceFrom, maintenanceUntil, maintenanceNote })`
- Sets `status = 'maintenance'` on backend
- Success: `toast.success('Room set to maintenance mode')` + invalidate `ROOM_KEYS.list` + close modal
- Error: `toast.error(message)`

**Clear maintenance button** (shown inside modal if room already in maintenance):
```tsx
<Button
  variant="outline"
  className="text-[#4acf7f] border-[#4acf7f]"
  onClick={handleClearMaintenance}
  disabled={isClearPending}
>
  {isClearPending
    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    : <CheckCircle className="mr-2 h-4 w-4" />
  }
  Mark as Available
</Button>
```

---

## API Module — `rooms.api.ts`

```ts
export const roomsApi = {
  getAll: (filters: RoomFilters) =>
    http.get<ResponseByPagination<Room>>('/rooms', {
      params: buildParams(filters),
    }),

  getById: (id: string) =>
    http.get<Room>(`/rooms/${id}`),

  create: (data: CreateRoomInput) =>
    http.post<Room>('/rooms', data),

  update: (id: string, data: UpdateRoomInput) =>
    http.patch<Room>(`/rooms/${id}`, normalizeBodyValues(data)),

  delete: (id: string) =>
    http.delete(`/rooms/${id}`),

  toggleStatus: (id: string, status: RoomStatus) =>
    http.patch<Room>(`/rooms/${id}/status`, { status }),

  setMaintenance: (id: string, data: MaintenanceInput) =>
    http.patch<Room>(`/rooms/${id}/maintenance`, data),

  clearMaintenance: (id: string) =>
    http.patch<Room>(`/rooms/${id}/maintenance/clear`),

  getSchedule: (id: string, date: string) =>
    http.get<RoomScheduleSlot[]>(`/rooms/${id}/schedule`, {
      params: { date },
    }),
}
```

---

## Loading States

- `loading.tsx`: skeleton grid (6 cards) or skeleton table (6 rows)
- Utilization stats bar: 4 skeleton stat chips
- Room cards: skeleton matching card layout with color bar
- Room list: 6 skeleton rows with `<Skeleton>` per cell
- Schedule panel: skeleton timeline slots
- Modal: skeleton inputs while room data loads for edit
- Maintenance conflict check: spinner inline below date pickers

---

## Error Handling

- `error.tsx`: retry + back to dashboard
- Create/Edit form: `<FormMessage>` inline per field
- Delete blocked if upcoming bookings: `<AlertDialog>` — "This room has X upcoming sessions. Reassign them before deleting."
- Maintenance with booking conflicts: inline warning in modal — not blocked, but staff warned
- Capacity reduction warning on edit: inline amber alert
- Clear maintenance: `<AlertDialog>` confirmation — "Mark room as available again?"
- Mutation errors: `toast.error(error.response?.data?.message ?? 'Something went wrong')`

---

## Key Principles Applied

- `page.tsx` is a Server Component — reads `searchParams`, fetches rooms for fast first paint
- All filters + view mode in URL — fully bookmarkable
- Zustand manages schedule panel open state + selected room — shared across grid and table
- Room `color` field flows into calendar appointments for visual room identification
- Utilization stats derived client-side from `useRooms()` — no extra API call needed
- Maintenance modal shows conflict warning but does not block submission — admin decision
- Delete is blocked server-side if upcoming bookings exist — not just hidden in UI
- Schedule panel fetched lazily — only when panel is opened (`enabled: isSchedulePanelOpen`)
- Role-based access: only Admin can create/edit/delete rooms via `<AccessControl>`
- All user-facing strings use i18n translation keys
