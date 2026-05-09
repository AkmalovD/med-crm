import { DashboardScaffold } from '@/components/dashboard/DashboardScaffold'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-[#e7ebf3] ${className ?? ''}`} />
}

export default function MessagesLoading() {
  return (
    <DashboardScaffold>
      <div className="messages-shell flex">
        {/* Left panel skeleton */}
        <div className="w-72 flex flex-col border-r border-[#e7ebf3] bg-white shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7ebf3]">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <div className="px-3 py-2 border-b border-[#e7ebf3]">
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="flex px-3 py-2 gap-1 border-b border-[#e7ebf3]">
            {[40, 52, 48, 48].map((w, i) => (
              <Skeleton key={i} className={`h-6 w-${w} rounded-full`} />
            ))}
          </div>
          <div className="flex-1 py-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel skeleton */}
        <div className="flex-1 flex flex-col bg-[#f3f5fb]">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7ebf3] bg-white">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-4 space-y-2">
            {[false, true, false, true, false, false, true].map((own, i) => (
              <div key={i} className={`flex items-end gap-2 ${own ? 'flex-row-reverse' : ''}`}>
                {!own && <Skeleton className="h-6 w-6 rounded-full shrink-0" />}
                <Skeleton className={`h-10 rounded-2xl ${own ? 'w-48' : 'w-56'}`} />
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-[#e7ebf3] bg-white px-4 py-3">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </DashboardScaffold>
  )
}
