import { DashboardScaffold } from '@/components/dashboard/DashboardScaffold'

export default function MyProfileLoading() {
  return (
    <DashboardScaffold>
      <div style={{ padding: '1.5rem', background: 'linear-gradient(180deg, #f8fafc 0%, #f5f7fb 100%)', minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.9rem' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#e2e8f0' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ height: 24, width: 200, background: '#e2e8f0', borderRadius: 6 }} />
            <div style={{ height: 14, width: 160, background: '#f1f5f9', borderRadius: 6 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <div style={{ height: 22, width: 80, background: '#f1f5f9', borderRadius: 4 }} />
              <div style={{ height: 22, width: 120, background: '#f1f5f9', borderRadius: 4 }} />
            </div>
          </div>
        </div>

        {/* Tabs + content skeleton */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.9rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0', padding: '0 1rem', background: '#f8fafc' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 44, width: 110, margin: '0 4px', background: '#f1f5f9', borderRadius: 6, alignSelf: 'center' }} />
            ))}
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 12, width: 80, background: '#e2e8f0', borderRadius: 4 }} />
                <div style={{ height: 40, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardScaffold>
  )
}
