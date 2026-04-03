'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { ChangePasswordInput, changePasswordSchema } from '@/validators/profile.schema'
import styles from './ProfileDashboardPage.module.css'

interface ChangePasswordFormProps {
  onSave: (data: ChangePasswordInput) => void
  isSaving: boolean
}

const STRENGTH_CONFIG = [
  { label: 'Too weak', color: '#ef4444', width: '25%' },
  { label: 'Weak', color: '#f97316', width: '50%' },
  { label: 'Good', color: '#eab308', width: '75%' },
  { label: 'Strong', color: '#4acf7f', width: '100%' },
]

function calcStrength(pw: string): number {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return Math.max(0, score - 1)
}

function validate(data: ChangePasswordInput): Partial<Record<keyof ChangePasswordInput, string>> {
  const result = changePasswordSchema.safeParse(data)
  if (result.success) return {}
  const errors: Partial<Record<keyof ChangePasswordInput, string>> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ChangePasswordInput
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className={styles.passwordWrapper}>
      <input
        className={styles.input}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button type="button" className={styles.passwordToggle} onClick={() => setShow((s) => !s)}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

export function ChangePasswordForm({ onSave, isSaving }: ChangePasswordFormProps) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordInput, string>>>({})
  const [showCurrent, setShowCurrent] = useState(false)

  const strength = next.length > 0 ? calcStrength(next) : -1
  const strengthConf = strength >= 0 ? STRENGTH_CONFIG[strength] : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: ChangePasswordInput = { currentPassword: current, newPassword: next, confirmPassword: confirm }
    const errs = validate(data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={styles.sectionTitle}>Change Password</h2>
      <p className={styles.sectionSubtitle}>Choose a strong password and do not reuse it across other sites.</p>

      <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
        {/* Current Password */}
        <div className={styles.formField}>
          <label className={styles.label}>
            Current Password <span className={styles.required}>*</span>
          </label>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
            <button type="button" className={styles.passwordToggle} onClick={() => setShowCurrent((s) => !s)}>
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.currentPassword && <span className={styles.inputError}>{errors.currentPassword}</span>}
        </div>

        {/* New Password */}
        <div className={styles.formField}>
          <label className={styles.label}>
            New Password <span className={styles.required}>*</span>
          </label>
          <PasswordInput value={next} onChange={setNext} placeholder="Enter new password" />
          {strengthConf && (
            <>
              <div className={styles.strengthBar}>
                <div
                  className={styles.strengthFill}
                  style={{ width: strengthConf.width, background: strengthConf.color }}
                />
              </div>
              <p className={styles.strengthLabel} style={{ color: strengthConf.color }}>
                {strengthConf.label}
              </p>
            </>
          )}
          {errors.newPassword && <span className={styles.inputError}>{errors.newPassword}</span>}
        </div>

        {/* Confirm Password */}
        <div className={styles.formField}>
          <label className={styles.label}>
            Confirm Password <span className={styles.required}>*</span>
          </label>
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
          {errors.confirmPassword && <span className={styles.inputError}>{errors.confirmPassword}</span>}
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.btn + ' ' + styles.btnPrimary}
          disabled={isSaving || !current || !next || !confirm}
        >
          {isSaving ? 'Saving…' : 'Change Password'}
        </button>
      </div>
    </form>
  )
}
