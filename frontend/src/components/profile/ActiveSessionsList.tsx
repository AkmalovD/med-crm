'use client'

import { useState } from 'react'
import { LogOut, Monitor, Smartphone, Tablet, X } from 'lucide-react'

import { ActiveSession } from './Profile.types'

interface ActiveSessionsListProps {
  sessions: ActiveSession[]
  onRevoke: (sessionId: string) => void
  onRevokeAll: () => void
  isRevoking: boolean
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function DeviceIcon({ type }: { type: ActiveSession['deviceType'] }) {
  if (type === 'mobile') return <Smartphone size={18} color="#94a3b8" />
  if (type === 'tablet') return <Tablet size={18} color="#94a3b8" />
  return <Monitor size={18} color="#94a3b8" />
}

export function ActiveSessionsList({ sessions, onRevoke, onRevokeAll, isRevoking }: ActiveSessionsListProps) {
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false)

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-base font-semibold text-slate-900">Active Sessions</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-[0.4rem] text-[0.8rem] font-medium text-red-500 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setConfirmRevokeAll(true)}
        >
          <LogOut size={13} />
          Revoke All Other Sessions
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={[
              'flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-[0.85rem]',
              session.isCurrent ? 'border-[#4acf7f] bg-green-50' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className="flex items-center gap-3">
              <DeviceIcon type={session.deviceType} />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  {session.deviceName}
                  {session.isCurrent && (
                    <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-[0.2rem] text-[0.68rem] font-semibold text-green-800">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-[0.15rem] text-xs text-slate-400">
                  {session.location ?? session.ipAddress} · Active {formatRelative(session.lastActiveAt)}
                </p>
              </div>
            </div>
            {!session.isCurrent && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-2 py-[0.3rem] text-[0.8rem] font-medium text-red-500 transition-[background,opacity] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => onRevoke(session.id)}
                disabled={isRevoking}
              >
                <X size={13} /> Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Confirm revoke all dialog */}
      {confirmRevokeAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={() => setConfirmRevokeAll(false)}>
          <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-base font-bold text-slate-900">Revoke All Other Sessions?</h2>
            <p className="mb-5 text-[0.85rem] text-slate-500">
              All devices except your current session will be logged out. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={() => setConfirmRevokeAll(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => { onRevokeAll(); setConfirmRevokeAll(false) }}
                disabled={isRevoking}
              >
                {isRevoking ? 'Revoking…' : 'Revoke All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
