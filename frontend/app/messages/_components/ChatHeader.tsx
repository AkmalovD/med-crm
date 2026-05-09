'use client'

import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useMessageStore } from '@/store/useMessageStore'
import { useMuteConversation } from '@/features/messages/hooks/useConversationMutations'
import type { Conversation } from '@/features/messages/types/messages.types'
import { CURRENT_USER_ID } from '@/data/messagesData/messagesDashboardData'
import { Avatar } from './ConversationItem'

interface ChatHeaderProps {
  conversation: Conversation
}

function formatLastSeen(iso: string | null): string {
  if (!iso) return 'Offline'
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function ChatHeader({ conversation: conv }: ChatHeaderProps) {
  const { soundEnabled, toggleSound } = useMessageStore()
  const mute = useMuteConversation()

  const otherParticipant = conv.participants.find((p) => p.id !== CURRENT_USER_ID)
  const displayName = conv.name ?? otherParticipant?.fullName ?? 'Unknown'
  const isOnline = otherParticipant?.isOnline ?? false

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--panel)] shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={displayName} size={9} />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[var(--primary)] border-2 border-white" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{displayName}</p>
          <p className="text-xs text-[var(--soft-text)]">
            {isOnline ? (
              <span className="text-[var(--primary)] font-medium">Online</span>
            ) : (
              `Last seen ${formatLastSeen(otherParticipant?.lastSeenAt ?? null)}`
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Mute toggle */}
        <button
          type="button"
          onClick={() => mute.mutate({ id: conv.id, isMuted: !conv.isMuted })}
          title={conv.isMuted ? 'Unmute' : 'Mute notifications'}
          className="p-2 rounded-lg text-[var(--soft-text)] hover:bg-[var(--background)] transition-colors"
        >
          {conv.isMuted ? <BellOff size={16} /> : <Bell size={16} />}
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          className="p-2 rounded-lg text-[var(--soft-text)] hover:bg-[var(--background)] transition-colors"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Conversation type badge */}
        <span
          className={cn(
            'ml-1 px-2.5 py-1 rounded-full text-xs font-semibold',
            conv.type === 'internal'
              ? 'bg-violet-100 text-violet-600'
              : 'bg-blue-100 text-blue-600'
          )}
        >
          {conv.type === 'internal' ? 'Internal' : 'Client'}
        </span>
      </div>
    </div>
  )
}
