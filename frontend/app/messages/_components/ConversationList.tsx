'use client'

import { ConversationItem } from './ConversationItem'
import type { Conversation } from '@/features/messages/types/messages.types'

interface ConversationListProps {
  conversations: Conversation[] | undefined
  isLoading: boolean
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 mx-1">
      <div className="h-10 w-10 rounded-full bg-[var(--border)] animate-pulse shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-32 rounded bg-[var(--border)] animate-pulse" />
        <div className="h-3 w-48 rounded bg-[var(--border)] animate-pulse" />
      </div>
    </div>
  )
}

export function ConversationList({ conversations, isLoading }: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center py-8">
        <p className="text-sm text-[var(--soft-text)]">No conversations found</p>
      </div>
    )
  }

  const pinned = conversations.filter((c) => c.isPinned)
  const unpinned = conversations.filter((c) => !c.isPinned)

  return (
    <div className="flex-1 overflow-y-auto py-1">
      {pinned.length > 0 && (
        <div>
          <p className="px-4 py-1.5 text-[11px] font-semibold text-[var(--soft-text)] uppercase tracking-wider">
            Pinned
          </p>
          {pinned.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
      {unpinned.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <p className="px-4 py-1.5 text-[11px] font-semibold text-[var(--soft-text)] uppercase tracking-wider">
              All conversations
            </p>
          )}
          {unpinned.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  )
}
