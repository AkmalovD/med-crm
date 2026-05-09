'use client'

import { Plus } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'

export function TasksHeader({ totalCount }: { totalCount: number }) {
  const openCreateModal = useTaskStore((s) => s.openCreateModal)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <p className="text-sm text-[var(--soft-text)] mt-0.5">
          {totalCount} task{totalCount !== 1 ? 's' : ''} total
        </p>
      </div>
      <button
        onClick={() => openCreateModal()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <Plus className="h-4 w-4" />
        New Task
      </button>
    </div>
  )
}
