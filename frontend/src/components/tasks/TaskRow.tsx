'use client'

import { AlertCircle, ChevronRight, Clock, Link } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import { useToggleTaskComplete } from '@/hooks/useTasks'
import type { Task } from '@/types/tasksDashboardTypes'
import { PRIORITY_LABELS } from '@/types/tasksDashboardTypes'

interface Props {
  task: Task
}

function PriorityDot({ priority }: { priority: Task['priority'] }) {
  const cls: Record<Task['priority'], string> = {
    urgent: 'bg-red-500',
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-400',
  }
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
      <span className={`h-2 w-2 rounded-full ${cls[priority]}`} />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}

export function TaskRow({ task }: Props) {
  const openDetailPanel = useTaskStore((s) => s.openDetailPanel)
  const showToast = useTaskStore((s) => s.showToast)
  const { mutate: toggleTask } = useToggleTaskComplete()

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    toggleTask(task.id, {
      onError: () => showToast('Failed to update task', 'error'),
    })
  }

  return (
    <div
      className={[
        'flex items-center gap-3 py-2.5 px-3 border-b border-[var(--border)] last:border-0 rounded-lg cursor-pointer transition-colors hover:bg-[var(--primary-light)]',
        task.status === 'done' ? 'opacity-60' : '',
      ].join(' ')}
      onClick={() => openDetailPanel(task.id)}
    >
      <div onClick={handleToggle}>
        <input
          type="checkbox"
          checked={task.status === 'done'}
          readOnly
          className="h-4 w-4 rounded accent-[#4acf7f] cursor-pointer"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={[
            'text-sm font-medium text-slate-800 truncate',
            task.status === 'done' ? 'line-through' : '',
          ].join(' ')}
        >
          {task.title}
        </p>
        {task.linkedClient && (
          <p className="text-xs text-[var(--soft-text)] flex items-center gap-1 mt-0.5">
            <Link className="h-3 w-3" />
            {task.linkedClient.fullName}
          </p>
        )}
      </div>

      <PriorityDot priority={task.priority} />

      {task.dueDate && (
        <span
          className={[
            'text-xs font-medium flex items-center gap-1 shrink-0',
            task.isOverdue && task.status !== 'done' ? 'text-red-600' :
            task.isDueToday && task.status !== 'done' ? 'text-amber-600' :
            'text-[var(--soft-text)]',
          ].join(' ')}
        >
          {task.isOverdue && task.status !== 'done' && <AlertCircle className="h-3 w-3" />}
          {task.isDueToday && task.status !== 'done' && <Clock className="h-3 w-3" />}
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); openDetailPanel(task.id) }}
        className="p-1 rounded-lg hover:bg-slate-200 text-[var(--soft-text)] transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
