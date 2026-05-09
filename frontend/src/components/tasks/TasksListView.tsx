'use client'

import { AlertCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MessageSquare, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { useDeleteTask, useToggleTaskComplete } from '@/hooks/useTasks'
import type { Task, TaskFilters, SortBy, SortDir } from '@/types/tasksDashboardTypes'
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/types/tasksDashboardTypes'

interface Props {
  tasks: Task[]
  isLoading: boolean
  filters: TaskFilters
  total: number
  onFiltersChange: (partial: Partial<TaskFilters>) => void
  onSortChange: (sortBy: SortBy, sortDir: SortDir) => void
}

function PriorityBadge({ priority }: { priority: Task['priority'] }) {
  const cls: Record<Task['priority'], string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const cls: Record<Task['status'], string> = {
    todo: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function CategoryBadge({ category }: { category: Task['category'] }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
      {CATEGORY_LABELS[category]}
    </span>
  )
}

function DueDateCell({ task }: { task: Task }) {
  if (!task.dueDate) return <span className="text-sm text-[var(--soft-text)]">—</span>

  const formatted = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  if (task.isOverdue && task.status !== 'done') {
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-red-600">
        <AlertCircle className="h-3.5 w-3.5" />
        {formatted}
      </span>
    )
  }
  if (task.isDueToday && task.status !== 'done') {
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
        <Clock className="h-3.5 w-3.5" />
        {formatted}
      </span>
    )
  }
  return <span className="text-sm text-[var(--soft-text)]">{formatted}</span>
}

function SortIcon({ column, sortBy, sortDir }: { column: SortBy; sortBy?: SortBy; sortDir?: SortDir }) {
  if (sortBy !== column) return <ChevronDown className="h-3.5 w-3.5 opacity-30" />
  return sortDir === 'asc'
    ? <ChevronUp className="h-3.5 w-3.5 text-[var(--primary)]" />
    : <ChevronDown className="h-3.5 w-3.5 text-[var(--primary)]" />
}

export function TasksListView({ tasks, isLoading, filters, total, onFiltersChange, onSortChange }: Props) {
  const openDetailPanel = useTaskStore((s) => s.openDetailPanel)
  const openEditModal = useTaskStore((s) => s.openEditModal)
  const showToast = useTaskStore((s) => s.showToast)

  const { mutate: toggleTask } = useToggleTaskComplete()
  const { mutate: deleteTask } = useDeleteTask()

  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / filters.perPage))

  function handleSort(col: SortBy) {
    if (filters.sortBy === col) {
      onSortChange(col, filters.sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      onSortChange(col, 'asc')
    }
  }

  function handleToggle(e: React.MouseEvent, taskId: string) {
    e.stopPropagation()
    toggleTask(taskId, {
      onError: () => showToast('Failed to update task', 'error'),
    })
  }

  function handleDelete(id: string) {
    deleteTask(id, {
      onSuccess: () => showToast('Task deleted'),
      onError: () => showToast('Failed to delete task', 'error'),
    })
    setConfirmDeleteId(null)
  }

  const thCls = 'text-xs font-semibold text-[var(--soft-text)] uppercase tracking-wide px-4 py-3 text-left bg-slate-50 border-b border-[var(--border)]'
  const thSortCls = thCls + ' cursor-pointer hover:text-slate-700 select-none'

  if (isLoading) {
    return (
      <div className="bg-[var(--panel)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--border)]">
                {[40, 200, 80, 80, 100, 90, 80, 40, 40].map((w, j) => (
                  <td key={j} className="px-4 py-3">
                    <div
                      className="h-4 rounded animate-pulse bg-slate-200"
                      style={{ width: w }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[var(--panel)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={thCls} style={{ width: 40 }} />
                <th
                  className={thSortCls}
                  onClick={() => handleSort('title')}
                >
                  <span className="flex items-center gap-1">
                    Title
                    <SortIcon column="title" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </span>
                </th>
                <th className={thCls}>Category</th>
                <th
                  className={thSortCls}
                  onClick={() => handleSort('priority')}
                >
                  <span className="flex items-center gap-1">
                    Priority
                    <SortIcon column="priority" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </span>
                </th>
                <th className={thCls}>Assignee</th>
                <th
                  className={thSortCls}
                  onClick={() => handleSort('dueDate')}
                >
                  <span className="flex items-center gap-1">
                    Due Date
                    <SortIcon column="dueDate" sortBy={filters.sortBy} sortDir={filters.sortDir} />
                  </span>
                </th>
                <th className={thCls}>Status</th>
                <th className={thCls} style={{ width: 48 }}>
                  <MessageSquare className="h-3.5 w-3.5" />
                </th>
                <th className={thCls} style={{ width: 48 }} />
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[var(--soft-text)] text-sm">
                    No tasks found. Try adjusting your filters or create a new task.
                  </td>
                </tr>
              )}
              {tasks.map((task, idx) => (
                <tr
                  key={task.id}
                  onClick={() => openDetailPanel(task.id)}
                  className={[
                    'border-b border-[var(--border)] cursor-pointer transition-colors',
                    'hover:bg-[var(--primary-light)]',
                    idx % 2 === 1 ? 'bg-slate-50/50' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => toggleTask(task.id, {
                        onError: () => showToast('Failed to update task', 'error'),
                      })}
                      className="h-4 w-4 rounded accent-[#4acf7f] cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 max-w-[280px]">
                    <p
                      className={[
                        'text-sm font-medium text-slate-800 truncate',
                        task.status === 'done' ? 'line-through opacity-50' : '',
                      ].join(' ')}
                    >
                      {task.title}
                    </p>
                    {task.linkedClient && (
                      <p className="text-xs text-[var(--soft-text)] mt-0.5 truncate">
                        {task.linkedClient.fullName}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={task.category} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ color: 'var(--primary)' }}
                      >
                        {task.assignee.fullName.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700 truncate max-w-[100px]">
                        {task.assignee.fullName.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DueDateCell task={task} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3">
                    {task.commentsCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-[var(--soft-text)]">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {task.commentsCount}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-[var(--soft-text)] transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {activeMenu === task.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 bg-white border border-[var(--border)] rounded-xl shadow-lg py-1 w-36">
                            <button
                              onClick={() => { openEditModal(task.id); setActiveMenu(null) }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => { setConfirmDeleteId(task.id); setActiveMenu(null) }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-slate-50">
            <p className="text-sm text-[var(--soft-text)]">
              Page {filters.page} of {totalPages} — {total} tasks
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFiltersChange({ page: filters.page - 1 })}
                disabled={filters.page <= 1}
                className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => onFiltersChange({ page: filters.page + 1 })}
                disabled={filters.page >= totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 max-w-[90vw]">
            <h3 className="text-base font-semibold text-slate-800">Delete this task?</h3>
            <p className="text-sm text-[var(--soft-text)] mt-2">
              This cannot be undone. The task and all its comments will be permanently removed.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-[var(--border)] rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
