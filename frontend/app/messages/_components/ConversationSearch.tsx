'use client'

import { Search } from 'lucide-react'

interface ConversationSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ConversationSearch({ value, onChange }: ConversationSearchProps) {
  return (
    <div className="px-3 py-2 border-b border-[var(--border)]">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--soft-text)]"
          size={14}
        />
        <input
          type="text"
          placeholder="Search conversations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--background)] border border-[var(--border)]
            text-sm text-[var(--foreground)] placeholder:text-[var(--soft-text)]
            outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>
    </div>
  )
}
