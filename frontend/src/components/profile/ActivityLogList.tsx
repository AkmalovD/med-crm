'use client'

import { useMemo, useState } from 'react'

import { ActivityLogEntry } from './Profile.types'
import styles from './ProfileDashboardPage.module.css'

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
      <div className={styles.filterRow}>
        <p className={styles.sectionTitle} style={{ margin: 0 }}>Recent Activity</p>
        <select
          className={styles.select}
          style={{ width: 'auto', minWidth: 150 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>No activity recorded yet.</div>
      ) : (
        groupKeys.map((key) => (
          <div key={key} className={styles.activityGroup}>
            <p className={styles.activityGroupDate}>{formatGroupDate(groups[key][0].performedAt)}</p>
            {groups[key].map((entry) => (
              <div key={entry.id} className={styles.activityRow}>
                <div className={styles.activityDot} />
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{entry.action}</p>
                  {entry.entityName && (
                    <p className={styles.activityEntity}>
                      {entry.entityType}: {entry.entityName}
                    </p>
                  )}
                </div>
                <div className={styles.activityMeta}>
                  <p className={styles.activityTime}>{formatTime(entry.performedAt)}</p>
                  <p className={styles.activityIp}>{entry.ipAddress}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  )
}
