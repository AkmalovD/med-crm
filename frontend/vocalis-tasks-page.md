# Vocalis — Tasks Page Implementation Prompt

## Stack Reference (from .cursorrules)
- **Framework**: Next.js App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (new-york) + CVA
- **State**: TanStack React Query (server state) + Zustand (UI state)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table (list view)
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## Unique Features on This Page
1. **Task list view** — paginated, sortable, filterable task list
2. **Kanban board view** — To Do / In Progress / Done columns with drag & drop
3. **My Tasks view** — filtered to current user only
4. **Task priorities** — Low / Medium / High / Urgent with color coding
5. **Task categories** — Follow-up, Administrative, Clinical, Billing, Other
6. **Linked entities** — link task to client, appointment, or therapist
7. **Due date with overdue highlighting** — red if overdue, amber if due today
8. **Task comments** — threaded comments per task with @mentions
9. **Reminder setting** — notify X minutes/hours/days before due date
10. **Quick complete toggle** — checkbox inline without opening task

---

## Route & File Structure

```
src/
└── app/
    └── (dashboard)/
        └── tasks/
            ├── page.tsx                        ← Server Component
            ├── loading.tsx                     ← Skeleton loading
            ├── error.tsx                       ← Error boundary
            └── _components/
                ├── TasksHeader.tsx
                ├── TasksViewToggle.tsx
                ├── TasksFilterBar.tsx
                ├── TasksStatsBar.tsx
                ├── TasksListView.tsx
                ├── TasksBoardView.tsx
                ├── TasksMyView.tsx
                ├── TaskRow.tsx
                ├── TaskCard.tsx
                ├── KanbanColumn.tsx
                ├── KanbanCard.tsx
                ├── CreateTaskModal.tsx
                ├── EditTaskModal.tsx
                ├── TaskDetailPanel.tsx
                └── TaskComments.tsx

src/
├── features/
│   └── tasks/
│       ├── api/
│       │   └── tasks.api.ts
│       ├── hooks/
│       │   ├── useTasks.ts
│       │   ├── useTask.ts
│       │   ├── useCreateTask.ts
│       │   ├── useUpdateTask.ts
│       │   ├── useDeleteTask.ts
│       │   ├── useToggleTaskComplete.ts
│       │   ├── useMoveTask.ts
│       │   ├── useTaskComments.ts
│       │   ├── useAddComment.ts
│       │   └── useDeleteComment.ts
│       ├── types/
│       │   └── tasks.types.ts
│       └── validators/
│           ├── createTask.schema.ts
│           └── addComment.schema.ts
└── store/
    └── useTaskStore.ts           ← Zustand: active view, selected task, modals
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Read view + filters from searchParams
// Fetch initial tasks server-side for fast first paint
export default async function TasksPage({ searchParams }) {
  const view = searchParams.view ?? 'list'
  const filters = parseTaskFilters(searchParams)
  const initialTasks = await fetchTasks(filters)

  return (
    <TasksClientShell
      initialTasks={initialTasks}
      initialFilters={filters}
      initialView={view}
    />
  )
}
```

### Component Rendering Order
```
PageHeader (title + "New Task" button)
  └── TasksStatsBar (total / overdue / due today / completed today)
      └── TasksViewToggle (List | Board | My Tasks)
          └── TasksFilterBar (search + priority + status + category + assignee + due date)
              ├── [list view]    → TasksListView (TanStack Table)
              ├── [board view]   → TasksBoardView (Kanban columns)
              └── [my tasks]     → TasksMyView (filtered list)
          └── TaskDetailPanel (slide-in right panel on task click)
```

---

## State Management

