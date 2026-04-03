'use client'

import { create } from 'zustand'

import { ProfileTab } from '@/components/profile/Profile.types'

interface ProfileStore {
  activeTab: ProfileTab
  setActiveTab: (tab: ProfileTab) => void

  is2FASetupModalOpen: boolean
  is2FADisableModalOpen: boolean
  open2FASetupModal: () => void
  close2FASetupModal: () => void
  open2FADisableModal: () => void
  close2FADisableModal: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  activeTab: 'personal',
  setActiveTab: (tab) => set({ activeTab: tab }),

  is2FASetupModalOpen: false,
  is2FADisableModalOpen: false,
  open2FASetupModal: () => set({ is2FASetupModalOpen: true }),
  close2FASetupModal: () => set({ is2FASetupModalOpen: false }),
  open2FADisableModal: () => set({ is2FADisableModalOpen: true }),
  close2FADisableModal: () => set({ is2FADisableModalOpen: false }),
}))
