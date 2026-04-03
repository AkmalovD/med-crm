'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

import { ROLE_LABELS } from './Profile.mock'
import { UserProfile } from './Profile.types'
import { UpdateProfileInput, updateProfileSchema } from '@/validators/profile.schema'
import styles from './ProfileDashboardPage.module.css'

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
      <h2 className={styles.sectionTitle}>Personal Information</h2>

      <div className={styles.formGrid}>
        {/* First Name */}
        <div className={styles.formField}>
          <label className={styles.label}>
            First Name <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
          {errors.firstName && <span className={styles.inputError}>{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className={styles.formField}>
          <label className={styles.label}>
            Last Name <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
          {errors.lastName && <span className={styles.inputError}>{errors.lastName}</span>}
        </div>

        {/* Phone */}
        <div className={styles.formField}>
          <label className={styles.label}>Phone</label>
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            type="tel"
          />
          {errors.phone && <span className={styles.inputError}>{errors.phone}</span>}
        </div>

        {/* Email — read only */}
        <div className={styles.readOnlyField}>
          <label className={styles.label}>Email</label>
          <div className={styles.readOnlyValue}>
            <Lock size={13} />
            {profile.email}
          </div>
          <span className={styles.inputHint}>
            <Lock size={11} /> Contact admin to update email
          </span>
        </div>

        {/* Bio */}
        <div className={[styles.formField, styles.formFieldFull].join(' ')}>
          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about yourself…"
            maxLength={300}
          />
          <span className={styles.charCount}>{bio.length} / 300</span>
          {errors.bio && <span className={styles.inputError}>{errors.bio}</span>}
        </div>

        {/* Role — read only */}
        <div className={styles.readOnlyField}>
          <label className={styles.label}>Role</label>
          <div className={styles.readOnlyValue}>
            <span className={styles.badge}>{ROLE_LABELS[profile.role] ?? profile.role}</span>
          </div>
          <span className={styles.inputHint}>Role can only be changed by an admin</span>
        </div>

        {/* Member Since — read only */}
        <div className={styles.readOnlyField}>
          <label className={styles.label}>Member Since</label>
          <div className={styles.readOnlyValue}>
            {new Date(profile.memberSince).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.btn + ' ' + styles.btnOutline}
          onClick={handleDiscard}
          disabled={!isDirty || isSaving}
        >
          Discard Changes
        </button>
        <button
          type="submit"
          className={styles.btn + ' ' + styles.btnPrimary}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