### Zustand Store — `useTaskStore.ts`
```ts
interface TaskStore {
  // View
  activeView: 'list' | 'board' | 'my'
  setActiveView: (view: TaskView) => void

  // Detail panel
  isDetailPanelOpen: boolean
  selectedTaskId: string | null
  openDetailPanel: (taskId: string) => void
  closeDetailPanel: () => void

  // Modals
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  activeTaskId: string | null

  openCreateModal: () => void
  closeCreateModal: () => void
  openEditModal: (id: string) => void
  closeEditModal: () => void
}
```

### React Query Hooks
```ts
// Task list with filters
useTasks(filters: TaskFilters)

// My tasks — current user only
useMyTasks(filters: TaskFilters)

// Single task detail
useTask(id: string)

// Comments for a task
useTaskComments(taskId: string)

// Mutations
useCreateTask()
useUpdateTask()
useDeleteTask()
useToggleTaskComplete()     // PATCH /tasks/:id/toggle
useMoveTask()               // PATCH /tasks/:id/status (kanban drag)
useAddComment()
useDeleteComment()

// Query key constants
export const TASK_KEYS = {
  all: ['tasks'],
  list: (filters) => ['tasks', 'list', filters],
  my: (filters) => ['tasks', 'my', filters],
  detail: (id) => ['tasks', 'detail', id],
  comments: (taskId) => ['tasks', 'comments', taskId],
}
```

### URL Search Params
```
?view=board&priority=high&status=todo&category=clinical&assigneeId=abc&due=today&page=1
// Active view + all filters in URL — fully bookmarkable
```

---

## Types — `tasks.types.ts`

```ts
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskCategory =
  | 'follow_up'
  | 'administrative'
  | 'clinical'
  | 'billing'
  | 'other'

export type TaskDueFilter = 'overdue' | 'today' | 'this_week' | 'all'

export type TaskView = 'list' | 'board' | 'my'

export type ReminderUnit = 'minutes' | 'hours' | 'days'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  // Assignment
  assigneeId: string
  assignee: Pick<Therapist, 'id' | 'fullName' | 'avatar'>
  createdById: string
  createdBy: Pick<Therapist, 'id' | 'fullName' | 'avatar'>
  // Due date
  dueDate: string | null          // ISO date
  dueTime: string | null          // "14:00"
  isOverdue: boolean              // computed server-side
  isDueToday: boolean             // computed server-side
  // Reminder
  reminderValue: number | null    // e.g. 30
  reminderUnit: ReminderUnit | null // 'minutes' | 'hours' | 'days'
  reminderSentAt: string | null
  // Linked entities
  linkedClientId: string | null
  linkedClient: Pick<Client, 'id' | 'fullName' | 'avatar'> | null
  linkedAppointmentId: string | null
  linkedTherapistId: string | null
  linkedTherapist: Pick<Therapist, 'id' | 'fullName' | 'avatar'> | null
  // Stats
  commentsCount: number
  // Meta
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  content: string
  mentions: string[]              // user IDs mentioned with @
  authorId: string
  author: Pick<Therapist, 'id' | 'fullName' | 'avatar'>
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  category?: TaskCategory
  assigneeId?: string
  due?: TaskDueFilter
  page: number
  perPage: number
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title'
  sortDir?: 'asc' | 'desc'
}
```

---

## Validators

### `createTask.schema.ts`
```ts
export const createTaskSchema = z.object({
  title: z.string().min(2, 'Title is required').max(120),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum([
    'follow_up', 'administrative', 'clinical', 'billing', 'other'
  ]),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  // Reminder
  reminderValue: z.number().min(1).optional(),
  reminderUnit: z.enum(['minutes', 'hours', 'days']).optional(),
  // Linked entities
  linkedClientId: z.string().optional(),
  linkedAppointmentId: z.string().optional(),
  linkedTherapistId: z.string().optional(),
})
.superRefine((data, ctx) => {
  if (data.reminderValue && !data.dueDate) {
    ctx.addIssue({
      path: ['reminderValue'],
      message: 'Reminder requires a due date',
      code: 'custom',
    })
  }
  if (data.reminderValue && !data.reminderUnit) {
    ctx.addIssue({
      path: ['reminderUnit'],
      message: 'Select reminder unit',
      code: 'custom',
    })
  }
})

export const updateTaskSchema = createTaskSchema.partial()

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
```

