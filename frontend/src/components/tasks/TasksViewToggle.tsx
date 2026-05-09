'use client'

import { Columns3, List, User } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'
import type { TaskView } from '@/types/tasksDashboardTypes'

const VIEWS: { value: TaskView; icon: React.ElementType; label: string }[] = [
  { value: 'list', icon: List, label: 'List' },
  { value: 'board', icon: Columns3, label: 'Board' },
  { value: 'my', icon: User, label: 'My Tasks' },
]

export function TasksViewToggle() {
  const activeView = useTaskStore((s) => s.activeView)
  const setActiveView = useTaskStore((s) => s.setActiveView)

  return (
    <div className="flex border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--panel)]">
      {VIEWS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setActiveView(value)}
          className={[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
            activeView === value
              ? 'text-white'
              : 'text-[var(--soft-text)] hover:bg-slate-50',
          ].join(' ')}
          style={activeView === value ? { backgroundColor: 'var(--primary)' } : {}}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
