import type { TaskFilters } from '@/types/tasksDashboardTypes'

export const USERS_QUERY_KEY = 'users'
export const USER_QUERY_KEY = 'user'

export const CLIENTS_QUERY_KEY = 'clients'
export const CLIENT_QUERY_KEY = 'client'
export const CLIENTS_TOTAL_QUERY_KEY = 'clients-total'

export const PATIENTS_QUERY_KEY = 'patients'
export const PATIENTS_TOTAL_QUERY_KEY = 'patients-total'

export const SESSIONS_TOTAL_QUERY_KEY = 'sessions-total'

export const TASK_KEYS = {
  all: ['tasks'] as const,
  list: (filters: Partial<TaskFilters>) => ['tasks', 'list', filters] as const,
  my: (filters: Partial<TaskFilters>) => ['tasks', 'my', filters] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
  comments: (taskId: string) => ['tasks', 'comments', taskId] as const,
}