### `addComment.schema.ts`
```ts
export const addCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment too long'),
  mentions: z.array(z.string()).default([]),
})

export type AddCommentInput = z.infer<typeof addCommentSchema>
```

---

## Section 1 — Page Header

### `TasksHeader.tsx`
```tsx
<PageHeader
  title="Tasks"
  rightContent={
    <Button className="bg-[#4acf7f] text-white" onClick={openCreateModal}>
      <Plus className="mr-2 h-4 w-4" />
      New Task
    </Button>
  }
/>
```

---

## Section 2 — Stats Bar

### `TasksStatsBar.tsx` — `'use client'`
Four inline stat chips derived client-side from task data:

| Stat | Color |
|---|---|
| Total Tasks | neutral |
| Overdue | `#ef4444` red |
| Due Today | `#f59e0b` amber |
| Completed Today | `#4acf7f` green |

```tsx
<div className="grid grid-cols-4 gap-4 mb-4">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="bg-white rounded-xl p-4 border flex items-center justify-between"
    >
      <div>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
        <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>
          {stat.value}
        </p>
      </div>
      <div className={cn('rounded-full p-2', stat.bgColor)}>
        <stat.icon className={cn('h-5 w-5', stat.iconColor)} />
      </div>
    </div>
  ))}
</div>
```

- Skeleton: 4 stat chips during loading

---

## Section 3 — View Toggle

### `TasksViewToggle.tsx` — `'use client'`
```tsx
// Synced with URL ?view= + Zustand activeView
<div className="flex border rounded-lg overflow-hidden">
  {[
    { value: 'list', icon: List, label: 'List' },
    { value: 'board', icon: Columns, label: 'Board' },
    { value: 'my', icon: User, label: 'My Tasks' },
  ].map(({ value, icon: Icon, label }) => (
    <button
      key={value}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
        activeView === value
          ? 'bg-[#4acf7f] text-white'
          : 'text-muted-foreground hover:bg-muted'
      )}
      onClick={() => setActiveView(value)}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  ))}
</div>
```

---

## Section 4 — Filter Bar

### `TasksFilterBar.tsx` — `'use client'`
All filters sync to URL search params on change.

```tsx
<div className="flex flex-wrap items-center gap-3">

  <Input
    placeholder="Search tasks..."
    className="w-56"
    // debounced 300ms → ?search= param
  />

  <Select
    placeholder="All Priorities"
    options={[
      { label: '🔴 Urgent', value: 'urgent' },
      { label: '🟠 High', value: 'high' },
      { label: '🟡 Medium', value: 'medium' },
      { label: '🟢 Low', value: 'low' },
    ]}
    // maps to ?priority= param
  />

  <Select
    placeholder="All Statuses"
    options={[
      { label: 'To Do', value: 'todo' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Done', value: 'done' },
    ]}
    // maps to ?status= param
  />

  <Select
    placeholder="All Categories"
    options={TASK_CATEGORIES}
    // maps to ?category= param
  />

  <Select
    placeholder="All Assignees"
    options={therapists}
    // maps to ?assigneeId= param
  />

  <Select
    placeholder="Due Date"
    options={[
      { label: 'Overdue', value: 'overdue' },
      { label: 'Due Today', value: 'today' },
      { label: 'This Week', value: 'this_week' },
      { label: 'All', value: 'all' },
    ]}
    // maps to ?due= param
  />

  <Button variant="ghost" onClick={clearFilters}>
    <X className="mr-2 h-4 w-4" />
    Clear
  </Button>

</div>
```

---

## Section 5 — List View

### `TasksListView.tsx` — `'use client'`
TanStack Table + shadcn `<Table>` + `DataTable<Task>`

