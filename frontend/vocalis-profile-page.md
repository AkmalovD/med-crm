# Vocalis — Profile Page Implementation Prompt

## Stack Reference (from .cursorrules)
- **Framework**: Next.js App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (new-york) + CVA
- **State**: TanStack React Query (server state) + Zustand (UI state)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## Unique Features on This Page
1. **Personal info editing** — name, photo, bio, phone, language
2. **Avatar upload** — crop & upload profile photo
3. **Password change** — current + new + confirm with strength meter
4. **Notification preferences** — email, SMS, in-app toggles per event type
5. **Language & locale settings** — UI language, date format, timezone, currency
6. **Active sessions** — list of logged-in devices with revoke option
7. **Two-factor authentication (2FA)** — enable/disable, QR code setup
8. **Activity log** — recent actions performed by the current user
9. **Danger zone** — delete account or deactivate with confirmation

---

## Route & File Structure

```
src/
└── app/
    └── (dashboard)/
        └── profile/
            ├── page.tsx                        ← Server Component
            ├── loading.tsx                     ← Skeleton loading
            ├── error.tsx                       ← Error boundary
            └── _components/
                ├── ProfileHeader.tsx
                ├── ProfileTabs.tsx
                ├── PersonalInfoForm.tsx
                ├── AvatarUpload.tsx
                ├── ChangePasswordForm.tsx
                ├── NotificationPreferences.tsx
                ├── LocaleSettings.tsx
                ├── ActiveSessionsList.tsx
                ├── TwoFactorSetup.tsx
                ├── ActivityLogList.tsx
                └── DangerZone.tsx

src/
├── features/
│   └── profile/
│       ├── api/
│       │   └── profile.api.ts
│       ├── hooks/
│       │   ├── useProfile.ts
│       │   ├── useUpdateProfile.ts
│       │   ├── useUpdateAvatar.ts
│       │   ├── useChangePassword.ts
│       │   ├── useUpdateNotifications.ts
│       │   ├── useUpdateLocale.ts
│       │   ├── useActiveSessions.ts
│       │   ├── useRevokeSession.ts
│       │   ├── useRevokeAllSessions.ts
│       │   ├── useSetup2FA.ts
│       │   ├── useEnable2FA.ts
│       │   ├── useDisable2FA.ts
│       │   └── useActivityLog.ts
│       ├── types/
│       │   └── profile.types.ts
│       └── validators/
│           ├── updateProfile.schema.ts
│           ├── changePassword.schema.ts
│           └── locale.schema.ts
└── store/
    └── useProfileStore.ts        ← Zustand: active tab, 2FA modal state
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Fetch current user profile server-side for fast first paint
export default async function ProfilePage() {
  const profile = await fetchCurrentUserProfile()
  return <ProfileClientShell initialProfile={profile} />
}
```

### Component Rendering Order
```
ProfileHeader (avatar + name + role badge + member since)
  └── ProfileTabs
      ├── Personal Info   → PersonalInfoForm + AvatarUpload
      ├── Security        → ChangePasswordForm + TwoFactorSetup + ActiveSessionsList
      ├── Notifications   → NotificationPreferences
      ├── Preferences     → LocaleSettings
      ├── Activity        → ActivityLogList
      └── Danger Zone     → DangerZone
```

---

## State Management

### Zustand Store — `useProfileStore.ts`
```ts
interface ProfileStore {
  activeTab: ProfileTab
  setActiveTab: (tab: ProfileTab) => void

  // 2FA flow
  is2FASetupModalOpen: boolean
  is2FADisableModalOpen: boolean
  open2FASetupModal: () => void
  close2FASetupModal: () => void
  open2FADisableModal: () => void
  close2FADisableModal: () => void
}
```

### React Query Hooks
```ts
// Current user profile
useProfile()

// Active sessions
useActiveSessions()

// Activity log
useActivityLog()

// Mutations
useUpdateProfile()
useUpdateAvatar()
useChangePassword()
useUpdateNotifications()
useUpdateLocale()
useRevokeSession()
useRevokeAllSessions()
useSetup2FA()         // generates QR code + secret
useEnable2FA()        // verify TOTP code to activate
useDisable2FA()       // requires password confirmation

// Query key constants
export const PROFILE_KEYS = {
  me: ['profile', 'me'],
  sessions: ['profile', 'sessions'],
  activity: ['profile', 'activity'],
}
```

