import { Camera } from 'lucide-react'

import { ROLE_LABELS } from './Profile.mock'
import { UserProfile } from './Profile.types'

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
    <div className="flex items-center gap-6 rounded-[0.9rem] border border-slate-200 bg-white p-6">
      <div className="relative shrink-0">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.fullName} className="h-24 w-24 rounded-full border-[3px] border-slate-200 object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-slate-200 bg-slate-200 text-[2rem] font-bold text-slate-500">{initials}</div>
        )}
        <button type="button" className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#4acf7f] text-white transition-colors hover:bg-[#3ab86d]" onClick={onEditAvatar} title="Change photo">
          <Camera size={13} />
        </button>
      </div>

      <div className="flex-1">
        <h1 className="m-0 text-2xl font-bold text-slate-900">{profile.fullName}</h1>
        <p className="mt-1 text-[0.85rem] text-slate-500">{profile.email}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-[0.2rem] text-xs font-semibold text-slate-700">{ROLE_LABELS[profile.role] ?? profile.role}</span>
          <span className="text-xs text-slate-400">Member since {formatDate(profile.memberSince)}</span>
          {profile.lastLoginAt && (
            <span className="text-xs text-slate-400">Last login {formatRelative(profile.lastLoginAt)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