**Column definitions (colocated):**
| Column | Render |
|---|---|
| Complete | `<Checkbox>` → `useToggleTaskComplete(id)` optimistic update |
| Title | task title + linked entity chip below (client/appointment) |
| Category | `<Badge>` color per category |
| Priority | colored badge — Urgent (red) / High (orange) / Medium (yellow) / Low (green) |
| Assignee | `<Avatar>` + name |
| Due Date | formatted date — red if overdue, amber if today, gray otherwise |
| Status | `<TaskStatusBadge>` |
| Comments | `<MessageSquare>` icon + count |
| Actions | `<DropdownMenu>` Edit / Delete |

**Priority badge CVA:**
```ts
const priorityVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    priority: {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    }
  }
})
```

**Due date rendering:**
```tsx
const dueDateClass = cn(
  'text-sm',
  task.isOverdue && 'text-red-600 font-medium',
  task.isDueToday && !task.isOverdue && 'text-amber-600 font-medium',
  !task.isOverdue && !task.isDueToday && 'text-muted-foreground'
)

// Show icon indicator
{task.isOverdue && <AlertCircle className="inline mr-1 h-3 w-3 text-red-500" />}
{task.isDueToday && !task.isOverdue && <Clock className="inline mr-1 h-3 w-3 text-amber-500" />}
```

**Quick complete checkbox (optimistic):**
```tsx
<Checkbox
  checked={task.status === 'done'}
  onCheckedChange={() => {
    // Optimistic update — toggle locally first
    queryClient.setQueryData(TASK_KEYS.list(filters), (old) =>
      old?.map((t) => t.id === task.id
        ? { ...t, status: t.status === 'done' ? 'todo' : 'done' }
        : t
      )
    )
    toggleTaskComplete(task.id)
  }}
/>
```

**Row click:** opens `TaskDetailPanel` (slide-in right)

**Features:**
- Sortable columns: title, dueDate, priority, createdAt
- Alternating rows: `even:bg-muted/30`
- Row hover: `hover:bg-[#f0fdf4] cursor-pointer`
- Completed tasks: `line-through text-muted-foreground opacity-60`
- Skeleton: 8 rows during loading
- Empty state per filter: "No tasks found" with relevant illustration
- Pagination synced to URL `?page=1&perPage=20`

---

## Section 6 — Board View (Kanban)

### `TasksBoardView.tsx` — `'use client'`
Three columns side by side with drag & drop between them.

```tsx
// Install: npm install @hello-pangea/dnd
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#6b7280' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#4acf7f' },
]

<DragDropContext onDragEnd={handleDragEnd}>
  <div className="grid grid-cols-3 gap-4 h-full">
    {COLUMNS.map((col) => (
      <KanbanColumn
        key={col.id}
        column={col}
        tasks={tasksByStatus[col.id]}
      />
    ))}
  </div>
</DragDropContext>
```

### `KanbanColumn.tsx`
```tsx
interface KanbanColumnProps {
  column: { id: TaskStatus; label: string; color: string }
  tasks: Task[]
}
```

**Column layout:**
```
┌─────────────────────────────┐
│ ● To Do        [12]  [+ Add]│  ← header with count + quick add
│─────────────────────────────│
│ [KanbanCard]                │
│ [KanbanCard]                │
│ [KanbanCard]                │
│ ...                         │
└─────────────────────────────┘
```

- Column header color dot matches `column.color`
- Task count badge
- `[+ Add]` button: opens `CreateTaskModal` with status pre-filled
- Droppable area highlighted on drag-over: `bg-[#f0fdf4] border-[#4acf7f]`
- Scroll independently if many tasks

### `KanbanCard.tsx` — Draggable
```tsx
interface KanbanCardProps {
  task: Task
  index: number
}
```

