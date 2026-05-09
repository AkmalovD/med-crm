'use client'

import { AlertCircle, Bell, Calendar, Clock, ExternalLink, Pencil, Tag, User, X } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import { useTask } from '@/hooks/useTasks'
import { TaskComments } from './TaskComments'
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/types/tasksDashboardTypes'
import type { Task } from '@/types/tasksDashboardTypes'

const PRIORITY_BADGE: Record<Task['priority'], string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

const STATUS_BADGE: Record<Task['status'], string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

function DetailRow({ icon: Icon, label, children }: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-2 w-28 shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-[var(--soft-text)]" />
        <span className="text-xs text-[var(--soft-text)] font-medium">{label}</span>
      </div>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  )
}

export function TaskDetailPanel() {
  const isOpen = useTaskStore((s) => s.isDetailPanelOpen)
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId)
  const closeDetailPanel = useTaskStore((s) => s.closeDetailPanel)
  const openEditModal = useTaskStore((s) => s.openEditModal)

  const { data: task, isLoading } = useTask(selectedTaskId)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closeDetailPanel}
        />
      )}

      <div
        className={[
          'fixed top-0 right-0 h-full z-50 w-96 bg-white border-l border-[var(--border)] shadow-xl flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
          {task ? (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_BADGE[task.priority]}`}>
                {PRIORITY_LABELS[task.priority]}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[task.status]}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
          ) : (
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          )}
          <div className="flex items-center gap-1">
            {task && (
              <button
                onClick={() => { openEditModal(task.id); closeDetailPanel() }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-[var(--soft-text)] transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={closeDetailPanel}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-[var(--soft-text)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex flex-col gap-4">
              <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && task && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-snug">{task.title}</h2>
                {task.description && (
                  <p className="text-sm text-[var(--soft-text)] mt-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--soft-text)] mb-1">
                  Details
                </p>
                <div className="bg-slate-50 rounded-xl border border-[var(--border)] px-3">
                  <DetailRow icon={User} label="Assignee">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ color: 'var(--primary)' }}
                      >
                        {task.assignee.fullName.charAt(0)}
                      </div>
                      {task.assignee.fullName}
                    </div>
                  </DetailRow>
                  <DetailRow icon={Tag} label="Category">
                    {CATEGORY_LABELS[task.category]}
                  </DetailRow>
                  <DetailRow icon={Calendar} label="Due Date">
                    {task.dueDate ? (
                      <span
                        className={[
                          'flex items-center gap-1',
                          task.isOverdue && task.status !== 'done' ? 'text-red-600 font-medium' :
                          task.isDueToday && task.status !== 'done' ? 'text-amber-600 font-medium' : '',
                        ].join(' ')}
                      >
                        {task.isOverdue && task.status !== 'done' && (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {task.isDueToday && task.status !== 'done' && (
                          <Clock className="h-4 w-4" />
                        )}
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {task.dueTime && ` · ${task.dueTime}`}
                        {task.isOverdue && task.status !== 'done' && (
                          <span className="ml-1">(Overdue)</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-[var(--soft-text)]">No due date</span>
                    )}
                  </DetailRow>
                  {task.reminderValue && (
                    <DetailRow icon={Bell} label="Reminder">
                      {task.reminderValue} {task.reminderUnit} before due
                    </DetailRow>
                  )}
                  <DetailRow icon={User} label="Created by">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold shrink-0 text-slate-500"
                      >
                        {task.createdBy.fullName.charAt(0)}
                      </div>
                      <span>{task.createdBy.fullName}</span>
                      <span className="text-[var(--soft-text)] text-xs">
                        · {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </DetailRow>
                </div>
              </div>

              {(task.linkedClient || task.linkedTherapist) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--soft-text)] mb-1">
                    Linked To
                  </p>
                  <div className="bg-slate-50 rounded-xl border border-[var(--border)] px-3">
                    {task.linkedClient && (
                      <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <div
                            className="h-6 w-6 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ color: 'var(--primary)' }}
                          >
                            {task.linkedClient.fullName.charAt(0)}
                          </div>
                          <span>{task.linkedClient.fullName}</span>
                          <span className="text-xs text-[var(--soft-text)]">Client</span>
                        </div>
                        <a
                          href={`/clients`}
                          className="p-1 rounded hover:bg-slate-200 text-[var(--soft-text)] transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                    {task.linkedTherapist && (
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <div
                            className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold shrink-0 text-slate-500"
                          >
                            {task.linkedTherapist.fullName.charAt(0)}
                          </div>
                          <span>{task.linkedTherapist.fullName}</span>
                          <span className="text-xs text-[var(--soft-text)]">Therapist</span>
                        </div>
                        <a
                          href={`/therapists`}
                          className="p-1 rounded hover:bg-slate-200 text-[var(--soft-text)] transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-[var(--border)] pt-4">
                <TaskComments taskId={task.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
