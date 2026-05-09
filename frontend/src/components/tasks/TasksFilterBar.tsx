'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { TaskFilters, TaskPriority, TaskStatus, TaskCategory, TaskDueFilter } from '@/types/tasksDashboardTypes'
import { MOCK_THERAPISTS } from '@/data/tasksData/tasksDashboardData'

interface Props {
  filters: TaskFilters
  onFiltersChange: (filters: Partial<TaskFilters>) => void
  onClearFilters: () => void
}

const PRIORITY_OPTIONS: { label: string; value: TaskPriority | '' }[] = [
  { label: 'All Priorities', value: '' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const STATUS_OPTIONS: { label: string; value: TaskStatus | '' }[] = [
  { label: 'All Statuses', value: '' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const CATEGORY_OPTIONS: { label: string; value: TaskCategory | '' }[] = [
  { label: 'All Categories', value: '' },
  { label: 'Follow-up', value: 'follow_up' },
  { label: 'Administrative', value: 'administrative' },
  { label: 'Clinical', value: 'clinical' },
  { label: 'Billing', value: 'billing' },
  { label: 'Other', value: 'other' },
]

const DUE_OPTIONS: { label: string; value: TaskDueFilter | '' }[] = [
  { label: 'Any Due Date', value: '' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Due Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
]

const selectCls =
  'text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--panel)] text-slate-700 focus:outline-none focus:border-[var(--primary)] transition-colors'

export function TasksFilterBar({ filters, onFiltersChange, onClearFilters }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  useEffect(() => {
    const t = setTimeout(() => onFiltersChange({ search: searchInput || undefined, page: 1 }), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const hasActiveFilters =
    !!filters.search ||
    !!filters.status ||
    !!filters.priority ||
    !!filters.category ||
    !!filters.assigneeId ||
    !!filters.due

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--soft-text)]" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="text-sm border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 w-52 bg-[var(--panel)] text-slate-700 focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      <select
        value={filters.priority ?? ''}
        onChange={(e) => onFiltersChange({ priority: (e.target.value as TaskPriority) || undefined, page: 1 })}
        className={selectCls}
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        value={filters.status ?? ''}
        onChange={(e) => onFiltersChange({ status: (e.target.value as TaskStatus) || undefined, page: 1 })}
        className={selectCls}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        value={filters.category ?? ''}
        onChange={(e) => onFiltersChange({ category: (e.target.value as TaskCategory) || undefined, page: 1 })}
        className={selectCls}
      >
        {CATEGORY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        value={filters.assigneeId ?? ''}
        onChange={(e) => onFiltersChange({ assigneeId: e.target.value || undefined, page: 1 })}
        className={selectCls}
      >
        <option value="">All Assignees</option>
        {MOCK_THERAPISTS.map((t) => (
          <option key={t.id} value={t.id}>{t.fullName}</option>
        ))}
      </select>

      <select
        value={filters.due ?? ''}
        onChange={(e) => onFiltersChange({ due: (e.target.value as TaskDueFilter) || undefined, page: 1 })}
        className={selectCls}
      >
        {DUE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={() => {
            setSearchInput('')
            onClearFilters()
          }}
          className="flex items-center gap-1.5 text-sm text-[var(--soft-text)] hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  )
}
