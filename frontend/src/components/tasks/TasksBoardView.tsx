'use client'

import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useQueryClient } from '@tanstack/react-query'
import { KanbanColumn } from './KanbanColumn'
import { useTaskStore } from '@/store/useTaskStore'
import { useMoveTask } from '@/hooks/useTasks'
import { TASK_KEYS } from '@/api/v1/queryKeys'
import type { Task, TaskFilters, TaskStatus } from '@/types/tasksDashboardTypes'

interface Props {
  tasks: Task[]
  isLoading: boolean
  filters: TaskFilters
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#6b7280' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#4acf7f' },
]

export function TasksBoardView({ tasks, isLoading, filters }: Props) {
  const queryClient = useQueryClient()
  const showToast = useTaskStore((s) => s.showToast)
  const { mutate: moveTask } = useMoveTask()

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const { draggableId, destination, source } = result
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId as TaskStatus

    queryClient.setQueryData(
      TASK_KEYS.list(filters),
      (old: { items: Task[]; total: number } | undefined) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((t) =>
            t.id === draggableId ? { ...t, status: newStatus } : t
          ),
        }
      }
    )

    moveTask(
      { id: draggableId, status: newStatus },
      {
        onSuccess: () => showToast('Task moved'),
        onError: () => {
          queryClient.invalidateQueries({ queryKey: TASK_KEYS.list(filters) })
          showToast('Failed to move task', 'error')
        },
      }
    )
  }

  const tasksByStatus = COLUMNS.reduce<Record<TaskStatus, Task[]>>(
    (acc, col) => {
      acc[col.id] = tasks.filter((t) => t.status === col.id)
      return acc
    },
    { todo: [], in_progress: [], done: [] }
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="bg-slate-50 rounded-xl border border-[var(--border)] min-h-[400px]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="p-3 flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByStatus[col.id]}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