**Card layout:**
```
┌─────────────────────────────┐
│ [Priority dot] [Category]   │
│                             │
│ Task Title (bold)           │
│ Description (2 lines muted) │
│                             │
│ 🔗 John Smith (client link) │
│                             │
│ [Avatar] Due: Jun 9   💬 3  │
└─────────────────────────────┘
```

- Priority colored left border (red/orange/yellow/green)
- Red bg tint if overdue: `bg-red-50`
- Amber bg tint if due today: `bg-amber-50`
- Click → opens `TaskDetailPanel`
- Drag handle: cursor-grab on `mousedown`

**Drag & drop handler:**
```ts
const handleDragEnd = async (result: DropResult) => {
  if (!result.destination) return
  const { draggableId, destination } = result
  const newStatus = destination.droppableId as TaskStatus

  // Optimistic update
  queryClient.setQueryData(TASK_KEYS.list(filters), (old) =>
    old?.map((t) => t.id === draggableId ? { ...t, status: newStatus } : t)
  )

  try {
    await moveTask({ id: draggableId, status: newStatus })
    toast.success('Task moved')
  } catch {
    // Revert optimistic update
    queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(filters) })
    toast.error('Failed to move task')
  }
}
```

---

## Section 7 — My Tasks View

### `TasksMyView.tsx` — `'use client'`
Filtered list view showing only tasks assigned to the current logged-in user.

**Grouped by due date:**
```
Overdue (3)
  [TaskRow] [TaskRow] [TaskRow]

Due Today (2)
  [TaskRow] [TaskRow]

This Week (5)
  [TaskRow] [TaskRow] ...

Later (8)
  [TaskRow] [TaskRow] ...

No Due Date (4)
  [TaskRow] [TaskRow] ...
```

**Each group header:**
```tsx
<div className="flex items-center gap-2 mb-2">
  <span className={cn(
    'text-sm font-semibold',
    group.id === 'overdue' && 'text-red-600',
    group.id === 'today' && 'text-amber-600',
    group.id === 'week' && 'text-foreground',
  )}>
    {group.label}
  </span>
  <Badge variant="secondary">{group.tasks.length}</Badge>
</div>
```

### `TaskRow.tsx` — compact row for My Tasks
```tsx
// Simpler than full table — inline row with just key info
<div className="flex items-center gap-3 py-2.5 border-b last:border-0 hover:bg-[#f0fdf4] rounded-lg px-2">
  <Checkbox
    checked={task.status === 'done'}
    onCheckedChange={() => toggleTaskComplete(task.id)}
  />
  <div className={cn('flex-1', task.status === 'done' && 'line-through opacity-50')}>
    <p className="text-sm font-medium">{task.title}</p>
    {task.linkedClient && (
      <p className="text-xs text-muted-foreground">
        <Link className="inline mr-1 h-3 w-3" />
        {task.linkedClient.fullName}
      </p>
    )}
  </div>
  <TaskPriorityBadge priority={task.priority} />
  <TaskDueDateChip dueDate={task.dueDate} isOverdue={task.isOverdue} isDueToday={task.isDueToday} />
  <Button variant="ghost" size="icon" onClick={() => openDetailPanel(task.id)}>
    <ChevronRight className="h-4 w-4" />
  </Button>
</div>
```

---

## Section 8 — Task Detail Panel

### `TaskDetailPanel.tsx` — `'use client'`
Slide-in panel from right (`w-96`) — opened on task row/card click.

**Header:**
```tsx
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex items-center gap-2">
    <TaskPriorityBadge priority={task.priority} />
    <TaskStatusBadge status={task.status} />
  </div>
  <div className="flex items-center gap-1">
    <Button variant="ghost" size="icon" onClick={() => openEditModal(task.id)}>
      <Pencil className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={closeDetailPanel}>
      <X className="h-4 w-4" />
    </Button>
  </div>
</div>
```

