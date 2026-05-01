'use client'

import { useState } from 'react'
import { Trash2, UserX } from 'lucide-react'

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
      <p className="mb-4 text-sm text-slate-400">
        These actions are permanent and cannot be undone. Please proceed with caution.
      </p>

      {/* Deactivate */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="m-0 text-sm font-semibold text-amber-800">Deactivate Account</p>
            <p className="mt-[0.15rem] text-[0.78rem] text-amber-700">
              Temporarily disable your account. You can reactivate by contacting an admin.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ color: '#b45309', borderColor: '#fcd34d', whiteSpace: 'nowrap' }}
          onClick={() => setDeactivateOpen(true)}
        >
          <UserX size={14} />
          Deactivate
        </button>
      </div>

      <div className="my-5 h-px bg-slate-100" />

      {/* Delete */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="m-0 text-sm font-semibold text-red-800">Delete Account</p>
            <p className="mt-[0.15rem] text-[0.78rem] text-red-700">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-red-500 px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => setDeleteStep(1)}
        >
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      {/* Deactivate confirm dialog */}
      {deactivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={() => setDeactivateOpen(false)}>
          <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-base font-bold text-slate-900">Deactivate your account?</h2>
            <p className="mb-5 text-[0.85rem] text-slate-500">
              You will be logged out and lose access until an admin reactivates your account.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={() => setDeactivateOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={resetDelete}>
          <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-base font-bold text-slate-900">Are you absolutely sure?</h2>
            <p className="mb-5 text-[0.85rem] text-slate-500">
              This will permanently delete your account, all session history, and cannot be recovered.
              Type <strong>DELETE</strong> to confirm.
            </p>
            <div className="flex flex-col gap-[0.35rem]">
              <label className="text-[0.82rem] font-medium text-gray-700">Type DELETE to confirm</label>
              <input
                className="w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-bold tracking-[0.08em] text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={resetDelete}>
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={resetDelete}>
          <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-base font-bold text-slate-900">Confirm with your password</h2>
            <p className="mb-5 text-[0.85rem] text-slate-500">Enter your password to permanently delete your account.</p>
            <div className="flex flex-col gap-[0.35rem]">
              <label className="text-[0.82rem] font-medium text-gray-700">Password</label>
              <input
                className="w-full box-border rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] focus:border-[#4acf7f] focus:shadow-[0_0_0_3px_rgba(74,207,127,0.12)]"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={resetDelete}>
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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
