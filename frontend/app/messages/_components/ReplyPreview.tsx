'use client'

import { X } from 'lucide-react'
import { useMessageStore } from '@/store/useMessageStore'

export function ReplyPreview() {
  const { replyToMessage, clearReply } = useMessageStore()

  if (!replyToMessage) return null

  return (
    <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-[var(--background)] border-l-2 border-[var(--primary)]">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--primary)]">
          Replying to {replyToMessage.sender.fullName}
        </p>
        <p className="text-xs text-[var(--soft-text)] truncate">{replyToMessage.content}</p>
      </div>
      <button
        type="button"
        onClick={clearReply}
        className="p-1 rounded-lg text-[var(--soft-text)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  )
}
