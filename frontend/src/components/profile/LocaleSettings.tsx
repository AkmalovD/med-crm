'use client'

import { useState } from 'react'

import { LocaleInput, localeSchema } from '@/validators/profile.schema'
import { UserProfile } from './Profile.types'

interface LocaleSettingsProps {
  profile: UserProfile
  onSave: (data: LocaleInput) => void
  isSaving: boolean
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'uz', label: 'Uzbek' },
]

const TIMEZONES = [
  'Asia/Tashkent',
  'Europe/Moscow',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Tokyo',
  'UTC',
]

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'UZS', label: 'UZS — Uzbek Sum' },
  { value: 'RUB', label: 'RUB — Russian Ruble' },
  { value: 'GBP', label: 'GBP — British Pound' },
]

const DATE_FORMATS: Array<{ value: LocaleInput['dateFormat']; label: string; example: string }> = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '09/06/2025' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '06/09/2025' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-06-09' },
]

function validate(data: LocaleInput): Partial<Record<keyof LocaleInput, string>> {
  const result = localeSchema.safeParse(data)
  if (result.success) return {}
  const errors: Partial<Record<keyof LocaleInput, string>> = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof LocaleInput
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

export function LocaleSettings({ profile, onSave, isSaving }: LocaleSettingsProps) {
  const [language, setLanguage] = useState(profile.language)
  const [timezone, setTimezone] = useState(profile.timezone)
  const [dateFormat, setDateFormat] = useState<LocaleInput['dateFormat']>(profile.dateFormat)
  const [currency, setCurrency] = useState(profile.currency)
  const [errors, setErrors] = useState<Partial<Record<keyof LocaleInput, string>>>({})

  const previewDate = DATE_FORMATS.find((f) => f.value === dateFormat)?.example ?? ''

  const handleReset = () => {
    setLanguage('en')
    setTimezone('UTC')
    setDateFormat('DD/MM/YYYY')
    setCurrency('USD')
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: LocaleInput = { language, timezone, dateFormat, currency }
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
      <h2 className="mb-5 text-base font-semibold text-slate-900">Language & Preferences</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Language */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className="text-[0.82rem] font-medium text-gray-700">UI Language</label>
          <select className="w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          {errors.language && <span className="text-xs text-red-500">{errors.language}</span>}
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className="text-[0.82rem] font-medium text-gray-700">Timezone</label>
          <select className="w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          {errors.timezone && <span className="text-xs text-red-500">{errors.timezone}</span>}
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className="text-[0.82rem] font-medium text-gray-700">Currency</label>
          <select className="w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.currency && <span className="text-xs text-red-500">{errors.currency}</span>}
        </div>

        {/* Date Format */}
        <div className="flex flex-col gap-[0.35rem]">
          <label className="text-[0.82rem] font-medium text-gray-700">Date Format</label>
          <div className="flex flex-col gap-2">
            {DATE_FORMATS.map((fmt) => (
              <label key={fmt.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="dateFormat"
                  className="h-[15px] w-[15px] accent-[#4acf7f]"
                  value={fmt.value}
                  checked={dateFormat === fmt.value}
                  onChange={() => setDateFormat(fmt.value)}
                />
                {fmt.label}
              </label>
            ))}
          </div>
          {dateFormat && (
            <p className="mt-1 pl-1 text-[0.78rem] text-[#4acf7f]">Preview: {previewDate}</p>
          )}
          {errors.dateFormat && <span className="text-xs text-red-500">{errors.dateFormat}</span>}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-5">
        <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={handleReset}>
          Reset to Defaults
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </form>
  )
}
