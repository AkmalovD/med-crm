'use client'

import { useMemo, useState } from 'react'

import { ActivityLogEntry } from './Profile.types'

interface ActivityLogListProps {
  entries: ActivityLogEntry[]
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Activity' },
  { value: 'profile', label: 'Profile Changes' },
  { value: 'client', label: 'Client Actions' },
  { value: 'appointment', label: 'Appointments' },
  { value: 'document', label: 'Documents' },
  { value: 'invoice', label: 'Invoices' },
]

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatGroupDate(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return 'Today'
  if (isSameDay(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function groupByDate(entries: ActivityLogEntry[]): Record<string, ActivityLogEntry[]> {
  const groups: Record<string, ActivityLogEntry[]> = {}
  for (const entry of entries) {
    const key = new Date(entry.performedAt).toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
}

export function ActivityLogList({ entries }: ActivityLogListProps) {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return entries
    return entries.filter((e) => {
      if (filter === 'profile') return !e.entityType
      return e.entityType === filter
    })
  }, [entries, filter])

  const groups = useMemo(() => groupByDate(filtered), [filtered])
  const groupKeys = Object.keys(groups)

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="m-0 text-base font-semibold text-slate-900">Recent Activity</p>
        <select
          className="w-auto min-w-[150px] box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">No activity recorded yet.</div>
      ) : (
        groupKeys.map((key) => (
          <div key={key} className="mb-5">
            <p className="mb-2 pl-1 text-[0.78rem] font-semibold uppercase tracking-[0.04em] text-slate-400">{formatGroupDate(groups[key][0].performedAt)}</p>
            {groups[key].map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 border-b border-slate-100 py-[0.65rem] last:border-b-0">
                <div className="mt-[0.35rem] h-2 w-2 shrink-0 rounded-full bg-[#4acf7f]" />
                <div className="flex-1">
                  <p className="m-0 text-sm text-slate-900">{entry.action}</p>
                  {entry.entityName && (
                    <p className="mt-[0.1rem] text-xs text-slate-400">
                      {entry.entityType}: {entry.entityName}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-400">{formatTime(entry.performedAt)}</p>
                  <p className="mt-[0.1rem] text-[0.72rem] text-slate-300">{entry.ipAddress}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  )
}
