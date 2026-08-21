import { create } from 'zustand'

export type AdminTab =
  | 'create-app'
  | 'update-app'
  | 'create-tags'
  | 'update-tags'

type AdminState = {
  activeTab: AdminTab
  selectedAppId: string | null
  selectedTagId: string | null
  setActiveTab: (tab: AdminTab) => void
  setSelectedAppId: (id: string | null) => void
  setSelectedTagId: (id: string | null) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  activeTab: 'create-app',
  selectedAppId: null,
  selectedTagId: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedAppId: (id) => set({ selectedAppId: id }),
  setSelectedTagId: (id) => set({ selectedTagId: id }),
}))
