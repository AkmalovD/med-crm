import { Camera } from 'lucide-react'

import { ROLE_LABELS } from './Profile.mock'
import { UserProfile } from './Profile.types'
import styles from './ProfileDashboardPage.module.css'

interface ProfileHeaderProps {
  profile: UserProfile
  onEditAvatar: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
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

export function ProfileHeader({ profile, onEditAvatar }: ProfileHeaderProps) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()

  return (
    <div className={styles.headerCard}>
      <div className={styles.avatarWrapper}>
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.fullName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{initials}</div>
        )}
        <button type="button" className={styles.avatarEditBtn} onClick={onEditAvatar} title="Change photo">
          <Camera size={13} />
        </button>
      </div>

      <div className={styles.headerMeta}>
        <h1 className={styles.headerName}>{profile.fullName}</h1>
        <p className={styles.headerEmail}>{profile.email}</p>
        <div className={styles.headerBadges}>
          <span className={styles.badge}>{ROLE_LABELS[profile.role] ?? profile.role}</span>
          <span className={styles.badgeMeta}>Member since {formatDate(profile.memberSince)}</span>
          {profile.lastLoginAt && (
            <span className={styles.badgeMeta}>Last login {formatRelative(profile.lastLoginAt)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
