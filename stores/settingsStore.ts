import { createStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type SettingsState = {
  settingsDialogOpen: boolean
  displayIds: boolean
  alwaysShowDelete: boolean
  edgesSelectedToFront: boolean
  edgesSelectionAnimated: boolean
  showExampleOverwriteWarning: boolean
}

type SettingsActions = {
  toggleDisplayIds: () => void
  toggleAlwaysShowDelete: () => void
  toggleEdgesSelectedToFront: () => void
  toggleEdgesSelectionAnimated: () => void
  setShowExampleOverwriteWarning: (show: boolean) => void
  setSettingsDialogOpen: (isOpen: boolean) => void
}

export type SettingsStore = SettingsState & SettingsActions

const initialState: SettingsState = {
  settingsDialogOpen: false,
  displayIds: true,
  alwaysShowDelete: false,
  edgesSelectedToFront: true,
  edgesSelectionAnimated: true,
  showExampleOverwriteWarning: true,
}

export const createSettingsStore = (
  initState: SettingsState = initialState
) => {
  return createStore<SettingsStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,
          toggleAlwaysShowDelete() {
            set({ alwaysShowDelete: !get().alwaysShowDelete })
          },
          toggleDisplayIds() {
            set({ displayIds: !get().displayIds })
          },
          toggleEdgesSelectedToFront() {
            set({ edgesSelectedToFront: !get().edgesSelectedToFront })
          },
          toggleEdgesSelectionAnimated() {
            set({ edgesSelectionAnimated: !get().edgesSelectionAnimated })
          },
          setShowExampleOverwriteWarning(show: boolean) {
            set({ showExampleOverwriteWarning: show })
          },
          setSettingsDialogOpen(isOpen) {
            set({ settingsDialogOpen: isOpen })
          },
        }),
        {
          name: 'SettingsStore',
        }
      ),
      { name: 'SettingsStore' }
    )
  )
}