### URL Search Params
```
?tab=security
// Active tab persisted in URL — direct linking to specific section
```

---

## Types — `profile.types.ts`

```ts
export type ProfileTab =
  | 'personal'
  | 'security'
  | 'notifications'
  | 'preferences'
  | 'activity'
  | 'danger'

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
  email: boolean
  sms: boolean
  inApp: boolean
}

export interface ActiveSession {
  id: string
  deviceName: string            // e.g. "Chrome on MacOS"
  deviceType: 'desktop' | 'mobile' | 'tablet'
  ipAddress: string
  location: string | null       // e.g. "Tashkent, UZ"
  lastActiveAt: string
  isCurrent: boolean            // true = this session
  createdAt: string
}

export interface ActivityLogEntry {
  id: string
  action: string                // e.g. "Updated personal info"
  entityType: string | null     // e.g. "client", "appointment"
  entityName: string | null     // e.g. "John Smith"
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
  language: string              // e.g. "en", "ru", "uz"
  timezone: string              // e.g. "Asia/Tashkent"
  dateFormat: string            // e.g. "DD/MM/YYYY"
  currency: string              // e.g. "USD"
  is2FAEnabled: boolean
  notificationPreferences: NotificationPreference[]
  memberSince: string
  lastLoginAt: string | null
}
```

---

## Validators

### `updateProfile.schema.ts`
```ts
export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  phone: z.string().min(7, 'Valid phone required').optional().or(z.literal('')),
  bio: z.string().max(300, 'Bio too long').optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
```

### `changePassword.schema.ts`
```ts
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
})
.refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
.refine((d) => d.currentPassword !== d.newPassword, {
  message: 'New password must differ from current',
  path: ['newPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
```

### `locale.schema.ts`
```ts
export const localeSchema = z.object({
  language: z.string().min(2).max(5),
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  currency: z.string().min(3).max(3),
})

export type LocaleInput = z.infer<typeof localeSchema>
```

---

## Section 1 — Profile Header

### `ProfileHeader.tsx` — Server Component
```tsx
// Large avatar (96px) with edit button overlay
// Full name text-2xl font-bold
// Role badge (Admin / Therapist / Receptionist)
// Email (muted)
// Member since date

<div className="flex items-center gap-6 p-6 bg-white rounded-xl border mb-6">
  <div className="relative">
    <Avatar src={profile.avatar} className="h-24 w-24" />
    <button
      className="absolute bottom-0 right-0 rounded-full bg-[#4acf7f] p-1.5
        text-white shadow-md hover:bg-[#3ab86d] transition-colors"
      onClick={() => document.getElementById('avatar-input')?.click()}
    >
      <Camera className="h-3.5 w-3.5" />
    </button>
  </div>
  <div className="flex-1">
    <h1 className="text-2xl font-bold text-foreground">{profile.fullName}</h1>
    <p className="text-sm text-muted-foreground mt-0.5">{profile.email}</p>
    <div className="flex items-center gap-3 mt-2">
      <Badge variant="secondary">{roleLabels[profile.role]}</Badge>
      <span className="text-xs text-muted-foreground">
        Member since {formatDate(profile.memberSince)}
      </span>
      {profile.lastLoginAt && (
        <span className="text-xs text-muted-foreground">
          Last login {formatRelative(profile.lastLoginAt)}
        </span>
      )}
    </div>
  </div>
</div>
```

---

## Section 2 — Profile Tabs

### `ProfileTabs.tsx` — `'use client'`
```tsx
// Synced with ?tab= URL param + Zustand activeTab
<Tabs value={activeTab} onValueChange={handleTabChange}>
  <TabsList className="mb-6">
    <TabsTrigger value="personal">
      <User className="mr-2 h-4 w-4" />
      Personal Info
    </TabsTrigger>
    <TabsTrigger value="security">
      <Shield className="mr-2 h-4 w-4" />
      Security
    </TabsTrigger>
    <TabsTrigger value="notifications">
      <Bell className="mr-2 h-4 w-4" />
      Notifications
    </TabsTrigger>
    <TabsTrigger value="preferences">
      <Settings className="mr-2 h-4 w-4" />
      Preferences
    </TabsTrigger>
    <TabsTrigger value="activity">
      <Activity className="mr-2 h-4 w-4" />
      Activity
    </TabsTrigger>
    <TabsTrigger value="danger" className="text-destructive">
      <AlertTriangle className="mr-2 h-4 w-4" />
      Danger Zone
    </TabsTrigger>
  </TabsList>
</Tabs>
```

