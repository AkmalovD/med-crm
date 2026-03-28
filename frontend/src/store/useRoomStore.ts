"use client";

import { create } from "zustand";

interface RoomStore {
  isSchedulePanelOpen: boolean;
  selectedRoomId: string | null;
  toggleSchedulePanel: (roomId: string) => void;
  closeSchedulePanel: () => void;

  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isMaintenanceModalOpen: boolean;
  activeRoomId: string | null;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (id: string) => void;
  closeEditModal: () => void;
  openMaintenanceModal: (id: string) => void;
  closeMaintenanceModal: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  isSchedulePanelOpen: false,
  selectedRoomId: null,
  toggleSchedulePanel: (roomId) =>
    set((state) =>
      state.isSchedulePanelOpen && state.selectedRoomId === roomId
        ? { isSchedulePanelOpen: false, selectedRoomId: null }
        : { isSchedulePanelOpen: true, selectedRoomId: roomId },
    ),
  closeSchedulePanel: () => set({ isSchedulePanelOpen: false, selectedRoomId: null }),

  isCreateModalOpen: false,
  isEditModalOpen: false,
  isMaintenanceModalOpen: false,
  activeRoomId: null,

  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false, activeRoomId: null }),
  openEditModal: (id) => set({ isEditModalOpen: true, activeRoomId: id }),
  closeEditModal: () => set({ isEditModalOpen: false, activeRoomId: null }),
  openMaintenanceModal: (id) => set({ isMaintenanceModalOpen: true, activeRoomId: id }),
  closeMaintenanceModal: () => set({ isMaintenanceModalOpen: false, activeRoomId: null }),
}));