**Body:**
```
Title (bold, lg)
Description (muted, full text)

─── Details ─────────────────────────
Assignee      [Avatar] Dr. Smith
Category      Clinical
Due Date      Jun 9, 2025 14:00
              ⚠ Overdue (if applicable)
Reminder      30 minutes before
Created by    [Avatar] Admin · Jun 7

─── Linked To ───────────────────────
Client        [Avatar] John Smith  →
Appointment   Jun 8, 09:00 – 09:50 →

─── Comments ────────────────────────
[TaskComments component]
```

- Linked entity links navigate to the relevant page
- Skeleton while loading task detail

---

## Section 9 — Task Comments

### `TaskComments.tsx` — `'use client'`
Shown inside `TaskDetailPanel` at bottom.

**Comments list:**
```tsx
{comments.map((comment) => (
  <div key={comment.id} className="flex items-start gap-3 py-3">
    <Avatar src={comment.author.avatar} className="h-7 w-7 shrink-0" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{comment.author.fullName}</span>
        <span className="text-xs text-muted-foreground">
          {formatRelative(comment.createdAt)}
        </span>
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap">
        {/* Render @mentions in blue */}
        {renderCommentWithMentions(comment.content, comment.mentions)}
      </p>
    </div>
    {/* Delete — only author or admin */}
    {(isAuthor || isAdmin) && (
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground"
        onClick={() => deleteComment(comment.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    )}
  </div>
))}
```

**Comment input:**
```tsx
// Textarea with @mention detection
<div className="border rounded-xl p-3 focus-within:border-[#4acf7f] transition-colors">
  <Textarea
    placeholder="Add a comment... Use @ to mention someone"
    value={commentText}
    onChange={handleCommentChange}
    rows={2}
    className="border-0 p-0 resize-none focus-visible:ring-0"
  />
  {/* @mention dropdown */}
  {showMentionDropdown && (
    <div className="absolute z-10 bg-white border rounded-lg shadow-lg mt-1 w-48">
      {filteredStaff.map((staff) => (
        <button
          key={staff.id}
          className="flex items-center gap-2 px-3 py-2 w-full hover:bg-muted text-sm"
          onClick={() => insertMention(staff)}
        >
          <Avatar src={staff.avatar} className="h-5 w-5" />
          {staff.fullName}
        </button>
      ))}
    </div>
  )}
  <div className="flex justify-end mt-2">
    <Button
      size="sm"
      className="bg-[#4acf7f] text-white"
      onClick={submitComment}
      disabled={!commentText.trim() || isSubmitting}
    >
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Comment'}
    </Button>
  </div>
</div>
```

**@mention logic:**
```ts
const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value
  setCommentText(value)

  // Detect @ symbol and filter staff
  const atIndex = value.lastIndexOf('@')
  if (atIndex !== -1 && atIndex === value.length - 1) {
    setShowMentionDropdown(true)
    setMentionQuery('')
  } else if (atIndex !== -1 && value.slice(atIndex + 1).match(/^\w+$/)) {
    setMentionQuery(value.slice(atIndex + 1))
    setShowMentionDropdown(true)
  } else {
    setShowMentionDropdown(false)
  }
}
```

- `useAddComment()` mutation → invalidates `TASK_KEYS.comments(taskId)`
- `useDeleteComment()` → `<AlertDialog>` confirmation

---

## Section 10 — Create / Edit Task Modal

### `CreateTaskModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useTaskStore`
- React Hook Form + `createTaskSchema`

**Form layout — two columns:**
```
Left column:
  Title *           ← text input (max 120 chars)
  Description       ← textarea (optional, max 1000 chars)
  Category *        ← Select
  Status *          ← Select: To Do / In Progress / Done

Right column:
  Priority *        ← Select with colored option labels
  Assignee *        ← Select (avatar + name per option)
  Due Date          ← Date picker (optional)
  Due Time          ← Time select (optional, 15-min slots)

Full width:
  Reminder          ← inline: [number input] [Select: minutes/hours/days] before due
                       Only shown if due date is set
                       e.g. "30 minutes before"

── Link to ────────────────────────────────────
  Client            ← Combobox (optional, searchable)
  Appointment       ← Select (optional, filtered by linked client if set)
  Therapist         ← Select (optional)
```

