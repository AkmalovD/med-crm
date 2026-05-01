'use client'

import { NotificationChannel, NotificationEvent, NotificationPreference } from './Profile.types'

interface NotificationPreferencesProps {
  preferences: NotificationPreference[]
  onToggle: (event: NotificationEvent, channel: NotificationChannel, enabled: boolean) => void
  isUpdating: boolean
}

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <label className="relative inline-flex h-5 w-9 cursor-pointer" style={{ opacity: disabled ? 0.5 : 1 }}>
      <input
        type="checkbox"
        className="peer absolute h-0 w-0 opacity-0"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="absolute inset-0 rounded-[99px] bg-slate-200 transition-colors peer-checked:bg-[#4acf7f]" />
      <span className="absolute left-[3px] top-[3px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform peer-checked:translate-x-4" />
    </label>
  )
}

export function NotificationPreferences({ preferences, onToggle, isUpdating }: NotificationPreferencesProps) {
  return (
    <>
      <h2 className="mb-5 text-base font-semibold text-slate-900">Notification Preferences</h2>
      <p className="-mt-3 mb-5 text-[0.82rem] text-slate-500">Choose how you want to be notified for each event.</p>

      <div style={{ overflowX: 'auto' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-[0.78rem] font-semibold text-slate-500">Event</th>
              <th className="border-b border-slate-200 px-3 py-2 text-center text-[0.78rem] font-semibold text-slate-500">Email</th>
              <th className="border-b border-slate-200 px-3 py-2 text-center text-[0.78rem] font-semibold text-slate-500">SMS</th>
              <th className="border-b border-slate-200 px-3 py-2 text-center text-[0.78rem] font-semibold text-slate-500">In-App</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map((pref) => (
              <tr key={pref.event}>
                <td className="border-b border-slate-100 px-3 py-3 text-sm text-gray-700">{pref.label}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-center text-sm text-gray-700">
                  <ToggleSwitch
                    checked={pref.email}
                    onChange={(checked) => onToggle(pref.event, 'email', checked)}
                    disabled={isUpdating}
                  />
                </td>
                <td className="border-b border-slate-100 px-3 py-3 text-center text-sm text-gray-700">
                  <ToggleSwitch
                    checked={pref.sms}
                    onChange={(checked) => onToggle(pref.event, 'sms', checked)}
                    disabled={isUpdating}
                  />
                </td>
                <td className="border-b border-slate-100 px-3 py-3 text-center text-sm text-gray-700">
                  <ToggleSwitch
                    checked={pref.inApp}
                    onChange={(checked) => onToggle(pref.event, 'in_app', checked)}
                    disabled={isUpdating}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-center gap-[0.3rem] text-xs text-slate-400">
        Changes are saved automatically when you toggle a preference.
      </p>
    </>
  )
}
