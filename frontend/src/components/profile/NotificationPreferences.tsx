'use client'

import { NotificationChannel, NotificationEvent, NotificationPreference } from './Profile.types'
import styles from './ProfileDashboardPage.module.css'

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
    <label className={styles.toggle} style={{ opacity: disabled ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={styles.toggleTrack} />
      <span className={styles.toggleThumb} />
    </label>
  )
}

export function NotificationPreferences({ preferences, onToggle, isUpdating }: NotificationPreferencesProps) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Notification Preferences</h2>
      <p className={styles.sectionSubtitle}>Choose how you want to be notified for each event.</p>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.notifTable}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Email</th>
              <th>SMS</th>
              <th>In-App</th>
            </tr>
          </thead>
          <tbody>
            {preferences.map((pref) => (
              <tr key={pref.event}>
                <td>{pref.label}</td>
                <td>
                  <ToggleSwitch
                    checked={pref.email}
                    onChange={(checked) => onToggle(pref.event, 'email', checked)}
                    disabled={isUpdating}
                  />
                </td>
                <td>
                  <ToggleSwitch
                    checked={pref.sms}
                    onChange={(checked) => onToggle(pref.event, 'sms', checked)}
                    disabled={isUpdating}
                  />
                </td>
                <td>
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

      <p className={styles.inputHint} style={{ marginTop: '1rem' }}>
        Changes are saved automatically when you toggle a preference.
      </p>
    </>
  )
}
