'use client'

import { Activity, AlertTriangle, Bell, Settings, Shield, User } from 'lucide-react'

import { ProfileTab } from './Profile.types'
import styles from './ProfileDashboardPage.module.css'

interface ProfileTabsProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}

const TABS: { id: ProfileTab; label: string; icon: React.ReactNode; danger?: boolean }[] = [
  { id: 'personal', label: 'Personal Info', icon: <User size={14} /> },
  { id: 'security', label: 'Security', icon: <Shield size={14} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
  { id: 'preferences', label: 'Preferences', icon: <Settings size={14} /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={14} /> },
  { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={14} />, danger: true },
]

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className={styles.tabsList}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={[
            styles.tab,
            activeTab === tab.id ? styles.tabActive : '',
            tab.danger ? styles.tabDanger : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
