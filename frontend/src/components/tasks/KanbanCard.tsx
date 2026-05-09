'use client'

import { Draggable } from '@hello-pangea/dnd'
import { AlertCircle, Clock, Link, MessageSquare } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import type { Task } from '@/types/tasksDashboardTypes'
import { CATEGORY_LABELS } from '@/types/tasksDashboardTypes'

interface Props {
  task: Task
  index: number
}

const PRIORITY_BORDER: Record<Task['priority'], string> = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-400',
  medium: 'border-l-yellow-400',
  low: 'border-l-green-400',
}

const PRIORITY_DOT: Record<Task['priority'], string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-green-400',
}

export function KanbanCard({ task, index }: Props) {
  const openDetailPanel = useTaskStore((s) => s.openDetailPanel)

  const cardBg =
    task.isOverdue && task.status !== 'done'
      ? 'bg-red-50'
      : task.isDueToday && task.status !== 'done'
      ? 'bg-amber-50'
      : 'bg-white'

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => openDetailPanel(task.id)}
          className={[
            'rounded-xl border border-[var(--border)] border-l-4 p-3 cursor-pointer transition-shadow',
            PRIORITY_BORDER[task.priority],
            cardBg,
            snapshot.isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md',
          ].join(' ')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
              <span className="text-xs text-[var(--soft-text)]">
                {CATEGORY_LABELS[task.category]}
              </span>
            </div>
          </div>

          <p className="text-sm font-semibold text-slate-800 leading-snug mb-1">
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-[var(--soft-text)] line-clamp-2 mb-2">
              {task.description}
            </p>
          )}

          {task.linkedClient && (
            <div className="flex items-center gap-1 mb-2">
              <Link className="h-3 w-3 text-[var(--soft-text)]" />
              <span className="text-xs text-[var(--soft-text)]">
                {task.linkedClient.fullName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <div
                className="h-6 w-6 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ color: 'var(--primary)' }}
              >
                {task.assignee.fullName.charAt(0)}
              </div>
              {task.dueDate && (
                <span
                  className={[
                    'text-xs font-medium flex items-center gap-0.5',
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
            </div>
            {task.commentsCount > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-[var(--soft-text)]">
                <MessageSquare className="h-3 w-3" />
                {task.commentsCount}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
