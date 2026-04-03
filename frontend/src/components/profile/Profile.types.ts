export type ProfileTab = 'personal' | 'security' | 'notifications' | 'preferences' | 'activity' | 'danger'

export type TherapistRole = 'admin' | 'therapist' | 'receptionist'

export type NotificationChannel = 'email' | 'sms' | 'in_app'

export type NotificationEvent =
  | 'new_appointment'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'appointment_rescheduled'
  | 'new_client_assigned'
  | 'client_goal_achieved'
  | 'invoice_paid'
  | 'system_updates'

export interface NotificationPreference {
  event: NotificationEvent
  label: string
  email: boolean
  sms: boolean
  inApp: boolean
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export interface ActiveSession {
  id: string
  deviceName: string
  deviceType: DeviceType
  ipAddress: string
  location: string | null
  lastActiveAt: string
  isCurrent: boolean
  createdAt: string
}

export interface ActivityLogEntry {
  id: string
  action: string
  entityType: string | null
  entityName: string | null
  ipAddress: string
  performedAt: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string | null
  avatar: string | null
  bio: string | null
  role: TherapistRole
  language: string
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  currency: string
  is2FAEnabled: boolean
  notificationPreferences: NotificationPreference[]
  memberSince: string
  lastLoginAt: string | null
}
