import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  pageTitle: string
  setSidebarOpen: (open: boolean) => void
  setPageTitle: (title: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  pageTitle: 'Dashboard',
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setPageTitle: (pageTitle) => set({ pageTitle }),
}))