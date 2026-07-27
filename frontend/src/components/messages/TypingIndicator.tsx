'use client'

import { useMessageStore } from '@/store/useMessageStore'

export function TypingIndicator() {
  const { typingUsers } = useMessageStore()
  const names = Object.values(typingUsers)

  if (names.length === 0) return null

  return (
    <div className="flex items-end gap-2 px-1">
      <div className="w-6 h-6 rounded-full bg-[var(--border)] shrink-0" />
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-4 py-2.5">
        <div className="flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--soft-text)] animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--soft-text)] animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--soft-text)] animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
      <p className="text-xs text-[var(--soft-text)] mb-1">
        {names.join(', ')} {names.length === 1 ? 'is' : 'are'} typing...
      </p>
    </div>
  )
}