**Submit behavior:**
- `useCreateTask()` mutation
- Success: `toast.success('Task created')` + invalidate `TASK_KEYS.list` + `TASK_KEYS.my` + close modal
- Error: `toast.error(message)`

### `EditTaskModal.tsx` — `'use client'`
- Same form pre-filled
- Uses `useUpdateTask()` mutation + `updateTaskSchema`

---

## API Module — `tasks.api.ts`

```ts
export const tasksApi = {
  getAll: (filters: TaskFilters) =>
    http.get<ResponseByPagination<Task>>('/tasks', {
      params: buildParams(filters),
    }),

  getMy: (filters: TaskFilters) =>
    http.get<Task[]>('/tasks/my', {
      params: buildParams(filters),
    }),

  getById: (id: string) =>
    http.get<Task>(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    http.post<Task>('/tasks', data),

  update: (id: string, data: UpdateTaskInput) =>
    http.patch<Task>(`/tasks/${id}`, normalizeBodyValues(data)),

  delete: (id: string) =>
    http.delete(`/tasks/${id}`),

  toggle: (id: string) =>
    http.patch<Task>(`/tasks/${id}/toggle`),

  move: (id: string, status: TaskStatus) =>
    http.patch<Task>(`/tasks/${id}/status`, { status }),

  // Comments
  getComments: (taskId: string) =>
    http.get<TaskComment[]>(`/tasks/${taskId}/comments`),

  addComment: (taskId: string, data: AddCommentInput) =>
    http.post<TaskComment>(`/tasks/${taskId}/comments`, data),

  deleteComment: (taskId: string, commentId: string) =>
    http.delete(`/tasks/${taskId}/comments/${commentId}`),
}
```

---

## Loading States

- `loading.tsx`: skeleton stats bar + view toggle + filter bar + list rows
- Stats bar: 4 skeleton chips
- List view: 8 skeleton rows with `<Skeleton>` per cell
- Board view: 3 skeleton columns with 3 skeleton cards each
- My Tasks view: skeleton grouped rows
- Detail panel: skeleton for all fields + comment rows
- Comments: 3 skeleton comment rows while loading

---

## Error Handling

- `error.tsx`: retry + back to dashboard
- Create/Edit form: `<FormMessage>` inline per field
- Reminder without due date: inline Zod error — "Reminder requires a due date"
- Drag & drop failure: optimistic revert + `toast.error('Failed to move task')`
- Toggle complete failure: optimistic revert + `toast.error('Failed to update task')`
- Delete task: `<AlertDialog>` confirmation — "Delete this task? This cannot be undone."
- Delete comment: `<AlertDialog>` confirmation
- Mutation errors: `toast.error(error.response?.data?.message ?? 'Something went wrong')`

---

## Key Principles Applied

- `page.tsx` is a Server Component — reads `searchParams`, fetches initial tasks for fast first paint
- All filters + active view in URL — fully bookmarkable (e.g. share "My overdue tasks" link)
- Quick complete checkbox uses optimistic update — instant visual feedback, reverts on failure
- Kanban drag & drop uses optimistic update — card moves immediately, reverts if API fails
- Board view uses `@hello-pangea/dnd` — accessible, maintained fork of `react-beautiful-dnd`
- `TaskDetailPanel` is a slide-in panel, not a modal — keeps context visible while reviewing tasks
- Comments @mention detection triggers on `@` character — no external library needed
- My Tasks grouped by due date urgency — overdue first, then today, then this week
- Role-based: therapists see only their own tasks by default — admins see all
- All user-facing strings use i18n translation keys
