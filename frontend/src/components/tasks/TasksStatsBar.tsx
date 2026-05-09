'use client'

import { AlertCircle, CheckCircle2, Clock, ListChecks } from 'lucide-react'
import type { Task } from '@/types/tasksDashboardTypes'

interface Props {
  tasks: Task[]
}

export function TasksStatsBar({ tasks }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const overdue = tasks.filter((t) => t.isOverdue && t.status !== 'done').length
  const dueToday = tasks.filter((t) => t.isDueToday && t.status !== 'done').length
  const completedToday = tasks.filter(
    (t) => t.completedAt && t.completedAt.split('T')[0] === today
  ).length

  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      color: 'var(--foreground)',
      bg: 'bg-slate-100',
      iconColor: 'text-slate-500',
      icon: ListChecks,
    },
    {
      label: 'Overdue',
      value: overdue,
      color: '#ef4444',
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
      icon: AlertCircle,
    },
    {
      label: 'Due Today',
      value: dueToday,
      color: '#f59e0b',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      icon: Clock,
    },
    {
      label: 'Completed Today',
      value: completedToday,
      color: 'var(--primary)',
      bg: 'bg-[var(--primary-light)]',
      iconColor: 'text-[var(--primary)]',
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[var(--panel)] rounded-xl p-4 border border-[var(--border)] flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-[var(--soft-text)] font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
          <div className={`rounded-full p-2.5 ${stat.bg}`}>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
