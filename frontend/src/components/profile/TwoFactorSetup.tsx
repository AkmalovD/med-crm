'use client'

import { useRef, useState } from 'react'
import { Copy, ShieldCheck, ShieldOff, X } from 'lucide-react'

import { useProfileStore } from '@/store/useProfileStore'
import styles from './ProfileDashboardPage.module.css'

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
        <div className={[styles.infoCard, styles.infoCardGreen].join(' ')}>
          <div className={styles.infoCardLeft}>
            <div className={[styles.infoCardIcon, styles.infoCardIconGreen].join(' ')}>
              <ShieldCheck size={18} color="#16a34a" />
            </div>
            <div>
              <p className={styles.infoCardTitle} style={{ color: '#166534' }}>Two-Factor Authentication Enabled</p>
              <p className={styles.infoCardDesc} style={{ color: '#15803d' }}>Your account is protected with 2FA</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.btn + ' ' + styles.btnOutline}
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
            onClick={open2FADisableModal}
          >
            Disable 2FA
          </button>
        </div>
      ) : (
        <div className={styles.infoCard}>
          <div className={styles.infoCardLeft}>
            <div className={styles.infoCardIcon}>
              <ShieldOff size={18} color="#94a3b8" />
            </div>
            <div>
              <p className={styles.infoCardTitle}>Two-Factor Authentication</p>
              <p className={styles.infoCardDesc}>Add an extra layer of security to your account</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.btn + ' ' + styles.btnPrimary}
            onClick={open2FASetupModal}
          >
            Enable 2FA
          </button>
        </div>
      )}

      {/* Setup Modal */}
      {is2FASetupModalOpen && (
        <div className={styles.modalBackdrop} onClick={closeSetup}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className={styles.modalTitle}>
                {step === 'scan' ? 'Scan QR Code' : 'Verify Code'}
              </h2>
              <button type="button" className={styles.btn + ' ' + styles.btnGhost} onClick={closeSetup}>
                <X size={16} />
              </button>
            </div>

            {step === 'scan' && (
              <>
                <p className={styles.modalDesc}>
                  Scan the QR code with Google Authenticator, Authy, or a compatible app.
                </p>
                <div className={styles.qrBlock}>
                  {MOCK_QR_URL ? (
                    <img src={MOCK_QR_URL} alt="QR Code" style={{ width: 140, height: 140 }} />
                  ) : (
                    <div className={styles.qrCode}>QR Code</div>
                  )}
                  <button
                    type="button"
                    className={styles.qrSecret}
                    onClick={() => navigator.clipboard?.writeText(MOCK_SECRET)}
                    title="Click to copy"
                  >
                    <Copy size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {MOCK_SECRET}
                  </button>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click the key to copy</span>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={closeSetup}>Cancel</button>
                  <button type="button" className={styles.btn + ' ' + styles.btnPrimary} onClick={() => setStep('verify')}>
                    Next: Verify
                  </button>
                </div>
              </>
            )}

            {step === 'verify' && (
              <>
                <p className={styles.modalDesc}>Enter the 6-digit code from your authenticator app.</p>
                <div className={styles.otpWrapper}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      className={styles.otpInput}
                      value={digit}
                      maxLength={1}
                      inputMode="numeric"
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                {otpError && <p className={styles.inputError} style={{ textAlign: 'center' }}>{otpError}</p>}
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={() => setStep('scan')}>Back</button>
                  <button
                    type="button"
                    className={styles.btn + ' ' + styles.btnPrimary}
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
        <div className={styles.modalBackdrop} onClick={closeDisable}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className={styles.modalTitle}>Disable Two-Factor Authentication</h2>
              <button type="button" className={styles.btn + ' ' + styles.btnGhost} onClick={closeDisable}>
                <X size={16} />
              </button>
            </div>
            <p className={styles.modalDesc}>
              Enter your current password to confirm you want to disable 2FA.
            </p>
            <div className={styles.formField}>
              <label className={styles.label}>Current Password</label>
              <input
                className={styles.input}
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={closeDisable}>Cancel</button>
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnDestructive}
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
