import { create } from 'zustand'
import type { TaskView } from '@/types/tasksDashboardTypes'

interface TaskStore {
  activeView: TaskView
  setActiveView: (view: TaskView) => void

  isDetailPanelOpen: boolean
  selectedTaskId: string | null
  openDetailPanel: (taskId: string) => void
  closeDetailPanel: () => void

  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  activeTaskId: string | null
  createModalInitialStatus: string | null

  openCreateModal: (initialStatus?: string) => void
  closeCreateModal: () => void
  openEditModal: (id: string) => void
  closeEditModal: () => void

  toastMessage: string | null
  toastType: 'success' | 'error' | null
  showToast: (message: string, type?: 'success' | 'error') => void
  clearToast: () => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  activeView: 'list',
  setActiveView: (view) => set({ activeView: view }),

  isDetailPanelOpen: false,
  selectedTaskId: null,
  openDetailPanel: (taskId) =>
    set({ isDetailPanelOpen: true, selectedTaskId: taskId }),
  closeDetailPanel: () =>
    set({ isDetailPanelOpen: false, selectedTaskId: null }),

  isCreateModalOpen: false,
  isEditModalOpen: false,
  activeTaskId: null,
  createModalInitialStatus: null,

  openCreateModal: (initialStatus) =>
    set({ isCreateModalOpen: true, createModalInitialStatus: initialStatus ?? null }),
  closeCreateModal: () =>
    set({ isCreateModalOpen: false, createModalInitialStatus: null }),
  openEditModal: (id) =>
    set({ isEditModalOpen: true, activeTaskId: id }),
  closeEditModal: () =>
    set({ isEditModalOpen: false, activeTaskId: null }),

  toastMessage: null,
  toastType: null,
  showToast: (message, type = 'success') => {
    set({ toastMessage: message, toastType: type })
    setTimeout(() => set({ toastMessage: null, toastType: null }), 3500)
  },
  clearToast: () => set({ toastMessage: null, toastType: null }),
}))