---

## Section 3 — Personal Info Tab

### `PersonalInfoForm.tsx` — `'use client'`
- React Hook Form + `updateProfileSchema`
- Two-column layout

**Left column:**
```
First Name *    ← text input
Last Name *     ← text input
Phone           ← phone input (optional)
Bio             ← textarea (max 300 chars)
                  Character counter below
```

**Right column:**
```
Email           ← read-only (contact admin to change)
                  Lock icon + "Contact admin to update email"
Role            ← read-only badge (cannot self-change role)
Member Since    ← read-only
```

**Submit:**
```tsx
<div className="flex justify-end gap-2 mt-6">
  <Button variant="outline" onClick={resetForm}>Discard Changes</Button>
  <Button className="bg-[#4acf7f] text-white" type="submit" disabled={isPending}>
    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
    Save Changes
  </Button>
</div>
```

- `useUpdateProfile()` mutation
- Success: `toast.success('Profile updated')` + invalidate `PROFILE_KEYS.me`
- Dirty state check: "Discard Changes" only active when form is dirty

### `AvatarUpload.tsx` — `'use client'`
```tsx
// Hidden file input + crop modal
<input
  id="avatar-input"
  type="file"
  accept="image/jpeg,image/png,image/webp"
  className="hidden"
  onChange={handleFileSelect}
/>

// After file selected → show crop modal
<Dialog open={isCropModalOpen}>
  <DialogContent className="max-w-lg">
    <DialogTitle>Crop Profile Photo</DialogTitle>
    {/* react-image-crop or similar */}
    <ReactCrop
      src={selectedImageUrl}
      crop={crop}
      onChange={setCrop}
      aspect={1}
      circularCrop
    />
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={cancelCrop}>Cancel</Button>
      <Button className="bg-[#4acf7f] text-white" onClick={confirmCrop}>
        Apply
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

- Max file size: 5MB
- Accepted: JPG, PNG, WebP
- Crop to square, circular preview
- Submit: `useUpdateAvatar(croppedBlob)` → multipart POST
- Success: `toast.success('Avatar updated')` + invalidate `PROFILE_KEYS.me` + update `useAuthStore` avatar

---

## Section 4 — Security Tab

### `ChangePasswordForm.tsx` — `'use client'`
- React Hook Form + `changePasswordSchema`

**Form fields:**
```
Current Password *    ← password input + show/hide toggle
New Password *        ← password input + show/hide toggle
                        Password strength meter below (Weak / Fair / Strong / Very Strong)
Confirm Password *    ← password input + show/hide toggle
```

**Password strength meter:**
```tsx
// Real-time strength calculation as user types
const strength = calculatePasswordStrength(newPassword)
// strength: 0-4

const strengthConfig = [
  { label: 'Too weak', color: 'bg-red-500', width: 'w-1/4' },
  { label: 'Weak', color: 'bg-orange-500', width: 'w-2/4' },
  { label: 'Good', color: 'bg-yellow-500', width: 'w-3/4' },
  { label: 'Strong', color: 'bg-[#4acf7f]', width: 'w-full' },
]

<div className="mt-2">
  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
    <div className={cn('h-full rounded-full transition-all', config.color, config.width)} />
  </div>
  <p className="text-xs text-muted-foreground mt-1">{config.label}</p>
</div>
```

**Submit:**
- `useChangePassword()` mutation
- On success: `toast.success('Password changed successfully')` + reset form + invalidate all sessions (force re-login on other devices)
- On error: `toast.error(message)` — e.g. "Current password is incorrect"

---

### `TwoFactorSetup.tsx` — `'use client'`

**State A — 2FA disabled:**
```tsx
<div className="flex items-center justify-between p-4 rounded-xl border">
  <div className="flex items-center gap-3">
    <div className="rounded-full bg-muted p-2">
      <ShieldOff className="h-5 w-5 text-muted-foreground" />
    </div>
    <div>
      <p className="font-medium">Two-Factor Authentication</p>
      <p className="text-sm text-muted-foreground">
        Add an extra layer of security to your account
      </p>
    </div>
  </div>
  <Button className="bg-[#4acf7f] text-white" onClick={open2FASetupModal}>
    Enable 2FA
  </Button>
