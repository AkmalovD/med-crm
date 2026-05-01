'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { ChangePasswordInput, changePasswordSchema } from '@/validators/profile.schema'

const labelClass = 'text-[0.82rem] font-medium text-gray-700'
const requiredClass = 'ml-[0.15rem] text-red-500'
const inputClass = 'w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const errorClass = 'text-xs text-red-500'

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
    <div className="relative">
      <input
        className={`${inputClass} pr-10`}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button type="button" className="absolute right-[0.6rem] top-1/2 flex -translate-y-1/2 items-center p-0 text-slate-400 hover:text-slate-500" onClick={() => setShow((s) => !s)}>
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
      <h2 className="mb-5 text-base font-semibold text-slate-900">Change Password</h2>
      <p className="-mt-3 mb-5 text-[0.82rem] text-slate-500">Choose a strong password and do not reuse it across other sites.</p>

      <div className="grid grid-cols-1 gap-5">
        {/* Current Password */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>
            Current Password <span className={requiredClass}>*</span>
          </label>
          <div className="relative">
            <input
              className={`${inputClass} pr-10`}
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
            <button type="button" className="absolute right-[0.6rem] top-1/2 flex -translate-y-1/2 items-center p-0 text-slate-400 hover:text-slate-500" onClick={() => setShowCurrent((s) => !s)}>
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.currentPassword && <span className={errorClass}>{errors.currentPassword}</span>}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>
            New Password <span className={requiredClass}>*</span>
          </label>
          <PasswordInput value={next} onChange={setNext} placeholder="Enter new password" />
          {strengthConf && (
            <>
              <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-[99px] bg-slate-100">
                <div
                  className="h-full rounded-[99px] transition-[width,background] duration-300"
                  style={{ width: strengthConf.width, background: strengthConf.color }}
                />
              </div>
              <p className="mt-1 text-[0.72rem] text-slate-400" style={{ color: strengthConf.color }}>
                {strengthConf.label}
              </p>
            </>
          )}
          {errors.newPassword && <span className={errorClass}>{errors.newPassword}</span>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>
            Confirm Password <span className={requiredClass}>*</span>
          </label>
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
          {errors.confirmPassword && <span className={errorClass}>{errors.confirmPassword}</span>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving || !current || !next || !confirm}
        >
          {isSaving ? 'Saving…' : 'Change Password'}
        </button>
      </div>
    </form>
  )
}
