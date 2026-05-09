'use client'

import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { useTaskComments, useAddComment, useDeleteComment } from '@/hooks/useTasks'
import { useTaskStore } from '@/store/useTaskStore'
import { MOCK_THERAPISTS, CURRENT_USER_ID } from '@/data/tasksData/tasksDashboardData'
import type { TaskComment } from '@/types/tasksDashboardTypes'

interface Props {
  taskId: string
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'yesterday'
  if (diffD < 7) return `${diffD}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function renderContent(content: string, mentions: string[]) {
  if (!content.includes('@')) return <>{content}</>
  const parts = content.split(/(@\w[\w\s]*?)(?=\s|$|@)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const name = part.slice(1).trim()
          const isMentioned = MOCK_THERAPISTS.some((t) =>
            t.fullName.toLowerCase().includes(name.toLowerCase())
          )
          return isMentioned ? (
            <span key={i} className="text-blue-600 font-medium">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function CommentItem({
  comment,
  taskId,
  onDelete,
}: {
  comment: TaskComment
  taskId: string
  onDelete: (commentId: string) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isOwn = comment.authorId === CURRENT_USER_ID

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-0 group">
      <div
        className="h-7 w-7 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ color: 'var(--primary)' }}
      >
        {comment.author.fullName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-800">{comment.author.fullName}</span>
          <span className="text-xs text-[var(--soft-text)]">{formatRelative(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">
          {renderContent(comment.content, comment.mentions)}
        </p>
      </div>
      {isOwn && (
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Delete
              </button>
              <span className="text-xs text-[var(--soft-text)]">/</span>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[var(--soft-text)] hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 rounded hover:bg-slate-100 text-[var(--soft-text)] hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function TaskComments({ taskId }: Props) {
  const showToast = useTaskStore((s) => s.showToast)
  const { data: comments, isLoading } = useTaskComments(taskId)
  const { mutate: addComment, isPending: isSubmitting } = useAddComment()
  const { mutate: deleteComment } = useDeleteComment()

  const [text, setText] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const mentions = useState<string[]>([])[0]
  const [mentionList, setMentionList] = useState<string[]>([])

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setText(value)
    const atIndex = value.lastIndexOf('@')
    if (atIndex !== -1) {
      const afterAt = value.slice(atIndex + 1)
      if (!afterAt.includes(' ') || afterAt === '') {
        setMentionQuery(afterAt)
        setShowMentions(true)
        return
      }
    }
    setShowMentions(false)
  }

  function insertMention(name: string, id: string) {
    const atIndex = text.lastIndexOf('@')
    const newText = text.slice(0, atIndex) + `@${name} `
    setText(newText)
    setMentionList((prev) => [...prev, id])
    setShowMentions(false)
  }

  function handleSubmit() {
    if (!text.trim()) return
    addComment(
      { taskId, data: { content: text.trim(), mentions: mentionList } },
      {
        onSuccess: () => {
          setText('')
          setMentionList([])
        },
        onError: () => showToast('Failed to add comment', 'error'),
      }
    )
  }

  function handleDelete(commentId: string) {
    deleteComment(
      { taskId, commentId },
      {
        onSuccess: () => showToast('Comment deleted'),
        onError: () => showToast('Failed to delete comment', 'error'),
      }
    )
  }

  const filteredStaff = MOCK_THERAPISTS.filter((t) =>
    t.fullName.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--soft-text)] mb-3">
        Comments {comments?.length ? `(${comments.length})` : ''}
      </p>

      {isLoading && (
        <div className="flex flex-col gap-3 mb-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-full bg-slate-200 animate-pulse shrink-0" />
              <div className="flex-1">
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="mb-4">
          {(comments ?? []).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              taskId={taskId}
              onDelete={handleDelete}
            />
          ))}
          {(comments ?? []).length === 0 && (
            <p className="text-sm text-[var(--soft-text)] py-3">No comments yet.</p>
          )}
        </div>
      )}

      <div className="relative border border-[var(--border)] rounded-xl p-3 focus-within:border-[var(--primary)] transition-colors">
        <textarea
          placeholder="Add a comment... Use @ to mention someone"
          value={text}
          onChange={handleTextChange}
          rows={2}
          className="w-full text-sm resize-none focus:outline-none text-slate-700 placeholder:text-[var(--soft-text)] bg-transparent"
        />
        {showMentions && filteredStaff.length > 0 && (
          <div className="absolute bottom-full left-0 mb-1 z-20 bg-white border border-[var(--border)] rounded-xl shadow-lg py-1 w-52">
            {filteredStaff.map((staff) => (
              <button
                key={staff.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertMention(staff.fullName, staff.id)}
                className="flex items-center gap-2 px-3 py-2 w-full hover:bg-slate-50 text-sm text-slate-700 transition-colors"
              >
                <div
                  className="h-6 w-6 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ color: 'var(--primary)' }}
                >
                  {staff.fullName.charAt(0)}
                </div>
                {staff.fullName}
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            Comment
          </button>
        </div>
      </div>
    </div>
  )
}