</div>
```

**2FA Setup Modal (QR code flow):**
```
Step 1: Scan QR code
  [QR Code image — generated by useSetup2FA()]
  Secret key (text, copyable): JBSWY3DPEHPK3PXP
  Helper: "Scan with Google Authenticator, Authy, or similar"

Step 2: Verify
  Enter the 6-digit code from your authenticator app:
  [_ _ _ _ _ _]  ← 6 digit OTP input, auto-focus, auto-submit

  [Cancel]  [Verify & Enable]
```

- `useSetup2FA()` → returns `{ qrCodeUrl, secret }` on modal open
- `useEnable2FA(code)` → verifies TOTP + activates
- Success: `toast.success('2FA enabled')` + invalidate `PROFILE_KEYS.me` + close modal

**State B — 2FA enabled:**
```tsx
<div className="flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50">
  <div className="flex items-center gap-3">
    <div className="rounded-full bg-green-100 p-2">
      <ShieldCheck className="h-5 w-5 text-green-600" />
    </div>
    <div>
      <p className="font-medium text-green-800">Two-Factor Authentication Enabled</p>
      <p className="text-sm text-green-700">Your account is protected with 2FA</p>
    </div>
  </div>
  <Button variant="outline" className="text-destructive border-destructive" onClick={open2FADisableModal}>
    Disable 2FA
  </Button>
</div>
```

**Disable 2FA Modal:**
```
Password confirmation required:
  Enter your current password to disable 2FA:
  [Password input]

  [Cancel]  [Disable 2FA]
```

- `useDisable2FA({ password })` → requires password to prevent unauthorized disable
- Success: `toast.success('2FA disabled')` + invalidate `PROFILE_KEYS.me`

---

### `ActiveSessionsList.tsx` — `'use client'`

**Header:**
```tsx
<div className="flex items-center justify-between mb-4">
  <p className="font-medium">Active Sessions</p>
  <Button
    variant="outline"
    size="sm"
    className="text-destructive"
    onClick={handleRevokeAll}
  >
    <LogOut className="mr-2 h-4 w-4" />
    Revoke All Other Sessions
  </Button>
