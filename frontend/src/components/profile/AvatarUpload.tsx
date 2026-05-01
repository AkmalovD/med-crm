'use client'

import { useRef, useState } from 'react'
import { X } from 'lucide-react'

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface AvatarUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => void
  isUploading: boolean
}

export function AvatarUpload({ isOpen, onClose, onUpload, isUploading }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Only JPG, PNG, and WebP images are accepted.')
      setPreview(null)
      setSelectedFile(null)
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setFileError('File is too large. Maximum size is 5 MB.')
      setPreview(null)
      setSelectedFile(null)
      return
    }

    setFileError(null)
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleApply = () => {
    if (!selectedFile) return
    onUpload(selectedFile)
  }

  const handleClose = () => {
    setPreview(null)
    setSelectedFile(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45" onClick={handleClose}>
      <div className="w-[90vw] max-w-[460px] rounded-[0.9rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="mb-1 text-base font-bold text-slate-900">Change Profile Photo</h2>
            <p className="mb-5 text-[0.85rem] text-slate-500">JPG, PNG, or WebP · Max 5 MB</p>
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-4 py-2 text-[0.85rem] font-medium text-slate-500 transition-[background,opacity] hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="mb-4 flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-4">
            <img
              src={preview}
              alt="Preview"
              style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
            />
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              {selectedFile?.name}
            </p>
          </div>
        ) : (
          <div
            className="mb-4 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4"
            style={{ cursor: 'pointer', border: '2px dashed #e2e8f0', background: '#f8fafc' }}
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex h-[140px] w-[140px] items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-400">Click to select image</div>
          </div>
        )}

        {fileError && <p className="mb-3 text-xs text-red-500">{fileError}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.85rem] font-medium text-gray-700 transition-[background,opacity] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60" onClick={handleClose}>
            Cancel
          </button>
          {!preview && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => inputRef.current?.click()}
            >
              Select Photo
            </button>
          )}
          {preview && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#4acf7f] px-4 py-2 text-[0.85rem] font-medium text-white transition-[background,opacity] hover:bg-[#3ab86d] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleApply}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading…' : 'Apply Photo'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
