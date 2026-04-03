'use client'

import { useRef, useState } from 'react'
import { X } from 'lucide-react'

import styles from './ProfileDashboardPage.module.css'

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
    <div className={styles.modalBackdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className={styles.modalTitle}>Change Profile Photo</h2>
            <p className={styles.modalDesc}>JPG, PNG, or WebP · Max 5 MB</p>
          </div>
          <button type="button" className={styles.btnGhost + ' ' + styles.btn} onClick={handleClose}>
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
          <div className={styles.qrBlock}>
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
            className={styles.qrBlock}
            style={{ cursor: 'pointer', border: '2px dashed #e2e8f0', background: '#f8fafc' }}
            onClick={() => inputRef.current?.click()}
          >
            <div className={styles.qrCode}>Click to select image</div>
          </div>
        )}

        {fileError && <p className={styles.inputError} style={{ marginBottom: '0.75rem' }}>{fileError}</p>}

        <div className={styles.modalActions}>
          <button type="button" className={styles.btn + ' ' + styles.btnOutline} onClick={handleClose}>
            Cancel
          </button>
          {!preview && (
            <button
              type="button"
              className={styles.btn + ' ' + styles.btnPrimary}
              onClick={() => inputRef.current?.click()}
            >
              Select Photo
            </button>
          )}
          {preview && (
            <button
              type="button"
              className={styles.btn + ' ' + styles.btnPrimary}
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
