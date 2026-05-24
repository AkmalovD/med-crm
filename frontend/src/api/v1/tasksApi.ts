import type { Task, TaskComment, TaskFilters, TaskStatus } from '@/types/tasksDashboardTypes'
import type { CreateTaskInput, UpdateTaskInput, AddCommentInput } from '@/validators/taskValidator'
import { MOCK_TASKS, MOCK_COMMENTS } from '@/data/tasksData/tasksDashboardData'

let tasks: Task[] = [...MOCK_TASKS]
let comments: TaskComment[] = [...MOCK_COMMENTS]
let nextTaskId = 100
let nextCommentId = 100

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildFilteredTasks(filters: TaskFilters): Task[] {
  let result = [...tasks]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q),
    )
  }
  if (filters.status) result = result.filter((t) => t.status === filters.status)
  if (filters.priority) result = result.filter((t) => t.priority === filters.priority)
  if (filters.category) result = result.filter((t) => t.category === filters.category)
  if (filters.assigneeId) result = result.filter((t) => t.assigneeId === filters.assigneeId)

  if (filters.due) {
    const today = new Date().toISOString().split('T')[0]
    const weekLater = new Date()
    weekLater.setDate(weekLater.getDate() + 7)
    const weekLaterStr = weekLater.toISOString().split('T')[0]

    if (filters.due === 'overdue') result = result.filter((t) => t.isOverdue)
    else if (filters.due === 'today') result = result.filter((t) => t.isDueToday)
    else if (filters.due === 'this_week')
      result = result.filter(
        (t) => t.dueDate && t.dueDate >= today && t.dueDate <= weekLaterStr,
      )
  }

  const sortBy = filters.sortBy ?? 'createdAt'
  const dir = filters.sortDir === 'asc' ? 1 : -1

  result.sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title) * dir
    if (sortBy === 'dueDate')
      return ((a.dueDate ?? '9999') < (b.dueDate ?? '9999') ? -1 : 1) * dir
    if (sortBy === 'priority') {
      const order: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 }
      return ((order[a.priority] ?? 0) - (order[b.priority] ?? 0)) * dir
    }
    return a.createdAt < b.createdAt ? -dir : dir
  })

  return result
}

export class TasksService {
  private static instance: TasksService | null = null

  private constructor() {}

  static getInstance(): TasksService {
    if (!TasksService.instance) {
      TasksService.instance = new TasksService()
    }
    return TasksService.instance
  }

  getAll = async (filters: TaskFilters): Promise<{ items: Task[]; total: number }> => {
    await delay()
    const filtered = buildFilteredTasks(filters)
    const total = filtered.length
    const start = (filters.page - 1) * filters.perPage
    const items = filtered.slice(start, start + filters.perPage)
    return { items, total }
  }

  getMy = async (userId: string, filters: TaskFilters): Promise<Task[]> => {
    await delay()
    return buildFilteredTasks({ ...filters, assigneeId: userId })
  }

  getById = async (id: string): Promise<Task> => {
    await delay()
    const task = tasks.find((t) => t.id === id)
    if (!task) throw new Error(`Task ${id} not found`)
    return task
  }

  create = async (data: CreateTaskInput): Promise<Task> => {
    await delay()
    const assignee = tasks.find((t) => t.assigneeId === data.assigneeId)?.assignee ?? {
      id: data.assigneeId,
      fullName: 'Unknown',
      avatar: null,
    }
    const newTask: Task = {
      id: `t${++nextTaskId}`,
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? 'todo',
      priority: data.priority ?? 'medium',
      category: data.category,
      assigneeId: data.assigneeId,
      assignee,
      createdById: 'u1',
      createdBy: { id: 'u1', fullName: 'Dr. Emily Smith', avatar: null },
      dueDate: data.dueDate ?? null,
      dueTime: data.dueTime || null,
      isOverdue: false,
      isDueToday: data.dueDate === new Date().toISOString().split('T')[0],
      reminderValue: data.reminderValue ?? null,
      reminderUnit: data.reminderUnit ?? null,
      reminderSentAt: null,
      linkedClientId: data.linkedClientId ?? null,
      linkedClient: null,
      linkedAppointmentId: data.linkedAppointmentId ?? null,
      linkedTherapistId: data.linkedTherapistId ?? null,
      linkedTherapist: null,
      commentsCount: 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tasks = [newTask, ...tasks]
    return newTask
  }

  update = async (id: string, data: UpdateTaskInput): Promise<Task> => {
    await delay()
    tasks = tasks.map((t) => {
      if (t.id !== id) return t
      const dueDate = data.dueDate !== undefined ? (data.dueDate || null) : t.dueDate
      const today = new Date().toISOString().split('T')[0]
      return {
        ...t,
        ...data,
        dueDate,
        dueTime: data.dueTime !== undefined ? (data.dueTime || null) : t.dueTime,
        isDueToday: dueDate === today,
        isOverdue: dueDate ? dueDate < today : false,
        updatedAt: new Date().toISOString(),
      }
    })
    return tasks.find((t) => t.id === id)!
  }

  delete = async (id: string): Promise<void> => {
    await delay()
    tasks = tasks.filter((t) => t.id !== id)
  }

  toggle = async (id: string): Promise<Task> => {
    await delay()
    tasks = tasks.map((t) => {
      if (t.id !== id) return t
      const isDone = t.status !== 'done'
      return {
        ...t,
        status: isDone ? ('done' as const) : ('todo' as const),
        completedAt: isDone ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      }
    })
    return tasks.find((t) => t.id === id)!
  }

  move = async (id: string, status: TaskStatus): Promise<Task> => {
    await delay()
    tasks = tasks.map((t) => {
      if (t.id !== id) return t
      return {
        ...t,
        status,
        completedAt: status === 'done' ? new Date().toISOString() : t.completedAt,
        updatedAt: new Date().toISOString(),
      }
    })
    return tasks.find((t) => t.id === id)!
  }

  getComments = async (taskId: string): Promise<TaskComment[]> => {
    await delay()
    return comments.filter((c) => c.taskId === taskId)
  }

  addComment = async (taskId: string, data: AddCommentInput): Promise<TaskComment> => {
    await delay()
    const newComment: TaskComment = {
      id: `cm${++nextCommentId}`,
      taskId,
      content: data.content,
      mentions: data.mentions ?? [],
      authorId: 'u1',
      author: { id: 'u1', fullName: 'Dr. Emily Smith', avatar: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    comments = [...comments, newComment]
    tasks = tasks.map((t) =>
      t.id === taskId ? { ...t, commentsCount: t.commentsCount + 1 } : t,
    )
    return newComment
  }

  deleteComment = async (taskId: string, commentId: string): Promise<void> => {
    await delay()
    comments = comments.filter((c) => c.id !== commentId)
    tasks = tasks.map((t) =>
      t.id === taskId ? { ...t, commentsCount: Math.max(0, t.commentsCount - 1) } : t,
    )
  }
}

export default TasksService.getInstance()
