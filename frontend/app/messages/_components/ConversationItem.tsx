'use client'

import { useState, useRef, useEffect } from 'react'
import { Pin, BellOff, MoreVertical, Archive, CheckCheck, Bell, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useMessageStore } from '@/store/useMessageStore'
import {
  usePinConversation,
  useArchiveConversation,
  useMuteConversation,
  useMarkAsUnread,
} from '@/features/messages/hooks/useConversationMutations'
import type { Conversation } from '@/features/messages/types/messages.types'
import { CURRENT_USER_ID } from '@/data/messagesData/messagesDashboardData'

interface ConversationItemProps {
  conversation: Conversation
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase()
  return (
    <span className="text-xs font-bold text-white">{initials}</span>
  )
}

function Avatar({ name, size = 10 }: { name: string; size?: number }) {
  const colors = [
    'bg-violet-400', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400',
    'bg-rose-400', 'bg-cyan-400', 'bg-pink-400', 'bg-indigo-400',
  ]
  const index = name.charCodeAt(0) % colors.length
  return (
    <div
      className={cn(
        `w-${size} h-${size} rounded-full flex items-center justify-center shrink-0`,
        colors[index]
      )}
    >
      <Initials name={name} />
    </div>
  )
}

export { Avatar, Initials }

export function ConversationItem({ conversation: conv }: ConversationItemProps) {
  const { activeConversationId, setActiveConversation } = useMessageStore()
  const isActive = activeConversationId === conv.id
  const [menuOpen, setMenuOpen] = useState(false)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const pin = usePinConversation()
  const archive = useArchiveConversation()
  const mute = useMuteConversation()
  const markUnread = useMarkAsUnread()

  const otherParticipant = conv.participants.find((p) => p.id !== CURRENT_USER_ID)
  const displayName = conv.name ?? otherParticipant?.fullName ?? 'Unknown'
  const isOnline = otherParticipant?.isOnline ?? false

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors rounded-lg mx-1 relative group',
          isActive
            ? 'bg-[var(--primary-light)] border border-[var(--primary)]/30'
            : 'hover:bg-[var(--background)]',
          conv.unreadCount > 0 && !isActive && 'bg-blue-50/40'
        )}
        onClick={() => setActiveConversation(conv.id)}
        onContextMenu={(e) => {
          e.preventDefault()
          setMenuOpen(true)
        }}
      >
        {/* Avatar with online indicator */}
        <div className="relative shrink-0">
          <Avatar name={displayName} size={10} />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--primary)] border-2 border-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className={cn('text-sm truncate text-[var(--foreground)]', conv.unreadCount > 0 && 'font-semibold')}>
              {displayName}
              {conv.isPinned && <Pin className="inline ml-1 text-[var(--soft-text)]" size={11} />}
              {conv.isMuted && <BellOff className="inline ml-1 text-[var(--soft-text)]" size={11} />}
            </p>
            {conv.lastMessage && (
              <span className="text-[11px] text-[var(--soft-text)] shrink-0">
                {formatTime(conv.lastMessage.sentAt)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-0.5 gap-1">
            <p className={cn(
              'text-xs truncate text-[var(--soft-text)]',
              conv.unreadCount > 0 && 'text-[var(--foreground)] font-medium'
            )}>
              {conv.lastMessage?.content ?? 'No messages yet'}
            </p>
            {conv.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-[var(--primary)] text-white shrink-0">
                {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Context menu trigger */}
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[var(--border)] shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((o) => !o)
          }}
        >
          <MoreVertical size={14} className="text-[var(--soft-text)]" />
        </button>

        {/* Context menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-2 top-10 z-50 bg-[var(--panel)] border border-[var(--border)] rounded-xl shadow-lg py-1 min-w-44"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
              onClick={() => {
                pin.mutate({ id: conv.id, isPinned: !conv.isPinned })
                setMenuOpen(false)
              }}
            >
              <Pin size={14} />
              {conv.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
              onClick={() => {
                markUnread.mutate(conv.id)
                setMenuOpen(false)
              }}
            >
              <CheckCheck size={14} />
              Mark as unread
            </button>
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
              onClick={() => {
                mute.mutate({ id: conv.id, isMuted: !conv.isMuted })
                setMenuOpen(false)
              }}
            >
              {conv.isMuted ? <Bell size={14} /> : <BellOff size={14} />}
              {conv.isMuted ? 'Unmute' : 'Mute'}
            </button>
            <div className="h-px bg-[var(--border)] my-1" />
            <button
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-[var(--background)] transition-colors"
              onClick={() => {
                setMenuOpen(false)
                setShowArchiveConfirm(true)
              }}
            >
              <Archive size={14} />
              Archive
            </button>
          </div>
        )}
      </div>

      {/* Archive confirmation dialog */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--panel)] rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Archive size={18} className="text-amber-600" />
              </div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">Archive conversation?</h3>
            </div>
            <p className="text-sm text-[var(--soft-text)] mb-5">
              This conversation will be removed from your inbox. You can find it in archived conversations later.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                onClick={() => setShowArchiveConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                onClick={() => {
                  archive.mutate(conv.id)
                  setShowArchiveConfirm(false)
                  setActiveConversation(null)
                }}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
