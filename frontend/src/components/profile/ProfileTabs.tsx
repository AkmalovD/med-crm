'use client'

import { Activity, AlertTriangle, Bell, Settings, Shield, User } from 'lucide-react'

import { ProfileTab } from './Profile.types'

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
    <div className="flex flex-wrap gap-0 rounded-t-[0.9rem] border-b border-slate-200 bg-slate-50 px-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={[
            'flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent bg-transparent px-4 py-[0.85rem] text-[0.85rem] font-medium transition-colors',
            tab.danger ? 'text-red-500 hover:text-red-600' : 'text-slate-500 hover:text-slate-900',
            activeTab === tab.id ? 'border-b-[#4acf7f] text-[#4acf7f]' : '',
          ].filter(Boolean).join(' ')}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
