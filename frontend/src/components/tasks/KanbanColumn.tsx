'use client'

import { Droppable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { KanbanCard } from './KanbanCard'
import { useTaskStore } from '@/store/useTaskStore'
import type { Task, TaskStatus } from '@/types/tasksDashboardTypes'

interface Column {
  id: TaskStatus
  label: string
  color: string
}

interface Props {
  column: Column
  tasks: Task[]
  isDraggingOver?: boolean
}

export function KanbanColumn({ column, tasks }: Props) {
  const openCreateModal = useTaskStore((s) => s.openCreateModal)

  return (
    <div className="flex flex-col bg-slate-50 rounded-xl border border-[var(--border)] min-h-[400px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <span className="text-sm font-semibold text-slate-700">{column.label}</span>
          <span className="bg-slate-200 text-slate-600 text-xs font-medium rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openCreateModal(column.id)}
          className="p-1 rounded-lg hover:bg-slate-200 text-[var(--soft-text)] hover:text-slate-700 transition-colors"
          title={`Add task to ${column.label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={[
              'flex flex-col gap-2 p-3 flex-1 min-h-[100px] rounded-b-xl transition-colors overflow-y-auto',
              snapshot.isDraggingOver
                ? 'bg-[var(--primary-light)] border-2 border-dashed border-[var(--primary)]'
                : '',
            ].join(' ')}
          >
            {tasks.map((task, index) => (
              <KanbanCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-[var(--soft-text)] text-center py-4">
                  No tasks here
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
