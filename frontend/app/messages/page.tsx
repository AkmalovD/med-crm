'use client'

import { Suspense } from 'react'
import { DashboardScaffold } from '@/components/dashboard/DashboardScaffold'
import { MessagesLayout } from './_components/MessagesLayout'

export default function MessagesPage() {
  return (
    <DashboardScaffold>
      <Suspense>
        <MessagesLayout />
      </Suspense>
    </DashboardScaffold>
  )
}
