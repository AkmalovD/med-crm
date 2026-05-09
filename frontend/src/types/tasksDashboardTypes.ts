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

export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'title'
export type SortDir = 'asc' | 'desc'

export interface TaskPerson {
  id: string
  fullName: string
  avatar: string | null
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  assigneeId: string
  assignee: TaskPerson
  createdById: string
  createdBy: TaskPerson
  dueDate: string | null
  dueTime: string | null
  isOverdue: boolean
  isDueToday: boolean
  reminderValue: number | null
  reminderUnit: ReminderUnit | null
  reminderSentAt: string | null
  linkedClientId: string | null
  linkedClient: TaskPerson | null
  linkedAppointmentId: string | null
  linkedTherapistId: string | null
  linkedTherapist: TaskPerson | null
  commentsCount: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  content: string
  mentions: string[]
  authorId: string
  author: TaskPerson
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  search?: string
  status?: TaskStatus | ''
  priority?: TaskPriority | ''
  category?: TaskCategory | ''
  assigneeId?: string
  due?: TaskDueFilter | ''
  page: number
  perPage: number
  sortBy?: SortBy
  sortDir?: SortDir
}

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  follow_up: 'Follow-up',
  administrative: 'Administrative',
  clinical: 'Clinical',
  billing: 'Billing',
  other: 'Other',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}
