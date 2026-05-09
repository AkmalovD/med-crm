'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import { useTask, useUpdateTask } from '@/hooks/useTasks'
import { createTaskSchema, type CreateTaskInput } from '@/validators/taskValidator'
import type { z } from 'zod'

type FormValues = z.input<typeof createTaskSchema>
import { MOCK_THERAPISTS } from '@/data/tasksData/tasksDashboardData'

const inputCls = 'w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--soft-text)]'
const selectCls = inputCls
const labelCls = 'block text-xs font-semibold text-slate-600 mb-1'
const errorCls = 'text-xs text-red-500 mt-1'

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

export function EditTaskModal() {
  const isOpen = useTaskStore((s) => s.isEditModalOpen)
  const activeTaskId = useTaskStore((s) => s.activeTaskId)
  const closeEditModal = useTaskStore((s) => s.closeEditModal)
  const showToast = useTaskStore((s) => s.showToast)

  const { data: task } = useTask(activeTaskId)
  const { mutate: updateTask, isPending } = useUpdateTask()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createTaskSchema),
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? undefined,
        status: task.status,
        priority: task.priority,
        category: task.category,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate ?? undefined,
        dueTime: task.dueTime ?? undefined,
        reminderValue: task.reminderValue ?? undefined,
        reminderUnit: task.reminderUnit ?? undefined,
        linkedClientId: task.linkedClientId ?? undefined,
        linkedTherapistId: task.linkedTherapistId ?? undefined,
      })
    }
  }, [task, reset])

  const dueDate = watch('dueDate')

  function onSubmit(data: FormValues) {
    if (!activeTaskId) return
    updateTask(
      { id: activeTaskId, data: data as CreateTaskInput },
      {
        onSuccess: () => {
          showToast('Task updated')
          closeEditModal()
        },
        onError: () => showToast('Failed to update task', 'error'),
      }
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <h2 className="text-base font-bold text-slate-800">Edit Task</h2>
          <button
            onClick={closeEditModal}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-[var(--soft-text)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1">
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                {...register('title')}
                placeholder="Task title..."
                maxLength={120}
                className={inputCls}
              />
              {errors.title && <p className={errorCls}>{errors.title.message}</p>}
            </div>

            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                {...register('description')}
                placeholder="Optional description..."
                rows={3}
                maxLength={1000}
                className={inputCls + ' resize-none'}
              />
            </div>

            <div>
              <label className={labelCls}>Category *</label>
              <select {...register('category')} className={selectCls}>
                <option value="">Select category...</option>
                <option value="follow_up">Follow-up</option>
                <option value="administrative">Administrative</option>
                <option value="clinical">Clinical</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <p className={errorCls}>{errors.category.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Status *</label>
              <select {...register('status')} className={selectCls}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Priority *</label>
              <select {...register('priority')} className={selectCls}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Assignee *</label>
              <select {...register('assigneeId')} className={selectCls}>
                <option value="">Select assignee...</option>
                {MOCK_THERAPISTS.map((t) => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
              {errors.assigneeId && <p className={errorCls}>{errors.assigneeId.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Due Time</label>
              <select {...register('dueTime')} className={selectCls} disabled={!dueDate}>
                <option value="">No time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {dueDate && (
              <>
                <div>
                  <label className={labelCls}>Reminder — amount</label>
                  <input
                    type="number"
                    min={1}
                    {...register('reminderValue', { valueAsNumber: true })}
                    placeholder="e.g. 30"
                    className={inputCls}
                  />
                  {errors.reminderValue && (
                    <p className={errorCls}>{errors.reminderValue.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Reminder — unit</label>
                  <select {...register('reminderUnit')} className={selectCls}>
                    <option value="">No reminder</option>
                    <option value="minutes">Minutes before</option>
                    <option value="hours">Hours before</option>
                    <option value="days">Days before</option>
                  </select>
                </div>
              </>
            )}

            <div className="col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--soft-text)] mb-3">
                Link to (optional)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Client</label>
                  <input
                    {...register('linkedClientId')}
                    placeholder="Client ID (optional)"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Therapist</label>
                  <select {...register('linkedTherapistId')} className={selectCls}>
                    <option value="">None</option>
                    {MOCK_THERAPISTS.map((t) => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-[var(--border)] rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
