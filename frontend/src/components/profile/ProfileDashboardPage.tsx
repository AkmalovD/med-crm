'use client'

import { useState } from 'react'

import { DashboardScaffold } from '../dashboard/DashboardScaffold'
import { ACTIVITY_LOG_MOCK, PROFILE_MOCK, SESSIONS_MOCK } from './Profile.mock'
import { NotificationChannel, NotificationEvent, NotificationPreference, UserProfile } from './Profile.types'
import { UpdateProfileInput } from '@/validators/profile.schema'
import { LocaleInput } from '@/validators/profile.schema'
import { ChangePasswordInput } from '@/validators/profile.schema'
import { useProfileStore } from '@/store/useProfileStore'

import { ProfileHeader } from './ProfileHeader'
import { ProfileTabs } from './ProfileTabs'
import { PersonalInfoForm } from './PersonalInfoForm'
import { AvatarUpload } from './AvatarUpload'
import { ChangePasswordForm } from './ChangePasswordForm'
import { TwoFactorSetup } from './TwoFactorSetup'
import { ActiveSessionsList } from './ActiveSessionsList'
import { NotificationPreferences } from './NotificationPreferences'
import { LocaleSettings } from './LocaleSettings'
import { ActivityLogList } from './ActivityLogList'
import { DangerZone } from './DangerZone'

import styles from './ProfileDashboardPage.module.css'

export function ProfileDashboardPage() {
  const [profile, setProfile] = useState<UserProfile>(PROFILE_MOCK)
  const [sessions, setSessions] = useState(SESSIONS_MOCK)
  const [activityLog] = useState(ACTIVITY_LOG_MOCK)

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isSavingLocale, setIsSavingLocale] = useState(false)
  const [isUpdatingNotif, setIsUpdatingNotif] = useState(false)
  const [isRevokingSession, setIsRevokingSession] = useState(false)
  const [is2FALoading, setIs2FALoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isDangerLoading, setIsDangerLoading] = useState(false)

  const { activeTab, setActiveTab } = useProfileStore()

  const handleSaveProfile = (data: UpdateProfileInput) => {
    setIsSavingProfile(true)
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        phone: data.phone ?? null,
        bio: data.bio ?? null,
      }))
      setIsSavingProfile(false)
    }, 800)
  }

  const handleAvatarUpload = (file: File) => {
    setIsUploadingAvatar(true)
    const reader = new FileReader()
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result as string }))
      setIsUploadingAvatar(false)
      setIsAvatarModalOpen(false)
    }
    reader.readAsDataURL(file)
  }

  const handleChangePassword = (_data: ChangePasswordInput) => {
    setIsSavingPassword(true)
    setTimeout(() => setIsSavingPassword(false), 900)
  }

  const handleSaveLocale = (data: LocaleInput) => {
    setIsSavingLocale(true)
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        language: data.language,
        timezone: data.timezone,
        dateFormat: data.dateFormat,
        currency: data.currency,
      }))
      setIsSavingLocale(false)
    }, 700)
  }

  const handleToggleNotification = (event: NotificationEvent, channel: NotificationChannel, enabled: boolean) => {
    setIsUpdatingNotif(true)
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        notificationPreferences: prev.notificationPreferences.map((pref): NotificationPreference => {
          if (pref.event !== event) return pref
          return {
            ...pref,
            email: channel === 'email' ? enabled : pref.email,
            sms: channel === 'sms' ? enabled : pref.sms,
            inApp: channel === 'in_app' ? enabled : pref.inApp,
          }
        }),
      }))
      setIsUpdatingNotif(false)
    }, 400)
  }

  const handleRevokeSession = (sessionId: string) => {
    setIsRevokingSession(true)
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setIsRevokingSession(false)
    }, 500)
  }

  const handleRevokeAll = () => {
    setIsRevokingSession(true)
    setTimeout(() => {
      setSessions((prev) => prev.filter((s) => s.isCurrent))
      setIsRevokingSession(false)
    }, 500)
  }

  const handleEnable2FA = (_code: string) => {
    setIs2FALoading(true)
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, is2FAEnabled: true }))
      setIs2FALoading(false)
      useProfileStore.getState().close2FASetupModal()
    }, 900)
  }

  const handleDisable2FA = (_password: string) => {
    setIs2FALoading(true)
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, is2FAEnabled: false }))
      setIs2FALoading(false)
      useProfileStore.getState().close2FADisableModal()
    }, 700)
  }

  const handleDeactivate = () => {
    setIsDangerLoading(true)
    setTimeout(() => setIsDangerLoading(false), 800)
  }

  const handleDelete = (_password: string) => {
    setIsDangerLoading(true)
    setTimeout(() => setIsDangerLoading(false), 800)
  }

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <ProfileHeader
          profile={profile}
          onEditAvatar={() => setIsAvatarModalOpen(true)}
        />

        <div className={styles.tabsWrapper}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className={styles.tabContent}>
            {activeTab === 'personal' && (
              <>
                <PersonalInfoForm
                  profile={profile}
                  onSave={handleSaveProfile}
                  isSaving={isSavingProfile}
                />
              </>
            )}

            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <ChangePasswordForm
                  onSave={handleChangePassword}
                  isSaving={isSavingPassword}
                />
                <div className={styles.divider} />
                <div>
                  <h2 className={styles.sectionTitle}>Two-Factor Authentication</h2>
                  <TwoFactorSetup
                    is2FAEnabled={profile.is2FAEnabled}
                    onEnable={handleEnable2FA}
                    onDisable={handleDisable2FA}
                    isLoading={is2FALoading}
                  />
                </div>
                <div className={styles.divider} />
                <ActiveSessionsList
                  sessions={sessions}
                  onRevoke={handleRevokeSession}
                  onRevokeAll={handleRevokeAll}
                  isRevoking={isRevokingSession}
                />
              </div>
            )}

            {activeTab === 'notifications' && (
              <NotificationPreferences
                preferences={profile.notificationPreferences}
                onToggle={handleToggleNotification}
                isUpdating={isUpdatingNotif}
              />
            )}

            {activeTab === 'preferences' && (
              <LocaleSettings
                profile={profile}
                onSave={handleSaveLocale}
                isSaving={isSavingLocale}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityLogList entries={activityLog} />
            )}

            {activeTab === 'danger' && (
              <DangerZone
                onDeactivate={handleDeactivate}
                onDelete={handleDelete}
                isLoading={isDangerLoading}
              />
            )}
          </div>
        </div>
      </div>

      <AvatarUpload
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUpload={handleAvatarUpload}
        isUploading={isUploadingAvatar}
      />
    </DashboardScaffold>
  )
}
