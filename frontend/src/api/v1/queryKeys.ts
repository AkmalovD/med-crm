import type { TaskFilters } from '@/types/tasksDashboardTypes'

export const queryKeys = {
  users: ['users'] as const,
  getUserById: (id: string) => ['users', id] as const,
  sessionsTotal: ['sessions', 'total'] as const,
  patients: ['patient'] as const,
  patientsTotal: ['patients', 'total'] as const,
  clients: ['clients'] as const,
  clientById: (id: string) => ['clients', id] as const,
  clientsTotal: ['clients', 'total'] as const,
}

export const TASK_KEYS = {
  all: ['tasks'] as const,
  list: (filters: Partial<TaskFilters>) => ['tasks', 'list', filters] as const,
  my: (filters: Partial<TaskFilters>) => ['tasks', 'my', filters] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
  comments: (taskId: string) => ['tasks', 'comments', taskId] as const,
}