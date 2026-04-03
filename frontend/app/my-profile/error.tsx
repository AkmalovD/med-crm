'use client'

import Link from 'next/link'

export default function MyProfileError({ reset }: { reset: () => void }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, color: '#0f172a' }}>Something went wrong</h1>
      <p style={{ color: '#64748b', marginBottom: 20 }}>
        We could not load your profile. Try again or return to the dashboard.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            border: 0,
            background: '#4acf7f',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
        <Link
          href="/dashboard"
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#334155',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
