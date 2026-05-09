'use client'

import { useState } from 'react'
import { DashboardScaffold } from '../dashboard/DashboardScaffold'
import { TasksHeader } from './TasksHeader'
import { TasksStatsBar } from './TasksStatsBar'
import { TasksViewToggle } from './TasksViewToggle'
import { TasksFilterBar } from './TasksFilterBar'
import { TasksListView } from './TasksListView'
import { TasksBoardView } from './TasksBoardView'
import { TasksMyView } from './TasksMyView'
import { TaskDetailPanel } from './TaskDetailPanel'
import { CreateTaskModal } from './CreateTaskModal'
import { EditTaskModal } from './EditTaskModal'
import { useTaskStore } from '@/store/useTaskStore'
import { useTasks } from '@/hooks/useTasks'
import type { TaskFilters, SortBy, SortDir } from '@/types/tasksDashboardTypes'
import { CURRENT_USER_ID } from '@/data/tasksData/tasksDashboardData'
import { CheckCircle2, XCircle } from 'lucide-react'

const DEFAULT_FILTERS: TaskFilters = {
  page: 1,
  perPage: 20,
  sortBy: 'createdAt',
  sortDir: 'desc',
}

export function TasksDashboardPage() {
  const activeView = useTaskStore((s) => s.activeView)
  const toastMessage = useTaskStore((s) => s.toastMessage)
  const toastType = useTaskStore((s) => s.toastType)

  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS)

  const { data, isLoading } = useTasks(filters)
  const tasks = data?.items ?? []
  const total = data?.total ?? 0

  function handleFiltersChange(partial: Partial<TaskFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  function handleClearFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  function handleSortChange(sortBy: SortBy, sortDir: SortDir) {
    setFilters((prev) => ({ ...prev, sortBy, sortDir, page: 1 }))
  }

  return (
    <DashboardScaffold>
      <div className="flex flex-col gap-4 pb-8">
        <TasksHeader totalCount={total} />
        <TasksStatsBar tasks={tasks} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <TasksViewToggle />
          <TasksFilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {activeView === 'list' && (
          <TasksListView
            tasks={tasks}
            isLoading={isLoading}
            filters={filters}
            total={total}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
        )}
        {activeView === 'board' && (
          <TasksBoardView tasks={tasks} isLoading={isLoading} filters={filters} />
        )}
        {activeView === 'my' && (
          <TasksMyView userId={CURRENT_USER_ID} filters={filters} />
        )}
      </div>

      <TaskDetailPanel />
      <CreateTaskModal />
      <EditTaskModal />

      {toastMessage && (
        <div
          className={[
            'fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium text-white transition-all',
            toastType === 'error' ? 'bg-red-500' : 'bg-[var(--primary)]',
          ].join(' ')}
        >
          {toastType === 'error' ? (
            <XCircle className="h-5 w-5 shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          )}
          {toastMessage}
        </div>
      )}
    </DashboardScaffold>
  )
}
