'use client'

import { cn } from '@/utils/cn'
import type { ConversationFilters } from '@/features/messages/types/messages.types'

type FilterValue = 'all' | ConversationFilters['type']

interface ConversationFiltersProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
  totalUnread: number
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Internal', value: 'internal' },
  { label: 'Clients', value: 'client' },
  { label: 'Unread', value: 'unread' },
]

export function ConversationFilters({ active, onChange, totalUnread }: ConversationFiltersProps) {
  return (
    <div className="flex px-3 py-2 gap-1 border-b border-[var(--border)] flex-wrap">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1',
            active === value
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--soft-text)] hover:bg-[var(--background)]'
          )}
        >
          {label}
          {value === 'unread' && totalUnread > 0 && (
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
