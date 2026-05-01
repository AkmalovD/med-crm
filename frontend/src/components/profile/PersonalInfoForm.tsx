'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

import { ROLE_LABELS } from './Profile.mock'
import { UserProfile } from './Profile.types'
import { UpdateProfileInput, updateProfileSchema } from '@/validators/profile.schema'

const labelClass = 'text-[0.82rem] font-medium text-gray-700'
const requiredClass = 'ml-[0.15rem] text-red-500'
const inputClass = 'w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const errorClass = 'text-xs text-red-500'
const readOnlyValueClass = 'flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500'
const hintClass = 'flex items-center gap-1 text-xs text-slate-400'
const buttonBaseClass = 'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.85rem] font-medium transition-[background,opacity] disabled:cursor-not-allowed disabled:opacity-60'

interface PersonalInfoFormProps {
  profile: UserProfile
  onSave: (data: UpdateProfileInput) => void
  isSaving: boolean
}

function validate(data: UpdateProfileInput): Partial<Record<keyof UpdateProfileInput, string>> {
  const result = updateProfileSchema.safeParse(data)
  if (result.success) return {}
  const errors: Partial<Record<keyof UpdateProfileInput, string>> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof UpdateProfileInput
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

export function PersonalInfoForm({ profile, onSave, isSaving }: PersonalInfoFormProps) {
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateProfileInput, string>>>({})

  const isDirty =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    phone !== (profile.phone ?? '') ||
    bio !== (profile.bio ?? '')

  const handleDiscard = () => {
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setPhone(profile.phone ?? '')
    setBio(profile.bio ?? '')
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: UpdateProfileInput = { firstName, lastName, phone: phone || undefined, bio: bio || undefined }
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
      <h2 className="mb-5 text-base font-semibold text-slate-900">Personal Information</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* First Name */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>
            First Name <span className={requiredClass}>*</span>
          </label>
          <input
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
          {errors.firstName && <span className={errorClass}>{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>
            Last Name <span className={requiredClass}>*</span>
          </label>
          <input
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
          {errors.lastName && <span className={errorClass}>{errors.lastName}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>Phone</label>
          <input
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            type="tel"
          />
          {errors.phone && <span className={errorClass}>{errors.phone}</span>}
        </div>

        {/* Email — read only */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>Email</label>
          <div className={readOnlyValueClass}>
            <Lock size={13} />
            {profile.email}
          </div>
          <span className={hintClass}>
            <Lock size={11} /> Contact admin to update email
          </span>
        </div>

        {/* Bio */}
        <div className="col-span-1 flex flex-col gap-[0.35rem] sm:col-span-2">
          <label className={labelClass}>Bio</label>
          <textarea
            className={`${inputClass} min-h-[90px] resize-y`}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about yourself…"
            maxLength={300}
          />
          <span className="text-right text-[0.72rem] text-slate-400">{bio.length} / 300</span>
          {errors.bio && <span className={errorClass}>{errors.bio}</span>}
        </div>

        {/* Role — read only */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>Role</label>
          <div className={readOnlyValueClass}>
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-[0.2rem] text-xs font-semibold text-slate-700">{ROLE_LABELS[profile.role] ?? profile.role}</span>
          </div>
          <span className={hintClass}>Role can only be changed by an admin</span>
        </div>

        {/* Member Since — read only */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className={labelClass}>Member Since</label>
          <div className={readOnlyValueClass}>
            {new Date(profile.memberSince).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5">
        <button
          type="button"
          className={`${buttonBaseClass} border border-slate-200 bg-white text-gray-700 hover:bg-slate-50`}
          onClick={handleDiscard}
          disabled={!isDirty || isSaving}
        >
          Discard Changes
        </button>
        <button
          type="submit"
          className={`${buttonBaseClass} bg-[#4acf7f] text-white hover:bg-[#3ab86d]`}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
