'use client'

import { useMyTasks } from '@/hooks/useTasks'
import { TaskRow } from './TaskRow'
import type { Task, TaskFilters } from '@/types/tasksDashboardTypes'

interface Props {
  userId: string
  filters: TaskFilters
}

interface TaskGroup {
  id: string
  label: string
  colorCls: string
  tasks: Task[]
}

function groupTasksByDue(tasks: Task[]): TaskGroup[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const weekLater = new Date(today)
  weekLater.setDate(weekLater.getDate() + 7)
  const weekLaterStr = weekLater.toISOString().split('T')[0]

  const active = tasks.filter((t) => t.status !== 'done')

  const overdue = active.filter((t) => t.isOverdue)
  const dueToday = active.filter((t) => t.isDueToday && !t.isOverdue)
  const thisWeek = active.filter(
    (t) =>
      !t.isOverdue &&
      !t.isDueToday &&
      t.dueDate &&
      t.dueDate > todayStr &&
      t.dueDate <= weekLaterStr
  )
  const later = active.filter(
    (t) =>
      !t.isOverdue &&
      !t.isDueToday &&
      t.dueDate &&
      t.dueDate > weekLaterStr
  )
  const noDue = active.filter((t) => !t.dueDate)
  const done = tasks.filter((t) => t.status === 'done')

  return [
    { id: 'overdue', label: 'Overdue', colorCls: 'text-red-600', tasks: overdue },
    { id: 'today', label: 'Due Today', colorCls: 'text-amber-600', tasks: dueToday },
    { id: 'week', label: 'This Week', colorCls: 'text-slate-800', tasks: thisWeek },
    { id: 'later', label: 'Later', colorCls: 'text-slate-700', tasks: later },
    { id: 'none', label: 'No Due Date', colorCls: 'text-[var(--soft-text)]', tasks: noDue },
    { id: 'done', label: 'Completed', colorCls: 'text-green-600', tasks: done },
  ].filter((g) => g.tasks.length > 0)
}

export function TasksMyView({ userId, filters }: Props) {
  const { data: tasks, isLoading } = useMyTasks(userId, filters)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-[var(--panel)] rounded-xl border border-[var(--border)] p-4">
            <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-3" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-10 bg-slate-100 rounded-lg animate-pulse mb-2" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  const allTasks = tasks ?? []
  const groups = groupTasksByDue(allTasks)

  if (groups.length === 0) {
    return (
      <div className="bg-[var(--panel)] rounded-xl border border-[var(--border)] py-20 text-center">
        <p className="text-[var(--soft-text)] text-sm">No tasks assigned to you.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-[var(--panel)] rounded-xl border border-[var(--border)] overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-slate-50">
            <span className={`text-sm font-semibold ${group.colorCls}`}>
              {group.label}
            </span>
            <span className="bg-slate-200 text-slate-600 text-xs font-medium rounded-full px-2 py-0.5">
              {group.tasks.length}
            </span>
          </div>
          <div className="px-2 py-1">
            {group.tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
