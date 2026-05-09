'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { DashboardScaffold } from '@/components/dashboard/DashboardScaffold'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MessagesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <DashboardScaffold>
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
        <div className="rounded-full bg-red-50 border border-red-200 p-6">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-[var(--foreground)]">Something went wrong</p>
          <p className="text-sm text-[var(--soft-text)] mt-1 max-w-sm">
            Failed to load messages. Please try again or return to the dashboard.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <RotateCcw size={14} />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </div>
      </div>
    </DashboardScaffold>
  )
}