</div>
```

**Session list:**
```tsx
{sessions.map((session) => (
  <div
    key={session.id}
    className={cn(
      'flex items-center justify-between p-4 rounded-xl border',
      session.isCurrent && 'border-[#4acf7f] bg-[#f0fdf4]'
    )}
  >
    <div className="flex items-center gap-3">
      {/* Device icon */}
      {session.deviceType === 'mobile'
        ? <Smartphone className="h-5 w-5 text-muted-foreground" />
        : <Monitor className="h-5 w-5 text-muted-foreground" />
      }
      <div>
        <p className="text-sm font-medium">
          {session.deviceName}
          {session.isCurrent && (
            <Badge className="ml-2 text-[10px] bg-[#4acf7f]">Current</Badge>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {session.location ?? session.ipAddress} · Active {formatRelative(session.lastActiveAt)}
        </p>
      </div>
    </div>
    {!session.isCurrent && (
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive"
        onClick={() => revokeSession(session.id)}
        disabled={isRevokePending}
      >
        Revoke
      </Button>
    )}
  </div>
))}
```

- `useRevokeSession(id)` — revokes individual session
- `useRevokeAllSessions()` — revokes all except current + `<AlertDialog>` confirmation
- Skeleton: 3 session rows during loading

---

## Section 5 — Notifications Tab

### `NotificationPreferences.tsx` — `'use client'`

**Layout — table of toggles:**
```
Event                    Email   SMS    In-App
─────────────────────────────────────────────
New Appointment          [✓]     [✓]    [✓]
Appointment Cancelled    [✓]     [✓]    [✓]
Appointment Reminder     [✓]     [✗]    [✓]
Appointment Rescheduled  [✓]     [✓]    [✓]
New Client Assigned      [✓]     [✗]    [✓]
Client Goal Achieved     [✗]     [✗]    [✓]
Invoice Paid             [✓]     [✗]    [✓]
System Updates           [✓]     [✗]    [✗]
```

**Each toggle:** shadcn `<Switch>` — fires `useUpdateNotifications()` immediately on change (no save button — auto-save pattern)

```tsx
<Switch
  checked={pref.email}
  onCheckedChange={(checked) => {
    updateNotification({ event: pref.event, channel: 'email', enabled: checked })
  }}
  disabled={isUpdatePending}
/>
```

- Auto-saves on toggle change — no explicit save button
- `toast.success('Preferences saved')` after each toggle
- Channels disabled if not configured at clinic level (e.g. SMS disabled if Twilio not set up)
- Disabled channel shows tooltip: "SMS not configured for this clinic"
- Skeleton: table skeleton during loading

---

## Section 6 — Preferences Tab

### `LocaleSettings.tsx` — `'use client'`
- React Hook Form + `localeSchema`

**Form fields:**
```
UI Language      ← Select:
                   English / Russian / Uzbek
                   (triggers full app language reload on save)

Timezone         ← Searchable Select (all IANA timezones)
                   Current: "Asia/Tashkent (UTC+5)"

Date Format      ← Radio group:
                   ○ DD/MM/YYYY  (e.g. 09/06/2025)
                   ○ MM/DD/YYYY  (e.g. 06/09/2025)
                   ○ YYYY-MM-DD  (e.g. 2025-06-09)
                   Live preview below: "Preview: 09/06/2025"

Currency         ← Select: USD / EUR / UZS / RUB / GBP
                   Used for revenue display across the app
```

**Submit:**
```tsx
<div className="flex justify-end gap-2 mt-6">
  <Button variant="outline" onClick={reset}>Reset to Defaults</Button>
  <Button className="bg-[#4acf7f] text-white" type="submit" disabled={isPending}>
    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
    Save Preferences
  </Button>
</div>
```

- `useUpdateLocale()` mutation
- On language change: triggers i18next language switch + `router.refresh()`
- Success: `toast.success('Preferences saved')`

---

## Section 7 — Activity Tab

### `ActivityLogList.tsx` — `'use client'`
Chronological list of recent actions performed by the current user.

**Header:**
```tsx
<div className="flex items-center justify-between mb-4">
  <p className="text-sm text-muted-foreground">
    Showing last 50 actions
  </p>
  <Select
    placeholder="Filter by type"
    options={ACTIVITY_TYPES}
    onChange={setActivityFilter}
  />
</div>
```

**Activity entries (grouped by date):**
```
[Date group — "Today, Jun 9"]
  ● Updated personal info                  14:32
  ● Viewed client John Smith               13:15
  ● Created appointment for Anna K.        11:02

[Date group — "Yesterday, Jun 8"]
  ● Changed password                       17:44
  ● Downloaded document referral.pdf       09:30
```

**Each entry row:**
```tsx
<div className="flex items-center gap-3 py-2.5 border-b last:border-0">
  <div className="h-2 w-2 rounded-full bg-[#4acf7f] shrink-0 mt-0.5" />
  <div className="flex-1">
    <p className="text-sm">{entry.action}</p>
    {entry.entityName && (
      <p className="text-xs text-muted-foreground">{entry.entityType}: {entry.entityName}</p>
    )}
  </div>
  <div className="text-right shrink-0">
    <p className="text-xs text-muted-foreground">{formatTime(entry.performedAt)}</p>
    <p className="text-xs text-muted-foreground">{entry.ipAddress}</p>
  </div>
</div>
```

- `useActivityLog()` with filter
- Skeleton: 8 skeleton rows during loading
- Empty state: "No activity recorded yet"

---

## Section 8 — Danger Zone Tab

### `DangerZone.tsx` — `'use client'`
Admin-only section with destructive actions. Wrapped in `<AccessControl>` for deactivation.

```tsx
<div className="space-y-4">
  <p className="text-sm text-muted-foreground">
    These actions are permanent and cannot be undone. Please proceed with caution.
  </p>

  {/* Deactivate Account */}
  <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50">
    <div>
      <p className="font-medium text-amber-800">Deactivate Account</p>
      <p className="text-sm text-amber-700 mt-0.5">
        Temporarily disable your account. You can reactivate by contacting admin.
      </p>
    </div>
    <Button
      variant="outline"
      className="border-amber-400 text-amber-700 hover:bg-amber-100"
      onClick={handleDeactivate}
    >
      <UserX className="mr-2 h-4 w-4" />
      Deactivate
    </Button>
  </div>

  {/* Delete Account */}
  <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
    <div>
      <p className="font-medium text-red-800">Delete Account</p>
      <p className="text-sm text-red-700 mt-0.5">
        Permanently delete your account and all associated data. This cannot be undone.
      </p>
    </div>
    <Button variant="destructive" onClick={handleDelete}>
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Account
    </Button>
  </div>
</div>
```

**Deactivate `<AlertDialog>`:**
```
Title: "Deactivate your account?"
Body: "You will be logged out and lose access until an admin reactivates your account."
Confirm: "Deactivate" (amber)
```

**Delete `<AlertDialog>` — two-step:**
```
Step 1:
  Title: "Are you absolutely sure?"
  Body: "This will permanently delete your account, all your session history,
         and cannot be recovered."
  Input: Type "DELETE" to confirm
  Confirm: enabled only when input === "DELETE"

Step 2:
  Password confirmation input
  Final "Delete My Account" button (red)
```

- Deactivate: sets user status to inactive + logout
- Delete: hard delete + logout + redirect to `/login`

---

## API Module — `profile.api.ts`

```ts
export const profileApi = {
  getMe: () =>
    http.get<UserProfile>('/profile/me'),

  update: (data: UpdateProfileInput) =>
    http.patch<UserProfile>('/profile/me', normalizeBodyValues(data)),

  updateAvatar: (formData: FormData) =>
    http.patch<UserProfile>('/profile/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  changePassword: (data: ChangePasswordInput) =>
    http.post('/profile/me/change-password', data),

  updateNotifications: (data: { event: NotificationEvent; channel: NotificationChannel; enabled: boolean }) =>
    http.patch('/profile/me/notifications', data),

  updateLocale: (data: LocaleInput) =>
    http.patch<UserProfile>('/profile/me/locale', data),

  getSessions: () =>
    http.get<ActiveSession[]>('/profile/me/sessions'),

  revokeSession: (sessionId: string) =>
    http.delete(`/profile/me/sessions/${sessionId}`),

  revokeAllSessions: () =>
    http.delete('/profile/me/sessions'),

  setup2FA: () =>
    http.post<{ qrCodeUrl: string; secret: string }>('/profile/me/2fa/setup'),

  enable2FA: (code: string) =>
    http.post('/profile/me/2fa/enable', { code }),

  disable2FA: (password: string) =>
    http.post('/profile/me/2fa/disable', { password }),

  getActivityLog: (filters?: { type?: string }) =>
    http.get<ActivityLogEntry[]>('/profile/me/activity', {
      params: buildParams(filters),
    }),

  deactivate: () =>
    http.post('/profile/me/deactivate'),

  delete: (password: string) =>
    http.post('/profile/me/delete', { password }),
}
```

---

## Loading States

- `loading.tsx`: skeleton for profile header + tabs + content
- Profile header: skeleton avatar + name + badges
- Personal info form: skeleton inputs in two columns
- Password form: skeleton input fields
- 2FA section: skeleton card
- Sessions list: 3 skeleton session rows
- Notifications table: skeleton toggle rows
- Locale form: skeleton selects
- Activity log: 8 skeleton rows

---

## Error Handling

- `error.tsx`: retry + back to dashboard
- Personal info: `<FormMessage>` inline per field
- Password change: inline Zod errors + server error for wrong current password
- 2FA verify: inline error "Invalid code — please try again" + auto-clear input
- Revoke all sessions: `<AlertDialog>` confirmation before firing
- Delete account: two-step `<AlertDialog>` with typed "DELETE" + password confirmation
- Avatar: file size / type rejection shown inline below upload button
- Locale save: `toast.error()` on failure
- Notification toggle: silent retry on failure — revert switch state + `toast.error()`

---

## Key Principles Applied

- `page.tsx` is a Server Component — fetches profile for fast first paint
- Active tab persisted in URL `?tab=` — direct linking to Security or Notifications tab
- Avatar upload flows through crop modal — never raw upload without crop
- Password change invalidates all other sessions server-side on success
- Notification toggles auto-save — no save button needed (single field mutation)
- 2FA disable requires password — prevents unauthorized deactivation
- Delete account is two-step — typed confirmation + password, never a single click
- Activity log is read-only — no pagination needed, last 50 entries only
- Danger zone deactivate/delete available to own account only — not an admin action on others
- All user-facing strings use i18n translation keys
- `useAuthStore` updated after avatar/profile changes for sidebar display consistency
