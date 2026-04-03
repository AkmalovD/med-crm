'use client'

import { useState } from 'react'
import { LogOut, Monitor, Smartphone, Tablet, X } from 'lucide-react'

import { ActiveSession } from './Profile.types'
import styles from './ProfileDashboardPage.module.css'

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
      <div className={styles.sessionsHeader}>
        <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Active Sessions</h3>
        <button
          type="button"
          className={styles.btn + ' ' + styles.btnOutline}
          style={{ color: '#ef4444', borderColor: '#fecaca', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          onClick={() => setConfirmRevokeAll(true)}
        >
          <LogOut size={13} />
          Revoke All Other Sessions
        </button>
      </div>

      <div className={styles.sessionsBetween}>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={[styles.sessionRow, session.isCurrent ? styles.sessionRowCurrent : ''].filter(Boolean).join(' ')}
          >
            <div className={styles.sessionLeft}>
              <DeviceIcon type={session.deviceType} />
              <div>
                <div className={styles.sessionName}>
                  {session.deviceName}
                  {session.isCurrent && (
                    <span className={[styles.badge, styles.badgeGreen].join(' ')} style={{ fontSize: '0.68rem' }}>
                      Current
                    </span>
                  )}
                </div>
                <p className={styles.sessionMeta}>
                  {session.location ?? session.ipAddress} · Active {formatRelative(session.lastActiveAt)}
                </p>
              </div>
            </div>
            {!session.isCurrent && (
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnGhost}
                style={{ color: '#ef4444', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
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
        <div className={styles.modalBackdrop} onClick={() => setConfirmRevokeAll(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Revoke All Other Sessions?</h2>
            <p className={styles.modalDesc}>
              All devices except your current session will be logged out. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={() => setConfirmRevokeAll(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnDestructive}
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
