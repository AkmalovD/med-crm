'use client'

import { useState } from 'react'
import { Trash2, UserX } from 'lucide-react'

import styles from './ProfileDashboardPage.module.css'

interface DangerZoneProps {
  onDeactivate: () => void
  onDelete: (password: string) => void
  isLoading: boolean
}

export function DangerZone({ onDeactivate, onDelete, isLoading }: DangerZoneProps) {
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletePassword, setDeletePassword] = useState('')

  const handleDeleteFinal = () => {
    if (deleteConfirmText !== 'DELETE') return
    onDelete(deletePassword)
  }

  const resetDelete = () => {
    setDeleteStep(0)
    setDeleteConfirmText('')
    setDeletePassword('')
  }

  return (
    <>
      <p className={styles.dangerIntro}>
        These actions are permanent and cannot be undone. Please proceed with caution.
      </p>

      {/* Deactivate */}
      <div className={[styles.infoCard, styles.infoCardAmber].join(' ')}>
        <div className={styles.infoCardLeft}>
          <div>
            <p className={styles.infoCardTitle} style={{ color: '#92400e' }}>Deactivate Account</p>
            <p className={styles.infoCardDesc} style={{ color: '#b45309' }}>
              Temporarily disable your account. You can reactivate by contacting an admin.
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.btn + ' ' + styles.btnOutline}
          style={{ color: '#b45309', borderColor: '#fcd34d', whiteSpace: 'nowrap' }}
          onClick={() => setDeactivateOpen(true)}
        >
          <UserX size={14} />
          Deactivate
        </button>
      </div>

      <div className={styles.divider} />

      {/* Delete */}
      <div className={[styles.infoCard, styles.infoCardRed].join(' ')}>
        <div className={styles.infoCardLeft}>
          <div>
            <p className={styles.infoCardTitle} style={{ color: '#991b1b' }}>Delete Account</p>
            <p className={styles.infoCardDesc} style={{ color: '#b91c1c' }}>
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.btn + ' ' + styles.btnDestructive}
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => setDeleteStep(1)}
        >
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      {/* Deactivate confirm dialog */}
      {deactivateOpen && (
        <div className={styles.modalBackdrop} onClick={() => setDeactivateOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Deactivate your account?</h2>
            <p className={styles.modalDesc}>
              You will be logged out and lose access until an admin reactivates your account.
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={() => setDeactivateOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnOutline}
                style={{ color: '#b45309', borderColor: '#fcd34d' }}
                onClick={() => { onDeactivate(); setDeactivateOpen(false) }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing…' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete — Step 1: type DELETE */}
      {deleteStep === 1 && (
        <div className={styles.modalBackdrop} onClick={resetDelete}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Are you absolutely sure?</h2>
            <p className={styles.modalDesc}>
              This will permanently delete your account, all session history, and cannot be recovered.
              Type <strong>DELETE</strong> to confirm.
            </p>
            <div className={styles.formField}>
              <label className={styles.label}>Type DELETE to confirm</label>
              <input
                className={[styles.input, styles.confirmInput].join(' ')}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={resetDelete}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnDestructive}
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={() => setDeleteStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete — Step 2: password */}
      {deleteStep === 2 && (
        <div className={styles.modalBackdrop} onClick={resetDelete}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Confirm with your password</h2>
            <p className={styles.modalDesc}>Enter your password to permanently delete your account.</p>
            <div className={styles.formField}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={resetDelete}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.btn + ' ' + styles.btnDestructive}
                disabled={!deletePassword || isLoading}
                onClick={handleDeleteFinal}
              >
                {isLoading ? 'Deleting…' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
