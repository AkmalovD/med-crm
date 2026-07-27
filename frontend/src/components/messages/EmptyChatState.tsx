'use client'

import { MessageSquare, Plus } from 'lucide-react'
import { useMessageStore } from '@/store/useMessageStore'

export function EmptyChatState() {
  const { openNewConversationModal } = useMessageStore()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
      <div className="rounded-full bg-[var(--panel)] border border-[var(--border)] p-6">
        <MessageSquare size={40} className="text-[var(--soft-text)]" />
      </div>
      <div>
        <p className="font-semibold text-[var(--foreground)]">No conversation selected</p>
        <p className="text-sm text-[var(--soft-text)] mt-1">
          Choose a conversation from the left or start a new one
        </p>
      </div>
      <button
        type="button"
        onClick={openNewConversationModal}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Plus size={15} />
        New Conversation
      </button>
    </div>
  )
}
