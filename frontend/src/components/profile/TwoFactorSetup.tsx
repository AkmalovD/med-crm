'use client'

import { useRef, useState } from 'react'
import { Copy, ShieldCheck, ShieldOff, X } from 'lucide-react'

import { useProfileStore } from '@/store/useProfileStore'

const MOCK_SECRET = 'JBSWY3DPEHPK3PXP'
const MOCK_QR_URL = null

interface TwoFactorSetupProps {
  is2FAEnabled: boolean
  onEnable: (code: string) => void
  onDisable: (password: string) => void
  isLoading: boolean
}

export function TwoFactorSetup({ is2FAEnabled, onEnable, onDisable, isLoading }: TwoFactorSetupProps) {
  const { is2FASetupModalOpen, is2FADisableModalOpen, open2FASetupModal, close2FASetupModal, open2FADisableModal, close2FADisableModal } =
    useProfileStore()

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [disablePassword, setDisablePassword] = useState('')
  const [otpError, setOtpError] = useState<string | null>(null)
  const [step, setStep] = useState<'scan' | 'verify'>('scan')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)
    if (digit && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const code = otpDigits.join('')
    if (code.length < 6) {
      setOtpError('Enter the full 6-digit code.')
      return
    }
    setOtpError(null)
    onEnable(code)
  }

  const handleDisable = () => {
    if (!disablePassword) return
    onDisable(disablePassword)
  }

  const closeSetup = () => {
    setOtpDigits(['', '', '', '', '', ''])
    setOtpError(null)
    setStep('scan')
    close2FASetupModal()
  }

  const closeDisable = () => {
    setDisablePassword('')
    close2FADisableModal()
  }

  return (
    <>
      {is2FAEnabled ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
              <ShieldCheck size={18} color="#16a34a" />
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-green-800">Two-Factor Authentication Enabled</p>
              <p className="mt-[0.15rem] text-[0.78rem] text-green-700">Your account is protected with 2FA</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
            onClick={open2FADisableModal}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <ShieldOff size={18} color="#94a3b8" />
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-slate-900">Two-Factor Authentication</p>
              <p className="mt-[0.15rem] text-[0.78rem] text-slate-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={open2FASetupModal}
          >
            Enable 2FA
          </button>
        </div>
      )}

      {/* Setup Modal */}
      {is2FASetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={closeSetup}>
          <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className="mb-1 text-base font-bold text-slate-900">
                {step === 'scan' ? 'Scan QR Code' : 'Verify Code'}
              </h2>
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-4 py-2 text-[0.85rem] font-medium text-slate-500 transition-[background,opacity] hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60" onClick={closeSetup}>
                <X size={16} />
              </button>
            </div>

            {step === 'scan' && (
              <>
                <p className="mb-5 text-[0.85rem] text-slate-500">
                  Scan the QR code with Google Authenticator, Authy, or a compatible app.
                </p>
                <div className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-4">
                  {MOCK_QR_URL ? (
                    <img src={MOCK_QR_URL} alt="QR Code" style={{ width: 140, height: 140 }} />
                  ) : (
                    <div className="flex h-[140px] w-[140px] items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-400">QR Code</div>
                  )}
                  <button
                    type="button"
                    className="cursor-pointer select-all rounded-md border border-slate-200 bg-white px-3 py-[0.35rem] font-mono text-[0.8rem] tracking-[0.1em] text-gray-700"
                    onClick={() => navigator.clipboard?.writeText(MOCK_SECRET)}
                    title="Click to copy"
                  >
                    <Copy size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {MOCK_SECRET}
                  </button>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click the key to copy</span>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={closeSetup}>Cancel</button>
                  <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60" onClick={() => setStep('verify')}>
                    Next: Verify
                  </button>
                </div>
              </>
            )}

            {step === 'verify' && (
              <>
                <p className="mb-5 text-[0.85rem] text-slate-500">Enter the 6-digit code from your authenticator app.</p>
                <div className="my-4 flex justify-center gap-2">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      className="h-12 w-[42px] rounded-lg border border-slate-200 text-center text-[1.1rem] font-semibold outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]"
                      value={digit}
                      maxLength={1}
                      inputMode="numeric"
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                {otpError && <p className="text-center text-xs text-red-500">{otpError}</p>}
                <div className="mt-5 flex justify-end gap-2">
                  <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={() => setStep('scan')}>Back</button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleVerify}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying…' : 'Verify & Enable'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disable Modal */}
      {is2FADisableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={closeDisable}>
          <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className="mb-1 text-base font-bold text-slate-900">Disable Two-Factor Authentication</h2>
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-4 py-2 text-[0.85rem] font-medium text-slate-500 transition-[background,opacity] hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60" onClick={closeDisable}>
                <X size={16} />
              </button>
            </div>
            <p className="mb-5 text-[0.85rem] text-slate-500">
              Enter your current password to confirm you want to disable 2FA.
            </p>
            <div className="flex flex-col gap-[0.35rem]">
              <label className="text-[0.82rem] font-medium text-gray-700">Current Password</label>
              <input
                className="w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]"
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={closeDisable}>Cancel</button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleDisable}
                disabled={!disablePassword || isLoading}
              >
                {isLoading ? 'Disabling…' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
