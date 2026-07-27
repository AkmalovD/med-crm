'use client'

import { useState } from 'react'
import { FileText, Download, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AttachmentPreviewProps {
  url: string
  name: string
  type: 'image' | 'pdf'
  size: number
  isOwn: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AttachmentPreview({ url, name, type, size, isOwn }: AttachmentPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (type === 'image') {
    return (
      <>
        <img
          src={url}
          alt={name}
          className="max-w-xs rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setLightboxOpen(true)}
        />
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={20} />
            </button>
            <img
              src={url}
              alt={name}
              className="max-w-[90vw] max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 mb-2 no-underline transition-opacity hover:opacity-80',
        isOwn ? 'bg-white/20' : 'bg-[var(--background)]'
      )}
    >
      <FileText size={18} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[10px] opacity-70">{formatFileSize(size)}</p>
      </div>
      <Download size={14} className="shrink-0" />
    </a>
  )
}
